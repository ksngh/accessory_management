import { pool } from '@/server/db/client';
import { StockVariant } from './stock.types';

export const findStockByProductId = async (productId: string): Promise<StockVariant[]> => {
  const result = await pool.query(
    'SELECT color, size, quantity FROM stock_variants WHERE product_id = $1',
    [productId]
  );
  return result.rows;
};

export const updateStock = async (productId: string, variants: StockVariant[]): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM stock_variants WHERE product_id = $1', [productId]);
    for (const variant of variants) {
      await client.query(
        'INSERT INTO stock_variants (product_id, color, size, quantity) VALUES ($1, $2, $3, $4)',
        [productId, variant.color, variant.size, variant.quantity]
      );
    }
    const totalStockResult = await client.query(
      'SELECT SUM(quantity) as total FROM stock_variants WHERE product_id = $1',
      [productId]
    );
    const totalStock = totalStockResult.rows[0].total || 0;
    await client.query('UPDATE products SET stock = $1 WHERE id = $2', [totalStock, productId]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
