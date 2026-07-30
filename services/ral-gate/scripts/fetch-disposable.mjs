/**
 * Regenerates data/disposable-domains.txt from the canonical community list.
 * Run with `npm run fetch:disposable` (from services/ral-gate).
 *
 *   disposable_email_blocklist.conf - upstream list
 *   data/allowed-domains.txt        - our allowlist, subtracted (gmail, relays, MX)
 *   data/disposable-extra.txt       - our own additions, added
 *
 * Upstream used to publish an allowlist.conf of their own false positives; it is
 * gone from the repo, so data/allowed-domains.txt is the only guard against a bad
 * upstream entry. Keep it current.
 *
 * The two local files are never written to, so a refresh can't drop hand-made
 * decisions.
 */
import { readFile, writeFile } from "node:fs/promises";

const BLOCKLIST_URL =
  "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf";

const TARGET = new URL("../data/disposable-domains.txt", import.meta.url);
const LOCAL_ALLOW = new URL("../data/allowed-domains.txt", import.meta.url);
const LOCAL_EXTRA = new URL("../data/disposable-extra.txt", import.meta.url);

/** Lower-cased, comment- and blank-stripped lines. */
function parseList(text) {
  return text
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith("#"));
}

async function fetchList(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status} ${res.statusText}`);
  return parseList(await res.text());
}

async function readLocal(url) {
  try {
    return parseList(await readFile(url, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

const [blocklist, localAllow, localExtra] = await Promise.all([
  fetchList(BLOCKLIST_URL),
  readLocal(LOCAL_ALLOW),
  readLocal(LOCAL_EXTRA),
]);

const allowed = new Set(localAllow);
const domains = new Set(
  [...blocklist, ...localExtra].filter((domain) => domain.includes(".") && !allowed.has(domain))
);

// A truncated or moved upstream file must fail loudly rather than quietly
// shipping a list that blocks nothing.
if (domains.size < 2000) {
  throw new Error(`Refusing to write a suspiciously small list (${domains.size} domains)`);
}

const sorted = [...domains].sort();
const header = [
  "# Disposable / throwaway email domains — DO NOT EDIT BY HAND.",
  "# Regenerate with `npm run fetch:disposable`.",
  "#",
  "# Source: github.com/disposable-email-domains/disposable-email-domains",
  "# minus data/allowed-domains.txt, plus data/disposable-extra.txt.",
  `# ${sorted.length} domains.`,
  "",
];

await writeFile(TARGET, `${header.join("\n")}${sorted.join("\n")}\n`, "utf8");

console.log(
  `disposable-domains.txt: ${sorted.length} domains ` +
    `(upstream ${blocklist.length}, local extra ${localExtra.length}, allowed ${allowed.size})`
);
