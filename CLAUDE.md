# CLAUDE.md

Full-stack TypeScript app in a pnpm monorepo, used for a live pair-programming session. Changes should be small, reviewable steps, each one verified.

## Layout

- `apps/api`: Express 5 REST API with Drizzle ORM on Postgres. Entry point is `src/index.ts` and the app factory is `src/app.ts`.
  - `src/db/schema.ts`: all tables. `drizzle/` holds generated SQL migrations (never hand-edit `drizzle/meta`).
  - `src/routes/<resource>.ts`: one Express router per resource, mounted under `/api/<resource>` in `app.ts`.
  - `src/middleware/errors.ts`: `HttpError`, the 404 handler and the central error handler.
- `apps/web`: React 19 with Vite and TanStack Query.
  - `src/api/client.ts`: the `api<T>()` fetch wrapper. `src/api/<resource>.ts` holds the query and mutation hooks.
  - `src/components/`: UI components. Styling is plain CSS in `src/styles.css`.
- `packages/shared` (`@app/shared`): Zod schemas and inferred types that both the api and web use. **This is the API contract.**

## Commands (run from repo root)

| Task                                 | Command                                                |
| ------------------------------------ | ------------------------------------------------------ |
| Start api + web                      | `pnpm dev` (web :5173, api :3001)                      |
| All tests                            | `pnpm test`                                            |
| One app's tests                      | `pnpm --filter api test` / `pnpm --filter web test`    |
| Single test file                     | `pnpm --filter api exec vitest run test/items.test.ts` |
| Typecheck / lint / all three         | `pnpm typecheck` / `pnpm lint` / `pnpm check`          |
| Generate migration after schema edit | `pnpm db:generate --name <change_name>`                |
| Apply migrations                     | `pnpm db:migrate`                                      |
| Wipe, migrate and seed the dev DB    | `pnpm db:reset`                                        |

The api tests use the separate `app_test` database. The global setup migrates it and every table is truncated before each test.

## Conventions

- **Adding a resource**: (1) Zod schemas and types in `packages/shared`, (2) table in `schema.ts` followed by `pnpm db:generate --name ...`, (3) router in `apps/api/src/routes` mounted in `app.ts`, (4) a supertest file in `apps/api/test` (and add the table to the TRUNCATE list in `test/setup.ts`), (5) hooks in `apps/web/src/api` and then components.
- Validate every request body and param with the shared Zod schema via `.parse()`. Express 5 forwards thrown and rejected errors to the error handler, so don't write try/catch in routes.
- Throw `HttpError(status, message)` for expected failures. The error response shape is always `{ error: { message, details? } }`.
- Return DTOs (ISO date strings) from routes, not raw DB rows.
- The frontend calls only relative `/api/...` paths (Vite proxies to the api). No hard-coded URLs.
- Use TanStack Query for all server state. Mutations invalidate the related query keys.
- TypeScript is strict with `noUncheckedIndexedAccess`. Don't use `any`, and don't use `!` unless the invariant is obvious.
- Write or update tests alongside each behaviour change, and run `pnpm check` before calling a task done.

## Domain: UK work-visa sponsorship

Domain terms to use in code, schemas and UI copy. The task brief always wins: if it conflicts with the context below, follow the brief and point out the difference.

| Term                             | Meaning                                                                                                                                                                                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sponsor / sponsor licence        | An employer licensed by the Home Office to employ overseas workers. One organisation can hold several licences, each covering several **sites** (work locations).                                                                                                                 |
| Sponsored worker                 | An employee whose visa depends on the sponsor. Key fields: role, SOC code, salary, weekly hours, work site, visa expiry.                                                                                                                                                          |
| CoS (Certificate of Sponsorship) | An electronic record the sponsor assigns to a worker for a specific role. The worker then applies for a visa using it. It can be _defined_ (applying from outside the UK) or _undefined_ (applying from inside the UK).                                                           |
| SOC code                         | The occupation code for the role. It sets the **going rate**, which is the minimum salary for that occupation.                                                                                                                                                                    |
| Salary threshold                 | A worker must be paid at least the higher of the general threshold and the going rate (lower rates exist for new entrants and Immigration Salary List roles), pro-rated by hours. Since April 2026 the threshold must be met **in every pay period**, not averaged over the year. |
| SMS (Sponsor Management System)  | The Home Office portal where sponsors assign CoS and submit reports.                                                                                                                                                                                                              |
| Reportable change                | A worker change the sponsor must report on the SMS, e.g. a change of work location, a salary cut, resignation or dismissal, failure to start, or more than 10 consecutive working days of unauthorised absence.                                                                   |
| Reporting deadline               | Usually **10 working days** after the event for worker changes and 20 working days for organisation changes. Working days exclude weekends and UK bank holidays. Compute dates as calendar dates in Europe/London, not as timestamps.                                             |
| Authorising Officer (AO)         | The senior person accountable for the licence. Approves CoS assignment and submissions.                                                                                                                                                                                           |
| Immigration adviser              | A regulated (IAA) adviser who reviews a case before anything is submitted.                                                                                                                                                                                                        |
| Right to work (RTW) check        | The check that a worker may legally work in the UK. Records must be kept, and some checks need follow-ups before a visa expires.                                                                                                                                                  |
| Appendix D                       | The Home Office list of records a sponsor must keep. It is the basis for compliance audits.                                                                                                                                                                                       |
| Compliance action                | Downgrade, suspension or revocation of a licence. Revocation puts every sponsored worker's visa at risk, which is why deadlines, owners and audit trails matter.                                                                                                                  |

Modelling defaults: store money as integer pence and calendar dates as `date` columns. Give every obligation an owner and a due date, and record every state change in an audit trail (actor, action, timestamp).

## Working style

- Before writing code for any non-trivial change, outline a short plan and wait for confirmation.
- Keep each change focused. Don't refactor unrelated code or add dependencies without asking.
- If requirements are ambiguous, ask rather than assume.
- For rule or business-logic work, use `/tdd`: write a failing test first, then implement. Before declaring a task done, use `/review`.
- A PostToolUse hook runs Prettier and `eslint --fix` on every file you edit, so don't reformat files by hand.
