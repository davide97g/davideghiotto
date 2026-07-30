import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8787),
  host: process.env.HOST ?? "0.0.0.0",
  nodeEnv: process.env.NODE_ENV ?? "development",
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:8080")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  sessionSecret: required("SESSION_SECRET", "dev-only-change-me-please-32chars"),
  databasePath: path.resolve(root, process.env.DATABASE_PATH ?? "./data/ral-gate.sqlite"),
  disposablePath: path.resolve(root, "./data/disposable-domains.txt"),
  disposableMxPath: path.resolve(root, "./data/disposable-mx-hosts.txt"),
  allowlistPath: path.resolve(root, "./data/allowed-domains.txt"),
  /** DNS deadline — a blackholed resolver must not hold a request open. */
  dnsTimeoutMs: Number(process.env.DNS_TIMEOUT_MS ?? 3000),
  dnsCacheTtlSeconds: Number(process.env.DNS_CACHE_TTL_SECONDS ?? 600),
  dnsNegativeTtlSeconds: Number(process.env.DNS_NEGATIVE_TTL_SECONDS ?? 60),
  /** Bearer token for GET /v1/admin/requests. Unset → the endpoint is closed. */
  adminToken: process.env.ADMIN_TOKEN?.trim() || "",
  /** Request-log retention. Older rows are swept hourly. 0 keeps everything. */
  logRetentionDays: Number(process.env.LOG_RETENTION_DAYS ?? 180),
  resendApiKey: process.env.RESEND_API_KEY?.trim() || "",
  emailFrom: process.env.EMAIL_FROM ?? "RAL Gate <onboarding@resend.dev>",
  otpTtlSeconds: Number(process.env.OTP_TTL_SECONDS ?? 600),
  otpLength: Number(process.env.OTP_LENGTH ?? 6),
  /** How long a verified unlock can fetch RAL data before it expires. */
  sessionTtlSeconds: Number(process.env.SESSION_TTL_SECONDS ?? 3600),
  isDev: (process.env.NODE_ENV ?? "development") !== "production",
};

export const isMailConfigured = Boolean(config.resendApiKey);
