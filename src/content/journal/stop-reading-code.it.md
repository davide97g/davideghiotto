La provocazione è nel titolo, ma non significa fare deploy alla cieca. Significa
smettere di confondere la lettura di ogni riga con il controllo del lavoro.

Quando un agente aggiunge, sposta o cancella migliaia di righe, la review manuale
diventa il collo di bottiglia. Più cresce la modifica, più chi legge si concentra sul
dettaglio e perde il contesto globale
([video @ 00:07:32](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=452s)).

| Review riga per riga | Review dell'output |
|---|---|
| Cerca difetti locali | Verifica requisiti e comportamento |
| Scala con le righe cambiate | Scala con i casi d'uso |
| Il codice è la prova | Test e osservazioni sono la prova |

## Il codice è un mezzo

Il risultato non è una funzione elegante. È una funzionalità corretta per chi la usa.
Molti bug non nascono dalla sintassi: nascono da un requisito perso, un caso d'uso
mancante o un passaggio di consegne incompleto. Anche codice perfetto può costruire il
prodotto sbagliato
([@ 00:04:34](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=274s)).

Per questo sposto la review dall'output intermedio all'output reale. Controllo il
comportamento nel browser, gli stati limite, performance, sicurezza e aderenza al
requisito. Il codice resta disponibile quando serve investigare; non è più la prima e
unica interfaccia di verifica.

Questo non vale allo stesso modo ovunque. Software medicale, pagamenti, autenticazione
e migrazioni distruttive richiedono più evidenze e più controllo umano. Ma “più
controllo” non deve significare soltanto “più righe lette”. Deve significare una
strategia di validazione proporzionata al rischio.

| Contesto | Controllo minimo |
|---|---|
| UI ordinaria | Test nel browser, accessibilità, visual diff |
| API e dati | Contract test, invarianti, rollback |
| Auth, pagamenti, safety | Threat model, test indipendenti, review umana mirata |

## Verificare con altro codice

La capacità generativa che produce la feature può produrre anche il suo contorno di
controllo: unit test, end-to-end, analisi statica, penetration test, load test e
strumenti di debug. Nel video propongo una pipeline che combina questi segnali con test
manuali mirati per ogni use case
([@ 00:08:42](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=522s)).

Anche la PR può essere letta prima da un modello: sintesi dei cambiamenti, aree a
rischio, invarianti rotte, file che meritano davvero attenzione
([@ 00:07:55](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=475s)). La review umana non
scompare. Sale di livello: decide cosa deve essere vero e valuta le prove.

Il nuovo lavoro del developer copre l'intera catena: capire il requisito, dirigere la
generazione, costruire i controlli, provare il prodotto, osservare il rilascio. È meno
digitazione, più responsabilità. Per me è anche più divertente: il codice è sempre
stato il mezzo, non il fine
([@ 00:09:26](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=566s)).

## Riferimenti e risorse

- [Video completo: “stop reading code”](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=0s)
- [Theo — “You're reading way too much code”](https://www.youtube.com/watch?v=434cG4g5KLE&t=0s),
  l'ispirazione citata nella descrizione
- [Discussione Hacker News sul post di Uncle Bob Martin](https://news.ycombinator.com/item?id=49074693),
  “My current strategy is to not read any of the code written by my agents”
- Tool nominati nella descrizione: [Claude Code](https://claude.com/product/claude-code),
  [Cursor](https://cursor.com/) e [Codex](https://openai.com/codex/)

> Non smettere di capire il software. Smetti di usare la quantità di codice letto come
> misura della qualità del controllo.
