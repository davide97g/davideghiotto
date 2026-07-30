import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

export const db = new Database(config.databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS otp_codes (
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    PRIMARY KEY (email)
  );

  CREATE TABLE IF NOT EXISTS unlocks (
    email TEXT PRIMARY KEY,
    unlocked_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS request_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    ip TEXT,
    kind TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_request_log_email ON request_log (kind, email, created_at);
  CREATE INDEX IF NOT EXISTS idx_request_log_ip ON request_log (kind, ip, created_at);
  CREATE INDEX IF NOT EXISTS idx_request_log_created ON request_log (created_at);
`);

// Older DBs may predate expires_at — add it and expire legacy rows immediately.
const unlockCols = db.pragma("table_info(unlocks)") as { name: string }[];
if (!unlockCols.some((c) => c.name === "expires_at")) {
  db.exec(`ALTER TABLE unlocks ADD COLUMN expires_at TEXT`);
  db.exec(`UPDATE unlocks SET expires_at = unlocked_at WHERE expires_at IS NULL`);
}

/**
 * request_log started as (email, ip, kind, created_at). Everything else is added
 * here so an existing SQLite file on the volume upgrades in place — SQLite only
 * allows one column per ALTER, and re-adding an existing column is an error, so
 * each one is guarded.
 */
const REQUEST_LOG_COLUMNS: Record<string, string> = {
  canonical_email: "TEXT",
  email_domain: "TEXT",
  outcome: "TEXT",
  user_agent: "TEXT",
  referer: "TEXT",
  origin: "TEXT",
  accept_language: "TEXT",
  country: "TEXT",
  mx_hosts: "TEXT",
  forwarded_for: "TEXT",
};

const logCols = new Set(
  (db.pragma("table_info(request_log)") as { name: string }[]).map((c) => c.name)
);
for (const [name, type] of Object.entries(REQUEST_LOG_COLUMNS)) {
  if (!logCols.has(name)) db.exec(`ALTER TABLE request_log ADD COLUMN ${name} ${type}`);
}

// After the migration, since rate limiting keys on the canonical address.
db.exec(
  `CREATE INDEX IF NOT EXISTS idx_request_log_canonical
     ON request_log (kind, canonical_email, created_at)`
);

export type OtpRow = {
  email: string;
  code_hash: string;
  expires_at: string;
  attempts: number;
  created_at: string;
};

export type UnlockRow = {
  email: string;
  unlocked_at: string;
  last_seen_at: string;
  expires_at: string;
};

export function upsertOtp(email: string, codeHash: string, expiresAt: string) {
  db.prepare(
    `INSERT INTO otp_codes (email, code_hash, expires_at, attempts, created_at)
     VALUES (?, ?, ?, 0, ?)
     ON CONFLICT(email) DO UPDATE SET
       code_hash = excluded.code_hash,
       expires_at = excluded.expires_at,
       attempts = 0,
       created_at = excluded.created_at`
  ).run(email, codeHash, expiresAt, new Date().toISOString());
}

export function getOtp(email: string): OtpRow | undefined {
  return db.prepare(`SELECT * FROM otp_codes WHERE email = ?`).get(email) as OtpRow | undefined;
}

export function bumpOtpAttempts(email: string) {
  db.prepare(`UPDATE otp_codes SET attempts = attempts + 1 WHERE email = ?`).run(email);
}

export function clearOtp(email: string) {
  db.prepare(`DELETE FROM otp_codes WHERE email = ?`).run(email);
}

export function recordUnlock(email: string, expiresAt: string) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO unlocks (email, unlocked_at, last_seen_at, expires_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       unlocked_at = excluded.unlocked_at,
       last_seen_at = excluded.last_seen_at,
       expires_at = excluded.expires_at`
  ).run(email, now, now, expiresAt);
}

export function touchUnlock(email: string) {
  db.prepare(`UPDATE unlocks SET last_seen_at = ? WHERE email = ?`).run(
    new Date().toISOString(),
    email
  );
}

export function getUnlock(email: string): UnlockRow | undefined {
  return db
    .prepare(`SELECT email, unlocked_at, last_seen_at, expires_at FROM unlocks WHERE email = ?`)
    .get(email) as UnlockRow | undefined;
}

export function clearUnlock(email: string) {
  db.prepare(`DELETE FROM unlocks WHERE email = ?`).run(email);
}

/** Drop unlock rows past their expires_at. Returns how many were removed. */
export function clearExpiredUnlocks(nowIso = new Date().toISOString()): number {
  const result = db.prepare(`DELETE FROM unlocks WHERE expires_at < ?`).run(nowIso);
  return result.changes;
}

/**
 * Valid unlock only — expired rows are deleted and treated as missing.
 * This is the gate for /session and /data so amounts never leave after TTL.
 */
export function getValidUnlock(email: string): UnlockRow | undefined {
  const unlock = getUnlock(email);
  if (!unlock) return undefined;
  if (!unlock.expires_at || new Date(unlock.expires_at).getTime() < Date.now()) {
    clearUnlock(email);
    return undefined;
  }
  return unlock;
}

export function logRequest(kind: string, email: string | null, ip: string | null) {
  db.prepare(
    `INSERT INTO request_log (email, ip, kind, created_at) VALUES (?, ?, ?, ?)`
  ).run(email, ip, kind, new Date().toISOString());
}

/** Everything worth keeping about one hit on the gate. */
export interface RequestLogEntry {
  kind: string;
  /** Address as typed (normalized case). Absent when the body never parsed. */
  email?: string | null;
  /** Identity form — sub-addressing and provider dots removed. */
  canonicalEmail?: string | null;
  emailDomain?: string | null;
  /** How the request ended: ok, invalid, disposable, disposable_mx, … */
  outcome?: string | null;
  ip?: string | null;
  forwardedFor?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  origin?: string | null;
  acceptLanguage?: string | null;
  /** Cloudflare's CF-IPCountry, when the request came through the proxy. */
  country?: string | null;
  /** MX hostnames the domain resolved to, comma-joined. */
  mxHosts?: string | null;
}

