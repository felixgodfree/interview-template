import cors from 'cors';
import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/client.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { itemsRouter } from './routes/items.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', async (_req, res) => {
    await db.execute(sql`select 1`);
    res.json({ status: 'ok', db: 'ok' });
  });

  app.use('/api/items', itemsRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
