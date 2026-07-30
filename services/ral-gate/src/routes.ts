import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { config } from "./config.js";
import { getRalPayload } from "./data.js";
import {
  bumpOtpAttempts,
  clearOtp,
  countRecent,
  getOtp,
  getValidUnlock,
  logRequest,
  recordUnlock,
  touchUnlock,
  upsertOtp,
} from "./db.js";
import { sendOtpEmail } from "./email.js";
import {
  hasMxRecords,
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

function clientIp(req: FastifyRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0]!.trim();
  }
  return req.ip;
}

function bearer(req: FastifyRequest): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
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

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    ok: true,
    mail: Boolean(config.resendApiKey),
    env: config.nodeEnv,
    sessionTtlSeconds: config.sessionTtlSeconds,
  }));

  app.post("/v1/ral/request", async (req, reply) => {
    const parsed = emailBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, error: "invalid" });
    }

    const email = normalizeEmail(parsed.data.email);
    const ip = clientIp(req);
    logRequest("request", email, ip);

    if (!isValidEmailFormat(email)) {
      return reply.code(400).send({ ok: false, error: "invalid" });
    }
    if (isDisposableEmail(email)) {
      return reply.code(400).send({ ok: false, error: "disposable" });
    }

    if (countRecent("request", "email", email, hoursAgo(1)) > 3) {
      return reply.code(429).send({ ok: false, error: "rate_limit" });
    }
    if (countRecent("request", "ip", ip, hoursAgo(1)) > 10) {
      return reply.code(429).send({ ok: false, error: "rate_limit" });
    }

    const mxOk = await hasMxRecords(email);
    if (!mxOk) {
      return reply.code(400).send({ ok: false, error: "invalid" });
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + config.otpTtlSeconds * 1000).toISOString();
    upsertOtp(email, hashOtp(code, email), expiresAt);

    try {
      await sendOtpEmail(email, code);
    } catch (err) {
      req.log.error(err);
      return reply.code(503).send({ ok: false, error: "mail" });
    }

    // Always opaque success — don't leak whether the mailbox exists beyond MX.
    return {
      ok: true,
      expiresIn: config.otpTtlSeconds,
      // Dev-only hint so local UI can show the code without opening logs.
      ...(config.isDev && !config.resendApiKey ? { devCode: code } : {}),
    };
  });

  app.post("/v1/ral/verify", async (req, reply) => {
    const parsed = verifyBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, error: "invalid" });
    }

    const email = normalizeEmail(parsed.data.email);
    const code = parsed.data.code.trim();
    const ip = clientIp(req);
    logRequest("verify", email, ip);

    if (!isValidEmailFormat(email) || isDisposableEmail(email)) {
      return reply.code(400).send({ ok: false, error: "invalid" });
    }

    if (countRecent("verify", "ip", ip, hoursAgo(1)) > 30) {
      return reply.code(429).send({ ok: false, error: "rate_limit" });
    }

    const row = getOtp(email);
    if (!row) {
      return reply.code(400).send({ ok: false, error: "code" });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      clearOtp(email);
      return reply.code(400).send({ ok: false, error: "expired" });
    }
    if (row.attempts >= 5) {
      clearOtp(email);
      return reply.code(400).send({ ok: false, error: "locked" });
    }

    const expected = hashOtp(code, email);
    if (expected !== row.code_hash) {
      bumpOtpAttempts(email);
      return reply.code(400).send({ ok: false, error: "code" });
    }

    clearOtp(email);
    const unlockExpiresAt = new Date(
      Date.now() + config.sessionTtlSeconds * 1000
    ).toISOString();
    recordUnlock(email, unlockExpiresAt);
    const token = await signSession(email);
    const unlock = getValidUnlock(email)!;

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
    const token = bearer(req);
    if (!token) return reply.code(401).send({ ok: false, error: "auth" });

    const session = await verifySession(token);
    if (!session) return reply.code(401).send({ ok: false, error: "auth" });

    const unlock = getValidUnlock(session.email);
    if (!unlock) return reply.code(401).send({ ok: false, error: "expired" });

    touchUnlock(session.email);
    logRequest("data", session.email, clientIp(req));

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
}
