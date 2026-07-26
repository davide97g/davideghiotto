È la lezione che ripeto più spesso, ed è anche quella che mi ha fatto risparmiare più
tempo e più token.

> Generare **da zero** produce slop e costa il massimo. Parti da qualcosa che esiste,
> stabile e fatto bene, e poi allontanati da lì: il salto di qualità è enorme.
> — [live @ 00:42:59](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2579s)

## Vale su ogni media

| Dominio | Da zero | Con reference |
|---|---|---|
| **3D** | prompt → modello generico | parti da asset open esistenti |
| **Immagini** | output standard | una reference vera cambia tutto ([Mobbin](https://mobbin.com/), [Pinterest](https://pinterest.com/)) |
| **Video** | inconsistente tra i frame | fornisci i **keyframe**, il modello riempie i buchi |
| **UI** | slop pulito ma anonimo | stessa immagine di reference a ogni tool |

Sul video il punto è netto: devi dare le immagini chiave e lasciare che il modello
riempia i buchi, perché da un prompt non riesce a restare consistente
([@ 01:22:10](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4930s)). Sulla UI, nello
shootout tra tool di vibecoding ho dato a ognuno la stessa immagine di reference: è il
modo più economico di comunicare un'estetica senza descriverla a parole
([@ 00:02:30](https://www.youtube.com/watch?v=NTtPD1Olpwo&t=150s)).

Le skill tipo `frontend-design` aiutano a "de-sloppare" perché fanno le domande giuste
— ma sono **enhancer**. La reference è la leva
([@ 01:20:37](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4837s)).

## Da reference visive a codebase intere

Con [sharp](https://sharp.davideghiotto.it/) ho portato il principio un livello più
su: non immagini, ma **prodotti open source interi**.

- **[Affine](https://affine.pro/)** → il backend [Rust](https://www.rust-lang.org/) preso in blocco
- **[AppFlowy](https://appflowy.io/)** → i documenti collaborativi
- **[tldraw](https://tldraw.dev/)** → il canvas infinito

> Riusare e ricomporre prodotti open source esistenti invece di reinventare la ruota —
> **vale anche con gli agenti**.
> — [@ 00:30:47](https://www.youtube.com/watch?v=qYqGsOKy40w&t=1847s)

Il risultato: l'infrastruttura real-time e multi-utente di un rimpiazzo di
Slack + Notion + Miro assemblata **in una sola sessione live**
([@ 02:20:45](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8445s)).

E la parte onesta, quella che vale più della demo:

> L'infrastruttura audio/video real-time ha funzionato meglio del previsto al primo
> colpo. La parte difficile e ancora incompiuta è la **UI/UX**, non la tecnologia
> sotto. — [@ 02:19:00](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8340s)

Sul lato costi è stato anche il **singolo risparmio più grande** della sessione: non
paghi token per rigenerare ciò che esiste già
([@ 00:14:02](https://www.youtube.com/watch?v=qYqGsOKy40w&t=842s)).

## Due dettagli operativi

**1. Parti da basso dettaglio.** Dai le reference, chiedi una versione grezza, poi
alza il dettaglio incrementalmente
([@ 00:55:43](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3343s)).

**2. Rifiuta il questionario.**

> «Non farmi troppe domande, inizia e poi costruiamo incrementalmente con il
> feedback.» — [@ 00:56:11](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3371s)

Le venti domande di chiarimento in apertura sono token spesi per informazioni che
avresti dato comunque al primo giro di feedback.

## Il caso limite: fare da reference a te stesso

Una cosa che ho iniziato a fare durante le live: **seminare parole chiave nel
transcript mentre parlo**, così che dopo i miei tool possano cercare quel transcript e
trovare da soli il momento esatto da clippare
([@ 00:49:19](https://www.youtube.com/watch?v=ubpckz1sTLY&t=2959s)).

Sto piantando ancore in anticipo invece di far scansionare tutto alla cieca. È anche
il motivo per cui esiste [Channeling](https://channeling.davideghiotto.it/), l'archivio
che indicizza quello che guardo con citazione al secondo.

**La domanda da farsi prima di ogni prompt: esiste già qualcosa di buono da cui
partire?** Nove volte su dieci sì.

## Riferimenti

| Momento | Fonte |
|---|---|
| Parti da qualcosa di stabile e poi allontanati; da zero costa | [@ 00:42:59](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2579s) |
| De-slopping: reference umane + skill come enhancer | [@ 01:20:37](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4837s) |
| Video: dai i keyframe, il modello riempie i buchi | [@ 01:22:10](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4930s) |
| Stessa immagine di reference a ogni tool nello shootout | [@ 00:02:30](https://www.youtube.com/watch?v=NTtPD1Olpwo&t=150s) |
| Riusare il sorgente di Affine/AppFlowy invece di scrivere da zero | [@ 00:13:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=819s) |
| Non paghi token per rigenerare ciò che esiste | [@ 00:14:02](https://www.youtube.com/watch?v=qYqGsOKy40w&t=842s) |
| Ricomporre OSS invece di reinventare — vale con gli agenti | [@ 00:30:47](https://www.youtube.com/watch?v=qYqGsOKy40w&t=1847s) |
| Infra real-time multi-utente in una sola sessione live | [@ 02:20:45](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8445s) |
| L'audio/video ha funzionato al primo colpo; la UI/UX è il difficile | [@ 02:19:00](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8340s) |
| Reference + basso dettaglio, poi alza incrementalmente | [@ 00:55:43](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3343s) |
| Non fare domande in apertura: parti e itera sul feedback | [@ 00:56:11](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3371s) |
| Seminare keyword nel transcript per ritrovare i momenti | [@ 00:49:19](https://www.youtube.com/watch?v=ubpckz1sTLY&t=2959s) |

Le fonti sono indicizzate in [Channeling](https://channeling.davideghiotto.it/):
`topics/reference-driven-generation`, `topics/token-efficiency`, `topics/ui-design`.
