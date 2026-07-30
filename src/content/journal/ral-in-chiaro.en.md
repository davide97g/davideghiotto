I publish what I earn. Not a range, not "competitive" — the gross annual figure, plus
every bump since the first offer in 2019. It lives at [/ral](/ral).

Total transparency is easy to claim and cheap to fake. Salary is the one number that
tests it, because it's the one everybody is trained to hide.

## Why now: the law moved first

[Directive (EU) 2023/970](https://eur-lex.europa.eu/eli/dir/2023/970/oj) on pay
transparency had to be transposed by **7 June 2026**. Italy did it with **D.Lgs. 7
maggio 2026, n. 96**, in force from that same date. Three things changed, for employers
of any size:

| Before | Now |
|---|---|
| Job ads said "salary commensurate with experience" | Pay level or range must be stated **before** the interview |
| "What do you earn today?" opened every call | Asking a candidate's **pay history is banned** |
| Pay-secrecy clauses in contracts | Void — you can't be stopped from discussing your own pay |

Add the reporting duties (gap disclosure at 100+ employees, mandatory joint assessment
above a 5% unexplained gap) and the direction is one-way: **pay opacity is being
legislated out.** Publishing my own number isn't activism anymore. It's early
compliance with the norm everybody is about to live in.

The asymmetry was never neutral, either. The company knows the whole band. The
candidate knows a rumour. Whoever guesses first, loses.

## How the page works

Screenshots below use **placeholder figures** — the real ones only exist behind the
gate.

Locked by default. The trajectory renders, the employers render, the amounts don't.

![The RAL chart before unlocking: employer bands visible, figures blurred](/ral-shot-locked.avif)

One step to open it: a real email, a one-time code.

![The access gate asking for a work email before sending a one-time code](/ral-shot-gate.avif)

Verified, and the numbers appear — with a visible one-hour clock on the session.

![Unlocked stats: current RAL, total growth, multiple, and the expiry countdown](/ral-shot-unlocked.avif)

Then the whole history: every bump, dated, coloured by employer.

![The unlocked chart with each RAL step and per-company cards underneath](/ral-shot-chart.avif)

## The rules I built into it

- **Amounts never ship to the browser.** The bundle carries companies and dates. The
  figures live only in `ral-gate`, a small service that answers after verification.
- **Fail-closed.** Service down, token expired, misconfigured env — the page stays
  locked. Never the other way round.
- **One hour.** Unlocks expire server-side; the countdown is on screen, not hidden.
- **Real mailboxes only.** Disposable domains are rejected on shape, on blocklist, and
  on MX host — the layer that catches temp-mail domains registered yesterday.
- **Symmetry.** I see who asked: address, domain, time. You see my salary. Fair trade.

Transparency isn't giving up leverage. It's refusing to pretend I don't have any.
