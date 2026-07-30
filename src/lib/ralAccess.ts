/**
 * Client for the ral-gate service.
 *
 * Fail-closed: any network / auth / config failure leaves the disclosure locked.
 * Amounts never live in this module — they arrive from GET /v1/ral/data.
 * Unlocks expire server-side; the client also clears local state when expiresAt hits.
 */

import type { RalUnlockedData } from "@/data/ral";

const STORAGE_KEY = "dg-ral-access-v2";
const TOKEN_KEY = "dg-ral-token-v2";

export interface RalAccess {
  email: string;
  unlockedAt: string;
  /** ISO timestamp — after this the backend refuses data and the UI must re-lock. */
  expiresAt: string;
}

export type RalGateError =
  | "invalid"
  | "disposable"
  | "network"
  | "rate_limit"
  | "mail"
  | "code"
  | "expired"
  | "locked"
  | "auth"
  | "unavailable";

/**
 * A failed call. `retryAfterMinutes` is only set for `rate_limit`, where the
 * service tells us how long until the caller gets another attempt.
 */
export type RalGateFailure = {
  ok: false;
  error: RalGateError;
  retryAfterMinutes?: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Minutes to wait, from the JSON body or the Retry-After header. */
function retryAfterMinutes(
  body: { retryAfterSeconds?: number; retryAfterMinutes?: number } | null,
  res: Response
): number | undefined {
  if (typeof body?.retryAfterMinutes === "number" && body.retryAfterMinutes > 0) {
    return Math.ceil(body.retryAfterMinutes);
  }
  const seconds =
    typeof body?.retryAfterSeconds === "number"
      ? body.retryAfterSeconds
      : Number(res.headers.get("retry-after"));
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return Math.max(1, Math.ceil(seconds / 60));
}

function apiBase(): string | null {
  const raw = import.meta.env.VITE_RAL_API_URL as string | undefined;
  if (!raw?.trim()) return null;
  return raw.replace(/\/$/, "");
}

export function isRalApiConfigured(): boolean {
  return Boolean(apiBase());
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!EMAIL_RE.test(trimmed)) return false;
  const local = trimmed.split("@")[0] ?? "";
  if (local.length < 2) return false;
  return true;
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function isExpired(expiresAt: string): boolean {
  const t = Date.parse(expiresAt);
  return !Number.isFinite(t) || t <= Date.now();
}

export function getRalAccess(): RalAccess | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RalAccess;
    if (!parsed?.email || !parsed?.unlockedAt || !parsed?.expiresAt) {
      clearRalAccess();
      return null;
    }
    if (!getStoredToken()) {
      clearRalAccess();
      return null;
    }
    if (isExpired(parsed.expiresAt)) {
      clearRalAccess();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearRalAccess(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

function persistAccess(access: RalAccess, token: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
  localStorage.setItem(TOKEN_KEY, token);
}

async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response | null> {
  const base = apiBase();
  if (!base) return null;
  try {
    return await fetch(`${base}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch {
    return null;
  }
}

export type RequestOtpResult =
  | { ok: true; expiresIn: number; devCode?: string }
  | RalGateFailure;

export async function requestRalOtp(email: string): Promise<RequestOtpResult> {
  const trimmed = email.trim().toLowerCase();
  if (!isValidEmail(trimmed)) return { ok: false, error: "invalid" };

  const res = await apiFetch("/v1/ral/request", {
    method: "POST",
    body: JSON.stringify({ email: trimmed }),
  });

  if (!res) return { ok: false, error: "unavailable" };

  const body = (await res.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: RalGateError;
        expiresIn?: number;
        devCode?: string;
        retryAfterSeconds?: number;
        retryAfterMinutes?: number;
      }
    | null;

  if (!res.ok || !body?.ok) {
    const error = body?.error ?? (res.status === 429 ? "rate_limit" : "network");
    return {
      ok: false,
      error,
      ...(error === "rate_limit"
        ? { retryAfterMinutes: retryAfterMinutes(body, res) }
        : {}),
    };
  }

  return {
    ok: true,
    expiresIn: body.expiresIn ?? 600,
    ...(body.devCode ? { devCode: body.devCode } : {}),
  };
}

export type VerifyOtpResult = { ok: true; access: RalAccess } | RalGateFailure;

export async function verifyRalOtp(
  email: string,
  code: string
): Promise<VerifyOtpResult> {
  const trimmed = email.trim().toLowerCase();
  const res = await apiFetch("/v1/ral/verify", {
    method: "POST",
    body: JSON.stringify({ email: trimmed, code: code.trim() }),
  });

  if (!res) return { ok: false, error: "unavailable" };

  const body = (await res.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: RalGateError;
        token?: string;
        access?: RalAccess;
        retryAfterSeconds?: number;
        retryAfterMinutes?: number;
      }
    | null;

  if (
    !res.ok ||
    !body?.ok ||
    !body.token ||
    !body.access?.email ||
    !body.access.unlockedAt ||
    !body.access.expiresAt
  ) {
    const error = body?.error ?? (res.status === 429 ? "rate_limit" : "code");
    return {
      ok: false,
      error,
      ...(error === "rate_limit"
        ? { retryAfterMinutes: retryAfterMinutes(body, res) }
        : {}),
    };
  }

  persistAccess(body.access, body.token);
  return { ok: true, access: body.access };
}

export type LoadRalDataResult =
  | { ok: true; access: RalAccess; data: RalUnlockedData }
  | { ok: false; error: RalGateError };

/**
 * Restore a previous session. Fail-closed: missing API / 401 / network → locked.
 */
export async function loadRalSessionData(): Promise<LoadRalDataResult> {
  const token = getStoredToken();
  if (!token) return { ok: false, error: "auth" };

  const res = await apiFetch("/v1/ral/data", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res) {
    clearRalAccess();
    return { ok: false, error: "unavailable" };
  }

  if (res.status === 401) {
    clearRalAccess();
    const body = (await res.json().catch(() => null)) as
      | { error?: RalGateError }
      | null;
    return { ok: false, error: body?.error ?? "auth" };
  }

  const body = (await res.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: RalGateError;
        access?: RalAccess;
        data?: RalUnlockedData;
      }
    | null;

  if (
    !res.ok ||
    !body?.ok ||
    !body.access?.email ||
    !body.access.unlockedAt ||
    !body.access.expiresAt ||
    !body.data
  ) {
    clearRalAccess();
    return { ok: false, error: body?.error ?? "network" };
  }

  if (isExpired(body.access.expiresAt)) {
    clearRalAccess();
    return { ok: false, error: "expired" };
  }

  persistAccess(body.access, token);
  return { ok: true, access: body.access, data: body.data };
}

/** Remaining unlock time in whole seconds (0 if expired / missing). */
export function unlockSecondsLeft(access: RalAccess | null): number {
  if (!access?.expiresAt) return 0;
  const ms = Date.parse(access.expiresAt) - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.ceil(ms / 1000);
}

export function formatUnlockCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
