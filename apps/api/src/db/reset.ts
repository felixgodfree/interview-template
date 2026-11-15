import { sql } from 'drizzle-orm';
import { env } from '../env.js';
import { db, pool } from './client.js';

// Drops everything (tables + migration history) so migrate can rebuild from scratch.
await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);
await db.execute(sql`CREATE SCHEMA public`);

console.log(`Reset ${new URL(env.DATABASE_URL).pathname.slice(1)}`);
await pool.end();
