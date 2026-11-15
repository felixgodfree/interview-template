# Borderless Interview Template

Full-stack TypeScript skeleton: **Express 5 + Drizzle + Postgres** api, **React + Vite + TanStack Query** frontend, Zod schemas shared between them, and Vitest everywhere.

## Prerequisites

- Node 22+ (`nvm use`)
- pnpm 10 (`corepack enable`)
- Docker (for Postgres)

## Getting started

```bash
cp .env.example .env
pnpm bootstrap  # install, start Postgres, migrate, seed
pnpm dev        # api on :3001, web on :5173
```

Open http://localhost:5173. Health check: http://localhost:5173/api/health

## Scripts

| Command                          | What it does                                  |
| -------------------------------- | --------------------------------------------- |
| `pnpm dev`                       | Run api + web together with hot reload        |
| `pnpm test`                      | Api integration tests + web component tests   |
| `pnpm check`                     | Typecheck, lint and test                      |
| `pnpm db:up` / `db:down`         | Start or stop the Postgres container          |
| `pnpm db:generate --name <name>` | Generate a migration from `schema.ts` changes |
| `pnpm db:migrate`                | Apply migrations                              |
| `pnpm db:reset`                  | Drop, migrate and reseed the dev database     |
| `pnpm db:studio`                 | Drizzle Studio (DB browser)                   |

## Structure

```
apps/api         Express api: routes, Drizzle schema + migrations, supertest tests
apps/web         React app: TanStack Query hooks, components, RTL tests
packages/shared  Zod schemas and types: the api contract
```

Postgres runs on host port **5433** (to avoid clashing with a local install), with an `app` database for dev and an `app_test` database for tests.
