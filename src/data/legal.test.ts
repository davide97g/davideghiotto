import { describe, expect, it } from "vitest";
import { hasLegalBody, legalDocs, loadLegalBody, type LegalDocId } from "./legal";

const LANGS = ["en", "it"] as const;
const DOCS: LegalDocId[] = ["privacy", "cookies"];

describe("legal documents", () => {
  it("ships privacy and cookies metadata", () => {
    expect(Object.keys(legalDocs).sort()).toEqual(["cookies", "privacy"]);
  });

  it("has a non-empty body for every doc and language", async () => {
    for (const id of DOCS) {
      for (const lang of LANGS) {
        expect(hasLegalBody(id, lang), `${id}.${lang}`).toBe(true);
        const body = await loadLegalBody(id, lang);
        expect(body.trim().length, `${id}.${lang}`).toBeGreaterThan(400);
        expect(body).not.toMatch(/\[TK/);
      }
    }
  });

  it("mentions GA4 and the measurement id in the cookie policy", async () => {
    const en = await loadLegalBody("cookies", "en");
    const it = await loadLegalBody("cookies", "it");
    expect(en).toContain("G-BTP8Z49CM7");
    expect(it).toContain("G-BTP8Z49CM7");
    expect(en.toLowerCase()).toContain("google analytics");
    expect(it.toLowerCase()).toContain("google analytics");
  });

  it("privacy policy points at the Garante and RAL gate", async () => {
    const it = await loadLegalBody("privacy", "it");
    expect(it).toContain("Garante");
    expect(it.toLowerCase()).toContain("ral");
    expect(it).toContain("dghiotto.careers@gmail.com");
  });
});
