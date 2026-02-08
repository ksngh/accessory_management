import { pool } from '@/server/db/client';
import { Category } from './categories.types';

export const findAllCategories = async (userId: number): Promise<Category[]> => {
  const result = await pool.query(
    'SELECT id, name, user_id as "userId" FROM categories WHERE user_id = $1 ORDER BY id ASC',
    [userId]
  );
  return result.rows;
};

export const createCategory = async (name: string, userId: number): Promise<Category> => {
  const result = await pool.query(
    'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id, name, user_id as "userId"',
    [name, userId]
  );
  return result.rows[0];
};

export const updateCategory = async (id: number, name: string, userId: number): Promise<Category | null> => {
  const result = await pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name, user_id as "userId"',
    [name, id, userId]
  );
  return result.rows[0] || null;
};

export const deleteCategory = async (id: number, userId: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM categories WHERE id = $1 AND user_id = $2', [id, userId]);
  return (result.rowCount ?? 0) > 0;
};
