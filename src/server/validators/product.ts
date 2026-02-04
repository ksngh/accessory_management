import { z } from 'zod';

export const productBulkCreateSchema = z.object({
  supplierId: z.string(),
  items: z.array(z.object({
    category: z.string(),
    price: z.number(),
    imageBase64: z.string().optional(),
    imageUrl: z.string().optional(),
    name: z.string(),
    sku: z.string(),
    hasSizes: z.boolean().optional(),
  })),
});
