import { describe, expect, it } from "vitest";
import { ralBumps, ralCompanies } from "@/data/ral";
import { isValidEmail } from "@/lib/ralAccess";

describe("ral data", () => {
  it("covers every CV employer in order", () => {
    expect(ralCompanies.map((c) => c.id)).toEqual([
      "reply",
      "namirial",
      "infodati",
      "bitrock",
    ]);
  });

  it("keeps bumps chronological without shipping amounts in the public bundle", () => {
    const dates = ralBumps.map((b) => b.date);
    expect([...dates].sort()).toEqual(dates);
    for (const bump of ralBumps) {
      expect(bump.amount).toBeUndefined();
    }
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

describe("ral access helpers", () => {
  it("rejects obviously broken emails", () => {
    expect(isValidEmail("a@b.c")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("accepts a plausible work email format", () => {
    expect(isValidEmail("recruiter@acme.io")).toBe(true);
  });
});
