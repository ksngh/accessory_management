import { fetcher } from './fetcher';
import { Category } from '@/types';

export const getCategories = async (): Promise<Category[]> => {
  const data = await fetcher.get<Category[]>('/api/categories');
  return data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const data = await fetcher.post<Category>('/api/categories', { name });
  return data;
};

export const updateCategory = async (id: number, name: string): Promise<Category> => {
  const data = await fetcher.put<Category>(`/api/categories/${id}`, { name });
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await fetcher.delete(`/api/categories/${id}`);
};
