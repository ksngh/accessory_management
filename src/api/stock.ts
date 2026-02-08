import { fetcher } from './fetcher';
import type { StockDetail, StockVariant } from '../types';

export const getStock = (productId: number): Promise<StockDetail> => {
  return fetcher<StockDetail>(`/products/${productId}/stock`);
};

export const updateStock = (productId: number, variants: StockVariant[], images: File[]): Promise<StockDetail> => {
  const formData = new FormData();
  formData.append('variants', JSON.stringify(variants));
  images.forEach(image => {
    formData.append('images', image);
  });

  return fetcher<StockDetail>(`/products/${productId}/stock`, {
    method: 'PUT',
    body: formData,
  });
};

export const deleteStockVariant = (productId: number, variantId: number): Promise<void> => {
  return fetcher<void>(`/products/${productId}/stock/${variantId}`, {
    method: 'DELETE',
  });
};

export const deleteStockVariantByKey = (productId: number, color: string, size?: string): Promise<void> => {
  const usp = new URLSearchParams({ color });
  if (size) usp.set('size', size);
  return fetcher<void>(`/products/${productId}/stock?${usp.toString()}`, {
    method: 'DELETE',
  });
};
