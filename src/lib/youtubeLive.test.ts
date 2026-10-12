import { describe, expect, it } from "vitest";
import { mergeSnapshot, type ChannelData } from "./youtubeLive";

const fallback: ChannelData = {
  subscribers: 100,
  videoCount: 10,
  videos: [{ id: "static0001", title: "static", publishedAt: "2026-01-01" }],
};

describe("mergeSnapshot", () => {
  it("takes every field from a well-formed response", () => {
    const body = {
      subscribers: 212,
      videoCount: 52,
      videos: [{ id: "ODXsaA_UhxA", title: "live", publishedAt: "2026-10-12", extra: 1 }],
      syncedAt: "2026-10-12T17:00:00Z",
    };
    expect(mergeSnapshot(body, fallback)).toEqual({
      subscribers: 212,
      videoCount: 52,
      videos: [{ id: "ODXsaA_UhxA", title: "live", publishedAt: "2026-10-12" }],
    });
  });

  it("keeps the static count the backend could not read", () => {
    const merged = mergeSnapshot({ subscribers: null, videoCount: 52, videos: [] }, fallback);
    expect(merged.subscribers).toBe(100);
    expect(merged.videoCount).toBe(52);
    expect(merged.videos).toBe(fallback.videos);
  });

  it("drops malformed videos and falls back when none survive", () => {
    const body = { videos: [{ id: "x" }, { id: "../evil", title: "t", publishedAt: "2026-01-01" }] };
    expect(mergeSnapshot(body, fallback).videos).toBe(fallback.videos);
  });

  it("survives a body that is not an object", () => {
    expect(mergeSnapshot("nope", fallback)).toEqual(fallback);
    expect(mergeSnapshot(null, fallback)).toEqual(fallback);
  });
});
