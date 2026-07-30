import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { clearExpiredUnlocks, pruneRequestLog } from "./db.js";
import { loadDisposableDomains, policyListSizes } from "./emailPolicy.js";
import { registerRoutes } from "./routes.js";

loadDisposableDomains();

const app = Fastify({
  logger: true,
  trustProxy: true,
});

await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl / same-origin tooling
    if (config.allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Origin not allowed"), false);
  },
  credentials: false,
});

await app.register(rateLimit, {
  max: 60,
  timeWindow: "1 minute",
});

await registerRoutes(app);

// Sweep expired unlocks so SQLite doesn't keep stale access rows around.
const CLEANUP_MS = 60_000;
clearExpiredUnlocks();
const cleanupTimer = setInterval(() => {
  const n = clearExpiredUnlocks();
  if (n > 0) app.log.info({ cleared: n }, "expired unlocks cleared");
}, CLEANUP_MS);
cleanupTimer.unref?.();

// Audit rows are personal data — drop them past the retention window.
const PRUNE_MS = 3_600_000;
const pruneTimer = setInterval(() => {
  const n = pruneRequestLog(config.logRetentionDays);
  if (n > 0) app.log.info({ pruned: n }, "request log pruned");
}, PRUNE_MS);
pruneTimer.unref?.();

try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info(
    { policy: policyListSizes(), admin: Boolean(config.adminToken) },
    `ral-gate listening on ${config.host}:${config.port} (mail=${Boolean(config.resendApiKey) ? "resend" : "dev-console"}, sessionTtl=${config.sessionTtlSeconds}s)`
  );
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
