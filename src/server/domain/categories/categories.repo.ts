import { pool } from '@/server/db/client';
import { Category } from './categories.types';

export const findAllCategories = async (): Promise<Category[]> => {
  const result = await pool.query('SELECT id, name, icon, 0 as count FROM categories');
  return result.rows;
};
