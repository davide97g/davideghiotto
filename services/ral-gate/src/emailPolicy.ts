/**
 * Email admission policy for the gate. Three layers, cheapest first:
 *
 *   1. shape      — format, length, reserved TLDs, IDN canonicalized to punycode
 *   2. domain     — allowlist, then the disposable blocklist with parent matching
 *   3. mail hosts — MX lookup, then the SAME blocklist applied to the exchange
 *                   hostnames
 *
 * Layer 3 is what catches throwaway domains registered after the last list
 * refresh: the operators rotate domains constantly but reuse a handful of mail
 * backends, so a brand-new domain nobody has listed yet still resolves its MX to
 * `mail.yopmail.com` or `mx.temp-mail.org`.
 *
 * The allowlist wins over the blocklist everywhere, including MX matching — a
 * bad upstream entry must never lock out gmail, and legitimate custom domains
 * that forward through improvmx / forwardemail must stay usable.
 */

import fs from "node:fs";
import { config } from "./config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** RFC limits: 64 for the local part, 254 for the whole address. */
const MAX_LOCAL = 64;
const MAX_EMAIL = 254;

/** Not routable on the public internet, so never a real mailbox. */
const RESERVED_TLDS = new Set([
  "invalid",
  "local",
  "localhost",
  "test",
  "example",
  "internal",
  "home",
  "lan",
  "onion",
]);

/** Placeholder local parts — nobody reaches these on purpose. */
const JUNK_LOCALS = /^(test|tests|asdf|asdfasdf|qwerty|abc|abcd|xxx|aaa|foo|bar)$/i;

/** Providers that ignore dots in the local part, so `a.b@` === `ab@`. */
const DOT_INSENSITIVE = new Set(["gmail.com", "googlemail.com"]);

let disposableDomains = new Set<string>();
let disposableMxHosts = new Set<string>();
let allowedDomains = new Set<string>();

function readList(filePath: string): Set<string> {
  const raw = fs.readFileSync(filePath, "utf8");
  return new Set(
    raw
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line && !line.startsWith("#"))
  );
}

export function loadDisposableDomains() {
  disposableDomains = readList(config.disposablePath);
  disposableMxHosts = readList(config.disposableMxPath);
  allowedDomains = readList(config.allowlistPath);
}

/** Sizes of the loaded lists — logged at boot so a truncated file is obvious. */
export function policyListSizes() {
  return {
    disposableDomains: disposableDomains.size,
    disposableMxHosts: disposableMxHosts.size,
    allowedDomains: allowedDomains.size,
  };
}

/**
 * Lowercase, strip a trailing root dot, and convert IDN to punycode, so a
 * lookalike domain can't walk past a list that only holds ASCII.
 * Returns "" when the host isn't parseable.
 */
export function canonicalDomain(domain: string): string {
  const trimmed = domain.trim().toLowerCase().replace(/\.$/, "");
  if (!trimmed) return "";
  try {
    const { hostname } = new URL(`http://${trimmed}`);
    return hostname;
  } catch {
    return "";
  }
}

export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 1) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = canonicalDomain(trimmed.slice(at + 1));
  return domain ? `${local}@${domain}` : trimmed;
}

/**
 * The address as a *person*, not as a string: `d.g+ral@gmail.com` and
 * `dg@gmail.com` are one mailbox and must share one rate-limit budget and one
 * unlock. Sub-addressing is stripped everywhere; dots only where the provider
 * ignores them.
 *
 * Mail still goes to the address as typed — this form is for identity only.
 */
export function canonicalEmail(email: string): string {
  const normalized = normalizeEmail(email);
  const at = normalized.lastIndexOf("@");
  if (at < 1) return normalized;

  const domain = normalized.slice(at + 1);
  let local = normalized.slice(0, at);

  const plus = local.indexOf("+");
  if (plus > 0) local = local.slice(0, plus);
  if (DOT_INSENSITIVE.has(domain)) local = local.replace(/\./g, "");

  return `${local}@${domain}`;
}

export function isValidEmailFormat(email: string): boolean {
  if (email.length > MAX_EMAIL) return false;
  if (!EMAIL_RE.test(email)) return false;

  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const domain = canonicalDomain(email.slice(at + 1));

  if (local.length < 2 || local.length > MAX_LOCAL) return false;
  if (JUNK_LOCALS.test(local)) return false;
  if (!domain || !domain.includes(".")) return false;
  // No `..`, and no leading/trailing dot or dash on any label.
  if (/\.\.|^[.-]|[.-]$|\.-|-\./.test(domain)) return false;

  const tld = domain.slice(domain.lastIndexOf(".") + 1);
  if (tld.length < 2 || /^\d+$/.test(tld)) return false;
  if (RESERVED_TLDS.has(tld)) return false;

  return true;
}

