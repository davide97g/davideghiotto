/**
 * Base URL of the site backend (services/ral-gate), which serves both the RAL
 * unlock and the live YouTube snapshot. Null when unset — every caller then
 * falls back to what the bundle ships.
 */
export function apiBase(): string | null {
  const raw = import.meta.env.VITE_RAL_API_URL as string | undefined;
  if (!raw?.trim()) return null;
  return raw.replace(/\/$/, "");
}
