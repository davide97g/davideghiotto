I servizi gestiti sono comodissimi per partire e vanno benissimo fino al primo tier.
Il problema arriva dopo.

> I managed service convengono all'inizio e fino al primo tier, ma il prezzo
> enterprise diventa alto rispetto alle performance: una volta che sei così dentro,
> conviene self-hostare.
> — [live @ 01:17:26](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4646s)

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

> Impara Docker: è la prima cosa che incontri quando fai self-hosting, e la incontri
> costantemente in qualsiasi progetto serio.
> — [@ 02:08:38](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7718s)

Non serve saperlo a memoria: serve saperlo **leggere**. Da lì un compose file con tre
servizi smette di fare paura.

Il secondo pezzo è il layer di deploy, e qui sta il punto che convince davvero:

> [Dokploy](https://dokploy.com/) dà una DX in stile Vercel — versioning, webhook,
> auto-deploy sul push — ma completamente self-hosted.
> — [@ 00:25:07](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1507s)

Non stai rinunciando alla comodità: stai spostando dove vive. È per questo che ora
sposto tutti i progetti seri su VPS.

## I quattro tier del deployment

1. **Vibe-coding tool** con bottone "publish" incluso
2. **PaaS free tier** — Vercel/Netlify + Supabase/Neon
3. **PaaS a pagamento** — i piani si concentrano intorno ai ~$20 e ~$100/mese
4. **Pro: self-hosting** — stacchi tutto e ti prendi la macchina
   ([@ 00:12:46](https://www.youtube.com/watch?v=-XmrA0TF__U&t=766s))

Il quarto tier è quello dove sono arrivato, e non è la scelta giusta per tutti.

## Quanto lontano si arriva: sharp

Con [sharp](https://sharp.davideghiotto.it/) — il rimpiazzo self-hosted di Slack +
Notion + Miro — ho portato il principio al limite: **ogni layer** su una singola VPS.
Auth, documenti collaborativi, whiteboard, e anche lo **streaming audio/video
real-time**. Nessun SaaS esterno
([@ 02:03:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=7419s)).

La formulazione che ne è uscita, e che secondo me è la più utile:

> Tutto ciò che sta **attorno** al tuo strumento di sviluppo può essere sostituito con
> open source self-hosted. L'unica cosa che non puoi rimpiazzare è il core: il tool
> con cui costruisci.
> — [@ 01:45:51](https://www.youtube.com/watch?v=qYqGsOKy40w&t=6351s)

## Cosa paghi in cambio

Non è gratis, è **spostato**:

- **La macchina e la manutenzione.** Aggiornamenti, backup, certificati,
  monitoraggio: tuoi.
- **La prima curva.** Il primo reverse proxy costa tempo; il secondo no.
- **Niente prezzo per utente, niente moltiplicatore enterprise**, e i dati restano
  dove sono i tuoi.

Nota a margine: ho anche un piccolo server LAN in casa (Raspberry Pi con qualche
container) per i lavori leggeri — tipo scaricare file audio che un IP cloud noto si
vedrebbe bloccare
([@ 02:14:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=8049s)). Non tutto deve
stare su una VPS: alcune cose stanno meglio in salotto.

**Se sei sul primo tier di un servizio gestito, resta lì. Se hai iniziato a guardare
la pagina dei prezzi enterprise, è il momento di provare.**

## Riferimenti

| Momento | Fonte |
|---|---|
| Tutta la sessione: staccare l'app dai managed service | [@ 00:14:22](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=862s) |
| VPS + Dokploy guidato da Claude: «facilissimo» | [@ 00:14:38](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=878s) |
| Dokploy = DX Vercel-like, self-hosted | [@ 00:25:07](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1507s) |
| Self-hosting completo: Vercel, Supabase e Clerk staccati | [@ 01:40:21](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=6021s) |
| Il «pro tier»: stacca tutto, full control, costo più basso | [@ 00:12:46](https://www.youtube.com/watch?v=-XmrA0TF__U&t=766s) |
| Piano: strip di tutti i managed service, tenendo solo Clerk | [@ 01:16:03](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4563s) |
| Prezzo enterprise alto vs performance: conviene self-hostare | [@ 01:17:26](https://www.youtube.com/watch?v=ubpckz1sTLY&t=4646s) |
| sharp: ogni layer self-hosted, auth → video, nessun SaaS | [@ 02:03:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=7419s) |
| Tutto attorno al core tool è sostituibile; il core no | [@ 01:45:51](https://www.youtube.com/watch?v=qYqGsOKy40w&t=6351s) |
| Impara Docker: lo incontri costantemente | [@ 02:08:38](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7718s) |
| Server LAN casalingo con container per i job leggeri | [@ 02:14:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=8049s) |

Le fonti sono indicizzate in [Channeling](https://channeling.davideghiotto.it/):
`topics/self-hosting`, `topics/container-orchestration`, `topics/reverse-proxy`,
`topics/self-hosted-authentication`.