/** The host plus every parent domain: a.b.c.com → [a.b.c.com, b.c.com, c.com]. */
function selfAndParents(host: string): string[] {
  const parts = host.split(".");
  const out: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) out.push(parts.slice(i).join("."));
  return out;
}

/** Explicitly trusted — checked before any blocklist, for domains and MX hosts. */
export function isAllowedDomain(host: string): boolean {
  const canonical = canonicalDomain(host);
  if (!canonical) return false;
  return selfAndParents(canonical).some((candidate) => allowedDomains.has(candidate));
}

/** Blocklisted domain, or a subdomain of one: foo.mailinator.com. */
export function isDisposableDomain(host: string): boolean {
  const canonical = canonicalDomain(host);
  if (!canonical) return true;
  if (isAllowedDomain(canonical)) return false;
  return selfAndParents(canonical).some((candidate) => disposableDomains.has(candidate));
}

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 1) return true;
  return isDisposableDomain(email.slice(at + 1));
}

/**
 * An MX hostname belonging to a known throwaway backend. Runs against the main
 * blocklist as well as the MX-only list, because most backends are named after
 * a brand that is already blocklisted.
 */
export function isDisposableMailHost(host: string): boolean {
  const canonical = canonicalDomain(host);
  if (!canonical) return false;
  if (isAllowedDomain(canonical)) return false;
  return selfAndParents(canonical).some(
    (candidate) => disposableMxHosts.has(candidate) || disposableDomains.has(candidate)
  );
}

type CacheEntry = { value: MailDomainCheck; expiresAt: number };

const dnsCache = new Map<string, CacheEntry>();
const CACHE_MAX = 5_000;

export interface MailDomainCheck {
  /** Domain publishes somewhere to deliver mail (MX, or an implicit A/AAAA). */
  deliverable: boolean;
  /** At least one mail host belongs to a known disposable backend. */
  disposableMx: boolean;
  /** MX hostnames found, canonicalized. Empty when delivery is implicit. */
  hosts: string[];
}

/**
 * DNS with a deadline. Without it a slow or blackholed resolver holds the
 * request open for the OS timeout, which is far longer than any visitor waits.
 */
async function withTimeout<T>(work: Promise<T>, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const deadline = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), config.dnsTimeoutMs);
  });
  try {
    return await Promise.race([work, deadline]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Can this domain receive mail, and does it receive it through a throwaway
 * backend? Cached briefly — the same domain gets hit repeatedly while someone
 * mistypes a code, and DNS answers don't change by the second.
 *
 * The A/AAAA fallback stays: RFC 5321 implicit MX is real and small legitimate
 * domains rely on it, so dropping it would reject genuine contacts. Mailbox
 * existence needs no probing — the OTP is the proof.
 */
export async function checkMailDomain(domain: string): Promise<MailDomainCheck> {
  const host = canonicalDomain(domain);
  if (!host) return { deliverable: false, disposableMx: false, hosts: [] };

  const cached = dnsCache.get(host);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const dns = await import("node:dns/promises");

  const mx = await withTimeout(
    dns.resolveMx(host).catch(() => [] as { exchange: string }[]),
    [] as { exchange: string }[]
  );

  const hosts = mx
    .map((record) => canonicalDomain(record.exchange))
    .filter((h): h is string => Boolean(h));

  let result: MailDomainCheck;
  if (hosts.length > 0) {
    result = {
      deliverable: true,
      disposableMx: hosts.some(isDisposableMailHost),
      hosts,
    };
  } else {
    const [a, aaaa] = await Promise.all([
      withTimeout(dns.resolve4(host).catch(() => [] as string[]), [] as string[]),
      withTimeout(dns.resolve6(host).catch(() => [] as string[]), [] as string[]),
    ]);
    result = {
      deliverable: a.length + aaaa.length > 0,
      disposableMx: false,
      hosts: [],
    };
  }

  if (dnsCache.size >= CACHE_MAX) dnsCache.clear();
  dnsCache.set(host, {
    value: result,
    expiresAt:
      Date.now() +
      (result.deliverable ? config.dnsCacheTtlSeconds : config.dnsNegativeTtlSeconds) * 1000,
  });

  return result;
}

/** Back-compat helper: delivery possible at all. */
export async function hasMxRecords(email: string): Promise<boolean> {
  const at = email.lastIndexOf("@");
  if (at < 1) return false;
  return (await checkMailDomain(email.slice(at + 1))).deliverable;
}
