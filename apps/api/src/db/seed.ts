import { db, pool } from './client.js';
import { items } from './schema.js';

await db.delete(items);
await db.insert(items).values([
  { name: 'First item', description: 'Seeded so the UI has something to show' },
  { name: 'Second item', description: null },
]);

console.log('Seeded database');
await pool.end();
