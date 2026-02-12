import { pool } from '@/server/db/client';
import { Supplier } from './suppliers.types';

export const findAllSuppliers = async (userId: number): Promise<Supplier[]> => {
  const result = await pool.query('SELECT id, name, user_id as "userId" FROM suppliers WHERE user_id = $1', [userId]);
  return result.rows;
};

export const createSupplier = async (name: string, userId: number): Promise<Supplier> => {
  const result = await pool.query(
    'INSERT INTO suppliers (name, user_id) VALUES ($1, $2) RETURNING id, name, user_id as "userId"',
    [name, userId]
  );
  return result.rows[0];
};

export const updateSupplier = async (id: number, name: string, userId: number): Promise<Supplier | null> => {
  const result = await pool.query(
    'UPDATE suppliers SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name, user_id as "userId"',
    [name, id, userId]
  );
  return result.rows[0] || null;
};

export const deleteSupplier = async (id: number, userId: number): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productIdsResult = await client.query(
      'SELECT id FROM products WHERE supplier_id = $1 AND user_id = $2',
      [id, userId]
    );
    const productIds: number[] = productIdsResult.rows.map((row) => row.id);

    if (productIds.length > 0) {
      await client.query('DELETE FROM order_items WHERE product_id = ANY($1::int[])', [productIds]);
    }

    await client.query('DELETE FROM orders WHERE supplier_id = $1 AND user_id = $2', [id, userId]);
    await client.query('DELETE FROM products WHERE supplier_id = $1 AND user_id = $2', [id, userId]);

    const result = await client.query('DELETE FROM suppliers WHERE id = $1 AND user_id = $2', [id, userId]);

    await client.query('COMMIT');
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
