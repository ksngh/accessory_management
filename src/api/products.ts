import { fetcher } from './fetcher';
import type { Product } from '../types';

export const getProducts = (params?: { supplierId?: number, category?: string }): Promise<Product[]> => {
  const usp = new URLSearchParams();
  if (params?.supplierId) usp.set('supplierId', String(params.supplierId));
  if (params?.category) usp.set('category', params.category);
  const queryString = usp.toString();
  return fetcher<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
};

export const getProduct = (id: number): Promise<Product> => {
  return fetcher<Product>(`/products/${id}`);
};

export const createBulkProducts = (data: any): Promise<Product[]> => {
  return fetcher<Product[]>('/products/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const deleteProduct = (id: number): Promise<void> => {
  return fetcher<void>(`/products/${id}`, {
    method: 'DELETE',
  });
};

export const updateProductOrder = (supplierId: number, items: { productId: number; rowIndex: number; colIndex: number }[]): Promise<{ success: boolean }> => {
  return fetcher<{ success: boolean }>('/products/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplierId, items }),
  });
};
