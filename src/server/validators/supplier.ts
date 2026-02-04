import { z } from 'zod';

export const supplierCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const supplierUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
});
