import { z } from 'zod';

export const productBulkCreateSchema = z.object({
  supplierId: z.number(),
  items: z.array(z.object({
    category: z.enum(['반지', '목걸이', '팔찌', '귀걸이', '기타']),
    price: z.number(),
    imageBase64: z.string().optional(),
    imageUrl: z.string().optional(),
    name: z.string(),
    sku: z.string(),
    hasSizes: z.boolean().optional(),
  })),
});
