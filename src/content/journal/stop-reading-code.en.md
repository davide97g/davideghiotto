The title is provocative, but it does not mean deploying blindly. It means no longer
confusing reading every line with controlling the work.

When an agent adds, moves or deletes thousands of lines, manual review becomes the
bottleneck. The larger the change, the easier it is to fixate on local detail and lose
the global context
([video @ 00:07:32](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=452s)).

| Line-by-line review | Output review |
|---|---|
| Finds local defects | Verifies requirements and behavior |
| Scales with changed lines | Scales with use cases |
| Code is the evidence | Tests and observations are the evidence |

## Code is a means

The result is not an elegant function. It is a feature that works for its users. Many
bugs do not begin in syntax: they begin with a lost requirement, a missing use case or
an incomplete handoff. Perfect code can still build the wrong product
([@ 00:04:34](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=274s)).

That is why I move review from the intermediate output to the real output. I inspect
behavior in the browser, edge states, performance, security and fit with the
requirement. The code remains available when an investigation needs it; it is no
longer the first and only verification interface.

This does not apply equally everywhere. Medical software, payments, authentication
and destructive migrations demand more evidence and more human control. But “more
control” should not mean only “more lines read.” It should mean a validation strategy
proportional to the risk.

| Context | Minimum control |
|---|---|
| Routine UI | Browser tests, accessibility, visual diff |
| APIs and data | Contract tests, invariants, rollback |
| Auth, payments, safety | Threat model, independent tests, targeted human review |

## Verify with more code

The same generative capacity that produces a feature can produce its verification
shell: unit tests, end-to-end tests, static analysis, penetration tests, load tests and
custom debugging tools. In the video I propose a pipeline combining these signals
with targeted manual checks for each use case
([@ 00:08:42](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=522s)).

An AI model can also take the first pass over a PR: summarize the change, flag risky
areas, find broken invariants and identify the files that deserve human attention
([@ 00:07:55](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=475s)). Human review does not
disappear. It moves up a level: decide what must be true, then evaluate the evidence.

The developer's new job spans the whole chain: understand the requirement, direct
generation, build the checks, exercise the product and observe the release. Less
typing, more responsibility. For me it is more fun too: code was always the means,
not the end
([@ 00:09:26](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=566s)).

## References and resources

- [Full video: “stop reading code”](https://www.youtube.com/watch?v=tfHkM5Bk5e0&t=0s)
- [Theo — “You're reading way too much code”](https://www.youtube.com/watch?v=434cG4g5KLE&t=0s),
  the inspiration linked in the description
- [Hacker News discussion of Uncle Bob Martin's post](https://news.ycombinator.com/item?id=49074693),
  “My current strategy is to not read any of the code written by my agents”
- Tools named in the description: [Claude Code](https://claude.com/product/claude-code),
  [Cursor](https://cursor.com/) and [Codex](https://openai.com/codex/)

> Do not stop understanding the software. Stop using the amount of code you read as a
> proxy for the quality of your control.
