import { findAllCategories } from './categories.repo';
import { Category } from './categories.types';

export const getCategories = async (): Promise<Category[]> => {
  return await findAllCategories();
};
