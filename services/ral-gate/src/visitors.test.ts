import { describe, expect, it } from "vitest";
import { classifyMailbox, loadOwnerEmails, placeholderToken } from "./visitors.js";

const owner = {
  emails: new Set(["ghiottodavidenko@gmail.com"]),
  ips: new Set(["92.246.115.65"]),
};

const who = (email: string, extra: { scripted?: boolean; ips?: string[] } = {}) =>
  classifyMailbox({ email, ...extra }, owner).who;

describe("classifyMailbox", () => {
  it("knows the owner by canonical address, dots and tags included", () => {
    expect(who("ghiotto.davidenko@gmail.com")).toBe("you");
    expect(who("ghiotto.davidenko+ral@gmail.com")).toBe("you");
  });

  it("treats any address asked for from an owner IP as the owner", () => {
    expect(classifyMailbox({ email: "mario@gmail.com", ips: ["92.246.115.65"] }, owner)).toEqual({
      who: "you",
      why: "same IP as your mailbox (92.246.115.65)",
    });
  });

  it("marks anything a script sent as a test", () => {
    expect(who("someone@guerrillamail.com", { scripted: true })).toBe("test");
  });

  it("marks reserved domains as tests", () => {
    expect(who("ratelimit-probe@no-mx-here-xyz123.invalid")).toBe("test");
    expect(who("someone@thing.local")).toBe("test");
    expect(who("anna@example.com")).toBe("test");
  });

  it("marks the placeholder names the log is full of", () => {
    for (const email of [
      "testozzo@testmail.com",
      "test@gmail.com",
      "pippo@gmail.com",
      "nope@mailinator.com",
      "asdfgh@outlook.com",
      "myrandomemail@gmail.com",
    ]) {
      expect(who(email), email).toBe("test");
    }
  });

  it("leaves real visitors real", () => {
    for (const email of [
      "g.greggio@reply.it",
      "joiberberi@icloud.com",
      "yahipox240@deertees.com",
      "anna.testa@gmail.com",
      "contestabile@libero.it",
      "hr@bitrock.it",
    ]) {
      expect(who(email), email).toBe("real");
    }
  });
});

describe("placeholderToken", () => {
  it("says which token gave it away", () => {
    expect(placeholderToken("mario.test@gmail.com")).toBe("test");
    expect(placeholderToken("pippo+ral@gmail.com")).toBe("pippo");
    expect(placeholderToken("mario.rossi@gmail.com")).toBeNull();
  });
});

describe("loadOwnerEmails", () => {
  it("ships the owner list, canonicalized", () => {
    expect(loadOwnerEmails().has("ghiottodavidenko@gmail.com")).toBe(true);
  });
});
