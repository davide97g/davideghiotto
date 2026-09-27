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

Runs on the **homelab mini PC**, Dokploy project **ral-gate**, application **ral-gate-api**
(`appName` `ral-gate-api-kds6va`). Moved off the Hetzner VPS on 2026-09-15; the VPS project,
its volume and its image are gone. The runbook for that move lives outside this repo, in the
homelab notes (`porting-to-homelab.md`).

- Source: GitHub app on the box (`davide97g/davideghiotto`, branch `main`), watch path
  `services/ral-gate/**`
- Build: `dockerfile` — `services/ral-gate/Dockerfile`, context `services/ral-gate`
- Domain: `ral-api.davideghiotto.it` → container port `8787`, **`https: false`,
  `certificateType: none`**. The box forwards no port: Cloudflare terminates TLS and a
  `cloudflared` tunnel carries the request to Traefik on plain HTTP. A certificate here
  would be a second handshake to nowhere.
- DNS is a **proxied CNAME to the tunnel**, not an A record.
- Volume: `ral-gate-data` mounted at `/data`, with `DATABASE_PATH=/data/ral-gate.sqlite`
  (the SQLite file must not live in `/app/data` — that path ships in the image and holds
  `disposable-domains.txt`). The container runs as `USER node` (uid 1000), so a file
  restored into that volume from outside must be `chown 1000:1000` or the app cannot write.
- `ALLOWED_ORIGINS=https://davideghiotto.it,https://www.davideghiotto.it`

### Deploys

Dokploy's `autoDeploy` is **off**: a GitHub webhook cannot reach a box with no inbound port.
[`.github/workflows/ral-gate.yml`](../../.github/workflows/ral-gate.yml) is the only path from
`main` to production — it runs `npm test` here, then triggers the deploy *and waits for its
result*, so a red deploy cannot hide under a green workflow.

It reaches Dokploy through `deploy-ral.davideghiotto.it`, a tunnel hostname whose path rule
allows `api/application\.(deploy|one)` and nothing else; the rest of Dokploy's admin API
answers 404 at Cloudflare's edge. Three repository secrets carry it: `RAL_DOKPLOY_URL`,
`RAL_DOKPLOY_API_KEY`, `RAL_DOKPLOY_APPLICATION_ID`.

Checklist when standing it up again elsewhere:

1. Point DNS `ral-api.davideghiotto.it` at the host — a proxied CNAME to the tunnel here, an
   A record only if the host terminates TLS itself
2. Long random `SESSION_SECRET`
3. `JEV_API_KEY` for the Jev layer — optional, the gate works without it
4. `RESEND_API_KEY` plus an `EMAIL_FROM` on a Resend-verified domain — with the key empty the
   service still boots but only logs codes to the container console (`/health` reports
   `"mail": false`)
5. Set portfolio `VITE_RAL_API_URL=https://ral-api.davideghiotto.it` and rebuild

`deploy/ral-gate.service` is the bare-systemd alternative, kept for a non-Docker host.

## Rate limits

Rolling 1-hour window: 3 code requests per email, 10 per IP, 30 verify attempts per IP.

A 429 says when the caller can try again — `Retry-After` plus
`{ error: "rate_limit", retryAfterSeconds, retryAfterMinutes }` — and the gate dialog shows that
wait instead of a vague "try later". Blocked attempts are logged under `request_blocked` /
`verify_blocked` rather than counted, so re-clicking the button can't push the quoted wait further
out.

## Anti temp-mail

Four layers, cheapest first. Each one rejects with `error: "disposable"` or `"invalid"`.

**1. Shape.** Format, RFC length caps (64 local / 254 total), placeholder local parts (`test@`,
`qwerty@`), reserved TLDs (`.invalid`, `.local`, `.test`, `.example`, `.onion`, …). Domains are
canonicalized to punycode first, so an IDN lookalike can't walk past an ASCII list.

**2. Domain lists.** `data/allowed-domains.txt` is checked *first* and always wins — a bad upstream
entry must never lock out gmail. Then `data/disposable-domains.txt` (~8k domains) with parent
matching, so `foo.mailinator.com` is caught by the `mailinator.com` entry.

**3. MX backends.** This is the layer that catches domains registered *after* the last list refresh.
Throwaway operators rotate domains constantly but keep pointing MX at the same few hosts, so the
exchange hostnames are matched against `data/disposable-mx-hosts.txt` **and** the main blocklist —
a brand-new unlisted domain still resolves its MX to `mail.yopmail.com`.

