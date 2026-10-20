/**
 * Finds the 3D-print projects on GitHub and lists their model files.
 *
 * A repo opts in with the `3d-printing` topic — nothing else is scanned. Its
 * .stl and .3mf files are listed from the git tree of the default branch, and an
 * optional `3d.json` at the repo root narrows them down and names them:
 *
 *   {
 *     "title": "keybordy MP",
 *     "summary": { "en": "…", "it": "…" },
 *     "paths": ["cad/out/stl"],
 *     "models": { "cad/out/stl/deck.stl": { "name": "Deck", "color": "#000000" } }
 *   }
 *
 * `paths` are prefixes (a folder or a single file); without them every model in
 * the tree is shown. Models named in `models` come first, in that order.
 *
 * Shared by the browser (src/lib/printsLive.ts) and the build-time snapshot
 * (scripts/fetch-prints.mjs, which runs this file under Node type stripping),
 * so it imports nothing but types and takes `fetch` as an argument.
 */

import type { LangId } from "@/context/LanguageContext";

export const PRINTS_OWNER = "davide97g";
export const PRINTS_TOPIC = "3d-printing";
export const MANIFEST_FILE = "3d.json";

const MODEL_EXT = /\.(stl|3mf)$/i;
const HEX = /^#[0-9a-f]{6}$/i;

export interface PrintModel {
  /** Path inside the repo. */
  path: string;
  name: string;
  format: "stl" | "3mf";
  /** Bytes, from the git tree. */
  size: number;
  /** raw.githubusercontent.com URL — CORS-open and not rate limited. */
  url: string;
  /** Filament colour from the manifest, a #rrggbb hex. */
  color?: string;
}

export interface PrintProject {
  repo: string;
  url: string;
  branch: string;
  title: string;
  summary: Record<LangId, string> | null;
  /** ISO timestamp of the last push. */
  pushedAt: string;
  models: PrintModel[];
}

export interface PrintsSnapshot {
  syncedAt: string;
  projects: PrintProject[];
}

interface RepoInfo {
  name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  pushed_at: string;
  topics?: string[];
  archived?: boolean;
}

interface TreeEntry {
  path: string;
  type: string;
  size?: number;
}

interface Manifest {
  title?: string;
  summary?: Record<LangId, string>;
  paths?: string[];
  models?: Record<string, { name?: string; color?: string }>;
}

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

export const rawUrl = (repo: string, branch: string, path: string) =>
  `https://raw.githubusercontent.com/${PRINTS_OWNER}/${repo}/${encodeURIComponent(branch)}/${encodePath(path)}`;

export const formatBytes = (n: number) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;

/** "cap2_talk.stl" → "Cap2 talk". */
export function modelName(path: string): string {
  const base = path.split("/").pop()!.replace(MODEL_EXT, "").replace(/[_-]+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** Keeps only what a manifest is allowed to say, so a typo never breaks the section. */
export function parseManifest(body: unknown): Manifest {
  const b = (body ?? {}) as Record<string, unknown>;
  const out: Manifest = {};
  if (typeof b.title === "string" && b.title.trim()) out.title = b.title.trim();
  const s = b.summary as Record<string, unknown> | undefined;
  if (typeof s?.en === "string" && typeof s.it === "string") out.summary = { en: s.en, it: s.it };
  if (Array.isArray(b.paths)) {
    const paths = b.paths.filter((p): p is string => typeof p === "string" && p.trim() !== "");
    if (paths.length) out.paths = paths.map((p) => p.replace(/^\.?\//, ""));
  }
  if (b.models && typeof b.models === "object") {
    out.models = {};
    for (const [path, raw] of Object.entries(b.models as Record<string, unknown>)) {
      const m = (raw ?? {}) as Record<string, unknown>;
      out.models[path.replace(/^\.?\//, "")] = {
        name: typeof m.name === "string" ? m.name : undefined,
        color: typeof m.color === "string" && HEX.test(m.color) ? m.color : undefined,
      };
    }
  }
  return out;
}

/** The repo's models: filtered by the manifest paths, manifest entries first. */
export function pickModels(repo: RepoInfo, tree: TreeEntry[], manifest: Manifest): PrintModel[] {
  const listed = Object.keys(manifest.models ?? {});
  const inScope = (path: string) =>
    !manifest.paths ||
    manifest.paths.some((p) => path === p || path.startsWith(p.endsWith("/") ? p : `${p}/`));

  const models = tree
    .filter((e) => e.type === "blob" && MODEL_EXT.test(e.path) && inScope(e.path))
    .map((e): PrintModel => {
      const meta = manifest.models?.[e.path];
      return {
        path: e.path,
        name: meta?.name ?? modelName(e.path),
        format: e.path.toLowerCase().endsWith(".3mf") ? "3mf" : "stl",
        size: e.size ?? 0,
        url: rawUrl(repo.name, repo.default_branch, e.path),
        ...(meta?.color ? { color: meta.color } : {}),
      };
    });

  const rank = (m: PrintModel) => {
    const i = listed.indexOf(m.path);
    return i === -1 ? listed.length : i;
  };
  return models.sort((a, b) => rank(a) - rank(b) || a.path.localeCompare(b.path));
}

export function isPrintRepo(repo: RepoInfo): boolean {
  return !repo.archived && (repo.topics ?? []).includes(PRINTS_TOPIC);
}

async function json<T>(fetchFn: Fetch, url: string): Promise<T> {
  const res = await fetchFn(url, { headers: { accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return (await res.json()) as T;
}

async function loadProject(fetchFn: Fetch, repo: RepoInfo): Promise<PrintProject | null> {
  const api = `https://api.github.com/repos/${PRINTS_OWNER}/${repo.name}`;
  const { tree } = await json<{ tree: TreeEntry[] }>(
    fetchFn,
    `${api}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`
  );

  let manifest: Manifest = {};
  if (tree.some((e) => e.path === MANIFEST_FILE)) {
    // A broken manifest falls back to the bare tree rather than hiding the repo.
    manifest = await json<unknown>(fetchFn, rawUrl(repo.name, repo.default_branch, MANIFEST_FILE))
      .then(parseManifest)
      .catch(() => ({}));
  }

  const models = pickModels(repo, tree, manifest);
  if (!models.length) return null;

  const description = repo.description?.trim();
  return {
    repo: repo.name,
    url: repo.html_url,
    branch: repo.default_branch,
    title: manifest.title ?? repo.name,
    summary: manifest.summary ?? (description ? { en: description, it: description } : null),
    pushedAt: repo.pushed_at,
    models,
  };
}

/**
 * Every public repo with the topic, most recently pushed first. One call for the
 * repo list and one per tagged repo, which fits the unauthenticated 60/hour.
 */
export async function discoverPrints(fetchFn: Fetch = fetch): Promise<PrintsSnapshot> {
  const repos = await json<RepoInfo[]>(
    fetchFn,
    `https://api.github.com/users/${PRINTS_OWNER}/repos?per_page=100&sort=pushed`
  );
  const projects = await Promise.all(repos.filter(isPrintRepo).map((r) => loadProject(fetchFn, r)));
  return {
    syncedAt: new Date().toISOString(),
    projects: projects
      .filter((p): p is PrintProject => p !== null)
      .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt)),
  };
}
