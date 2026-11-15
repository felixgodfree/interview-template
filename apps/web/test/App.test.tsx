import type { Item } from '@app/shared';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';
import { mockFetch, renderWithClient } from './render';

const item = (overrides: Partial<Item> = {}): Item => ({
  id: crypto.randomUUID(),
  name: 'Existing item',
  description: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('App', () => {
  it('lists items from the api', async () => {
    mockFetch(() => [200, [item({ name: 'From the api' })]]);
    renderWithClient(<App />);
    expect(await screen.findByText('From the api')).toBeInTheDocument();
  });

  it('creates an item and refetches the list', async () => {
    const items: Item[] = [];
    const fetchMock = mockFetch((_url, init) => {
      if (init?.method === 'POST') {
        const created = item(JSON.parse(String(init.body)));
        items.push(created);
        return [201, created];
      }
      return [200, items];
    });

    renderWithClient(<App />);
    expect(await screen.findByText('No items yet.')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Name'), 'New thing');
    await userEvent.click(screen.getByRole('button', { name: 'Add item' }));

    expect(await screen.findByText('New thing')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/items',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('shows api validation errors', async () => {
    mockFetch((_url, init) =>
      init?.method === 'POST' ? [400, { error: { message: 'Validation failed' } }] : [200, []],
    );
    renderWithClient(<App />);
    await screen.findByText('No items yet.');
    await userEvent.click(screen.getByRole('button', { name: 'Add item' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Validation failed');
  });
});
