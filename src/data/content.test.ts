import { describe, expect, it } from "vitest";
import {
  cover,
  experiences,
  featuredProject,
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
      featuredProject,
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

describe("featured project", () => {
  it("points at the live site and the public repo", () => {
    expect(featuredProject.site).toBe("https://autocratico.it/");
    expect(featuredProject.repo).toBe("https://github.com/davide97g/autocratico");
    expect(featuredProject.logo).toBe("/autocratico.svg");
  });

  it("is not duplicated in the secondary project list", () => {
    const titles = projects.map((p) => p.title.toLowerCase());
    expect(titles).not.toContain(featuredProject.name.toLowerCase());
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
