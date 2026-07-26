The first mistake I made: take the strongest model and use it for everything.
Orchestrate, decide, write, fix. It looks like the obvious call — it's the most capable
one — and it's the fastest way to burn a usage window.

## The pattern: real delegation

| Role | Who | What it does |
|---|---|---|
| **Orchestrator** | Fable | Plans, splits, dispatches. **Never executes** |
| **Heavy executor** | [GPT-5.6 Codex](https://openai.com/codex/) | The big work, in isolated subagents |
| **Cheap executor** | [Grok 4.5](https://grok.com/) via [Cursor](https://cursor.com/) | Standard and aesthetic UI |

> Fable stays **strictly** an orchestrator: it plans and dispatches, it doesn't
> execute. Execution goes to isolated subagents on cheaper models.
> — [stream @ 00:39:12](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2352s)

The routing key is **complexity**, not budget: hard work to the powerful model, simple
work to the cheaper one — exactly how you delegate with people
([@ 00:35:31](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2131s)). The expensive
model stays orchestrator and advisor
([@ 02:23:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8611s)).

Two details that sound pedantic and aren't:

1. **Write the model name exactly** — "GPT 5.6" — in the dispatch instruction, or the
   orchestrator picks a different one
   ([@ 00:39:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2371s)).
2. **Let it choose the effort per task.** Deterministically pinning one model per
   subagent type — as some defaults do — is not what I want: whoever knows the task
   should choose the horsepower
   ([@ 01:07:15](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4035s)).

## The counterintuitive part

> Giving every task a subagent with an **isolated context** consumes **more raw
> tokens** overall. And it costs **less**.
> — [@ 01:10:55](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4255s)

The reason is entirely compaction. Each subagent stays on a small scope and reports
back **only its result**: the main thread never fills up, so you never enter the
expensive compaction cycle — and compaction is lossy, it loses information, and when
the context gets too tight it blocks complex work outright.

**Fewer compactions and tighter focus beat the raw token count**
([@ 01:11:11](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4271s)).

The corollary worth keeping in mind:

> The context you watch is not the spend. The main thread can look calm while
> subagents burn credit underneath.
> — [@ 00:54:44](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3284s)

That's why you want a **status line** showing context plus the 5-hour and 7-day limits
per chat ([@ 02:02:20](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=7340s)).

## Knowing when to stop

The quality I underrated in an orchestrator isn't capability: it's **self-restraint**.

> On one [Drizzle](https://orm.drizzle.team/) refactor, Sonnet 5 spawned **15
> subagents** to explore the codebase and couldn't arrest itself: past a million
> tokens. — [@ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s)

None of those explorations was wrong in isolation. The failure was never deciding that
enough had been read
([@ 00:02:39](https://www.youtube.com/watch?v=_tx5HibNMW4&t=159s)).

**A good orchestrator is the one that closes early, not the one that opens a lot.**

## One trick for codebase context

Putting `/graphify update` in `CLAUDE.md` makes the agent refresh the repo's map at the
end of each task: on the next task it navigates the existing graph instead of
rebuilding context from scratch
([@ 00:12:52](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=772s)).

Same principle behind [Channeling](https://channeling.davideghiotto.it/): index once,
then query.

## If you're starting out: don't

This is later-stage work.

> Subagents are an advanced optimisation: master **one** tool before you think about
> orchestrating. — [@ 00:03:54](https://www.youtube.com/watch?v=i5Yqx-ZIwjQ&t=234s)

An operational note for when you get there: with 3–4 instances in parallel, **avoid git
worktrees** so the agents don't trample each other's files
([@ 00:44:21](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2661s)). But those are
problems worth having only once the rest already works.

## References

| Moment | Source |
|---|---|
| Fable as orchestrator only; execution to Codex/Grok | [@ 00:39:12](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2352s) |
| "Execution subagents should use the Codex CLI with GPT-5.6" | [@ 00:39:19](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2359s) |
| Write the model name exactly | [@ 00:39:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=2371s) |
| Deterministic per-subagent pinning is undesirable | [@ 01:07:15](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4035s) |
| Isolated contexts: more raw tokens, lower total cost | [@ 01:10:55](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4255s) |
| They avoid compaction and stay focused | [@ 01:11:11](https://www.youtube.com/watch?v=qYqGsOKy40w&t=4271s) |
| Standard UI to cheap subagents; the expensive one advises | [@ 02:23:31](https://www.youtube.com/watch?v=qYqGsOKy40w&t=8611s) |
| Fable orchestrates, explicit edits go to executors | [@ 00:33:26](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2006s) |
| Delegate like real life: complexity → horsepower | [@ 00:35:31](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=2131s) |
| Fan-out: 5 Opus 4.8 agents at max budget, ~30k tokens | [@ 02:06:32](https://www.youtube.com/watch?v=LIvW0-c-kUI&t=7592s) |
| 15 subagents on one refactor, past 1M tokens | [@ 00:01:42](https://www.youtube.com/watch?v=_tx5HibNMW4&t=102s) |
| "Doesn't know when to stop": an orchestration flaw | [@ 00:02:39](https://www.youtube.com/watch?v=_tx5HibNMW4&t=159s) |
| Main-thread context is not tokens consumed | [@ 00:54:44](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3284s) |
| Small context → lossy compaction | [@ 00:55:52](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=3352s) |
| 3–4 parallel instances, no worktrees | [@ 00:44:21](https://www.youtube.com/watch?v=UwMhqq9Evxk&t=2661s) |
| `/graphify update` in CLAUDE.md to avoid rebuilding context | [@ 00:12:52](https://www.youtube.com/watch?v=6JAmrUIjDM0&t=772s) |
| Subagents are an advanced optimisation: one tool first | [@ 00:03:54](https://www.youtube.com/watch?v=i5Yqx-ZIwjQ&t=234s) |

Sources are indexed in [Channeling](https://channeling.davideghiotto.it/):
`topics/agentic-orchestration`, `topics/model-delegation`, `topics/context-management`.
