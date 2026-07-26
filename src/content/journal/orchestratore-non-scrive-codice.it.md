L'errore che ho fatto per primo: prendere il modello più forte e usarlo per tutto.
Orchestra, decide, scrive, corregge. Sembra la scelta ovvia — è il più capace — ed è il
modo più rapido per bruciare una finestra di utilizzo.

## Il pattern: delega vera

| Ruolo | Chi | Cosa fa |
|---|---|---|
| **Orchestratore** | Fable | Pianifica, spezza, dispaccia. **Non esegue mai** |
| **Executor pesante** | [GPT-5.6 Codex](https://openai.com/codex/) | Il lavoro grosso, in subagent isolati |
| **Executor economico** | [Grok 4.5](https://grok.com/) via [Cursor](https://cursor.com/) | UI standard ed estetica |

> Fable resta **strettamente** orchestratore: pianifica e dispaccia, non esegue.
> L'esecuzione va a subagent isolati su modelli più economici.
> — [live @ 00:39:12](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2352s)

Il criterio è la **complessità**, non il budget: lavoro complesso al modello potente,
lavoro semplice a quello che costa meno — esattamente come deleghi con le persone
([@ 00:35:31](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2131s)). Il modello caro
resta orchestratore e advisor
([@ 02:23:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8611s)).

Due dettagli che sembrano pedanti e non lo sono:

1. **Scrivi il nome del modello esattamente** — "GPT 5.6" — nell'istruzione di
   dispatch, altrimenti l'orchestratore ne prende un altro
   ([@ 00:39:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2371s)).
2. **Lascia che scelga l'effort per task.** Fissare deterministicamente un modello per
   ogni tipo di subagent — come fanno alcuni default — non lo voglio: chi conosce il
   task scelga la potenza
   ([@ 01:07:15](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4035s)).

## La parte controintuitiva

> Dare a ogni task un subagent con **contesto isolato** consuma **più token grezzi** in
> totale. E costa **meno**.
> — [@ 01:10:55](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4255s)

Il motivo è tutto nella compaction. Ogni subagent resta su uno scope piccolo e riporta
indietro **solo il risultato**: il thread principale non si riempie mai, quindi non
entri nel ciclo costoso delle compaction — che sono lossy, perdono informazione e,
quando il contesto si stringe troppo, bloccano il lavoro complesso.

**Meno compaction e focus più stretto battono il conteggio grezzo dei token**
([@ 01:11:11](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4271s)).

Il corollario da tenere a mente:

> Il contesto che vedi non è la spesa. Il main thread può sembrare tranquillo mentre
> sotto i subagent bruciano credito.
> — [@ 00:54:44](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3284s)

Per questo serve una **status line** che mostri contesto e limiti (5 ore, 7 giorni) per
chat ([@ 02:02:20](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=7340s)).

## Sapere quando fermarsi

La qualità che sottovalutavo in un orchestratore non è la capacità: è
l'**autocontrollo**.

> Su un refactor [Drizzle](https://orm.drizzle.team/), Sonnet 5 ha aperto **15
> subagent** per esplorare il codebase e non è riuscito a fermarsi: oltre un milione di
> token. — [@ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s)

Nessuna di quelle esplorazioni era sbagliata in sé. Il problema era non decidere che
bastava ([@ 00:02:39](https://www.youtube.com/watch?v=_tx5HibNMW4&t=159s)).

**Un buon orchestratore è quello che chiude presto, non quello che apre molto.**

## Un trucco per il contesto sul codebase

Mettere `/graphify update` nel `CLAUDE.md` fa sì che l'agente aggiorni la mappa del repo
alla fine di ogni task: al task successivo naviga il grafo esistente invece di
ricostruire il contesto da zero
([@ 00:12:52](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=772s)).

È lo stesso principio dietro [Channeling](https://channeling.davideghiotto.it/):
indicizza una volta, poi interroga.

## Se stai iniziando: non farlo

Questa è roba da dopo.

> I subagent sono un'ottimizzazione avanzata: padroneggia **un** tool prima di pensare a
> orchestrare. — [@ 00:03:54](https://www.youtube.com/watch?v=i5Yqx-ZIwjQ&t=234s)

Nota operativa per quando ci arrivi: con 3–4 istanze in parallelo **evita i git
worktree**, così gli agenti non si pestano i file a vicenda
([@ 00:44:21](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2661s)). Ma sono problemi che
ha senso avere solo quando il resto funziona già.

## Riferimenti

| Momento | Fonte |
|---|---|
| Fable solo orchestratore; esecuzione a Codex/Grok | [@ 00:39:12](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2352s) |
| «I subagent di esecuzione usino Codex CLI con GPT-5.6» | [@ 00:39:19](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2359s) |
| Scrivi il nome del modello esattamente | [@ 00:39:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2371s) |
| Il pinning deterministico per subagent non è desiderabile | [@ 01:07:15](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4035s) |
| Contesti isolati: più token grezzi, meno costo totale | [@ 01:10:55](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4255s) |
| Evitano la compaction e restano focalizzati | [@ 01:11:11](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4271s) |
| UI standard ai subagent economici; il costoso resta advisor | [@ 02:23:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8611s) |
| Fable orchestratore, edit espliciti agli executor | [@ 00:33:26](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2006s) |
| Delega come nella vita reale: complessità → potenza | [@ 00:35:31](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2131s) |
| Fan-out: 5 agenti Opus 4.8 a budget max, ~30k token | [@ 02:06:32](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=7592s) |
| 15 subagent su un refactor, oltre 1M token | [@ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s) |
| «Non sa quando fermarsi»: difetto di orchestrazione | [@ 00:02:39](https://www.youtube.com/watch?v=_tx5HibNMW4&t=159s) |
| Il contesto del main thread non è il token consumato | [@ 00:54:44](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3284s) |
| Contesto piccolo → compaction lossy | [@ 00:55:52](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3352s) |
| 3–4 istanze in parallelo, senza worktree | [@ 00:44:21](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2661s) |
| `/graphify update` nel CLAUDE.md per non ricostruire il contesto | [@ 00:12:52](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=772s) |
| I subagent sono ottimizzazione avanzata: prima un tool solo | [@ 00:03:54](https://www.youtube.com/watch?v=i5Yqx-ZIwjQ&t=234s) |

Le fonti sono indicizzate in [Channeling](https://channeling.davideghiotto.it/):
`topics/agentic-orchestration`, `topics/model-delegation`, `topics/context-management`.
