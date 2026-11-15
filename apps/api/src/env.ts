import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// Load the repo-root .env (if present) without overriding variables already set.
const rootEnv = fileURLToPath(new URL('../../../.env', import.meta.url));
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().default(3001),
  DATABASE_URL: z.string().default('postgres://app:app@localhost:5433/app'),
  TEST_DATABASE_URL: z.string().default('postgres://app:app@localhost:5433/app_test'),
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  // Tests always run against the separate test database.
  DATABASE_URL: parsed.NODE_ENV === 'test' ? parsed.TEST_DATABASE_URL : parsed.DATABASE_URL,
};
