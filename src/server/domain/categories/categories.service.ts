import * as repo from './categories.repo';
import { Category } from './categories.types';
import { categoryCreateSchema, categoryUpdateSchema } from '@/server/validators/category';

export const getCategories = async (userId: number): Promise<Category[]> => {
  const existing = await repo.findAllCategories(userId);
  if (existing.length > 0) {
    return existing;
  }

  const defaults = ['반지', '목걸이', '팔찌', '귀걸이', '기타'];
  const created: Category[] = [];
  for (const name of defaults) {
    created.push(await repo.createCategory(name, userId));
  }
  return created;
};

export const createCategory = async (data: { name: string }, userId: number): Promise<Category> => {
  const validatedData = categoryCreateSchema.parse(data);
  return await repo.createCategory(validatedData.name, userId);
};

export const updateCategory = async (id: number, data: { name?: string }, userId: number): Promise<Category | null> => {
  const validatedData = categoryUpdateSchema.parse(data);
  if (!validatedData.name) {
    const existing = await repo.findAllCategories(userId);
    return existing.find(c => c.id === id) || null;
  }
  return await repo.updateCategory(id, validatedData.name, userId);
};

export const deleteCategory = async (id: number, userId: number): Promise<boolean> => {
  return await repo.deleteCategory(id, userId);
};