export function logRequestDetails(entry: RequestLogEntry) {
  db.prepare(
    `INSERT INTO request_log (
       kind, email, canonical_email, email_domain, outcome,
       ip, forwarded_for, user_agent, referer, origin, accept_language, country,
       mx_hosts, created_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    entry.kind,
    entry.email ?? null,
    entry.canonicalEmail ?? null,
    entry.emailDomain ?? null,
    entry.outcome ?? null,
    entry.ip ?? null,
    entry.forwardedFor ?? null,
    entry.userAgent ?? null,
    entry.referer ?? null,
    entry.origin ?? null,
    entry.acceptLanguage ?? null,
    entry.country ?? null,
    entry.mxHosts ?? null,
    new Date().toISOString()
  );
}

export interface RequestLogRow {
  id: number;
  created_at: string;
  kind: string;
  outcome: string | null;
  email: string | null;
  canonical_email: string | null;
  email_domain: string | null;
  ip: string | null;
  forwarded_for: string | null;
  country: string | null;
  user_agent: string | null;
  referer: string | null;
  origin: string | null;
  accept_language: string | null;
  mx_hosts: string | null;
}

/** Newest first, optionally filtered by kind / outcome / email substring. */
export function listRequests(opts: {
  limit?: number;
  offset?: number;
  kind?: string;
  outcome?: string;
  email?: string;
} = {}): RequestLogRow[] {
  const limit = Math.min(Math.max(opts.limit ?? 100, 1), 1000);
  const offset = Math.max(opts.offset ?? 0, 0);
  const where: string[] = [];
  const params: unknown[] = [];

  if (opts.kind) {
    where.push("kind = ?");
    params.push(opts.kind);
  }
  if (opts.outcome) {
    where.push("outcome = ?");
    params.push(opts.outcome);
  }
  if (opts.email) {
    where.push("(email LIKE ? OR canonical_email LIKE ?)");
    params.push(`%${opts.email}%`, `%${opts.email}%`);
  }

  return db
    .prepare(
      `SELECT id, created_at, kind, outcome, email, canonical_email, email_domain,
              ip, forwarded_for, country, user_agent, referer, origin,
              accept_language, mx_hosts
         FROM request_log
         ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        ORDER BY created_at DESC, id DESC
        LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset) as RequestLogRow[];
}

/**
 * One row per mailbox: how many times it asked, whether it ever unlocked, and
 * when it was last seen. This is the "who looked at my numbers" view.
 */
export function listEmailActivity(limit = 200) {
  return db
    .prepare(
      `SELECT
         COALESCE(canonical_email, email) AS email,
         MIN(created_at)                  AS first_seen,
         MAX(created_at)                  AS last_seen,
         COUNT(*)                         AS events,
         SUM(kind = 'request')            AS code_requests,
         SUM(kind = 'verify')             AS verify_attempts,
         SUM(outcome = 'unlocked')        AS unlocks,
         SUM(kind = 'data')               AS data_reads,
         SUM(kind LIKE '%_blocked')       AS blocked,
         COUNT(DISTINCT ip)               AS distinct_ips,
         MAX(country)                     AS country,
         MAX(email_domain)                AS domain
       FROM request_log
       WHERE COALESCE(canonical_email, email) IS NOT NULL
       GROUP BY COALESCE(canonical_email, email)
       ORDER BY last_seen DESC
       LIMIT ?`
    )
    .all(Math.min(Math.max(limit, 1), 1000));
}

export function requestTotals() {
  const byOutcome = db
    .prepare(
      `SELECT kind, COALESCE(outcome, 'unknown') AS outcome, COUNT(*) AS n
         FROM request_log GROUP BY kind, outcome ORDER BY n DESC`
    )
    .all();
  const totals = db
    .prepare(
      `SELECT COUNT(*) AS events,
              COUNT(DISTINCT COALESCE(canonical_email, email)) AS mailboxes,
              COUNT(DISTINCT ip) AS ips,
              MIN(created_at) AS since
         FROM request_log`
    )
    .get();
  return { totals, byOutcome };
}

/** Drop request_log rows older than the retention window. 0 days = keep all. */
export function pruneRequestLog(days: number): number {
  if (!days || days <= 0) return 0;
  const cutoff = new Date(Date.now() - days * 86_400_000).toISOString();
  return db.prepare(`DELETE FROM request_log WHERE created_at < ?`).run(cutoff).changes;
}

export type RateKey = "email" | "canonical_email" | "ip";

export function countRecent(kind: string, key: RateKey, value: string, sinceIso: string) {
  return (
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM request_log
         WHERE kind = ? AND ${key} = ? AND created_at >= ?`
      )
      .get(kind, value, sinceIso) as { n: number }
  ).n;
}

/**
 * Timestamps of the matching rows still inside the window, oldest first.
 * Rate limiting needs the timestamps, not just the count: the oldest hit is what
 * tells the caller how long until a slot frees up again.
 */
export function recentTimestamps(
  kind: string,
  key: RateKey,
  value: string,
  sinceIso: string
): string[] {
  const rows = db
    .prepare(
      `SELECT created_at FROM request_log
       WHERE kind = ? AND ${key} = ? AND created_at >= ?
       ORDER BY created_at ASC`
    )
    .all(kind, value, sinceIso) as { created_at: string }[];
  return rows.map((r) => r.created_at);
}
