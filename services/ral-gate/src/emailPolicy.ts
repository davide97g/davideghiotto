import fs from "node:fs";
import { config } from "./config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

let disposable = new Set<string>();

export function loadDisposableDomains() {
  const raw = fs.readFileSync(config.disposablePath, "utf8");
  disposable = new Set(
    raw
      .split("\n")
      .map((l) => l.trim().toLowerCase())
      .filter((l) => l && !l.startsWith("#"))
  );
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailFormat(email: string): boolean {
  if (!EMAIL_RE.test(email)) return false;
  const [local, domain] = email.split("@");
  if (!local || local.length < 2) return false;
  if (!domain || !domain.includes(".")) return false;
  if (/^(test|asdf|qwerty|abc|xxx)$/i.test(local)) return false;
  return true;
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return true;
  if (disposable.has(domain)) return true;
  // Catch subdomains of known disposables: foo.mailinator.com
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join(".");
    if (disposable.has(candidate)) return true;
  }
  return false;
}

/** Best-effort MX presence check — soft fail open only on DNS errors in production? Fail closed. */
export async function hasMxRecords(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  if (!domain) return false;
  try {
    const dns = await import("node:dns/promises");
    const mx = await dns.resolveMx(domain);
    return mx.length > 0;
  } catch {
    try {
      const dns = await import("node:dns/promises");
      // Some hosts only publish A/AAAA
      const a = await dns.resolve4(domain).catch(() => [] as string[]);
      const aaaa = await dns.resolve6(domain).catch(() => [] as string[]);
      return a.length + aaaa.length > 0;
    } catch {
      return false;
    }
  }
}
