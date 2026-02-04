import { pool } from '@/server/db/client';
import { Supplier } from './suppliers.types';

export const findAllSuppliers = async (): Promise<Supplier[]> => {
  const result = await pool.query('SELECT id, name FROM suppliers');
  return result.rows;
};

export const createSupplier = async (name: string): Promise<Supplier> => {
  const result = await pool.query(
    'INSERT INTO suppliers (name) VALUES ($1) RETURNING id, name',
    [name]
  );
  return result.rows[0];
};

export const updateSupplier = async (id: string, name: string): Promise<Supplier | null> => {
  const result = await pool.query(
    'UPDATE suppliers SET name = $1 WHERE id = $2 RETURNING id, name',
    [name, id]
  );
  return result.rows[0] || null;
};

export const deleteSupplier = async (id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
  return result.rowCount > 0;
};
