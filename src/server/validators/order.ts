import { z } from 'zod';
import { OrderStatus } from '../domain/orders/orders.enums';

export const orderCreateSchema = z.object({
  supplierId: z.number(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().int().min(1),
    selectedColor: z.string(),
    selectedSize: z.string().optional(),
  })),
});

export const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
