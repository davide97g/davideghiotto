# Journal drafts

Five drafts for the [journal band](https://davideghiotto.it/#journal) on
davideghiotto.it. Nothing here is wired into the site yet — the section reads
`journalEntries` in `src/data/content.ts`, and that array is still empty on purpose.

Topics were not invented: they come from the
[Channeling](https://channeling.davideghiotto.it/) wiki in
`~/personal/projects/channeling`, ranked by **inbound wikilinks** across
`knowledge/wiki/` — i.e. what the channel actually keeps coming back to. Every
claim in every draft is anchored to a timestamped moment in one of your own videos,
and every timestamp is a deep link (`&t=<seconds>s`) verified against its label.

## The five

| # | Draft | Topic (inbound links) | Anchor video |
|---|---|---|---|
| 01 | [Il costo non è il prezzo del token](01-stop-pricing-tokens.md) | token-efficiency (22) | [Fable 5 Ritorna!](https://www.youtube.com/watch?v=_tx5HibNMW4) |
| 02 | [Ho staccato tutto: Vercel, Supabase, Clerk](02-ho-staccato-tutto.md) | self-hosting (**31 — hottest**) | [VPS + Dokploy](https://www.youtube.com/watch?v=6JAmrUIjDM0) |
| 03 | [Riusare batte rigenerare](03-riusare-batte-rigenerare.md) | reference-driven-generation (14) | [Fable+Sol = Sharp](https://www.youtube.com/watch?v=qYqGsOKy40w) |
| 04 | [L'orchestratore non scrive codice](04-orchestratore-non-scrive-codice.md) | agentic-orchestration (17) + context-management (13) | [Personal Knowledge System](https://www.youtube.com/watch?v=LIvW0-c-kUI) |
| 05 | [Ho smesso di scrivere codice a dicembre](05-ho-smesso-di-scrivere-codice.md) | developer-role-shift (8) + proficiency-levels (9) | [Fable 5 al limite](https://www.youtube.com/watch?v=UwMhqq9Evxk) |

Hot topics that are still **unused** and would carry a sixth and seventh post:
`vibe-coding` (17 — the tool tier list), `model-benchmarking` (14),
`api-key-security` (14), `continuous-deployment` (14), `agent-skills` (10),
`autonomous-agents` (8 — "always-on agents in search of a use case").

## Structure of each file

1. **Frontmatter** — title, platform, status, topic + link count, hero image, tags
2. **Body in Italian** — the channel's language, with pull quotes that deep-link to
   the exact second, comparison tables, and outbound links to every tool named
3. **Riferimenti** — a numbered table of every cited moment, each a `&t=` deep link
4. **LinkedIn cut** — a ~1.400-character version for the feed
5. **EN — short version** — for the English side of the site
6. **Entry for content.ts** — paste-ready `journalEntries` object, bilingual

## Publishing pipeline

1. Edit the draft. Anything marked **`[TK]`** is a detail only you can confirm —
   two video titles are unverified. Don't publish a `[TK]`.
2. Post it (LinkedIn first, per the frontmatter). Draft 01 and 04 cross-reference
   each other: post 01 before 04, or fix the `(#)` placeholder link in 01.
3. Copy the `## Entry for content.ts` block into `journalEntries`, fill in the real
   `date` and `link`, commit.

`platform` must be one of the `journalPlatforms` ids — `linkedin`, `youtube`,
`github`, `site` — because that id maps to the lucide icon in the rail.

## Assets used

- Video thumbnails: `https://i.ytimg.com/vi/<videoId>/hqdefault.jpg`
- Channeling screenshot (draft 04): `https://davideghiotto.it/shot-channeling.avif`,
  already deployed with the site
