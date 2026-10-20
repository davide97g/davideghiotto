/**
 * Live 3D-print projects, read straight from GitHub by the browser.
 *
 * Unlike the YouTube feed, GitHub sends CORS headers, so there is no backend in
 * the loop: one call for the repo list plus one per tagged repo, cached for the
 * session so reloads do not spend the unauthenticated 60/hour. Fail-soft — the
 * bundle ships `src/data/prints.snapshot.json`, which renders first and stays on
 * screen when GitHub errors or rate-limits.
 */

import { printsSnapshot } from "@/data/prints";
import { discoverPrints, type PrintsSnapshot } from "@/lib/printsGithub";
import { useQuery } from "@tanstack/react-query";

const STALE_MS = 15 * 60_000;
const CACHE_KEY = "prints:snapshot";

function readCache(): PrintsSnapshot | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as PrintsSnapshot;
    return Date.now() - Date.parse(cached.syncedAt) < STALE_MS ? cached : null;
  } catch {
    return null;
  }
}

async function fetchPrints(): Promise<PrintsSnapshot> {
  const cached = readCache();
  if (cached) return cached;
  const live = await discoverPrints();
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(live));
  } catch {
    // Private mode or a full quota: the next load just asks GitHub again.
  }
  return live;
}

export function usePrints(): PrintsSnapshot {
  const { data } = useQuery({
    queryKey: ["prints"],
    queryFn: fetchPrints,
    staleTime: STALE_MS,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return data ?? printsSnapshot;
}
