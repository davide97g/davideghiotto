import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { sectionOrder } from "./content";
import {
  hasBody,
  journalPlatforms,
  journalPosts,
  loadPostBody,
  readingMinutes,
  type JournalPlatformId,
} from "./journal";

const LANGS = ["en", "it"] as const;
const PLATFORM_IDS: JournalPlatformId[] = ["linkedin", "youtube", "github", "site"];

describe("journal section", () => {
  it("is detached, between work and stack", () => {
    expect([...sectionOrder]).toEqual([
      "hero",
      "channel",
      "work",
      "journal",
      "stack",
      "path",
      "profile",
    ]);
  });

  it("only lists platforms the rail can render an icon for", () => {
    for (const platform of journalPlatforms) expect(PLATFORM_IDS).toContain(platform.id);
  });

  it("has a LinkedIn platform for the cross-post CTA", () => {
    expect(journalPlatforms.find((p) => p.id === "linkedin")?.url).toContain(
      "linkedin.com/in/"
    );
  });
});

describe("journal posts", () => {
  it("ships at least one post", () => {
    expect(journalPosts.length).toBeGreaterThan(0);
  });

  it("has unique, url-safe slugs", () => {
    const slugs = journalPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("carries an ISO date, and a well-formed video id when it has one", () => {
    for (const post of journalPosts) {
      expect(post.date, post.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(post.date).getTime()), post.slug).toBe(false);
      // Notes not drawn from a stream carry no video — but a present id must be usable.
      if (post.video !== undefined) expect(post.video, post.slug).toMatch(/^[\w-]{11}$/);
    }
  });

  it("keeps every referenced image in public/", async () => {
    const missing: string[] = [];
    for (const post of journalPosts) {
      for (const lang of LANGS) {
        const body = await loadPostBody(post.slug, lang);
        for (const [, src] of body.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)) {
          if (!existsSync(join(process.cwd(), "public", src))) {
            missing.push(`${post.slug}.${lang}: ${src}`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it.each(LANGS)("has a %s body file for every post", (lang) => {
    const missing = journalPosts.filter((post) => !hasBody(post.slug, lang));
    expect(missing.map((post) => post.slug)).toEqual([]);
  });

  it.each(LANGS)("has a substantial %s body for every post", async (lang) => {
    const short: string[] = [];
    for (const post of journalPosts) {
      const body = await loadPostBody(post.slug, lang);
      if (body.trim().length < 400) short.push(post.slug);
    }
    expect(short).toEqual([]);
  });

  it.each(LANGS)("has a %s title and excerpt for every post", (lang) => {
    for (const post of journalPosts) {
      expect(post.title[lang].trim(), post.slug).not.toBe("");
      expect(post.excerpt[lang].trim(), post.slug).not.toBe("");
    }
  });

  it("never publishes an unresolved TK marker", async () => {
    for (const post of journalPosts) {
      for (const lang of LANGS) {
        const body = await loadPostBody(post.slug, lang);
        expect(body, `${post.slug}.${lang}`).not.toContain("[TK");
      }
    }
  });

  it("reports a plausible reading time", async () => {
    for (const post of journalPosts) {
      for (const lang of LANGS) {
        expect(readingMinutes(await loadPostBody(post.slug, lang))).toBeGreaterThanOrEqual(2);
      }
    }
  });

  /**
   * The notes quote the streams by timestamp, so a mislabelled deep link sends the
   * reader to the wrong moment and silently misattributes a quote. Every
   * `@ HH:MM:SS](…&t=Ns)` pair has to agree.
   */
  it("links every quoted timestamp to the matching second", async () => {
    const pattern =
      /@ (\d{2}):(\d{2}):(\d{2})\]\(https:\/\/www\.youtube\.com\/watch\?v=[\w-]+&t=(\d+)s\)/g;
    const mismatches: string[] = [];
    let checked = 0;

    for (const post of journalPosts) {
      for (const lang of LANGS) {
        const body = await loadPostBody(post.slug, lang);
        for (const [, h, m, s, secs] of body.matchAll(pattern)) {
          checked += 1;
          const expected = Number(h) * 3600 + Number(m) * 60 + Number(s);
          if (expected !== Number(secs)) {
            mismatches.push(`${post.slug}.${lang}: ${h}:${m}:${s} → t=${secs}s`);
          }
        }
      }
    }

    expect(mismatches).toEqual([]);
    expect(checked).toBeGreaterThan(50);
  });
});
