import { timingSafeEqual } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { config } from "./config.js";
import { getRalPayload } from "./data.js";
import {
  bumpOtpAttempts,
  clearOtp,
  getOtp,
  getValidUnlock,
  listEmailActivity,
  listRequests,
  logRequestDetails,
  recentTimestamps,
  recordUnlock,
  requestTotals,
  touchUnlock,
  upsertOtp,
  type RequestLogEntry,
} from "./db.js";
import { sendOtpEmail } from "./email.js";
import {
  canonicalEmail,
  checkMailDomain,
  isDisposableEmail,
  isValidEmailFormat,
  normalizeEmail,
} from "./emailPolicy.js";
import { generateOtp, hashOtp, signSession, verifySession } from "./otp.js";

const emailBody = z.object({
  email: z.string().min(3).max(254),
});

const verifyBody = z.object({
  email: z.string().min(3).max(254),
  code: z.string().min(4).max(12),
});

function header(req: FastifyRequest, name: string): string | null {
  const value = req.headers[name];
  if (Array.isArray(value)) return value[0] ?? null;
  return typeof value === "string" && value.length ? value : null;
}

/**
 * The visitor, not the proxy in front of them.
 *
 * Behind the Cloudflare proxy, Traefik appends the Cloudflare edge to
 * X-Forwarded-For, so its first hop is an edge address shared by everyone in
 * that datacentre — keying the per-IP limit on it would put unrelated visitors
 * in one 10/hour budget. CF-Connecting-IP is the real client and is set by
 * Cloudflare itself, so it wins when present.
 */
