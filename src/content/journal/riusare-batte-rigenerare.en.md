It's the lesson I repeat most, and also the one that has saved me the most time and
the most tokens.

> Generating **from scratch** produces slop and costs the most. Start from something
> that exists, stable and well-made, then drift away from it: the jump in quality is
> enormous. — [stream @ 00:42:59](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2579s)

## It holds across every medium

| Domain | From scratch | With a reference |
|---|---|---|
| **3D** | prompt → generic model | start from existing open assets |
| **Images** | standard output | a real reference changes everything ([Mobbin](https://mobbin.com/), [Pinterest](https://pinterest.com/)) |
| **Video** | inconsistent across frames | supply the **keyframes**, the model fills the gaps |
| **UI** | clean but anonymous slop | hand every tool the same reference image |

On video the point is sharp: you have to give the key images and let the model fill
the gaps, because from a prompt alone it can't stay consistent
([@ 01:22:10](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4930s)). On UI, in the
vibe-coding tool shootout I handed every tool the same reference image — the cheapest
way to convey an aesthetic without describing it in words
([@ 00:02:30](https://www.youtube.com/watch?v=NTtPD1Olpwo&t=150s)).

Skills like `frontend-design` help de-slop because they ask the right questions — but
they're **enhancers**. The reference is the lever
([@ 01:20:37](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4837s)).

## From visual references to whole codebases

With [sharp](https://sharp.davideghiotto.it/) I took the principle a level up: not
images, but entire **open-source products**.

- **[Affine](https://affine.pro/)** → the [Rust](https://www.rust-lang.org/) backend lifted wholesale
- **[AppFlowy](https://appflowy.io/)** → the collaborative docs
- **[tldraw](https://tldraw.dev/)** → the infinite canvas

> Reuse and recompose existing open-source products instead of reinventing the wheel —
> **this holds with agents too**.
> — [@ 00:30:47](https://www.youtube.com/watch?v=qYqGsOKy40w&t=1847s)

The result: the real-time, multi-user infrastructure of a Slack + Notion + Miro
replacement assembled in **one live session**
([@ 02:20:45](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8445s)).

And the honest part, worth more than the demo:

> The real-time audio/video infrastructure worked better than expected on the first
> try. The hard, still-unfinished part is the **UI/UX**, not the technology
> underneath. — [@ 02:19:00](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8340s)

On the cost side it was also the session's **single largest saving**: you don't pay
tokens to regenerate what already exists
([@ 00:14:02](https://www.youtube.com/watch?v=qYqGsOKy40w&t=842s)).

## Two operational details

**1. Start at low detail.** Give the references, ask for a rough version, then raise
the detail incrementally
([@ 00:55:43](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3343s)).

**2. Refuse the questionnaire.**

> "Don't ask me too many questions, just start and we'll build incrementally with
> feedback." — [@ 00:56:11](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3371s)

Twenty clarifying questions up front are tokens spent on information you'd have given
in the first round of feedback anyway.

## The edge case: being your own reference

Something I started doing during streams: **seeding keywords into the transcript as I
speak**, so that later my own tooling can search that transcript and find the exact
moment to clip on its own
([@ 00:49:19](https://www.youtube.com/watch?v=ubpckz1sTLY&t=2959s)).

I'm planting anchors up front instead of making something scan blindly. It's also why
[Channeling](https://channeling.davideghiotto.it/) exists — the archive that indexes
what I watch with citations down to the second.

**The question to ask before every prompt: does something good already exist to start
from?** Nine times out of ten, yes.

## References

| Moment | Source |
|---|---|
| Start from something stable then drift; from scratch is costly | [@ 00:42:59](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2579s) |
| De-slopping: human references + skills as enhancers | [@ 01:20:37](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4837s) |
| Video: supply keyframes, the model fills the gaps | [@ 01:22:10](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=4930s) |
| Same reference image handed to every tool in the shootout | [@ 00:02:30](https://www.youtube.com/watch?v=NTtPD1Olpwo&t=150s) |
| Reuse Affine/AppFlowy source instead of writing from scratch | [@ 00:13:39](https://www.youtube.com/watch?v=qYqGsOKy40w&t=819s) |
| You don't pay tokens to regenerate what exists | [@ 00:14:02](https://www.youtube.com/watch?v=qYqGsOKy40w&t=842s) |
| Recompose OSS instead of reinventing — holds with agents | [@ 00:30:47](https://www.youtube.com/watch?v=qYqGsOKy40w&t=1847s) |
| Real-time multi-user infra in a single live session | [@ 02:20:45](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8445s) |
| Audio/video worked first try; UI/UX is the hard part | [@ 02:19:00](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8340s) |
| References + low detail, then raise incrementally | [@ 00:55:43](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3343s) |
| No questions up front: start and iterate on feedback | [@ 00:56:11](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=3371s) |
| Seeding transcript keywords to find moments later | [@ 00:49:19](https://www.youtube.com/watch?v=ubpckz1sTLY&t=2959s) |

Sources are indexed in [Channeling](https://channeling.davideghiotto.it/):
`topics/reference-driven-generation`, `topics/token-efficiency`, `topics/ui-design`.
