import { beforeAll, describe, expect, it } from "vitest";
import {
  canonicalDomain,
  canonicalEmail,
  isAllowedDomain,
  isDisposableDomain,
  isDisposableEmail,
  isDisposableMailHost,
  isValidEmailFormat,
  loadDisposableDomains,
  normalizeEmail,
  policyListSizes,
} from "./emailPolicy.js";

beforeAll(() => {
  loadDisposableDomains();
});

describe("lists", () => {
  it("ships a real blocklist, not a stub", () => {
    const { disposableDomains, disposableMxHosts, allowedDomains } = policyListSizes();
    expect(disposableDomains).toBeGreaterThan(5000);
    expect(disposableMxHosts).toBeGreaterThan(20);
    expect(allowedDomains).toBeGreaterThan(40);
  });

  it("never blocks the providers real people use", () => {
    for (const domain of [
      "gmail.com",
      "outlook.com",
      "hotmail.it",
      "yahoo.com",
      "icloud.com",
      "proton.me",
      "protonmail.com",
      "fastmail.com",
      "libero.it",
      "virgilio.it",
      "aruba.it",
      "davideghiotto.it",
      "bitrock.it",
    ]) {
      expect(isDisposableDomain(domain), domain).toBe(false);
    }
  });

  it("blocks the well-known throwaway services", () => {
    for (const domain of [
      "mailinator.com",
      "yopmail.com",
      "guerrillamail.com",
      "temp-mail.org",
      "1secmail.com",
      "trashmail.com",
      "sharklasers.com",
      "getnada.com",
    ]) {
      expect(isDisposableDomain(domain), domain).toBe(true);
    }
  });

  it("blocks subdomains of a blocked domain", () => {
    expect(isDisposableEmail("someone@team.mailinator.com")).toBe(true);
  });

  it("keeps masked relays usable — a real person is behind them", () => {
    for (const domain of ["privaterelay.appleid.com", "mozmail.com", "duck.com"]) {
      expect(isAllowedDomain(domain), domain).toBe(true);
      expect(isDisposableDomain(domain), domain).toBe(false);
    }
  });
});

describe("canonicalDomain", () => {
  it("lowercases, drops the root dot and converts IDN to punycode", () => {
    expect(canonicalDomain("GMAIL.com")).toBe("gmail.com");
    expect(canonicalDomain("gmail.com.")).toBe("gmail.com");
    expect(canonicalDomain("münchen.de")).toBe("xn--mnchen-3ya.de");
  });

  it("returns empty for unparseable hosts", () => {
    expect(canonicalDomain("")).toBe("");
    expect(canonicalDomain("  ")).toBe("");
  });
});

describe("canonicalEmail", () => {
  it("strips sub-addressing everywhere", () => {
    expect(canonicalEmail("me+ral@fastmail.com")).toBe("me@fastmail.com");
    expect(canonicalEmail("me+a+b@outlook.com")).toBe("me@outlook.com");
  });

  it("strips dots only where the provider ignores them", () => {
    expect(canonicalEmail("d.a.v.i.d.e+x@gmail.com")).toBe("davide@gmail.com");
    expect(canonicalEmail("davide@googlemail.com")).toBe("davide@googlemail.com");
    // Dots are significant outside Google — must not be touched.
    expect(canonicalEmail("first.last@bitrock.it")).toBe("first.last@bitrock.it");
  });

  it("collapses the aliases one mailbox can spawn to a single identity", () => {
    const forms = [
      "Davide.Ghiotto@gmail.com",
      "davideghiotto+ral@gmail.com",
      "d.a.videghiotto+again@GMAIL.COM",
    ].map(canonicalEmail);
    expect(new Set(forms).size).toBe(1);
  });

  it("leaves a plain address alone", () => {
    expect(canonicalEmail(" Someone@Example.ORG ")).toBe("someone@example.org");
  });
});

describe("normalizeEmail", () => {
  it("lowercases and canonicalizes the domain but keeps the local part", () => {
    expect(normalizeEmail(" Me+Tag@GMAIL.com ")).toBe("me+tag@gmail.com");
  });
});

describe("isValidEmailFormat", () => {
  it("accepts ordinary addresses", () => {
    for (const email of [
      "davide@bitrock.it",
      "first.last+tag@sub.example.co.uk",
      "hr@ph.d-company.com",
    ]) {
      expect(isValidEmailFormat(email), email).toBe(true);
    }
  });

  it("rejects shapes that can never receive mail", () => {
    for (const email of [
      "no-at-sign",
      "a@b",
      "x@example.com", // local part too short
      "someone@example.invalid",
      "someone@thing.local",
      "someone@thing.test",
      "someone@example..com",
      "someone@-example.com",
      "someone@example.1",
      `${"a".repeat(65)}@example.com`,
      `${"a".repeat(250)}@example.com`,
    ]) {
      expect(isValidEmailFormat(email), email).toBe(false);
    }
  });

  it("rejects placeholder local parts", () => {
    expect(isValidEmailFormat("test@gmail.com")).toBe(false);
    expect(isValidEmailFormat("qwerty@gmail.com")).toBe(false);
  });
});

describe("isDisposableMailHost", () => {
  it("catches a fresh unlisted domain by its throwaway MX backend", () => {
    // The domain itself is unknown to every list; the MX gives it away.
    expect(isDisposableDomain("brand-new-domain-nobody-listed-yet.com")).toBe(false);
    expect(isDisposableMailHost("mail.yopmail.com")).toBe(true);
    expect(isDisposableMailHost("mx1.1secmail.com")).toBe(true);
    expect(isDisposableMailHost("mx.temp-mail.org")).toBe(true);
  });

  it("leaves real mail infrastructure alone", () => {
    for (const host of [
      "aspmx.l.google.com",
      "gmail-smtp-in.l.google.com",
      "bitrock-it.mail.protection.outlook.com",
      "mx1.improvmx.com",
      "mx.migadu.com",
      "in1-smtp.messagingengine.com",
    ]) {
      expect(isDisposableMailHost(host), host).toBe(false);
    }
  });

  it("lets the allowlist win over the blocklist", () => {
    expect(isAllowedDomain("mx1.improvmx.com")).toBe(true);
  });
});
