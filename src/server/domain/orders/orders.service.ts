import * as repo from './orders.repo';
import { Order } from './orders.types';
import { orderCreateSchema, orderUpdateSchema } from '@/server/validators/order';
import { OrderStatus } from './orders.enums';
import { normalizeImageUrl } from '@/server/utils/image';

const normalizeOrderItemImages = (order: Order | null): Order | null => {
  if (!order?.items) return order;

  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      imageUrl: normalizeImageUrl(item.imageUrl) ?? item.imageUrl,
    })),
  };
};

export const getOrder = async (id: number, userId: number): Promise<Order | null> => {
  const order = await repo.findOrderById(id, userId);
  return normalizeOrderItemImages(order);
};

export const getOrders = async (userId: number, filters: { status?: OrderStatus, supplierId?: number }): Promise<Order[]> => {
  return await repo.findAllOrders(userId, filters);
};

export const createOrder = async (data: any, userId: number): Promise<Order> => {
  const validatedData = orderCreateSchema.parse(data);
  const order = await repo.createOrder(validatedData, userId);
  return normalizeOrderItemImages(order) as Order;
};

export const updateOrderStatus = async (id: number, data: { status: OrderStatus }, userId: number): Promise<Order | null> => {
  const validatedData = orderUpdateSchema.parse(data);
  const order = await repo.updateOrderStatus(id, validatedData.status, userId);
  return normalizeOrderItemImages(order);
};

export const deleteOrder = async (id: number, userId: number): Promise<boolean> => {
  return await repo.deleteOrder(id, userId);
};
