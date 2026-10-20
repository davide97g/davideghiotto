/**
 * Who is behind a mailbox in the request log: the owner, a test, or a real
 * visitor. The admin view leads with this, because most of the log is the owner
 * poking at their own gate and the few real rows are the reason to read it.
 *
 * Every label carries the rule that produced it, so a wrong call is visible as
 * one — this is a reading aid, nothing is gated on it.
 */
import fs from "node:fs";
import { config } from "./config.js";
import { canonicalEmail } from "./emailPolicy.js";

export type Who = "you" | "test" | "real";

export interface Label {
  who: Who;
  /** The rule that decided, in a few words. */
  why: string;
}

export interface MailboxSignals {
  email: string;
  /** Any event came from something other than a browser (curl, a script). */
  scripted?: boolean | number | null;
  /** Client IPs the mailbox was seen on. */
  ips?: string[];
}

export interface OwnerContext {
  /** Canonical owner mailboxes. */
  emails: Set<string>;
  /** IPs an owner mailbox was seen on. */
  ips: Set<string>;
}

/** Not routable, or reserved for documentation — no visitor types these. */
const RESERVED_DOMAIN = /(^|\.)(example\.(com|net|org)|[^.]+\.(invalid|local|localhost|test|example))$/;

/** Names people type when the address doesn't matter. Matched per local-part token. */
const PLACEHOLDER_TOKEN =
  /^(test(s|er|ing|ozzo)?\d*|prova\d*|asdf\w*|qwert\w*|\w*random\w*|dummy|fake|probe|ratelimit|someone|nobody|nope|noreply|foo|bar|baz|pippo|pluto|paperino|topolino|aaa+|xxx+|abcd?)$/;

function localPart(email: string): string {
  const at = email.lastIndexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

function domainPart(email: string): string {
  const at = email.lastIndexOf("@");
  return at > 0 ? email.slice(at + 1) : "";
}

/** The placeholder the local part was built from, if it was. */
export function placeholderToken(email: string): string | null {
  const local = localPart(email.toLowerCase()).split("+")[0]!;
  for (const token of [local, ...local.split(/[._-]+/)]) {
    if (token && PLACEHOLDER_TOKEN.test(token)) return token;
  }
  return null;
}

export function classifyMailbox(mailbox: MailboxSignals, owner: OwnerContext): Label {
  const email = mailbox.email.toLowerCase();
  if (owner.emails.has(canonicalEmail(email))) return { who: "you", why: "your mailbox" };

  const sharedIp = mailbox.ips?.find((ip) => owner.ips.has(ip));
  if (sharedIp) return { who: "you", why: `same IP as your mailbox (${sharedIp})` };

  if (mailbox.scripted) return { who: "test", why: "sent by a script, not a browser" };
  if (RESERVED_DOMAIN.test(domainPart(email))) return { who: "test", why: "reserved domain" };

  const token = placeholderToken(email);
  if (token) return { who: "test", why: `placeholder name "${token}"` };

  return { who: "real", why: "" };
}

/** `a,b,c` from GROUP_CONCAT, as a list. */
export function splitIps(value: unknown): string[] {
  return typeof value === "string" && value ? value.split(",") : [];
}

let ownerEmails: Set<string> | undefined;

/** data/owner-emails.txt, canonicalized, read once. A missing file means no owner. */
export function loadOwnerEmails(filePath = config.ownerEmailsPath): Set<string> {
  if (ownerEmails && filePath === config.ownerEmailsPath) return ownerEmails;
  let raw = "";
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
  const emails = new Set(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map(canonicalEmail)
  );
  if (filePath === config.ownerEmailsPath) ownerEmails = emails;
  return emails;
}
