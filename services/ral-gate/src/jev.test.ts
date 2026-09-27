import { describe, expect, it } from "vitest";
import { decide, describeVerdict } from "./jev.js";

const opts = { threshold: 0.75, allowlisted: false };

describe("decide", () => {
  it("lets a real mailbox through", () => {
    expect(decide({ throwawayService: 0.01, fakeMailbox: 0.08 }, opts)).toBeNull();
  });

  it("blocks a throwaway service as disposable", () => {
    expect(decide({ throwawayService: 0.98, fakeMailbox: 0.1 }, opts)).toBe("disposable");
  });

  it("blocks an invented mailbox on a real provider as fake", () => {
    expect(decide({ throwawayService: 0.02, fakeMailbox: 0.93 }, opts)).toBe("fake");
  });

  it("blocks at the threshold, not only above it", () => {
    expect(decide({ throwawayService: 0.75, fakeMailbox: 0 }, opts)).toBe("disposable");
  });

  it("never blocks an allowlisted domain on the service score", () => {
    const scores = { throwawayService: 0.99, fakeMailbox: 0.1 };
    expect(decide(scores, { ...opts, allowlisted: true })).toBeNull();
  });

  it("still blocks an invented mailbox on an allowlisted domain", () => {
    const scores = { throwawayService: 0.02, fakeMailbox: 0.93 };
    expect(decide(scores, { ...opts, allowlisted: true })).toBe("fake");
  });
});

describe("describeVerdict", () => {
  it("stores nothing when the check was skipped", () => {
    expect(describeVerdict({ kind: "skipped" })).toBeNull();
  });

  it("stores the error so a fail-open request is visible in the log", () => {
    expect(describeVerdict({ kind: "error", reason: "timeout" })).toBe('{"error":"timeout"}');
  });

  it("stores both scores", () => {
    const verdict = {
      kind: "scored" as const,
      scores: { throwawayService: 0.54, fakeMailbox: 0.81 },
      block: "fake" as const,
    };
    expect(describeVerdict(verdict)).toBe('{"service":0.54,"fake":0.81}');
  });
});
