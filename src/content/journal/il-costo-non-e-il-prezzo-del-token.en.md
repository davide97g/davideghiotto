Every model comparison I read lines the prices up: this one costs X per million
tokens, that one costs Y. People pick the lower number, then wonder why the bill went
up.

The number on the pricing page is not what you pay.

> What you pay is **total tokens burned per completed task**, not the price per
> token. — [stream @ 00:02:18](https://www.youtube.com/watch?v=_tx5HibNMW4&t=138s)

## The case that proved it to me

Sonnet 5 is cheaper per token than Opus. On one
[Drizzle](https://orm.drizzle.team/) refactor it spawned **15 subagents** to explore
the codebase and couldn't stop itself: saturated context, repeated compactions, past
a million tokens.

> It consumes less per token, but so many more of them that it ends up worse than
> Opus. — [stream @ 00:02:24](https://www.youtube.com/watch?v=_tx5HibNMW4&t=144s)

Slower **and** more expensive than the "expensive" model I was avoiding to save
money. Knowing when to stop is as much a quality of an orchestrator as raw capability
is.

The trap exists at the top end too. Fable 5, running 3–4 instances in parallel,
burned a 5-hour usage window in about **one**
([@ 00:43:57](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2637s)). Extremely
capable, extremely voracious: it orchestrates executors that consume on their own, so
on tasks that aren't genuinely hard it eats far more than Opus
([@ 01:59:24](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=7164s)). Save it for when
it's needed. GPT-5.5, by comparison, is notably more efficient
([@ 02:06:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7569s)).

## The three levers I actually pull

| Lever | What changes |
|---|---|
| **Right effort, not maximum** | A smart model at `high` effort finishes without iterating, so token use stays low. `Max` has diminishing returns |
| **Delegate by complexity** | Hard work to the strong model, standard work to the cheap one. Same delegation you'd do with people |
| **Don't regenerate what exists** | The biggest lever of all: reuse open source instead of generating from zero |

The curve to push down is **tokens against complexity**: stay under the threshold and
reach for cheaper models below it
([@ 00:31:39](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1899s)).

## The skills: three different axes of the same problem

They aren't tricks, they're three distinct points of attack
([@ 01:00:05](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3605s)):

- **caveman** → compresses the final **output**.
- **ponytail** → cuts the amount of **code** written. Less code = less to generate
  and maintain: excess code is debt for agents too.
- **headroom** → compresses the local **context**.

And the rule I repeat constantly:

> Generalize when you see the occasion, not before. Premature generalization is debt
> — for humans and for agents.
> — [@ 01:03:29](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3809s)

## The opposite way to get it wrong: *tokenmaxxing*

The dev chat coined the term: hoarding API keys and subscriptions
([DeepSeek](https://www.deepseek.com/), Kimi, [OpenAI](https://openai.com/),
[Mistral](https://mistral.ai/) on one side; [Cursor](https://cursor.com/),
[Claude Code](https://claude.com/claude-code), [Codex](https://openai.com/codex/),
opencode on the other) while being unable to saturate a single one. FOMO dressed as
strategy: the credits go unused while you chase the next release.

## Takeaway

**Before switching models to save money, measure how many tokens the one you already
use spends finishing _one_ real task.** In my experience the answer points at your
prompts, not your provider.

## References

Every link opens the video at the exact second.

| Moment | Source |
|---|---|
| Slow + inefficient = costly, in usage and in tokens | [@ 00:02:18](https://www.youtube.com/watch?v=_tx5HibNMW4&t=138s) |
| Consumes less per token but so many more: worse than Opus | [@ 00:02:24](https://www.youtube.com/watch?v=_tx5HibNMW4&t=144s) |
| 15 subagents on one refactor, past 1M tokens | [@ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s) |
| Fable burned a 5-hour window in ~1 | [@ 00:43:57](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2637s) |
| GPT-5.5 notably more token-efficient | [@ 02:06:09](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=7569s) |
| Effort + delegation instead of always maxing out | [@ 00:05:26](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=326s) |
| `high` effort: finishes without iterating, low token use | [@ 00:32:47](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=1967s) |
| Push the token/complexity curve down | [@ 00:31:39](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=1899s) |
| Fable orchestrates Opus/Sonnet: costly, burns fast | [@ 01:04:46](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=3886s) |
| On easier tasks it eats more than Opus | [@ 01:59:24](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=7164s) |
| caveman / ponytail / headroom: three saving axes | [@ 01:00:05](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3605s) |
| Generalize when you see the occasion, not before | [@ 01:03:29](https://www.youtube.com/watch?v=ubpckz1sTLY&t=3809s) |

Sources are indexed in [Channeling](https://channeling.davideghiotto.it/):
`topics/token-efficiency`, `topics/effort-levels`, `topics/context-management`.
