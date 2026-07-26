Ogni confronto tra modelli che leggo mette i prezzi in fila: questo costa X per
milione di token, quello costa Y. Poi si sceglie il numero più basso e ci si stupisce
quando la fattura sale.

Il numero sulla pagina dei prezzi non è quello che paghi.

> Quello che paghi sono i **token totali bruciati per task completato**, non il prezzo
> per token. — [live @ 00:02:18](https://www.youtube.com/watch?v=_tx5HibNMW4&t=138s)

## Il caso che me l'ha dimostrato

Sonnet 5 costa meno per token di Opus. Su un refactor
[Drizzle](https://orm.drizzle.team/) ha aperto **15 subagent** per esplorare il
codebase e non è riuscito a fermarsi: contesto saturato, compaction a ripetizione,
oltre un milione di token.

> Consuma meno per token, ma ne consuma così tanti in più che finisce per essere
> peggio di Opus. — [live @ 00:02:24](https://www.youtube.com/watch?v=_tx5HibNMW4&t=144s)

Più lento **e** più caro del modello "costoso" che stavo evitando per risparmiare.
Sapere quando fermarsi è una qualità dell'orchestratore tanto quanto la capacità
grezza.

Il rovescio vale anche in alto. Fable 5 con 3–4 istanze in parallelo mi ha saturato
una finestra da 5 ore in circa **una**
([@ 00:43:57](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2637s)). Potentissimo e
vorace: orchestra executor che a loro volta consumano, quindi su task non davvero
difficili mangia molto più di Opus
([@ 01:59:24](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=7164s)). Va tenuto per
quando serve. GPT-5.5, per confronto, è notevolmente più efficiente
([@ 02:06:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7569s)).

## Le tre leve che uso

| Leva | Cosa cambia |
|---|---|
| **Effort giusto, non massimo** | Un modello intelligente a effort `high` chiude senza iterare, quindi consuma poco. `Max` ha rendimenti decrescenti |
| **Delegare per complessità** | Lavoro complesso al modello potente, standard a quello economico. Come deleghi con le persone |
| **Non rigenerare ciò che esiste** | La leva più grande di tutte: riusare open source invece di generare da zero |

La curva da spingere in basso è quella **token/complessità**: stai sotto la soglia e
usa modelli più economici sotto di essa
([@ 00:31:39](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1899s)).

## Le skill: tre assi diversi dello stesso problema

Non sono trucchi, sono tre punti d'attacco distinti
([@ 01:00:05](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3605s)):

- **caveman** → comprime l'**output** finale.
- **ponytail** → riduce il **codice** scritto. Meno codice = meno da generare e
  mantenere: il codice in eccesso è debito anche per gli agenti.
- **headroom** → comprime il **contesto** locale.

E la regola che ripeto sempre:

> Generalizza quando vedi l'occasione, non prima. La generalizzazione prematura è
> debito — per gli umani e per gli agenti.
> — [@ 01:03:29](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3809s)

## Il modo opposto di sbagliare: *tokenmaxxing*

Nella chat dev è nato il termine: collezionare API key e abbonamenti
([DeepSeek](https://www.deepseek.com/), Kimi, [OpenAI](https://openai.com/),
[Mistral](https://mistral.ai/) da un lato; [Cursor](https://cursor.com/),
[Claude Code](https://claude.com/claude-code), [Codex](https://openai.com/codex/),
opencode dall'altro) senza riuscire a saturarne nemmeno uno. FOMO travestita da
strategia: i crediti restano inutilizzati mentre si rincorre il rilascio successivo.

## Take-away

**Prima di cambiare modello per risparmiare, misura quanti token spende quello che
usi già per finire _un_ task reale.** Nella mia esperienza la risposta punta ai tuoi
prompt, non al tuo provider.

## Riferimenti

Ogni link apre il video al secondo esatto.

| Momento | Fonte |
|---|---|
| Lento + inefficiente = costoso, in usage e in token | [@ 00:02:18](https://www.youtube.com/watch?v=_tx5HibNMW4&t=138s) |
| Consuma meno per token ma tanti di più: peggio di Opus | [@ 00:02:24](https://www.youtube.com/watch?v=_tx5HibNMW4&t=144s) |
| 15 subagent su un refactor, oltre 1M token | [@ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s) |
| Fable ha bruciato una finestra da 5 ore in ~1 | [@ 00:43:57](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2637s) |
| GPT-5.5 notevolmente più token-efficient | [@ 02:06:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7569s) |
| Effort + delega invece di maxare sempre | [@ 00:05:26](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=326s) |
| Effort `high`: chiude senza iterare, token bassi | [@ 00:32:47](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=1967s) |
| Spingi giù la curva token/complessità | [@ 00:31:39](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1899s) |
| Fable orchestra Opus/Sonnet: costa e brucia in fretta | [@ 01:04:46](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=3886s) |
| Su task non difficili mangia più di Opus | [@ 01:59:24](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=7164s) |
| caveman / ponytail / headroom: tre assi di risparmio | [@ 01:00:05](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3605s) |
| Generalizza quando vedi l'occasione, non prima | [@ 01:03:29](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3809s) |

Le fonti sono indicizzate in [Channeling](https://channeling.davideghiotto.it/):
`topics/token-efficiency`, `topics/effort-levels`, `topics/context-management`.
