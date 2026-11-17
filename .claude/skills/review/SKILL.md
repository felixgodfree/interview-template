---
name: review
description: Review uncommitted changes against CLAUDE.md and the task before calling work done. Reports issues; does not edit.
argument-hint: [optional focus]
disable-model-invocation: true
---

Review the current uncommitted work. Focus (optional): $ARGUMENTS

1. Run `git status` and `git diff`, and read any untracked files.
2. Check against the conventions in CLAUDE.md: shared Zod schemas for every input, `HttpError` for expected failures, DTOs rather than raw rows, money in pence, `date` columns for calendar dates, an audit trail for state changes, and a test for each behaviour.
3. Look for real bugs: date off-by-one errors and timezone mistakes, null or undefined handling, missing role or permission checks, invalid state transitions, a missing migration, an unhandled error path, or N+1 queries.
4. List the edge cases that have no test.
5. Run `pnpm check`.

Report in this order, keeping it tight: **Blocking**, **Should fix**, **Untested edge cases**, and the **`pnpm check` result**. Don't change any code. Propose the fixes and wait for me.
