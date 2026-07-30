#!/usr/bin/env node
/**
 * Writes `public/sitemap.xml` from the journal data, so the note pages can't be
 * published without being crawlable.
 *
 * Slugs and dates are read straight out of `src/data/journal.ts` — that file is the
 * single source of truth for what exists at `/journal/:slug`, and a hand-maintained
 * sitemap would drift from it the first time a note is added. Runs as part of
 * `npm run build`; `src/data/sitemap.test.ts` fails if the committed file is stale.
 *
 * Language is a `?lang=` query param rather than a path, so each page has one
 * canonical `<loc>` plus `hreflang` alternates pointing at the two variants.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://davideghiotto.it";
const LANGS = ["en", "it"];

const source = readFileSync(resolve(root, "src/data/journal.ts"), "utf8");

/** Each `journalPosts` entry opens with its slug and date, in that order. */
const posts = [...source.matchAll(/slug:\s*"([^"]+)",\s*\n\s*date:\s*"(\d{4}-\d{2}-\d{2})"/g)].map(
  ([, slug, date]) => ({ slug, date })
);

if (!posts.length) {
  console.error("sitemap: no posts found in src/data/journal.ts — refusing to write");
  process.exit(1);
}

/** Newest post date, used as the landing page's lastmod so it stays deterministic. */
const latest = posts.map((p) => p.date).sort().at(-1);

const alternates = (path) =>
  [
    ...LANGS.map(
      (lang) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}${path}?lang=${lang}" />`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${path}" />`,
  ].join("\n");

const entry = ({ path, lastmod, changefreq, priority }) =>
  [
    "  <url>",
    `    <loc>${SITE}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    alternates(path),
    "  </url>",
  ].join("\n");

const urls = [
  entry({ path: "/", lastmod: latest, changefreq: "weekly", priority: "1.0" }),
  entry({
    path: "/ral",
    lastmod: latest,
    changefreq: "monthly",
    priority: "0.7",
  }),
  ...posts.map((post) =>
    entry({
      path: `/journal/${post.slug}`,
      lastmod: post.date,
      changefreq: "monthly",
      priority: "0.8",
    })
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls.join("\n")}
</urlset>
`;

writeFileSync(resolve(root, "public/sitemap.xml"), xml);
console.log(`sitemap: wrote ${urls.length} urls (1 landing + 1 ral + ${posts.length} notes)`);
