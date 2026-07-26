/**
 * Regenerates the `videos` array in src/data/youtube.ts from the channel RSS feed.
 * Run with `npm run fetch:youtube`. Channel meta (subscribers, videoCount) is not
 * in the feed and stays hand-maintained.
 */
import { readFile, writeFile } from "node:fs/promises";

const TARGET = new URL("../src/data/youtube.ts", import.meta.url);

const source = await readFile(TARGET, "utf8");
const channelId = source.match(/id:\s*"(UC[\w-]+)"/)?.[1];
if (!channelId) throw new Error("Could not find the channel id in src/data/youtube.ts");

const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
const xml = await res.text();

const decode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => ({
  id: entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1],
  title: decode(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? ""),
  publishedAt: entry.match(/<published>(\d{4}-\d{2}-\d{2})/)?.[1],
}));

if (!videos.length) throw new Error("No entries found in the feed");

const block = `export const videos: Video[] = ${JSON.stringify(videos, null, 2)};\n`;
const next = source.replace(/export const videos: Video\[\] = \[[\s\S]*?\n\];\n/, block);
if (next === source) throw new Error("Could not locate the videos array to replace");

await writeFile(TARGET, next);
console.log(`Wrote ${videos.length} videos to src/data/youtube.ts`);
