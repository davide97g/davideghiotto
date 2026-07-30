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
`);

// Older DBs may predate expires_at — add it and expire legacy rows immediately.
const unlockCols = db.pragma("table_info(unlocks)") as { name: string }[];
if (!unlockCols.some((c) => c.name === "expires_at")) {
  db.exec(`ALTER TABLE unlocks ADD COLUMN expires_at TEXT`);
  db.exec(`UPDATE unlocks SET expires_at = unlocked_at WHERE expires_at IS NULL`);
}

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

export function countRecent(kind: string, key: "email" | "ip", value: string, sinceIso: string) {
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
  key: "email" | "ip",
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
