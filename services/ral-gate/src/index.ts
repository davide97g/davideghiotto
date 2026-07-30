import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { clearExpiredUnlocks } from "./db.js";
import { loadDisposableDomains } from "./emailPolicy.js";
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

try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info(
    `ral-gate listening on ${config.host}:${config.port} (mail=${Boolean(config.resendApiKey) ? "resend" : "dev-console"}, sessionTtl=${config.sessionTtlSeconds}s)`
  );
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
