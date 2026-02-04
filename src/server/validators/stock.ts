import { z } from 'zod';

export const stockUpdateSchema = z.object({
  variants: z.array(z.object({
    color: z.string(),
    size: z.string().optional(),
    quantity: z.number().int().min(0),
  })),
});
