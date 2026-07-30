# ral-gate — OTP email unlock for RAL disclosure

Fail-closed Node API. If this service is down, the portfolio keeps every figure locked.

## Quick start (dev)

```bash
cd services/ral-gate
cp .env.example .env
npm run dev
```

Without `RESEND_API_KEY`, OTP codes print to the server console (and are returned as `devCode` in development only).

Health: `GET http://localhost:8787/health`

### API

| Method | Path | Body / Auth | Result |
|---|---|---|---|
| `POST` | `/v1/ral/request` | `{ email }` | sends OTP (rejects disposable / bad MX) |
| `POST` | `/v1/ral/verify` | `{ email, code }` | `{ token, access }` (`access.expiresAt`) |
| `GET` | `/v1/ral/session` | `Authorization: Bearer <token>` | session info (401 if expired) |
| `GET` | `/v1/ral/data` | `Authorization: Bearer <token>` | RAL amounts (auth + unexpired unlock) |

Verified unlocks expire after `SESSION_TTL_SECONDS` (default **1 hour**). Past that, `/data` and `/session` return 401, the unlock row is deleted, and the portfolio clears local state so figures disappear without a full reload. A background timer on the server sweeps expired unlock rows every minute.

## Production (Dokploy)

Deployed on the VPS through Dokploy as project **ral-gate**, application **ral-gate-api**:

- Source: this repo (custom git, branch `main`), watch path `services/ral-gate/**`
- Build: `dockerfile` — `services/ral-gate/Dockerfile`, context `services/ral-gate`
- Domain: `ral-api.davideghiotto.it` → container port `8787`, Let's Encrypt
- Volume: `ral-gate-data` mounted at `/data`, with `DATABASE_PATH=/data/ral-gate.sqlite`
  (the SQLite file must not live in `/app/data` — that path ships in the image and holds
  `disposable-domains.txt`)
- `ALLOWED_ORIGINS=https://davideghiotto.it,https://www.davideghiotto.it`

Checklist when standing it up again elsewhere:

1. Point DNS `ral-api.davideghiotto.it` → VPS, so Let's Encrypt can issue
2. Long random `SESSION_SECRET`
3. `RESEND_API_KEY` plus an `EMAIL_FROM` on a Resend-verified domain — with the key empty the
   service still boots but only logs codes to the container console (`/health` reports
   `"mail": false`)
4. Set portfolio `VITE_RAL_API_URL=https://ral-api.davideghiotto.it` and rebuild

`deploy/ral-gate.service` is the bare-systemd alternative, kept for a non-Docker host.

## Anti temp-mail

- Format + MX / A record check
- Disposable domain list in `data/disposable-domains.txt`
- Per-email and per-IP rate limits

Refresh the list periodically from [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains).

## Data privacy

Exact RAL numbers live only in `src/data.ts` on this service. The portfolio bundle ships company/date metadata without amounts. Unlock sessions are time-boxed — after TTL the API refuses amounts even if the JWT is still presented.
