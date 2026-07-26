---
title: Riusare batte rigenerare
platform: linkedin
status: draft
date: TBD
topic: reference-driven-generation — 14 inbound links
hero: https://i.ytimg.com/vi/qYqGsOKy40w/hqdefault.jpg
tags: [agents, open-source, design, token-efficiency]
---

# Riusare batte rigenerare

[![Fable+Sol = Sharp. Rimpiazzo Slack + Notion + Excalidraw](https://i.ytimg.com/vi/qYqGsOKy40w/hqdefault.jpg)](https://www.youtube.com/watch?v=qYqGsOKy40w)

*Dalla live [«Fable+Sol = Sharp. Rimpiazzo Slack + Notion + Excalidraw»](https://www.youtube.com/watch?v=qYqGsOKy40w).*

È la lezione che ripeto più spesso, ed è anche quella che mi ha fatto risparmiare
più tempo e più token.

> Generare **da zero** produce slop e costa il massimo. Parti da qualcosa che
> esiste, stabile e fatto bene, e poi allontanati da lì: il salto di qualità è
> enorme.
> — [@ 00:42:59](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2579s)

## Vale su ogni media

| Dominio | Da zero | Con reference |
|---|---|---|
| **3D** | prompt → modello generico | parti da asset open esistenti |
| **Immagini** | output standard | una reference vera cambia tutto ([Mobbin](https://mobbin.com/), [Pinterest](https://pinterest.com/)) |
| **Video** | inconsistente tra i frame | fornisci i **keyframe**, il modello riempie i buchi ([@ 01:22:10](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4930s)) |
| **UI** | slop pulito ma anonimo | stessa immagine di reference a ogni tool ([@ 00:02:30](https://www.youtube.com/watch?v=NTtPD1Olpwo&t=150s)) |

Le skill tipo [frontend-design](https://skills.sh/) aiutano a "de-sloppare" perché
fanno le domande giuste — ma sono **enhancer**. La reference è la leva
([@ 01:20:37](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4837s)).

## Da reference visive a codebase intere

Con [sharp](https://sharp.davideghiotto.it/) ho portato il principio un livello più
su: non immagini, ma **prodotti open source interi**.

- **[Affine](https://affine.pro/)** → il backend [Rust](https://www.rust-lang.org/) preso in blocco
- **[AppFlowy](https://appflowy.io/)** → i documenti collaborativi
- **[tldraw](https://tldraw.dev/)** → il canvas infinito

> Riusare e ricomporre prodotti open source esistenti invece di reinventare la
> ruota — **vale anche con gli agenti**.
> — [@ 00:30:47](https://www.youtube.com/watch?v=qYqGsOKy40w&t=1847s)

Il risultato: l'infrastruttura real-time e multi-utente di un rimpiazzo di
Slack + Notion + Miro assemblata **in una sola sessione live**
([@ 02:20:45](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8445s)).

E la parte onesta, quella che vale più della demo:

> L'infrastruttura audio/video real-time ha funzionato meglio del previsto al primo
> colpo. La parte difficile e ancora incompiuta è la **UI/UX**, non la tecnologia
> sotto.
> — [@ 02:19:00](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8340s)

Sul lato costi è stato anche il **singolo risparmio più grande** della sessione:
non paghi token per rigenerare ciò che esiste già
([@ 00:14:02](https://www.youtube.com/watch?v=qYqGsOKy40w&t=842s)).

## Due dettagli operativi

**1. Parti da basso dettaglio.** Dai le reference, chiedi una versione grezza, poi
alza il dettaglio incrementalmente
([@ 00:55:43](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3343s)).

**2. Rifiuta il questionario.**

> «Non farmi troppe domande, inizia e poi costruiamo incrementalmente con il
> feedback.»
> — [@ 00:56:11](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3371s)

Le venti domande di chiarimento in apertura sono token spesi per informazioni che
avresti dato comunque al primo giro di feedback.

## Il caso limite: fare da reference a te stesso

Una cosa che ho iniziato a fare durante le live: **seminare parole chiave nel
transcript mentre parlo**, così che dopo i miei tool possano cercare quel
transcript e trovare da soli il momento esatto da clippare
([@ 00:49:19](https://www.youtube.com/watch?v=ubpckz1sTLY&t=2959s)).

Sto piantando ancore in anticipo invece di far scansionare tutto alla cieca. È lo
stesso principio applicato al mio stesso materiale — ed è anche il motivo per cui
esiste [Channeling](https://channeling.davideghiotto.it/), l'archivio che indicizza
quello che guardo con citazione al secondo.

**La domanda da farsi prima di ogni prompt: esiste già qualcosa di buono da cui
partire?** Nove volte su dieci sì.

---

## Riferimenti

| # | Momento | Fonte |
|---|---|---|
| 1 | Parti da qualcosa di stabile e poi allontanati; da zero costa | [UwMhqq9Evxk @ 00:42:59](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2579s) |
| 2 | De-slopping: reference umane + skill come enhancer | [UwMhqq9Evxk @ 01:20:37](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4837s) |
| 3 | Video: dai i keyframe, il modello riempie i buchi | [UwMhqq9Evxk @ 01:22:10](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4930s) |
| 4 | Stessa immagine di reference a ogni tool nello shootout | [NTtPD1Olpwo @ 00:02:30](https://www.youtube.com/watch?v=NTtPD1Olpwo&t=150s) |
| 5 | Riusare il sorgente di Affine/AppFlowy invece di scrivere da zero | [qYqGsOKy40w @ 00:13:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=819s) |
| 6 | Non paghi token per rigenerare ciò che esiste | [qYqGsOKy40w @ 00:14:02](https://www.youtube.com/watch?v=qYqGsOKy40w&t=842s) |
| 7 | Ricomporre OSS invece di reinventare — vale con gli agenti | [qYqGsOKy40w @ 00:30:47](https://www.youtube.com/watch?v=qYqGsOKy40w&t=1847s) |
| 8 | Infra real-time multi-utente in una sola sessione live | [qYqGsOKy40w @ 02:20:45](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8445s) |
| 9 | L'audio/video ha funzionato al primo colpo; la UI/UX è il difficile | [qYqGsOKy40w @ 02:19:00](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8340s) |
| 10 | Reference + basso dettaglio, poi alza incrementalmente | [LIvW0-c-kUI @ 00:55:43](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3343s) |
| 11 | Non fare domande in apertura: parti e itera sul feedback | [LIvW0-c-kUI @ 00:56:11](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3371s) |
| 12 | Seminare keyword nel transcript per ritrovare i momenti | [ubpckz1sTLY @ 00:49:19](https://www.youtube.com/watch?v=ubpckz1sTLY&t=2959s) |

Fonti nel wiki di [Channeling](https://channeling.davideghiotto.it/):
`topics/reference-driven-generation`, `topics/token-efficiency`, `topics/ui-design`.

---

## LinkedIn cut

La lezione che ripeto più spesso, e quella che mi ha fatto risparmiare più tempo e
più token: generare da zero produce slop.

Parti da qualcosa che esiste già, stabile e fatto bene, e poi allontanati da lì. Il
salto di qualità è enorme, e vale su tutto: 3D (asset open esistenti), immagini
(una reference vera batte qualsiasi prompt), video (dai i keyframe, il modello
riempie i buchi), UI (la stessa immagine di reference a ogni tool).

Le skill tipo frontend-design aiutano perché fanno le domande giuste. Ma sono
enhancer. La reference è la leva.

Con sharp ho portato il principio un livello più su: non reference visive, ma
prodotti open source interi. Il backend Rust di Affine preso in blocco, AppFlowy
per i documenti, tldraw per il canvas.

Risultato: l'infrastruttura real-time e multi-utente di un rimpiazzo di Slack +
Notion + Miro assemblata in una sola sessione live. E la parte onesta: l'audio/video
real-time ha funzionato meglio del previsto al primo colpo — il difficile, ancora
incompiuto, è la UI/UX. Non la tecnologia sotto.

Sul lato costi è stato il singolo risparmio più grande della sessione: non paghi
token per rigenerare ciò che esiste già.

La domanda da farsi prima di ogni prompt: esiste già qualcosa di buono da cui
partire? Nove volte su dieci sì.

---

## EN — short version

The lesson I repeat most, and the one that saves me the most time and tokens:
**generating from scratch produces slop**. Start from something that already
exists, stable and well-made, then drift from it.

It holds across media — 3D (start from open assets), images (a real reference beats
any prompt), video (supply the keyframes, let the model fill the gaps), UI (hand
every tool the same reference image). Skills like `frontend-design` help because
they ask the right questions, but they're enhancers. The reference is the lever.

With [sharp](https://sharp.davideghiotto.it/) I took it a level up: not visual
references but whole open-source products — [Affine](https://affine.pro/)'s Rust
backend lifted wholesale, [AppFlowy](https://appflowy.io/) for docs,
[tldraw](https://tldraw.dev/) for the canvas. The real-time, multi-user
infrastructure of a Slack + Notion + Miro replacement came together in one live
session. The honest part: the real-time audio/video worked first try — the hard,
unfinished piece is the UI/UX, not the tech underneath.

It was also the session's single biggest cost saving: you don't pay tokens to
regenerate what already exists.

Two operational notes: start at low detail and raise it incrementally, and refuse
the twenty clarifying questions up front — that's context you'd have given in the
first feedback round anyway.

---

## Entry for content.ts

```ts
{
  title: {
    en: "Reuse beats regeneration",
    it: "Riusare batte rigenerare",
  },
  excerpt: {
    en: "Generating from scratch produces slop and costs the most. Affine's backend, AppFlowy and tldraw got me a real-time product in one session.",
    it: "Generare da zero produce slop ed è la cosa più costosa. Il backend di Affine, AppFlowy e tldraw mi hanno dato un prodotto real-time in una sessione.",
  },
  date: "TBD",
  platform: "linkedin",
  link: "TBD",
}
```
