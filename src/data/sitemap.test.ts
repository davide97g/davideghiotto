import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { journalPosts } from "./journal";

const sitemap = readFileSync(resolve(process.cwd(), "public/sitemap.xml"), "utf8");
const SITE = "https://davideghiotto.it";

/**
 * `npm run build` regenerates the sitemap, but the file is committed — so a note
 * added without a build would ship uncrawlable. These assertions catch that.
 */
describe("sitemap", () => {
  it("is a well-formed urlset with the hreflang namespace", () => {
    expect(sitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
  });

  it("lists the landing page", () => {
    expect(sitemap).toContain(`<loc>${SITE}/</loc>`);
  });

  it("lists every journal post exactly once", () => {
    for (const post of journalPosts) {
      const loc = `<loc>${SITE}/journal/${post.slug}</loc>`;
      expect(sitemap.split(loc).length - 1, post.slug).toBe(1);
    }
  });

  it("has one url entry per post plus the landing page", () => {
    expect(sitemap.split("<url>").length - 1).toBe(journalPosts.length + 1);
  });

  it("carries each post's own date as its lastmod", () => {
    for (const post of journalPosts) {
      const block = sitemap
        .split("<url>")
        .find((chunk) => chunk.includes(`/journal/${post.slug}</loc>`));
      expect(block, post.slug).toContain(`<lastmod>${post.date}</lastmod>`);
    }
  });

  it("offers both languages plus x-default for every url", () => {
    const entries = sitemap.split("<url>").slice(1);
    for (const entry of entries) {
      expect(entry).toMatch(/hreflang="en"/);
      expect(entry).toMatch(/hreflang="it"/);
      expect(entry).toMatch(/hreflang="x-default"/);
    }
  });

  it("is advertised in robots.txt", () => {
    const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});
