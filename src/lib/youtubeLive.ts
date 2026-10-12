/**
 * Live channel data from the site backend (GET /v1/youtube), refreshed there
 * every 15 minutes and polled here on the same beat.
 *
 * Fail-soft, the opposite of the RAL gate: the bundle ships a static copy in
 * `src/data/youtube.ts`, the section renders that first, and a response only
 * replaces the parts of it that came back well-formed. No backend, a 503 or a
 * malformed body all leave the static copy on screen.
 */

import { channel, videos as staticVideos, type Video } from "@/data/youtube";
import { apiBase } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface ChannelData {
  subscribers: number;
  videoCount: number;
  videos: Video[];
}

const POLL_MS = 15 * 60_000;

export const staticChannelData: ChannelData = {
  subscribers: channel.subscribers,
  videoCount: channel.videoCount,
  videos: staticVideos,
};

const isCount = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0;

const isVideo = (v: unknown): v is Video => {
  const x = v as Record<string, unknown> | null;
  return (
    typeof x?.id === "string" &&
    /^[\w-]{6,}$/.test(x.id) &&
    typeof x.title === "string" &&
    typeof x.publishedAt === "string" &&
    Number.isFinite(Date.parse(x.publishedAt))
  );
};

/** Merges a response over the static copy, field by field. */
export function mergeSnapshot(body: unknown, fallback: ChannelData = staticChannelData): ChannelData {
  const b = (body ?? {}) as Record<string, unknown>;
  const live = Array.isArray(b.videos)
    ? b.videos.filter(isVideo).map(({ id, title, publishedAt }) => ({ id, title, publishedAt }))
    : [];
  return {
    subscribers: isCount(b.subscribers) ? b.subscribers : fallback.subscribers,
    videoCount: isCount(b.videoCount) ? b.videoCount : fallback.videoCount,
    videos: live.length ? live : fallback.videos,
  };
}

async function fetchChannelData(): Promise<ChannelData> {
  const res = await fetch(`${apiBase()}/v1/youtube`);
  if (!res.ok) throw new Error(`youtube snapshot ${res.status}`);
  return mergeSnapshot(await res.json());
}

export function useChannelData(): ChannelData {
  const { data } = useQuery({
    queryKey: ["youtube"],
    queryFn: fetchChannelData,
    enabled: Boolean(apiBase()),
    staleTime: POLL_MS,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  return data ?? staticChannelData;
}
