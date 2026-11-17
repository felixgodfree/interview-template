---
name: tdd
description: Build a business rule or feature test-first (red, green, refactor). For logic such as deadlines, salary checks and state transitions.
argument-hint: <behaviour to build>
disable-model-invocation: true
---

Build this test-first: $ARGUMENTS

1. **Examples first.** Restate the behaviour as a short table of concrete input → expected output examples. Include edge cases: boundaries, weekends and bank holidays, empty or missing data, invalid states. Mark any example where you're assuming a rule. Stop and wait for me to confirm or correct them.
2. **Pure core.** Put the rule in a pure module (e.g. `apps/api/src/domain/<name>.ts`) with no Express, Drizzle or `Date.now()` inside. Pass "today" in as a parameter.
3. **Red.** Write the tests from the agreed examples (e.g. `apps/api/test/domain/<name>.test.ts`). Run only that file and confirm the tests fail for the right reason.
4. **Green.** Implement the simplest code that passes. Re-run the file.
5. **Refactor**, only if it clearly helps, and keep the tests green.
6. **Wire up** to routes or UI only if I asked for it, then run `pnpm check`.
7. Finish with a summary of 3 to 5 lines: the rules implemented, the assumptions made, and the edge cases still untested.
