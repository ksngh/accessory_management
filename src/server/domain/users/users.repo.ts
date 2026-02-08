import { pool } from '@/server/db/client';
import { User } from '@/types';

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT id, username FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createUser = async (username: string, hashedPassword: string): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, hashedPassword]
  );
  return result.rows[0];
};
