import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  cover,
  experiences,
  featuredProjects,
  principles,
  projects,
  socials,
  stackGroups,
  summary,
  ui,
} from "./content";

const LANGS = ["en", "it"] as const;

const isLocalized = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length === LANGS.length && LANGS.every((lang) => keys.includes(lang));
};

/** Collects `path` → value for every Localized entry found in the tree. */
function collect(value: unknown, path: string, found: Array<[string, unknown]>) {
  if (isLocalized(value)) {
    found.push([path, value]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, i) => collect(entry, `${path}[${i}]`, found));
    return;
  }
  if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([key, entry]) => collect(entry, `${path}.${key}`, found));
  }
}

describe("localized content", () => {
  const found: Array<[string, unknown]> = [];
  collect(
    {
      ui,
      cover,
      summary,
      principles,
      projects,
      stackGroups,
      experiences,
      featuredProjects,
    },
    "root",
    found
  );

  it("finds localized strings to check", () => {
    expect(found.length).toBeGreaterThan(40);
  });

  it.each(LANGS)("has a non-empty %s value everywhere", (lang) => {
    const missing = found
      .filter(([, value]) => {
        const entry = (value as Record<string, unknown>)[lang];
        if (Array.isArray(entry)) return entry.length === 0 || entry.some((s) => !String(s).trim());
        return !String(entry ?? "").trim();
      })
      .map(([path]) => path);

    expect(missing).toEqual([]);
  });
});

describe("featured projects", () => {
  it("each point at a live site, a public repo and a mark that ships", () => {
    expect(featuredProjects.map((p) => p.id)).toEqual(["autocratico", "keybordy-mp"]);
    for (const p of featuredProjects) {
      expect(p.site, p.id).toMatch(/^https:\/\//);
      expect(p.repo, p.id).toMatch(/^https:\/\/github\.com\/davide97g\//);
      expect(existsSync(join("public", p.logo)), p.logo).toBe(true);
    }
  });

  it("each carry a trailer and screenshots that exist in public/", () => {
    for (const p of featuredProjects) {
      expect(p.trailers.length, p.id).toBeGreaterThan(0);
      for (const trailer of p.trailers) expect(trailer.id, p.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(p.shots.length, p.id).toBeGreaterThan(0);
      for (const shot of p.shots) {
        expect(existsSync(join("public", shot.avif)), shot.avif).toBe(true);
        expect(existsSync(join("public", shot.fallback)), shot.fallback).toBe(true);
      }
    }
  });

  it("are not duplicated in the secondary project list", () => {
    const titles = projects.map((p) => p.title.toLowerCase());
    for (const p of featuredProjects) expect(titles).not.toContain(p.name.toLowerCase());
  });
});

describe("socials", () => {
  it("gives every entry an absolute link and a handle to show", () => {
    expect(socials.length).toBeGreaterThan(0);

    for (const social of socials) {
      expect(social.url, social.id).toMatch(/^https:\/\//);
      expect(social.handle.trim(), social.id).not.toBe("");
      expect(social.name.trim(), social.id).not.toBe("");
    }
  });

  it("lists each platform once", () => {
    const ids = socials.map((social) => social.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("secondary projects", () => {
  it("lists the screenshotted ones first, right below the featured one", () => {
    expect(projects.slice(0, 4).map((p) => p.title)).toEqual([
      "Calorico",
      "Majestic",
      "Thumb Studio",
      "Channeling",
    ]);

    const withShot = projects.flatMap((p, i) => (p.shot ? [i] : []));
    expect(withShot).toEqual(withShot.map((_, i) => i));
  });

  it("pairs every screenshot with a badge saying why it is there", () => {
    const shown = projects.filter((p) => p.shot);
    expect(shown).toHaveLength(4);

    for (const project of shown) {
      expect(project.badge, project.title).toBeDefined();
      expect(project.shot?.avif, project.title).toMatch(/^\/shot-.+\.avif$/);
      expect(project.shot?.fallback, project.title).toMatch(/^\/shot-.+\.jpg$/);
      // Majestic has nowhere to point yet; the rest link to their live site.
      if (project.link) {
        expect(project.link, project.title).toMatch(/^https:\/\/\w+\.davideghiotto\.it\/$/);
      }
    }
  });
});
