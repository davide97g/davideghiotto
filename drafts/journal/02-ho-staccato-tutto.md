---
title: Ho staccato tutto — Vercel, Supabase, Clerk
platform: linkedin
status: draft
date: TBD
topic: self-hosting — 31 inbound links, the hottest topic in the wiki
hero: https://i.ytimg.com/vi/6JAmrUIjDM0/hqdefault.jpg
tags: [self-hosting, docker, vps, devops, agents]
---

# Ho staccato tutto: Vercel, Supabase, Clerk

[![VPS + Dokploy con Claude Code: Addio Vercel & Supabase](https://i.ytimg.com/vi/6JAmrUIjDM0/hqdefault.jpg)](https://www.youtube.com/watch?v=6JAmrUIjDM0)

*Dalla live [«VPS + Dokploy con Claude Code: Addio Vercel & Supabase»](https://www.youtube.com/watch?v=6JAmrUIjDM0).*

I servizi gestiti sono comodissimi per partire e vanno benissimo fino al primo
tier. Il problema arriva dopo.

> I managed service convengono all'inizio e fino al primo tier, ma il prezzo
> enterprise diventa alto rispetto alle performance: una volta che sei così
> dentro, conviene self-hostare.
> — [@ 01:17:26](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4646s)

L'ho fatto in diretta, su un'app vera già online.

## Prima e dopo

| Layer | Prima | Dopo |
|---|---|---|
| Frontend | [Vercel](https://vercel.com/) | [Docker](https://www.docker.com/) su VPS |
| Database | [Neon](https://neon.tech/) / [Supabase](https://supabase.com/) | Postgres nel compose |
| Backend | [Render](https://render.com/) | Servizio nel compose |
| Auth | [Clerk](https://clerk.com/) | [Better Auth](https://www.better-auth.com/) |
| Proxy / TLS | incluso nel PaaS | [Traefik](https://traefik.io/) + [Let's Encrypt](https://letsencrypt.org/) |
| Deploy / DX | push su Vercel | [Dokploy](https://dokploy.com/) su [Hetzner](https://www.hetzner.com/) |

Tutto in **un** `docker-compose`: db + server + web. Dominio custom, segreti nel
pannello, HTTPS automatico.

La parte che non mi aspettavo:

> **Facilissimo** — l'avevo già mezzo fatto per sbaglio prima della live.
> — [@ 00:14:38](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=878s)

[Claude Code](https://claude.com/claude-code) ha guidato quasi tutto via SSH.

## Docker è il primo pezzo da imparare

> Impara Docker: è la prima cosa che incontri quando fai self-hosting, e la
> incontri costantemente in qualsiasi progetto serio.
> — [@ 02:08:38](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7718s)

Non serve saperlo a memoria: serve saperlo **leggere**. Da lì un compose file con
tre servizi smette di fare paura.

Il secondo pezzo è il layer di deploy, e qui sta il punto che convince davvero:

> [Dokploy](https://dokploy.com/) dà una DX in stile Vercel — versioning, webhook,
> auto-deploy sul push — ma completamente self-hosted.
> — [@ 00:25:07](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1507s)

Non stai rinunciando alla comodità. Stai spostando dove vive. È per questo che ora
sposto tutti i progetti seri su VPS.

## I quattro tier del deployment

1. **Vibe-coding tool** con bottone "publish" incluso
2. **PaaS free tier** — Vercel/Netlify + Supabase/Neon
3. **PaaS a pagamento** — cluster intorno ai ~$20 e ~$100/mese
4. **Pro: self-hosting** — stacchi tutto e ti prendi la macchina
   ([@ 00:12:46](https://www.youtube.com/watch?v=-XmrA0TF__U&t=766s))

Il quarto tier è quello dove sono arrivato, e non è la scelta giusta per tutti.

## Quanto lontano si arriva: sharp

Con [sharp](https://sharp.davideghiotto.it/) — il rimpiazzo self-hosted di Slack +
Notion + Miro — ho portato il principio al limite: **ogni layer** su una singola
VPS. Auth, documenti collaborativi, whiteboard, e anche lo **streaming audio/video
real-time**. Nessun SaaS esterno
([@ 02:03:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=7419s)).

La formulazione che ne è uscita, e che secondo me è la più utile:

> Tutto ciò che sta **attorno** al tuo strumento di sviluppo può essere sostituito
> con open source self-hosted. L'unica cosa che non puoi rimpiazzare è il core: il
> tool con cui costruisci (Cursor / Codex).
> — [@ 01:45:51](https://www.youtube.com/watch?v=qYqGsOKy40w&t=6351s)

## Cosa paghi in cambio

Non è gratis, è **spostato**:

- 💸 **La macchina e la manutenzione.** Aggiornamenti, backup, certificati,
  monitoraggio: tuoi.
- ⏱️ **La prima curva.** Il primo reverse proxy costa tempo; il secondo no.
- ✅ **Niente prezzo per utente, niente moltiplicatore enterprise**, e i dati
  restano dove sono i tuoi.

Nota a margine: ho anche un piccolo server LAN in casa (Raspberry Pi con qualche
container) per i lavori leggeri — tipo scaricare file audio che un IP cloud noto si
vedrebbe bloccare
([@ 02:14:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=8049s)). Non tutto deve
stare su una VPS: alcune cose stanno meglio in salotto.

**Se sei sul primo tier di un servizio gestito, resta lì. Se hai iniziato a
guardare la pagina dei prezzi enterprise, è il momento di provare.**

---

## Riferimenti

| # | Momento | Fonte |
|---|---|---|
| 1 | Tutta la sessione: staccare l'app dai managed service | [6JAmrUIjDM0 @ 00:14:22](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=862s) |
| 2 | VPS + Dokploy guidato da Claude: «facilissimo» | [6JAmrUIjDM0 @ 00:14:38](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=878s) |
| 3 | Dokploy = DX Vercel-like, self-hosted | [6JAmrUIjDM0 @ 00:25:07](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1507s) |
| 4 | Self-hosting completo: Vercel, Supabase e Clerk staccati | [6JAmrUIjDM0 @ 01:40:21](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=6021s) |
| 5 | Il «pro tier»: stacca tutto, full control, costo più basso | [-XmrA0TF__U @ 00:12:46](https://www.youtube.com/watch?v=-XmrA0TF__U&t=766s) |
| 6 | Piano: strip di tutti i managed service, tenendo solo Clerk | [ubpckz1sTLY @ 01:16:03](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4563s) |
| 7 | Prezzo enterprise alto vs performance: conviene self-hostare | [ubpckz1sTLY @ 01:17:26](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4646s) |
| 8 | sharp: ogni layer self-hosted, auth → video, nessun SaaS | [qYqGsOKy40w @ 02:03:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=7419s) |
| 9 | Tutto attorno al core tool è sostituibile; il core no | [qYqGsOKy40w @ 01:45:51](https://www.youtube.com/watch?v=qYqGsOKy40w&t=6351s) |
| 10 | Impara Docker: lo incontri costantemente | [UwMhqq9Evxk @ 02:08:38](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7718s) |
| 11 | Server LAN casalingo con container per i job leggeri | [UwMhqq9Evxk @ 02:14:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=8049s) |

Fonti nel wiki di [Channeling](https://channeling.davideghiotto.it/):
`topics/self-hosting`, `topics/container-orchestration`, `topics/reverse-proxy`,
`topics/self-hosted-authentication`.

> **[TK]** il titolo esatto del video `-XmrA0TF__U` (i tier di deployment) va
> verificato prima di pubblicare.

---

## LinkedIn cut

Ho staccato tutto: Vercel, Supabase, Clerk. In diretta, su un'app vera già online.

Punto di arrivo: una VPS, un solo docker-compose (db + server + web), Traefik come
reverse proxy con HTTPS automatico, dominio custom, Better Auth al posto di Clerk.

La parte che non mi aspettavo: è stato facilissimo. Talmente facile che l'avevo già
mezzo fatto per sbaglio prima della live. Claude Code ha guidato quasi tutto via
SSH.

Due cose che porto via:

→ Docker è il primo pezzo da imparare. Non a memoria: da saper leggere. Lo incontri
in qualsiasi progetto serio.
→ Dokploy dà una developer experience in stile Vercel — versioning, webhook,
auto-deploy sul push — su una macchina tua. Non rinunci alla comodità: sposti dove
vive.

E la formulazione più utile che ne è uscita: tutto ciò che sta ATTORNO al tuo
strumento di sviluppo può diventare open source self-hosted. L'unica cosa che non
puoi rimpiazzare è il core — il tool con cui costruisci.

Cosa paghi in cambio: la macchina e la sua manutenzione, e la prima curva di
apprendimento. Cosa non paghi più: il prezzo per utente e il moltiplicatore
enterprise.

Se sei sul primo tier di un managed service, resta lì. Se hai iniziato a guardare
la pagina dei prezzi enterprise, è il momento di provare.

---

## EN — short version

Managed services are wonderfully convenient to start with and fine up to the first
tier. Then enterprise pricing gets high relative to the performance you get — and
by then you're committed enough that running it yourself pays off.

I detached everything live, on a real app: Vercel, Neon/Supabase, Render and Clerk
out; one VPS with a single `docker-compose` (db + server + web), Traefik with
Let's Encrypt HTTPS, a custom domain, and Better Auth in. Claude Code drove most of
it over SSH, and it was far easier than expected.

Two takeaways. **Docker is the first piece to learn** — not memorised, just
readable; you hit it in every serious project. And **Dokploy gives you Vercel-like
DX** (versioning, webhooks, auto-deploy on push) on your own box, so you're not
giving up convenience, you're relocating it.

With [sharp](https://sharp.davideghiotto.it/) I pushed it all the way: every layer
self-hosted on one VPS, up to real-time audio/video, no external SaaS. Everything
*around* your core dev tool can be self-hosted open source — only the core tool
can't be replaced.

What you pay instead: the box, its upkeep, and the first learning curve. What you
stop paying: per-seat pricing and the enterprise multiplier.

---

## Entry for content.ts

```ts
{
  title: {
    en: "I detached everything: Vercel, Supabase, Clerk",
    it: "Ho staccato tutto: Vercel, Supabase, Clerk",
  },
  excerpt: {
    en: "One VPS, one docker-compose, Traefik in front, Better Auth instead of Clerk — and what self-hosting actually costs you in exchange.",
    it: "Una VPS, un docker-compose, Traefik davanti, Better Auth invece di Clerk — e cosa ti costa davvero il self-hosting in cambio.",
  },
  date: "TBD",
  platform: "linkedin",
  link: "TBD",
}
```
