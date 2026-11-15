import type { ApiError } from '@app/shared';

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

/** Thin fetch wrapper: JSON in/out, throws ApiRequestError on non-2xx. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null;
    throw new ApiRequestError(
      res.status,
      body?.error.message ?? `Request failed (${res.status})`,
      body?.error.details,
    );
  }

  return (res.status === 204 ? undefined : await res.json()) as T;
}
