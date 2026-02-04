import { fetcher } from './fetcher';
import type { Product } from '../types';

export const getProducts = (params?: { supplierId?: string, category?: string }): Promise<Product[]> => {
  const usp = new URLSearchParams();
  if (params?.supplierId) usp.set('supplierId', params.supplierId);
  if (params?.category) usp.set('category', params.category);
  const queryString = usp.toString();
  return fetcher<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
};

export const getProduct = (id: string): Promise<Product> => {
  return fetcher<Product>(`/products/${id}`);
};

export const createBulkProducts = (data: any): Promise<Product[]> => {
  return fetcher<Product[]>('/products/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
