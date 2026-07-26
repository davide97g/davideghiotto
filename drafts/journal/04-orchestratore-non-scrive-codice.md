---
title: L'orchestratore non scrive codice
platform: linkedin
status: draft
date: TBD
topic: agentic-orchestration (17) + context-management (13) + model-delegation (8)
hero: https://i.ytimg.com/vi/LIvW0-c-kUI/hqdefault.jpg
tags: [agents, orchestration, context, claude-code, codex]
---

# L'orchestratore non scrive codice

[![Costruiamo un Personal Knowledge System con Fable](https://i.ytimg.com/vi/LIvW0-c-kUI/hqdefault.jpg)](https://www.youtube.com/watch?v=LIvW0-c-kUI)

*Dalle live [«Personal Knowledge System con Fable»](https://www.youtube.com/watch?v=LIvW0-c-kUI) e [«Fable+Sol = Sharp»](https://www.youtube.com/watch?v=qYqGsOKy40w).*

L'errore che ho fatto per primo: prendere il modello più forte e usarlo per tutto.
Orchestra, decide, scrive, corregge. Sembra la scelta ovvia — è il più capace — ed è
il modo più rapido per bruciare una finestra di utilizzo.

## Il pattern: delega vera

| Ruolo | Chi | Cosa fa |
|---|---|---|
| **Orchestratore** | Fable | Pianifica, spezza, dispaccia. **Non esegue mai** |
| **Executor pesante** | [GPT-5.6 Codex](https://openai.com/codex/) | Il lavoro grosso, in subagent isolati |
| **Executor economico** | [Grok 4.5](https://grok.com/) via [Cursor](https://cursor.com/) | UI standard ed estetica |

> Fable resta **strettamente** orchestratore: pianifica e dispaccia, non esegue.
> L'esecuzione va a subagent isolati su modelli più economici.
> — [@ 00:39:12](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2352s)

Il criterio è la **complessità**, non il budget: lavoro complesso al modello
potente, lavoro semplice a quello che costa meno — esattamente come deleghi con le
persone
([@ 00:35:31](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2131s)). Il modello caro
resta orchestratore e advisor
([@ 02:23:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8611s)).

Due dettagli che sembrano pedanti e non lo sono:

1. **Scrivi il nome del modello esattamente** — "GPT 5.6" — nell'istruzione di
   dispatch, altrimenti l'orchestratore ne prende un altro
   ([@ 00:39:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2371s)).
2. **Lascia che scelga l'effort per task.** Fissare deterministicamente un modello
   per ogni tipo di subagent — come fanno alcuni default — non lo voglio: chi
   conosce il task scelga la potenza
   ([@ 01:07:15](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4035s)).

## La parte controintuitiva

> Dare a ogni task un subagent con **contesto isolato** consuma **più token
> grezzi** in totale. E costa **meno**.
> — [@ 01:10:55](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4255s)

Il motivo è tutto nella compaction. Ogni subagent resta su uno scope piccolo e
riporta indietro **solo il risultato**: il thread principale non si riempie mai,
quindi non entri nel ciclo costoso delle compaction — che sono lossy, perdono
informazione e, quando il contesto si stringe troppo, bloccano il lavoro complesso.

**Meno compaction e focus più stretto battono il conteggio grezzo dei token**
([@ 01:11:11](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4271s)).

Il corollario da tenere a mente:

> Il contesto che vedi non è la spesa. Il main thread può sembrare tranquillo
> mentre sotto i subagent bruciano credito.
> — [@ 00:54:44](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3284s)

Per questo serve una **status line** che mostri contesto e limiti (5 ore, 7 giorni)
per chat ([@ 02:02:20](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=7340s)).

## Sapere quando fermarsi

La qualità che sottovalutavo in un orchestratore non è la capacità: è
l'**autocontrollo**.

> Su un refactor [Drizzle](https://orm.drizzle.team/), Sonnet 5 ha aperto **15
> subagent** per esplorare il codebase e non è riuscito a fermarsi: oltre un
> milione di token.
> — [@ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s)

Nessuna di quelle esplorazioni era sbagliata in sé. Il problema era non decidere che
bastava
([@ 00:02:39](https://www.youtube.com/watch?v=_tx5HibNMW4&t=159s)).

**Un buon orchestratore è quello che chiude presto, non quello che apre molto.**

## Un trucco per il contesto sul codebase

Mettere `/graphify update` nel `CLAUDE.md` fa sì che l'agente aggiorni la mappa del
repo alla fine di ogni task: al task successivo naviga il grafo esistente invece di
ricostruire il contesto da zero
([@ 00:12:52](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=772s)).

È lo stesso principio dietro [Channeling](https://channeling.davideghiotto.it/):
indicizza una volta, poi interroga.

![Channeling — risposta con citazioni e grafo della conoscenza](https://davideghiotto.it/shot-channeling.avif)

## Se stai iniziando: non farlo

Questa è roba da dopo.

> I subagent sono un'ottimizzazione avanzata: padroneggia **un** tool prima di
> pensare a orchestrare.
> — [@ 00:03:54](https://www.youtube.com/watch?v=i5Yqx-ZIwjQ&t=234s)

Nota operativa per quando ci arrivi: con 3–4 istanze in parallelo **evita i git
worktree**, così gli agenti non si pestano i file a vicenda
([@ 00:44:21](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2661s)). Ma sono problemi
che ha senso avere solo quando il resto funziona già.

---

## Riferimenti

| # | Momento | Fonte |
|---|---|---|
| 1 | Fable solo orchestratore; esecuzione a Codex/Grok | [qYqGsOKy40w @ 00:39:12](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2352s) |
| 2 | «I subagent di esecuzione usino Codex CLI con GPT-5.6» | [qYqGsOKy40w @ 00:39:19](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2359s) |
| 3 | Scrivi il nome del modello esattamente | [qYqGsOKy40w @ 00:39:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2371s) |
| 4 | Il pinning deterministico per subagent non è desiderabile | [qYqGsOKy40w @ 01:07:15](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4035s) |
| 5 | Contesti isolati: più token grezzi, meno costo totale | [qYqGsOKy40w @ 01:10:55](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4255s) |
| 6 | Evitano la compaction e restano focalizzati | [qYqGsOKy40w @ 01:11:11](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4271s) |
| 7 | UI standard ai subagent economici; il costoso resta advisor | [qYqGsOKy40w @ 02:23:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8611s) |
| 8 | Fable orchestratore, edit espliciti agli executor | [LIvW0-c-kUI @ 00:33:26](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2006s) |
| 9 | Delega come nella vita reale: complessità → potenza | [LIvW0-c-kUI @ 00:35:31](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2131s) |
| 10 | Fan-out: 5 agenti Opus 4.8 a budget max, ~30k token | [LIvW0-c-kUI @ 02:06:32](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=7592s) |
| 11 | 15 subagent su un refactor, oltre 1M token | [_tx5HibNMW4 @ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s) |
| 12 | «Non sa quando fermarsi»: difetto di orchestrazione | [_tx5HibNMW4 @ 00:02:39](https://www.youtube.com/watch?v=_tx5HibNMW4&t=159s) |
| 13 | Il contesto del main thread ≠ token consumati | [UwMhqq9Evxk @ 00:54:44](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3284s) |
| 14 | Contesto piccolo → compaction lossy | [UwMhqq9Evxk @ 00:55:52](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3352s) |
| 15 | 3–4 istanze in parallelo, senza worktree | [UwMhqq9Evxk @ 00:44:21](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2661s) |
| 16 | `/graphify update` nel CLAUDE.md per non ricostruire il contesto | [6JAmrUIjDM0 @ 00:12:52](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=772s) |
| 17 | I subagent sono ottimizzazione avanzata: prima un tool solo | [i5Yqx-ZIwjQ @ 00:03:54](https://www.youtube.com/watch?v=i5Yqx-ZIwjQ&t=234s) |

Fonti nel wiki di [Channeling](https://channeling.davideghiotto.it/):
`topics/agentic-orchestration`, `topics/model-delegation`, `topics/context-management`.

---

## LinkedIn cut

L'errore che ho fatto per primo: prendere il modello più forte e usarlo per tutto.
Orchestra, decide, scrive, corregge. Sembra ovvio — è il più capace — ed è il modo
più rapido per bruciare una finestra di utilizzo.

Il pattern che uso ora è delega vera:

→ Fable orchestra e dispaccia. Solo. Non esegue mai.
→ GPT-5.6 Codex fa il lavoro pesante, in subagent isolati.
→ Grok 4.5 prende la UI standard ed estetica.

Il criterio è la complessità, non il budget. Il modello caro resta orchestratore e
advisor.

E qui la parte controintuitiva: dare a ogni task un subagent con contesto ISOLATO
consuma più token grezzi in totale — e costa meno.

Il motivo è la compaction. Ogni subagent resta su uno scope piccolo e riporta solo
il risultato, quindi il thread principale non si riempie mai e non entri nel ciclo
delle compaction — che perdono informazione e, quando il contesto si stringe
troppo, bloccano il lavoro complesso.

Corollario che vale da solo: il contesto che vedi non è la spesa. Il main thread
sembra tranquillo mentre sotto i subagent bruciano credito.

Ultima cosa, la qualità che sottovalutavo di più in un orchestratore: non è la
capacità, è l'autocontrollo. Su un refactor, Sonnet 5 ha aperto 15 subagent e non
è riuscito a fermarsi — oltre un milione di token. Nessuna esplorazione sbagliata
in sé: mancava la decisione che bastava.

Un buon orchestratore è quello che chiude presto, non quello che apre molto.

---

## EN — short version

My first mistake was taking the strongest model and using it for everything:
orchestrate, decide, write, fix. It looks obvious — it's the most capable — and
it's the fastest way to burn a usage window.

The pattern now is real delegation. **Fable orchestrates and dispatches, only
that.** [GPT-5.6 Codex](https://openai.com/codex/) does the heavy execution in
isolated subagents. [Grok 4.5](https://grok.com/) takes standard and aesthetic UI
work. The routing key is complexity, not budget; the expensive model stays
orchestrator and advisor. Two details that matter more than they look: write the
model name exactly in the dispatch instruction, and let the orchestrator pick
effort per task instead of pinning a model per subagent type.

The counterintuitive part: giving every task an **isolated context** burns more raw
tokens overall and still costs less. Each subagent stays on a small scope and
reports only its result, so the main thread never fills up and you never enter the
expensive, lossy compaction cycle. And the context you watch is not the spend — the
main thread can look calm while subagents burn credit underneath.

The quality I underrated most in an orchestrator isn't capability, it's
self-restraint. Sonnet 5 spawned 15 subagents on one refactor and couldn't stop:
past a million tokens. A good orchestrator closes early rather than opening a lot.

---

## Entry for content.ts

```ts
{
  title: {
    en: "The orchestrator doesn't write code",
    it: "L'orchestratore non scrive codice",
  },
  excerpt: {
    en: "Fable plans and dispatches, Codex executes, Grok takes the routine UI. Isolated subagents burn more raw tokens and cost less — here's why.",
    it: "Fable pianifica e dispaccia, Codex esegue, Grok prende la UI di routine. I subagent isolati bruciano più token grezzi e costano meno: ecco perché.",
  },
  date: "TBD",
  platform: "linkedin",
  link: "TBD",
}
```
