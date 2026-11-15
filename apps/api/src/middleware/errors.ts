import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ApiError } from '@app/shared';
import { ZodError, z } from 'zod';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.path}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status = 500;
  let body: ApiError = { error: { message: 'Internal server error' } };

  if (err instanceof ZodError) {
    status = 400;
    body = { error: { message: 'Validation failed', details: z.flattenError(err) } };
  } else if (err instanceof HttpError) {
    status = err.status;
    body = { error: { message: err.message, details: err.details } };
  } else if (err?.type === 'entity.parse.failed') {
    status = 400;
    body = { error: { message: 'Malformed JSON body' } };
  }

  if (status >= 500) console.error(err);
  res.status(status).json(body);
};
