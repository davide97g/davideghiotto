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

## Production (VPS)

1. Point DNS, e.g. `ral-api.davideghiotto.it` → VPS
2. Put a long `SESSION_SECRET` and a Resend key in `.env`
3. Verify domain in Resend; set `EMAIL_FROM` to a domain you own
4. Reverse-proxy with Caddy:

```caddy
ral-api.davideghiotto.it {
  reverse_proxy 127.0.0.1:8787
}
```

5. Install the systemd unit from `deploy/ral-gate.service`
6. Set portfolio `VITE_RAL_API_URL=https://ral-api.davideghiotto.it` and rebuild

## Anti temp-mail

- Format + MX / A record check
- Disposable domain list in `data/disposable-domains.txt`
- Per-email and per-IP rate limits

Refresh the list periodically from [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains).

## Data privacy

Exact RAL numbers live only in `src/data.ts` on this service. The portfolio bundle ships company/date metadata without amounts. Unlock sessions are time-boxed — after TTL the API refuses amounts even if the JWT is still presented.
