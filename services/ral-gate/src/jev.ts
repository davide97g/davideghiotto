import { config } from "./config.js";

/**
 * The fourth layer: a semantic read of the address, by TypeSafe's Jev.
 *
 * The lists and the MX check only know what they have seen before. Jev catches
 * what they cannot: a throwaway service nobody has listed yet, and a real
 * provider with an invented mailbox in front of it (`asdfgh@gmail.com`). It runs
 * last, after every cheap check has passed, so a list hit never costs a call.
 *
 * It fails open. A Jev outage leaves the other three layers standing and the OTP
 * still proves the mailbox exists — locking real contacts out because a
 * classifier was slow would be the worse failure. The error is logged instead.
 */

const ENDPOINT = "https://api.typesafe.ai/v1/systemone";

const QUESTIONS = {
  throwaway_service: {
    type: "noul",
    instructions:
      "Is `domain` a temporary, disposable or throwaway email service — one that hands out inboxes without sign-up so people can dodge giving a real address? `mx_hosts` lists the mail servers the domain resolves to.",
    criteria: {
      true: "A temp-mail, burner or anonymous throwaway inbox service (mailinator-style), including lookalike or newly registered domains that clearly exist to serve that purpose.",
      false:
        "A real mail provider or an organisation's own domain: consumer webmail (gmail, outlook, proton, libero), ISPs, companies, universities, agencies, personal domains, and privacy relays that forward to a verified inbox (Apple Hide My Email, Firefox Relay, DuckDuckGo).",
    },
  },
  fake_mailbox: {
    type: "noul",
    instructions:
      "Does `local_part` look invented to get past a form rather than a mailbox someone actually reads — a placeholder, a test value, a keyboard mash, random characters or a joke?",
    criteria: {
      true: "Placeholder or junk: test, testing, asdf, qwerty, fake, nope, noreply, example, random strings like xk3j9q2z, obvious joke names.",
      false:
        "Something a person or team plausibly uses: names, initials, surnames with numbers, nicknames, role inboxes like hr, jobs, careers, recruiting, talent, info.",
    },
  },
} as const;

export interface JevScores {
  throwawayService: number;
  fakeMailbox: number;
}

export type JevVerdict =
  | { kind: "skipped" }
  | { kind: "error"; reason: string }
  | { kind: "scored"; scores: JevScores; block: "disposable" | "fake" | null };

/**
 * Policy, kept apart from the call so it is testable without the network.
 * An allowlisted domain is a real provider by decision, so only the mailbox
 * question can block it — the same precedence the domain lists follow.
 */
export function decide(
  scores: JevScores,
  opts: { threshold: number; allowlisted: boolean }
): "disposable" | "fake" | null {
  if (!opts.allowlisted && scores.throwawayService >= opts.threshold) return "disposable";
  if (scores.fakeMailbox >= opts.threshold) return "fake";
  return null;
}

/** The compact form stored in `request_log.jev`. */
export function describeVerdict(verdict: JevVerdict): string | null {
  switch (verdict.kind) {
    case "skipped":
      return null;
    case "error":
      return JSON.stringify({ error: verdict.reason });
    case "scored":
      return JSON.stringify({
        service: verdict.scores.throwawayService,
        fake: verdict.scores.fakeMailbox,
      });
  }
}

export async function judgeEmail(
  email: string,
  opts: { mxHosts: string[]; allowlisted: boolean }
): Promise<JevVerdict> {
  if (!config.jevApiKey) return { kind: "skipped" };

  const at = email.lastIndexOf("@");
  const state = {
    email,
    local_part: email.slice(0, at),
    domain: email.slice(at + 1),
    mx_hosts: opts.mxHosts,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.jevApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: config.jevModel, state, questions: QUESTIONS }),
      signal: AbortSignal.timeout(config.jevTimeoutMs),
    });
    if (!res.ok) return { kind: "error", reason: `http_${res.status}` };

    const body = (await res.json()) as {
      answers?: Record<string, { noul?: unknown }>;
    };
    const service = body.answers?.throwaway_service?.noul;
    const fake = body.answers?.fake_mailbox?.noul;
    if (typeof service !== "number" || typeof fake !== "number") {
      return { kind: "error", reason: "bad_response" };
    }

    const scores = { throwawayService: service, fakeMailbox: fake };
    return {
      kind: "scored",
      scores,
      block: decide(scores, { threshold: config.jevThreshold, allowlisted: opts.allowlisted }),
    };
  } catch (err) {
    const reason =
      err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")
        ? "timeout"
        : "network";
    return { kind: "error", reason };
  }
}
