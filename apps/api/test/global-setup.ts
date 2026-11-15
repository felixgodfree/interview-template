// Runs once before the whole suite: bring the test database schema up to date.
export default async function setup() {
  process.env.NODE_ENV = 'test';
  const { runMigrations } = await import('../src/db/migrate.js');
  const { pool } = await import('../src/db/client.js');
  await runMigrations();
  await pool.end();
}