**4. Jev.** Only an address that passed the first three reaches [TypeSafe](https://docs.typesafe.ai)'s
Jev (`src/jev.ts`), which answers two yes/no questions over `{ email, local_part, domain, mx_hosts }`:

- `throwaway_service` — is the domain a temp-mail service? Catches the ones no list has yet.
  Rejects with `"disposable"` (outcome `jev_disposable`). Ignored for allowlisted domains, the
  same precedence the lists follow.
- `fake_mailbox` — is the local part a placeholder, a test value or a keyboard mash? Catches
  `asdfgh@outlook.com`, which every other layer passes. Rejects with `"invalid"` (outcome `jev_fake`).

Either probability at or above `JEV_THRESHOLD` (default **0.75**) blocks. On the addresses it was
tuned against, real mailboxes (names, `hr@`, `careers@`, `recruiting@`) scored at most 0.10 and junk
at least 0.77, so the threshold sits in a wide gap. It costs one call (~300 ms) per request that
survives the lists.

It **fails open**: no `JEV_API_KEY`, a non-2xx, a malformed answer or a timeout past
`JEV_TIMEOUT_MS` lets the request through, since the OTP still proves the mailbox and locking out a
recruiter over a slow classifier is the worse failure. Every request row stores what Jev said in
`request_log.jev` — `{"service":0.01,"fake":0.03}`, or `{"error":"timeout"}` when it failed open —
so tuning the threshold is a query over real traffic, not a guess.

The A/AAAA fallback stays: RFC 5321 implicit MX is real and small legitimate domains rely on it, so
dropping it would reject genuine contacts. There is no SMTP `RCPT TO` probe — it is unreliable, gets
the sending IP blocked, and the OTP already proves the mailbox exists. DNS has a 3s deadline and a
short-TTL cache so a blackholed resolver can't hold a request open.

**Identity, not strings.** `d.a.vide+ral@gmail.com` and `davide@gmail.com` are one mailbox. Rate
limits, the OTP row and the unlock row all key on the canonical form (sub-addressing stripped
everywhere, dots stripped only for Gmail/Googlemail where they are ignored) — otherwise one mailbox
buys unlimited codes. Mail still goes to the address as typed.

Policy decisions, deliberate: free consumer providers (gmail, outlook, proton, libero, …) are
**allowed** — blocking them costs real contacts and barely slows anyone who can register a €5
domain. Masked relays (Apple Hide My Email, Firefox Relay, DuckDuckGo) are **allowed** too: they
forward to a verified human mailbox and the code arrives.

### Refreshing the list

```bash
npm run fetch:disposable
```

Pulls [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains),
subtracts `data/allowed-domains.txt`, adds `data/disposable-extra.txt`, and refuses to write a list
under 2,000 domains (so a moved or truncated upstream file fails loudly instead of shipping a filter
that blocks nothing). The two local files are never written to, so a refresh can't drop a hand-made
decision. Upstream removed their own `allowlist.conf`, which makes `data/allowed-domains.txt` the
only guard against a bad upstream entry — keep it current.

`npm test` (in this directory) covers alias canonicalization, MX matching, allowlist precedence and
the reserved-TLD rejections.

## Who asked — request log

Every hit on `/request`, `/verify` and `/data` writes one `request_log` row: timestamp, address as
typed, canonical address, domain, outcome, IP, `X-Forwarded-For`, user agent, referer, origin,
`Accept-Language`, Cloudflare's `CF-IPCountry` when proxied, the MX hosts the domain resolved to, and
Jev's scores.
`outcome` is the exact exit path — `sent`, `unlocked`, `served`, `wrong_code`, `disposable_domain`,
`disposable_mx`, `jev_disposable`, `jev_fake`, `no_mail_records`, `rate_limit_email`, `mail_error`, …

Read it with `ADMIN_TOKEN` set:

```bash
# browser table
open "https://ral-api.davideghiotto.it/v1/admin/requests?format=html&token=…"   # or send the header

# JSON: totals, per-mailbox rollup, recent events
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://ral-api.davideghiotto.it/v1/admin/requests?limit=200"
```

Filters: `kind`, `outcome`, `email` (substring), `limit`, `offset`, `format=html`. The endpoint is
closed entirely when `ADMIN_TOKEN` is unset, and the response is `no-store`.

These rows are personal data. `LOG_RETENTION_DAYS` (default 180) sweeps them hourly.

## Data privacy

Exact RAL numbers live only in `src/data.ts` on this service. The portfolio bundle ships company/date metadata without amounts. Unlock sessions are time-boxed — after TTL the API refuses amounts even if the JWT is still presented.
