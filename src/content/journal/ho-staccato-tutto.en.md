Managed services are wonderfully convenient to start with and perfectly fine up to
the first tier. The problem comes later.

> Managed services pay off at the beginning and up to the first tier, but enterprise
> pricing gets high relative to the performance you get: once you're that committed,
> self-hosting is worth it.
> — [stream @ 01:17:26](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4646s)

I did it live, on a real app already online.

## Before and after

| Layer | Before | After |
|---|---|---|
| Frontend | [Vercel](https://vercel.com/) | [Docker](https://www.docker.com/) on a VPS |
| Database | [Neon](https://neon.tech/) / [Supabase](https://supabase.com/) | Postgres in the compose |
| Backend | [Render](https://render.com/) | A service in the compose |
| Auth | [Clerk](https://clerk.com/) | [Better Auth](https://www.better-auth.com/) |
| Proxy / TLS | bundled with the PaaS | [Traefik](https://traefik.io/) + [Let's Encrypt](https://letsencrypt.org/) |
| Deploy / DX | push to Vercel | [Dokploy](https://dokploy.com/) on [Hetzner](https://www.hetzner.com/) |

Everything in **one** `docker-compose`: db + server + web. Custom domain, secrets in
the panel, automatic HTTPS.

The part I didn't expect:

> **Dead easy** — I'd half-done it by accident before the stream.
> — [@ 00:14:38](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=878s)

[Claude Code](https://claude.com/claude-code) drove most of it over SSH.

## Docker is the first piece to learn

> Learn Docker: it's the first thing you hit when you self-host, and you hit it
> constantly in any serious project.
> — [@ 02:08:38](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7718s)

You don't need it memorised — you need to be able to **read** it. From there, a
compose file with three services stops being scary.

The second piece is the deploy layer, and this is the argument that actually
convinces:

> [Dokploy](https://dokploy.com/) gives you Vercel-like DX — versioning, webhooks,
> auto-deploy on push — but entirely self-hosted.
> — [@ 00:25:07](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1507s)

You're not giving up the convenience: you're relocating it. That's why I'm moving all
serious projects onto a VPS now.

## The four deployment tiers

1. **Vibe-coding tool** with a built-in publish button
2. **PaaS free tier** — Vercel/Netlify + Supabase/Neon
3. **Paid PaaS** — plans cluster around ~$20 and ~$100/month
4. **Pro: self-hosting** — detach everything and take the machine
   ([@ 00:12:46](https://www.youtube.com/watch?v=-XmrA0TF__U&t=766s))

The fourth tier is where I landed, and it isn't the right call for everyone.

## How far this goes: sharp

With [sharp](https://sharp.davideghiotto.it/) — the self-hosted Slack + Notion + Miro
replacement — I pushed the principle to its limit: **every layer** on a single VPS.
Auth, collaborative docs, whiteboard, even **real-time audio/video streaming**. No
external SaaS
([@ 02:03:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=7419s)).

The framing that came out of it, and the one I find most useful:

> Everything **around** your development tool can be swapped for self-hosted open
> source. The only thing you can't replace is the core: the tool you build with.
> — [@ 01:45:51](https://www.youtube.com/watch?v=qYqGsOKy40w&t=6351s)

## What you pay instead

It isn't free, it's **moved**:

- **The box and its upkeep.** Updates, backups, certificates, monitoring — yours.
- **The first curve.** The first reverse proxy costs time; the second doesn't.
- **No per-seat pricing, no enterprise multiplier**, and your data stays where yours
  is.

A side note: I also run a small LAN server at home (a Raspberry Pi with a few
containers) for light jobs — like downloading audio files that a known cloud IP would
get blocked for
([@ 02:14:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=8049s)). Not everything
belongs on a VPS; some things are better off in the living room.

**If you're on a managed service's first tier, stay there. If you've started reading
the enterprise pricing page, it's time to try.**

## References

| Moment | Source |
|---|---|
| The whole session: detaching the app from managed services | [@ 00:14:22](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=862s) |
| VPS + Dokploy guided by Claude: "dead easy" | [@ 00:14:38](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=878s) |
| Dokploy = Vercel-like DX, self-hosted | [@ 00:25:07](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1507s) |
| Full self-hosting: Vercel, Supabase and Clerk detached | [@ 01:40:21](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=6021s) |
| The "pro tier": detach all, full control, lower cost | [@ 00:12:46](https://www.youtube.com/watch?v=-XmrA0TF__U&t=766s) |
| Plan: strip every managed service, keep only Clerk | [@ 01:16:03](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4563s) |
| Enterprise pricing vs performance: self-hosting wins | [@ 01:17:26](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4646s) |
| sharp: every layer self-hosted, auth → video, no SaaS | [@ 02:03:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=7419s) |
| Everything around the core tool is replaceable; the core isn't | [@ 01:45:51](https://www.youtube.com/watch?v=qYqGsOKy40w&t=6351s) |
| Learn Docker: you hit it constantly | [@ 02:08:38](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7718s) |
| Home LAN server with containers for light jobs | [@ 02:14:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=8049s) |

Sources are indexed in [Channeling](https://channeling.davideghiotto.it/):
`topics/self-hosting`, `topics/container-orchestration`, `topics/reverse-proxy`,
`topics/self-hosted-authentication`.
