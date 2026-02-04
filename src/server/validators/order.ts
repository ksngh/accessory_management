import { z } from 'zod';
import { OrderStatus } from '../domain/orders/orders.enums';

export const orderCreateSchema = z.object({
  supplierId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
    selectedColor: z.string(),
    selectedSize: z.string().optional(),
  })),
});

export const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
