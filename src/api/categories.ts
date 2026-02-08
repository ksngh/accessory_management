import { fetcher } from './fetcher';
import { Category } from '@/types';

export const getCategories = async (): Promise<Category[]> => {
  return fetcher<Category[]>('/categories');
};

export const createCategory = async (name: string): Promise<Category> => {
  return fetcher<Category>('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
};

export const updateCategory = async (id: number, name: string): Promise<Category> => {
  return fetcher<Category>(`/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
};

export const deleteCategory = async (id: number): Promise<void> => {
  await fetcher<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
};
