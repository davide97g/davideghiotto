/**
 * Regenerates src/data/prints.snapshot.json, the 3D-print projects the bundle
 * ships: every public repo with the `3d-printing` topic and its .stl / .3mf
 * files. Run with `npm run fetch:prints`; set GITHUB_TOKEN to lift the 60/hour
 * limit.
 *
 * This is the fallback. The browser re-runs the same discovery at runtime
 * (src/lib/printsLive.ts) and only falls back to this copy when GitHub fails.
 */
import { writeFile } from "node:fs/promises";
import { discoverPrints } from "../src/lib/printsGithub.ts";

const TARGET = new URL("../src/data/prints.snapshot.json", import.meta.url);
const token = process.env.GITHUB_TOKEN?.trim();

const snapshot = await discoverPrints((url, init) =>
  fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      ...(token && url.startsWith("https://api.github.com") ? { authorization: `Bearer ${token}` } : {}),
    },
  })
);

await writeFile(TARGET, `${JSON.stringify(snapshot, null, 2)}\n`);
const models = snapshot.projects.reduce((n, p) => n + p.models.length, 0);
console.log(`Wrote ${snapshot.projects.length} projects, ${models} models to src/data/prints.snapshot.json`);
