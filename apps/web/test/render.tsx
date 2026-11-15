import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { vi } from 'vitest';

/** Render with a fresh QueryClient (no retries) per test. */
export function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

/** Stub global fetch with a handler: (url, init) => [status, body]. */
export function mockFetch(handler: (url: string, init?: RequestInit) => [number, unknown]) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const [status, body] = handler(String(input), init);
    return new Response(status === 204 ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  });
}
