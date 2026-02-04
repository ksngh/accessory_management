import { fetcher } from './fetcher';
import type { ProductStatisticsResponse } from '../types';

export const getProductStatistics = (params: {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  supplierId?: string;
  category?: string;
  color?: string;
  sortBy?: 'quantity' | 'amount';
}): Promise<ProductStatisticsResponse> => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) usp.set(key, value);
  });
  return fetcher<ProductStatisticsResponse>(`/statistics/products?${usp.toString()}`);
};
