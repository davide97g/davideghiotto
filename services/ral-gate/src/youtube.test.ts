import { describe, expect, it } from "vitest";
import { parseChannelPage, parseCount, parseFeed } from "./youtube.js";

describe("parseFeed", () => {
  it("reads id, decoded title and upload day from each entry", () => {
    const xml = `<feed><title>channel</title>
      <entry><yt:videoId>abc123</yt:videoId><title>Tom &amp; Jerry &quot;live&quot;</title>
        <published>2026-10-12T08:00:00+00:00</published></entry>
      <entry><yt:videoId>def456</yt:videoId><title> second </title>
        <published>2026-10-10T08:00:00+00:00</published></entry>
    </feed>`;
    expect(parseFeed(xml)).toEqual([
      { id: "abc123", title: 'Tom & Jerry "live"', publishedAt: "2026-10-12" },
      { id: "def456", title: "second", publishedAt: "2026-10-10" },
    ]);
  });

  it("skips an entry missing a field instead of serving a broken card", () => {
    const xml = `<entry><yt:videoId>abc</yt:videoId><title>no date</title></entry>`;
    expect(parseFeed(xml)).toEqual([]);
  });
});

describe("parseCount", () => {
  it.each([
    ["212", 212],
    ["1,234", 1234],
    ["1.2K", 1200],
    ["3,4 M", 3_400_000],
    ["", null],
    ["no", null],
  ])("%s → %s", (input, expected) => {
    expect(parseCount(input)).toBe(expected);
  });
});

describe("parseChannelPage", () => {
  it("finds both counts in the page JSON", () => {
    const html = `{"metadataParts":[{"text":{"content":"212 subscribers"}},{"text":{"content":"52 videos"}}]}`;
    expect(parseChannelPage(html)).toEqual({ subscribers: 212, videoCount: 52 });
  });

  it("handles the singular and abbreviated forms", () => {
    const html = `"subscriberCountText":"1.5K subscribers","videoCountText":"1 video"`;
    expect(parseChannelPage(html)).toEqual({ subscribers: 1500, videoCount: 1 });
  });

  it("ignores the i18n templates that also say \"1 video\"", () => {
    const html = `"VIDEO_COUNT":{"case1":"1 video","other":"# videos"} {"content":"52 videos"}`;
    expect(parseChannelPage(html).videoCount).toBe(52);
  });

  it("returns nulls when the page has no counts", () => {
    expect(parseChannelPage("<html>consent</html>")).toEqual({ subscribers: null, videoCount: null });
  });
});
