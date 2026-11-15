import { sql } from 'drizzle-orm';
import { afterAll, beforeEach } from 'vitest';
import { db, pool } from '../src/db/client.js';

// Start every test with empty tables. Add new tables to this list as you create them.
beforeEach(async () => {
  await db.execute(sql`TRUNCATE TABLE items RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await pool.end();
});
