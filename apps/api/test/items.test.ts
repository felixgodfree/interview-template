import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('GET /api/health', () => {
  it('reports the api and database are up', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'ok' });
  });
});

describe('/api/items', () => {
  it('creates and lists items', async () => {
    const created = await request(app)
      .post('/api/items')
      .send({ name: 'Test item', description: 'hello' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: 'Test item', description: 'hello' });

    const list = await request(app).get('/api/items');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);
  });

  it('rejects invalid input with a 400 and details', async () => {
    const res = await request(app).post('/api/items').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.fieldErrors.name).toBeDefined();
  });

  it('updates an item', async () => {
    const { body: item } = await request(app).post('/api/items').send({ name: 'Before' });
    const res = await request(app).patch(`/api/items/${item.id}`).send({ name: 'After' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('After');
  });

  it('deletes an item, then 404s on fetch', async () => {
    const { body: item } = await request(app).post('/api/items').send({ name: 'Doomed' });
    expect((await request(app).delete(`/api/items/${item.id}`)).status).toBe(204);
    expect((await request(app).get(`/api/items/${item.id}`)).status).toBe(404);
  });
});
