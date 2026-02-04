import { fetcher } from './fetcher';
import type { StockDetail, StockVariant } from '../types';

export const getStock = (productId: string): Promise<StockDetail> => {
  return fetcher<StockDetail>(`/products/${productId}/stock`);
};

export const updateStock = (productId: string, variants: StockVariant[]): Promise<StockDetail> => {
  return fetcher<StockDetail>(`/products/${productId}/stock`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variants }),
  });
};
