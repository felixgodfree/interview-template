import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { createItemSchema, idParamSchema, updateItemSchema, type Item } from '@app/shared';
import { db } from '../db/client.js';
import { items, type ItemRow } from '../db/schema.js';
import { HttpError } from '../middleware/errors.js';

const toDto = (row: ItemRow): Item => ({
  ...row,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

export const itemsRouter = Router();

itemsRouter.get('/', async (_req, res) => {
  const rows = await db.select().from(items).orderBy(desc(items.createdAt));
  res.json(rows.map(toDto));
});

itemsRouter.get('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const [row] = await db.select().from(items).where(eq(items.id, id));
  if (!row) throw new HttpError(404, 'Item not found');
  res.json(toDto(row));
});

itemsRouter.post('/', async (req, res) => {
  const input = createItemSchema.parse(req.body);
  const [row] = await db.insert(items).values(input).returning();
  res.status(201).json(toDto(row!));
});

itemsRouter.patch('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateItemSchema.parse(req.body);
  const [row] = await db.update(items).set(input).where(eq(items.id, id)).returning();
  if (!row) throw new HttpError(404, 'Item not found');
  res.json(toDto(row));
});

itemsRouter.delete('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const [row] = await db.delete(items).where(eq(items.id, id)).returning();
  if (!row) throw new HttpError(404, 'Item not found');
  res.status(204).end();
});
