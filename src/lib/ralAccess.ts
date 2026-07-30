/**
 * Mocked RAL unlock gate.
 *
 * Accepts any syntactically valid email, persists the unlock in localStorage,
 * and simulates a short network round-trip. Swap `requestRalAccess` for a real
 * service later — the page only depends on this module's surface.
 */

const STORAGE_KEY = "dg-ral-access-v1";

export interface RalAccess {
  email: string;
  unlockedAt: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!EMAIL_RE.test(trimmed)) return false;
  // Soft rejection of throwaway-looking placeholders while the real API is pending.
  const local = trimmed.split("@")[0] ?? "";
  if (local.length < 2) return false;
  if (/^(test|asdf|qwerty|abc|xxx)$/i.test(local)) return false;
  return true;
}

export function getRalAccess(): RalAccess | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RalAccess;
    if (!parsed?.email || !parsed?.unlockedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearRalAccess(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export type RalAccessResult =
  | { ok: true; access: RalAccess }
  | { ok: false; error: "invalid" | "network" };

/**
 * Mock verification — delay + format check. Replace the body with a fetch to
 * the future capture endpoint; keep the return shape stable.
 */
export async function requestRalAccess(email: string): Promise<RalAccessResult> {
  const trimmed = email.trim().toLowerCase();

  await new Promise((r) => setTimeout(r, 700));

  if (!isValidEmail(trimmed)) {
    return { ok: false, error: "invalid" };
  }

  const access: RalAccess = {
    email: trimmed,
    unlockedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
  } catch {
    return { ok: false, error: "network" };
  }

  return { ok: true, access };
}
