/**
 * Regenerates the static YouTube copy in src/data/youtube.ts: the `videos` array
 * from the channel RSS feed, and `subscribers` / `videoCount` from the public
 * channel about page (they are not in the feed). Run with `npm run fetch:youtube`.
 *
 * This is the fallback the bundle ships. The live numbers come from the backend
 * (GET /v1/youtube in services/ral-gate), which runs the same parse every 15 min.
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

// Counts: anchored on the JSON key, since the page also ships i18n templates
// such as "case1":"1 video" that a bare match would take for the count.
const page = await fetch(`https://www.youtube.com/channel/${channelId}/about?hl=en&gl=US`, {
  headers: { "accept-language": "en-US,en", cookie: "SOCS=CAI" },
}).then((r) => (r.ok ? r.text() : ""));
const count = (label) => {
  const m = page.match(new RegExp(`(?:"content"|CountText"):"([\\d.,]+) ${label}s?"`));
  return m ? Number(m[1].replace(/[.,]/g, "")) : null;
};
const subscribers = count("subscriber");
const videoCount = count("video");

const block = `export const videos: Video[] = ${JSON.stringify(videos, null, 2)};\n`;
let next = source.replace(/export const videos: Video\[\] = \[[\s\S]*?\n\];\n/, block);
if (next === source) throw new Error("Could not locate the videos array to replace");

// Abbreviated counts ("1.2K") are left alone rather than guessed at.
if (subscribers !== null) next = next.replace(/subscribers: \d+,/, `subscribers: ${subscribers},`);
if (videoCount !== null) next = next.replace(/videoCount: \d+,/, `videoCount: ${videoCount},`);

await writeFile(TARGET, next);
console.log(
  `Wrote ${videos.length} videos to src/data/youtube.ts` +
    ` (subscribers ${subscribers ?? "unchanged"}, videos ${videoCount ?? "unchanged"})`
);
