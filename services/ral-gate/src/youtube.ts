import { config } from "./config.js";

/**
 * Live YouTube data for the portfolio's channel section.
 *
 * The browser cannot read any of this itself: the channel RSS feed sends no CORS
 * headers, and the counts are not in the feed at all. So this service fetches
 * both on a timer and serves the last good snapshot at GET /v1/youtube. The site
 * ships a static copy of the same data and only swaps it for this one when the
 * call succeeds, so an outage here costs freshness, never content.
 *
 * Videos come from the RSS feed (no key, the latest 15). Counts come from the
 * YouTube Data API when YOUTUBE_API_KEY is set, and from the public channel page
 * when it is not. Each half keeps its last good value when a refresh fails, so a
 * blip on one source never blanks the other.
 */

export interface YoutubeVideo {
  id: string;
  title: string;
  /** YYYY-MM-DD, the upload day. */
  publishedAt: string;
}

export interface ChannelStats {
  subscribers: number | null;
  videoCount: number | null;
}

export interface YoutubeSnapshot extends ChannelStats {
  channelId: string;
  videos: YoutubeVideo[];
  /** ISO timestamp of the last refresh where at least one source answered. */
  syncedAt: string;
}

const FETCH_TIMEOUT_MS = 10_000;

const decode = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

export function parseFeed(xml: string): YoutubeVideo[] {
  const videos: YoutubeVideo[] = [];
  for (const [, entry] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const publishedAt = entry.match(/<published>(\d{4}-\d{2}-\d{2})/)?.[1];
    if (id && title && publishedAt) videos.push({ id, title: decode(title.trim()), publishedAt });
  }
  return videos;
}

/** "212" → 212, "1.2K" → 1200, "3,4 M" → 3400000. Null when it is not a count. */
export function parseCount(text: string): number | null {
  const m = text.trim().match(/^([\d.,]+)\s*([KMB])?$/i);
  if (!m) return null;
  const suffix = m[2]?.toUpperCase();
  // With a suffix the separator is a decimal point; without one it groups thousands.
  const n = suffix ? Number(m[1].replace(",", ".")) : Number(m[1].replace(/[.,]/g, ""));
  if (!Number.isFinite(n)) return null;
  const scale = suffix === "K" ? 1e3 : suffix === "M" ? 1e6 : suffix === "B" ? 1e9 : 1;
  return Math.round(n * scale);
}

/**
 * Reads the counts out of the channel about page, requested with `hl=en` so the
 * strings are "212 subscribers" and "52 videos" whatever the server locale.
 * Anchored on the JSON key: the page also ships i18n templates such as
 * `"case1":"1 video"`, which a bare match would take for the count.
 */
export function parseChannelPage(html: string): ChannelStats {
  const pick = (label: string) => {
    const m = html.match(
      new RegExp(`(?:"content"|CountText"):"([\\d.,]+\\s?[KMB]?) ${label}s?"`, "i")
    );
    return m ? parseCount(m[1]) : null;
  };
  return { subscribers: pick("subscriber"), videoCount: pick("video") };
}

async function get(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}`);
  return res;
}

async function fetchVideos(channelId: string): Promise<YoutubeVideo[]> {
  const res = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  const videos = parseFeed(await res.text());
  if (!videos.length) throw new Error("feed had no entries");
  return videos;
}

async function fetchStats(channelId: string): Promise<ChannelStats> {
  if (config.youtubeApiKey) {
    const url = new URL("https://www.googleapis.com/youtube/v3/channels");
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", channelId);
    url.searchParams.set("key", config.youtubeApiKey);
    const body = (await (await get(url.toString())).json()) as {
      items?: { statistics?: { subscriberCount?: string; videoCount?: string; hiddenSubscriberCount?: boolean } }[];
    };
    const s = body.items?.[0]?.statistics;
    if (!s) throw new Error("Data API returned no channel");
    return {
      subscribers: s.hiddenSubscriberCount ? null : Number(s.subscriberCount ?? NaN) || null,
      videoCount: Number(s.videoCount ?? NaN) || null,
    };
  }

  // No key: the public page. The consent cookie keeps an EU host off the
  // consent.youtube.com interstitial, which has no counts on it.
  const res = await get(`https://www.youtube.com/channel/${channelId}/about?hl=en&gl=US`, {
    headers: { "accept-language": "en-US,en", cookie: "SOCS=CAI" },
  });
  const stats = parseChannelPage(await res.text());
  if (stats.subscribers === null && stats.videoCount === null) {
    throw new Error("channel page had no counts");
  }
  return stats;
}

let snapshot: YoutubeSnapshot | null = null;

export function getYoutubeSnapshot(): YoutubeSnapshot | null {
  return snapshot;
}

type Log = { info: (obj: object, msg: string) => void; warn: (obj: object, msg: string) => void };

export async function syncYoutube(log: Log): Promise<YoutubeSnapshot | null> {
  const channelId = config.youtubeChannelId;
  const [videos, stats] = await Promise.allSettled([fetchVideos(channelId), fetchStats(channelId)]);

  if (videos.status === "rejected") log.warn({ err: String(videos.reason) }, "youtube feed refresh failed");
  if (stats.status === "rejected") log.warn({ err: String(stats.reason) }, "youtube stats refresh failed");
  if (videos.status === "rejected" && stats.status === "rejected") return snapshot;

  const prev = snapshot;
  const nextVideos = videos.status === "fulfilled" ? videos.value : (prev?.videos ?? []);
  const nextStats = stats.status === "fulfilled" ? stats.value : null;

  snapshot = {
    channelId,
    subscribers: nextStats?.subscribers ?? prev?.subscribers ?? null,
    videoCount: nextStats?.videoCount ?? prev?.videoCount ?? null,
    videos: nextVideos,
    syncedAt: new Date().toISOString(),
  };
  log.info(
    { subscribers: snapshot.subscribers, videoCount: snapshot.videoCount, latest: nextVideos[0]?.id },
    "youtube synced"
  );
  return snapshot;
}

/** Syncs once now, then every YOUTUBE_SYNC_MINUTES. 0 turns the sync off. */
export function startYoutubeSync(log: Log): NodeJS.Timeout | null {
  if (config.youtubeSyncMinutes <= 0) return null;
  void syncYoutube(log);
  const timer = setInterval(() => void syncYoutube(log), config.youtubeSyncMinutes * 60_000);
  timer.unref?.();
  return timer;
}
