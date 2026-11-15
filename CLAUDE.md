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

## Working style

- Before writing code for any non-trivial change, outline a short plan and wait for confirmation.
- Keep each change focused. Don't refactor unrelated code or add dependencies without asking.
- If requirements are ambiguous, ask rather than assume.
