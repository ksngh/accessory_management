import { fetcher } from './fetcher';
import type { Order, OrderStatus } from '../types';

export const getOrders = (params?: { status?: OrderStatus, supplierId?: number }): Promise<Order[]> => {
  const usp = new URLSearchParams();
  if (params?.status) usp.set('status', params.status);
  if (params?.supplierId) usp.set('supplierId', String(params.supplierId));
  const queryString = usp.toString();
  return fetcher<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
};

export const getOrder = (id: number): Promise<Order> => {
  return fetcher<Order>(`/orders/${id}`);
};

export const createOrder = (order: any): Promise<Order> => {
  return fetcher<Order>('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
};

export const updateOrderStatus = (id: number, status: OrderStatus): Promise<Order> => {
  return fetcher<Order>(`/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};

export const deleteOrder = (id: number): Promise<void> => {
  return fetcher<void>(`/orders/${id}`, {
    method: 'DELETE',
  });
};
