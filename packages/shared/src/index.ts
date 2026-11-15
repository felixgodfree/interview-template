import { z } from 'zod';

/**
 * Shared API contract. Define each resource's shape once here; the api uses
 * these schemas to validate requests, the web app uses the inferred types.
 */

export const itemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Item = z.infer<typeof itemSchema>;

export const createItemSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  description: z.string().trim().max(2000).nullish(),
});
export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.partial();
export type UpdateItemInput = z.infer<typeof updateItemSchema>;

export const idParamSchema = z.object({ id: z.uuid() });

/** Every error response from the api has this shape. */
export type ApiError = {
  error: {
    message: string;
    details?: unknown;
  };
};
