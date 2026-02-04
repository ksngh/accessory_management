import { fetcher } from './fetcher';
import type { Category } from '../types';

export const getCategories = (): Promise<Category[]> => {
  return fetcher<Category[]>('/categories');
};
