Pubblico quanto guadagno. Non una forbice, non "commisurato all'esperienza": la RAL
lorda, più ogni aumento dalla prima offerta del 2019. Sta su [/ral](/ral).

La trasparenza totale è facile da dichiarare e costa niente da simulare. Lo stipendio è
il numero che la mette alla prova, perché è quello che tutti sono addestrati a
nascondere.

## Perché ora: la legge si è mossa prima

La [direttiva (UE) 2023/970](https://eur-lex.europa.eu/eli/dir/2023/970/oj) sulla
trasparenza retributiva andava recepita entro il **7 giugno 2026**. L'Italia l'ha fatto
con il **D.Lgs. 7 maggio 2026, n. 96**, in vigore da quella data. Tre cose sono
cambiate, per datori di lavoro di qualsiasi dimensione:

| Prima | Adesso |
|---|---|
| Annunci con "retribuzione commisurata all'esperienza" | Livello o fascia retributiva vanno dichiarati **prima** del colloquio |
| "Quanto prendi oggi?" apriva ogni call | Chiedere al candidato la **retribuzione pregressa è vietato** |
| Clausole di riservatezza sulla busta paga | Nulle: nessuno può impedirti di parlare della tua retribuzione |

Aggiungi gli obblighi di comunicazione (divari retributivi dai 100 dipendenti,
valutazione congiunta obbligatoria oltre il 5% di gap non giustificato) e la direzione è
una sola: **l'opacità retributiva sta venendo abolita per legge.** Pubblicare la mia RAL
non è più attivismo. È conformarsi in anticipo alla normalità di domani.

E l'asimmetria non è mai stata neutra. L'azienda conosce tutta la banda. Il candidato
conosce una voce di corridoio. Chi indovina per primo, perde.

## Come funziona la pagina

Gli screenshot qui sotto usano **cifre di esempio** — quelle vere esistono solo dietro
il gate.

Bloccata di default. La traiettoria si vede, le aziende si vedono, gli importi no.

![Il grafico della RAL prima dello sblocco: bande aziendali visibili, cifre offuscate](/ral-shot-locked.avif)

Un passo per aprirla: una email vera, un codice monouso.

![Il gate di accesso che chiede una email di lavoro prima di inviare il codice](/ral-shot-gate.avif)

Verificato, e i numeri compaiono — con un orologio visibile: un'ora di sessione.

![Statistiche sbloccate: RAL attuale, crescita totale, multiplo e countdown di scadenza](/ral-shot-unlocked.avif)

Poi tutto lo storico: ogni aumento, datato, colorato per azienda.

![Il grafico sbloccato con ogni step di RAL e le card per azienda sotto](/ral-shot-chart.avif)

## Le regole che ci ho messo dentro

- **Gli importi non arrivano mai al browser.** Il bundle porta aziende e date. Le cifre
  vivono solo in `ral-gate`, un piccolo servizio che risponde dopo la verifica.
- **Fail-closed.** Servizio giù, token scaduto, env sbagliata: la pagina resta bloccata.
  Mai il contrario.
- **Un'ora.** Gli sblocchi scadono lato server; il countdown è a schermo, non nascosto.
- **Solo mailbox reali.** I domini usa-e-getta vengono rifiutati sulla forma, sulla
  blocklist e sull'host MX — il livello che becca i temp-mail registrati ieri.
- **Simmetria.** Io vedo chi ha chiesto: indirizzo, dominio, orario. Tu vedi la mia RAL.
  Scambio giusto.

Trasparenza non è rinunciare al potere contrattuale. È smettere di fingere di non averne.