function clientIp(req: FastifyRequest): string {
  const cloudflare = header(req, "cf-connecting-ip") ?? header(req, "true-client-ip");
  if (cloudflare) return cloudflare.trim();
  const forwarded = header(req, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.ip;
}

/** Everything the transport tells us about a caller, captured once per request. */
interface CallerContext {
  ip: string;
  forwardedFor: string | null;
  userAgent: string | null;
  referer: string | null;
  origin: string | null;
  acceptLanguage: string | null;
  country: string | null;
}

function callerContext(req: FastifyRequest): CallerContext {
  return {
    ip: clientIp(req),
    forwardedFor: header(req, "x-forwarded-for"),
    userAgent: header(req, "user-agent"),
    referer: header(req, "referer") ?? header(req, "referrer"),
    origin: header(req, "origin"),
    acceptLanguage: header(req, "accept-language"),
    // Set by Cloudflare when the hostname is proxied; absent on a direct hit.
    country: header(req, "cf-ipcountry"),
  };
}

/** One audit row. Every exit path calls this, so nothing is silently dropped. */
function track(
  caller: CallerContext,
  entry: Omit<RequestLogEntry, keyof CallerContext>
) {
  logRequestDetails({
    ...entry,
    ip: caller.ip,
    forwardedFor: caller.forwardedFor,
    userAgent: caller.userAgent,
    referer: caller.referer,
    origin: caller.origin,
    acceptLanguage: caller.acceptLanguage,
    country: caller.country,
  });
}

function domainOf(email: string): string | null {
  const at = email.lastIndexOf("@");
  return at > 0 ? email.slice(at + 1) : null;
}

function bearer(req: FastifyRequest): string | null {
  const value = header(req, "authorization");
  if (!value?.startsWith("Bearer ")) return null;
  return value.slice(7).trim() || null;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

const RATE_WINDOW_HOURS = 1;

/** Hits allowed per rolling window, per key. */
const LIMITS = {
  requestPerEmail: 3,
  requestPerIp: 10,
  verifyPerIp: 30,
} as const;

/**
 * Seconds until one slot frees up, given the in-window hit timestamps (oldest
 * first). The hit that matters is the one at `length - limit`: once it ages out
 * of the window there is room for a new attempt.
 *
 * Rate-limited attempts are logged under a separate kind so they don't count
 * toward the limit — otherwise someone re-clicking the button would keep pushing
 * their own retry time further away, and the number we quote would be a lie.
 */
function retryAfterSeconds(hits: string[], limit: number): number {
  const freeing = hits[hits.length - limit];
  if (!freeing) return RATE_WINDOW_HOURS * 3600;
  const ms =
    new Date(freeing).getTime() + RATE_WINDOW_HOURS * 3600_000 - Date.now();
  return Math.max(1, Math.ceil(ms / 1000));
}

function rateLimited(reply: FastifyReply, hits: string[], limit: number) {
  const retryAfter = retryAfterSeconds(hits, limit);
  return reply
    .code(429)
    .header("retry-after", String(retryAfter))
    .send({
      ok: false,
      error: "rate_limit",
      retryAfterSeconds: retryAfter,
      // Rounded up, so the client never tells anyone to retry too early.
      retryAfterMinutes: Math.max(1, Math.ceil(retryAfter / 60)),
    });
}

function accessPayload(unlock: {
  email: string;
  unlocked_at: string;
  expires_at: string;
}) {
  return {
    email: unlock.email,
    unlockedAt: unlock.unlocked_at,
    expiresAt: unlock.expires_at,
  };
}

/**
 * Constant-time token comparison for the admin view. `?token=` is accepted
 * alongside the header purely so the HTML table is openable in a browser — it
 * lands in the proxy access log, so prefer the header for anything scripted.
 */
function adminAuthorized(req: FastifyRequest): boolean {
  if (!config.adminToken) return false;
  const query = req.query as Record<string, string | undefined>;
  const token = bearer(req) ?? header(req, "x-admin-token") ?? query.token;
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(config.adminToken);
  return a.length === b.length && timingSafeEqual(a, b);
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function adminHtml(
  totals: ReturnType<typeof requestTotals>,
  emails: ReturnType<typeof listEmailActivity>,
  recent: ReturnType<typeof listRequests>
): string {
  const table = (caption: string, rows: Record<string, unknown>[]) => {
    if (!rows.length) return `<h2>${caption}</h2><p class="empty">nothing yet</p>`;
    const cols = Object.keys(rows[0]!);
    return `<h2>${caption}</h2><div class="scroll"><table>
      <thead><tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
      <tbody>${rows
        .map(
          (row) =>
            `<tr>${cols.map((c) => `<td>${escapeHtml(row[c])}</td>`).join("")}</tr>`
        )
        .join("")}</tbody>
    </table></div>`;
  };

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ral-gate — request log</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; padding:32px; background:#08090A; color:#F4F2F0;
         font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace; }
  h1 { font-size:15px; letter-spacing:.18em; text-transform:uppercase; color:#8CFF2E; margin:0 0 4px; }
  h2 { font-size:11px; letter-spacing:.18em; text-transform:uppercase;
       color:#9a9590; margin:32px 0 8px; }
  p.meta { color:#9a9590; margin:0 0 8px; }
  p.empty { color:#9a9590; }
  .scroll { overflow-x:auto; border:1px solid #23262a; }
  table { border-collapse:collapse; width:100%; }
  th, td { padding:6px 10px; text-align:left; border-bottom:1px solid #191c20;
           white-space:nowrap; max-width:340px; overflow:hidden; text-overflow:ellipsis; }
  th { color:#8CFF2E; font-weight:600; font-size:11px; letter-spacing:.1em;
       text-transform:uppercase; background:#0d0f11; position:sticky; top:0; }
  tr:hover td { background:#0d0f11; }
</style></head><body>
<h1>ral-gate — request log</h1>
<p class="meta">${escapeHtml(JSON.stringify(totals.totals))}</p>
${table("by kind / outcome", totals.byOutcome as Record<string, unknown>[])}
${table("mailboxes", emails as Record<string, unknown>[])}
${table("recent events", recent as unknown as Record<string, unknown>[])}
</body></html>`;
}

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    ok: true,
    mail: Boolean(config.resendApiKey),
    env: config.nodeEnv,
    sessionTtlSeconds: config.sessionTtlSeconds,
  }));

  app.post("/v1/ral/request", async (req, reply) => {
    const caller = callerContext(req);
    const parsed = emailBody.safeParse(req.body);
    if (!parsed.success) {
      track(caller, { kind: "request", outcome: "malformed_body" });
      return reply.code(400).send({ ok: false, error: "invalid" });
    }

    // Two forms: `email` is where mail goes, `identity` is who the caller *is*.
    // Sub-addressing (`me+ral@gmail.com`) would otherwise buy unlimited codes.
    const email = normalizeEmail(parsed.data.email);
    const identity = canonicalEmail(email);
    const base = {
      email,
      canonicalEmail: identity,
      emailDomain: domainOf(identity),
    };
    const since = hoursAgo(RATE_WINDOW_HOURS);

    const emailHits = recentTimestamps("request", "canonical_email", identity, since);
    if (emailHits.length >= LIMITS.requestPerEmail) {
      track(caller, { ...base, kind: "request_blocked", outcome: "rate_limit_email" });
      return rateLimited(reply, emailHits, LIMITS.requestPerEmail);
    }
    const ipHits = recentTimestamps("request", "ip", caller.ip, since);
    if (ipHits.length >= LIMITS.requestPerIp) {
      track(caller, { ...base, kind: "request_blocked", outcome: "rate_limit_ip" });
      return rateLimited(reply, ipHits, LIMITS.requestPerIp);
    }

    if (!isValidEmailFormat(email)) {
      track(caller, { ...base, kind: "request", outcome: "invalid_format" });
      return reply.code(400).send({ ok: false, error: "invalid" });
    }
    if (isDisposableEmail(email)) {
      track(caller, { ...base, kind: "request", outcome: "disposable_domain" });
      return reply.code(400).send({ ok: false, error: "disposable" });
    }

    const mail = await checkMailDomain(domainOf(email) ?? "");
    const mxHosts = mail.hosts.join(",") || null;

    if (!mail.deliverable) {
      track(caller, { ...base, kind: "request", outcome: "no_mail_records", mxHosts });
      return reply.code(400).send({ ok: false, error: "invalid" });
    }
    // A fresh throwaway domain nobody has blocklisted yet still points its MX at
    // a known throwaway backend. This is the layer that catches those.
    if (mail.disposableMx) {
      track(caller, { ...base, kind: "request", outcome: "disposable_mx", mxHosts });
      return reply.code(400).send({ ok: false, error: "disposable" });
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + config.otpTtlSeconds * 1000).toISOString();
    upsertOtp(identity, hashOtp(code, identity), expiresAt);

    try {
      await sendOtpEmail(email, code);
    } catch (err) {
      req.log.error(err);
      track(caller, { ...base, kind: "request", outcome: "mail_error", mxHosts });
      return reply.code(503).send({ ok: false, error: "mail" });
    }

    track(caller, { ...base, kind: "request", outcome: "sent", mxHosts });

    // Always opaque success — don't leak whether the mailbox exists beyond MX.
    return {
      ok: true,
      expiresIn: config.otpTtlSeconds,
      // Dev-only hint so local UI can show the code without opening logs.
      ...(config.isDev && !config.resendApiKey ? { devCode: code } : {}),
    };
  });

  app.post("/v1/ral/verify", async (req, reply) => {
    const caller = callerContext(req);
    const parsed = verifyBody.safeParse(req.body);
    if (!parsed.success) {
      track(caller, { kind: "verify", outcome: "malformed_body" });
      return reply.code(400).send({ ok: false, error: "invalid" });
    }

    const email = normalizeEmail(parsed.data.email);
    const identity = canonicalEmail(email);
    const code = parsed.data.code.trim();
    const base = {
      email,
      canonicalEmail: identity,
      emailDomain: domainOf(identity),
    };

    const verifyHits = recentTimestamps(
      "verify",
      "ip",
      caller.ip,
      hoursAgo(RATE_WINDOW_HOURS)
    );
    if (verifyHits.length >= LIMITS.verifyPerIp) {
      track(caller, { ...base, kind: "verify_blocked", outcome: "rate_limit_ip" });
      return rateLimited(reply, verifyHits, LIMITS.verifyPerIp);
    }

    if (!isValidEmailFormat(email) || isDisposableEmail(email)) {
      track(caller, { ...base, kind: "verify", outcome: "invalid" });
      return reply.code(400).send({ ok: false, error: "invalid" });
    }

    const row = getOtp(identity);
    if (!row) {
      track(caller, { ...base, kind: "verify", outcome: "no_code" });
      return reply.code(400).send({ ok: false, error: "code" });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      clearOtp(identity);
      track(caller, { ...base, kind: "verify", outcome: "code_expired" });
      return reply.code(400).send({ ok: false, error: "expired" });
    }
    if (row.attempts >= 5) {
      clearOtp(identity);
      track(caller, { ...base, kind: "verify", outcome: "too_many_attempts" });
      return reply.code(400).send({ ok: false, error: "locked" });
    }

    const expected = hashOtp(code, identity);
    if (expected !== row.code_hash) {
      bumpOtpAttempts(identity);
      track(caller, { ...base, kind: "verify", outcome: "wrong_code" });
      return reply.code(400).send({ ok: false, error: "code" });
    }

    clearOtp(identity);
    const unlockExpiresAt = new Date(
      Date.now() + config.sessionTtlSeconds * 1000
    ).toISOString();
    recordUnlock(identity, unlockExpiresAt);
    const token = await signSession(identity);
    const unlock = getValidUnlock(identity)!;

    track(caller, { ...base, kind: "verify", outcome: "unlocked" });

    return {
      ok: true,
      token,
      access: accessPayload(unlock),
      expiresIn: config.sessionTtlSeconds,
    };
  });

  app.get("/v1/ral/session", async (req, reply) => {
    const token = bearer(req);
    if (!token) return reply.code(401).send({ ok: false, error: "auth" });

    const session = await verifySession(token);
    if (!session) return reply.code(401).send({ ok: false, error: "auth" });

    const unlock = getValidUnlock(session.email);
    if (!unlock) return reply.code(401).send({ ok: false, error: "expired" });

    touchUnlock(session.email);
    return {
      ok: true,
      access: accessPayload(unlock),
      expiresIn: Math.max(
        0,
        Math.floor((new Date(unlock.expires_at).getTime() - Date.now()) / 1000)
      ),
    };
  });

  /**
   * Fail-closed data endpoint. No token / bad token / expired unlock / service issues → 401.
   * Amounts never leave this process without a verified, unexpired session.
   */
  app.get("/v1/ral/data", async (req, reply) => {
    const caller = callerContext(req);
    const token = bearer(req);
    if (!token) return reply.code(401).send({ ok: false, error: "auth" });

    const session = await verifySession(token);
    if (!session) {
      track(caller, { kind: "data", outcome: "bad_token" });
      return reply.code(401).send({ ok: false, error: "auth" });
    }

    const unlock = getValidUnlock(session.email);
    if (!unlock) {
      track(caller, {
        kind: "data",
        email: session.email,
        canonicalEmail: session.email,
        emailDomain: domainOf(session.email),
        outcome: "unlock_expired",
      });
      return reply.code(401).send({ ok: false, error: "expired" });
    }

    touchUnlock(session.email);
    track(caller, {
      kind: "data",
      email: session.email,
      canonicalEmail: session.email,
      emailDomain: domainOf(session.email),
      outcome: "served",
    });

    return {
      ok: true,
      access: accessPayload(unlock),
      expiresIn: Math.max(
        0,
        Math.floor((new Date(unlock.expires_at).getTime() - Date.now()) / 1000)
      ),
      data: getRalPayload(),
    };
  });

  /**
   * Who asked for the numbers. Bearer ADMIN_TOKEN (or X-Admin-Token); closed
   * entirely when the env var is unset, so it can't be left open by accident.
   *
   * `?format=html` renders a table in the browser, otherwise JSON.
   * Filters: `kind`, `outcome`, `email` (substring), `limit`, `offset`.
   */
  app.get("/v1/admin/requests", async (req, reply) => {
    if (!adminAuthorized(req)) {
      return reply.code(401).send({ ok: false, error: "auth" });
    }

    const query = req.query as Record<string, string | undefined>;
    const recent = listRequests({
      limit: query.limit ? Number(query.limit) : 200,
      offset: query.offset ? Number(query.offset) : 0,
      kind: query.kind,
      outcome: query.outcome,
      email: query.email,
    });
    const emails = listEmailActivity(query.emails ? Number(query.emails) : 200);
    const totals = requestTotals();

    if (query.format === "html") {
      return reply
        .header("content-type", "text/html; charset=utf-8")
        .header("cache-control", "no-store")
        .send(adminHtml(totals, emails, recent));
    }

    return reply.header("cache-control", "no-store").send({
      ok: true,
      ...totals,
      emails,
      recent,
    });
  });
}
