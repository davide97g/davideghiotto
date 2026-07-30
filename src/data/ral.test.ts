import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearRalAccess,
  getRalAccess,
  isValidEmail,
  requestRalAccess,
} from "@/lib/ralAccess";
import { currentRal, ralBumps, ralCompanies } from "@/data/ral";

describe("ral data", () => {
  it("covers every CV employer in order", () => {
    expect(ralCompanies.map((c) => c.id)).toEqual([
      "reply",
      "namirial",
      "infodati",
      "bitrock",
    ]);
  });

  it("keeps bumps chronological and ends on the current figure", () => {
    const dates = ralBumps.map((b) => b.date);
    expect([...dates].sort()).toEqual(dates);
    expect(currentRal.amount).toBe(44_000);
    expect(currentRal.companyId).toBe("bitrock");
  });

  it("assigns each bump to a known company", () => {
    const ids = new Set(ralCompanies.map((c) => c.id));
    for (const bump of ralBumps) {
      expect(ids.has(bump.companyId)).toBe(true);
    }
  });

  it("ships an official logo for every employer", () => {
    for (const company of ralCompanies) {
      expect(company.logo.startsWith("/logos/")).toBe(true);
      expect(["round-white", "round", "raw"]).toContain(company.logoTreatment);
    }
  });
});

describe("ral access gate", () => {
  beforeEach(() => {
    localStorage.clear();
    clearRalAccess();
    vi.useRealTimers();
  });

  it("rejects placeholder emails", () => {
    expect(isValidEmail("test@company.com")).toBe(false);
    expect(isValidEmail("a@b.c")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("accepts a plausible work email and persists the unlock", async () => {
    const result = await requestRalAccess("recruiter@acme.io");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.access.email).toBe("recruiter@acme.io");
    expect(getRalAccess()?.email).toBe("recruiter@acme.io");
  });
});
