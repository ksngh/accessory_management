import * as repo from './orders.repo';
import { Order } from './orders.types';
import { orderCreateSchema, orderUpdateSchema } from '@/server/validators/order';
import { OrderStatus } from './orders.enums';

export const getOrder = async (id: number, userId: number): Promise<Order | null> => {
  return await repo.findOrderById(id, userId);
};

export const getOrders = async (userId: number, filters: { status?: OrderStatus, supplierId?: number }): Promise<Order[]> => {
  return await repo.findAllOrders(userId, filters);
};

export const createOrder = async (data: any, userId: number): Promise<Order> => {
  const validatedData = orderCreateSchema.parse(data);
  return await repo.createOrder(validatedData, userId);
};

export const updateOrderStatus = async (id: number, data: { status: OrderStatus }, userId: number): Promise<Order | null> => {
  const validatedData = orderUpdateSchema.parse(data);
  return await repo.updateOrderStatus(id, validatedData.status, userId);
};

export const deleteOrder = async (id: number, userId: number): Promise<boolean> => {
  return await repo.deleteOrder(id, userId);
};
