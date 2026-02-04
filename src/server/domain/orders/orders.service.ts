import * as repo from './orders.repo';
import { Order } from './orders.types';
import { orderCreateSchema, orderUpdateSchema } from '@/server/validators/order';
import { OrderStatus } from './orders.enums';

export const getOrder = async (id: string): Promise<Order | null> => {
  return await repo.findOrderById(id);
};

export const getOrders = async (filters: { status?: OrderStatus, supplierId?: string }): Promise<Order[]> => {
  return await repo.findAllOrders(filters);
};

export const createOrder = async (data: any): Promise<Order> => {
  const validatedData = orderCreateSchema.parse(data);
  return await repo.createOrder(validatedData);
};

export const updateOrderStatus = async (id: string, data: { status: OrderStatus }): Promise<Order | null> => {
  const validatedData = orderUpdateSchema.parse(data);
  return await repo.updateOrderStatus(id, validatedData.status);
};
