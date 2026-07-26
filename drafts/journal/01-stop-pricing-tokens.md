---
title: Il costo non è il prezzo del token
platform: linkedin
status: draft
date: TBD
topic: token-efficiency — 22 inbound links, the wiki's #2 topic
hero: https://i.ytimg.com/vi/_tx5HibNMW4/hqdefault.jpg
tags: [llm-cost, agents, claude-code, token-efficiency]
---

# Il costo non è il prezzo del token

[![Fable 5 Ritorna! Ah sì, c'è anche Sonnet 5...](https://i.ytimg.com/vi/_tx5HibNMW4/hqdefault.jpg)](https://www.youtube.com/watch?v=_tx5HibNMW4)

*Dalla live [«Fable 5 Ritorna! Ah sì, c'è anche Sonnet 5…»](https://www.youtube.com/watch?v=_tx5HibNMW4) — tutti i timestamp in fondo sono link diretti al minuto.*

Ogni confronto tra modelli che leggo mette i prezzi in fila: questo costa X per
milione di token, quello costa Y. Poi si sceglie il numero più basso e ci si
stupisce quando la fattura sale.

Il numero sulla pagina dei prezzi non è quello che paghi.

> Quello che paghi sono i **token totali bruciati per task completato**, non il
> prezzo per token.
> — [@ 00:02:18](https://www.youtube.com/watch?v=_tx5HibNMW4&t=138s)

## Il caso che me l'ha dimostrato

[Sonnet 5](https://www.anthropic.com/claude) costa meno per token di Opus. Su un
refactor [Drizzle](https://orm.drizzle.team/) ha aperto **15 subagent** per
esplorare il codebase e non è riuscito a fermarsi: contesto saturato, compaction a
ripetizione, oltre un milione di token.

> Consuma meno per token, ma ne consuma così tanti in più che finisce per essere
> peggio di Opus.
> — [@ 00:02:24](https://www.youtube.com/watch?v=_tx5HibNMW4&t=144s)

Più lento **e** più caro del modello "costoso" che stavo evitando per
risparmiare. Sapere quando fermarsi è una qualità dell'orchestratore tanto quanto
la capacità grezza — [ne ho scritto a parte](#).

Il rovescio vale anche in alto. [Fable 5](https://www.anthropic.com/) con 3–4
istanze in parallelo mi ha saturato una finestra da 5 ore in circa **una**
([@ 00:43:57](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2637s)). Potentissimo e
vorace: orchestra executor che a loro volta consumano, quindi su task non davvero
difficili mangia molto più di Opus
([@ 01:59:24](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=7164s)). Va tenuto per
quando serve. GPT-5.5, per confronto, è notevolmente più efficiente
([@ 02:06:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7569s)).

## Le tre leve che uso

| Leva | Cosa cambia | Dove ne parlo |
|---|---|---|
| **Effort giusto, non massimo** | Un modello intelligente a effort `high` chiude senza iterare, quindi consuma poco. `Max` ha rendimenti decrescenti | [@ 00:32:47](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=1967s) |
| **Delegare per complessità** | Lavoro complesso al modello potente, standard a quello economico. Come deleghi con le persone | [@ 00:05:26](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=326s) |
| **Non rigenerare ciò che esiste** | La leva più grande di tutte: riusare open source invece di generare da zero | [@ 00:31:39](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1899s) |

La curva da spingere in basso è quella **token/complessità**: stai sotto la soglia
e usa modelli più economici sotto di essa.

## Le skill: tre assi diversi dello stesso problema

Non sono trucchi, sono tre punti d'attacco distinti
([@ 01:00:05](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3605s)):

- **[caveman](https://skills.sh/)** → comprime l'**output** finale.
- **ponytail** → riduce il **codice** scritto. Meno codice = meno da generare e
  mantenere: il codice in eccesso è debito anche per gli agenti.
- **headroom** → comprime il **contesto** locale.

E la regola che ripeto sempre:

> Generalizza quando vedi l'occasione, non prima. La generalizzazione prematura è
> debito — per gli umani e per gli agenti.
> — [@ 01:03:29](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3809s)

## Il modo opposto di sbagliare: *tokenmaxxing*

Nella chat dev è nato il termine: collezionare API key e abbonamenti
([DeepSeek](https://www.deepseek.com/), Kimi,
[OpenAI](https://openai.com/), [Mistral](https://mistral.ai/) da un lato;
[Cursor](https://cursor.com/), [Claude Code](https://claude.com/claude-code),
[Codex](https://openai.com/codex/), opencode dall'altro) senza riuscire a
saturarne nemmeno uno. FOMO travestita da strategia: i crediti restano inutilizzati
mentre si rincorre il rilascio successivo.

## Take-away

**Prima di cambiare modello per risparmiare, misura quanti token spende quello che
usi già per finire _un_ task reale.** Nella mia esperienza la risposta punta ai
tuoi prompt, non al tuo provider.

---

## Riferimenti

Ogni link apre il video al secondo esatto.

| # | Momento | Fonte |
|---|---|---|
| 1 | Lento + inefficiente = costoso, in usage e in token | [_tx5HibNMW4 @ 00:02:18](https://www.youtube.com/watch?v=_tx5HibNMW4&t=138s) |
| 2 | Consuma meno per token ma tanti di più: peggio di Opus | [_tx5HibNMW4 @ 00:02:24](https://www.youtube.com/watch?v=_tx5HibNMW4&t=144s) |
| 3 | 15 subagent su un refactor, oltre 1M token | [_tx5HibNMW4 @ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s) |
| 4 | Fable ha bruciato una finestra da 5 ore in ~1 | [UwMhqq9Evxk @ 00:43:57](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2637s) |
| 5 | GPT-5.5 notevolmente più token-efficient | [UwMhqq9Evxk @ 02:06:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7569s) |
| 6 | Effort + delega invece di maxare sempre | [LIvW0-c-kUI @ 00:05:26](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=326s) |
| 7 | Effort `high`: chiude senza iterare, token bassi | [LIvW0-c-kUI @ 00:32:47](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=1967s) |
| 8 | Spingi giù la curva token/complessità | [6JAmrUIjDM0 @ 00:31:39](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1899s) |
| 9 | Fable orchestra Opus/Sonnet: costa e brucia in fretta | [6JAmrUIjDM0 @ 01:04:46](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=3886s) |
| 10 | Su task non difficili mangia più di Opus | [6JAmrUIjDM0 @ 01:59:24](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=7164s) |
| 11 | caveman / ponytail / headroom: tre assi di risparmio | [ubpckz1sTLY @ 01:00:05](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3605s) |
| 12 | Generalizza quando vedi l'occasione, non prima | [ubpckz1sTLY @ 01:03:29](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3809s) |

Fonti nel wiki di [Channeling](https://channeling.davideghiotto.it/):
`topics/token-efficiency`, `topics/effort-levels`, `topics/context-management`.

---

## LinkedIn cut

Ogni confronto tra modelli mette in fila il prezzo per milione di token. Quel
numero non è quello che paghi.

Quello che paghi sono i token totali per task completato.

Sonnet 5 costa meno per token di Opus. Su un refactor ha aperto 15 subagent per
esplorare il codebase e non è riuscito a fermarsi: contesto saturo, compaction a
ripetizione, oltre un milione di token. Più lento e più caro del modello
"costoso" che stavo evitando per risparmiare.

Vale anche al contrario: Fable 5 con 3-4 istanze in parallelo mi ha bruciato una
finestra da 5 ore in una. Su task non davvero difficili mangia più di Opus.

Le tre leve che uso, in ordine di impatto:

→ Non rigenerare ciò che esiste già (riusare open source)
→ Delegare per complessità: lavoro difficile al modello potente, standard a quello
economico
→ Effort "high", non "max": rendimenti decrescenti che paghi e non vedi

E la regola che ripeto sempre: generalizza quando vedi l'occasione, non prima. La
generalizzazione prematura è debito tecnico — per gli umani e per gli agenti.

Prima di cambiare modello per risparmiare, misura quanto spende quello che usi già
per finire UN task reale. La risposta punta ai tuoi prompt, non al tuo provider.

Tutti i momenti citati sono linkati al secondo nel post completo 👇

---

## EN — short version

Every model comparison lines up the price per million tokens. That number is not
what you pay. **What you pay is total tokens burned per completed task.**

[Sonnet 5](https://www.anthropic.com/claude) is cheaper per token than Opus. On one
[Drizzle](https://orm.drizzle.team/) refactor it spawned 15 subagents to explore the
codebase and couldn't stop itself: saturated context, repeated compactions, past a
million tokens. Slower *and* more expensive than the "expensive" model I was
avoiding to save money.

It cuts the other way too. Fable 5, running 3–4 instances in parallel, burned a
5-hour usage window in about one — it orchestrates executors that consume on their
own, so on tasks that aren't genuinely hard it eats far more than Opus. Reserve it.

Three levers, in order of impact: **don't regenerate what already exists** (reuse
open source), **delegate by complexity** (hard work to the strong model, standard
work to the cheap one), and **effort `high`, not `max`** — the top tier has
diminishing returns you pay for and never see. On top of those, three skills each
hitting a different axis: `caveman` compresses the output, `ponytail` cuts the
amount of code written, `headroom` compresses the context.

And the rule I repeat most: generalize when you see the occasion, not before.
Premature generalization is debt for humans and agents alike.

Before switching models to save money, measure what your current one spends
finishing *one* real task. The answer points at your prompts, not your provider.

---

## Entry for content.ts

```ts
{
  title: {
    en: "The cost is not the price of a token",
    it: "Il costo non è il prezzo del token",
  },
  excerpt: {
    en: "Sonnet 5 is cheaper per token and still cost me more: 15 subagents, a saturated context, a million tokens. What I measure instead.",
    it: "Sonnet 5 costa meno per token e mi è costato di più: 15 subagent, contesto saturo, un milione di token. Cosa misuro al suo posto.",
  },
  date: "TBD",
  platform: "linkedin",
  link: "TBD",
}
```
