import { pool } from '@/server/db/client';
import { StockVariant } from './stock.types';

export const findStockByProductId = async (productId: number, userId: number): Promise<StockVariant[]> => {
  const result = await pool.query(
    `SELECT sv.id, sv.color, sv.size, sv.quantity 
     FROM stock_variants sv
     JOIN products p ON sv.product_id = p.id
     WHERE sv.product_id = $1 AND p.user_id = $2`,
    [productId, userId]
  );
  return result.rows;
};

export const findStockVariantById = async (variantId: number, userId: number): Promise<StockVariant | null> => {
  const result = await pool.query(
    `SELECT sv.id, sv.color, sv.size, sv.quantity 
     FROM stock_variants sv
     JOIN products p ON sv.product_id = p.id
     WHERE sv.id = $1 AND p.user_id = $2`,
    [variantId, userId]
  );
  return result.rows[0] || null;
};

export const updateStock = async (productId: number, variants: StockVariant[], userId: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Verify product ownership
    const productCheck = await client.query('SELECT id FROM products WHERE id = $1 AND user_id = $2', [productId, userId]);
    if (productCheck.rows.length === 0) {
      throw new Error('Product not found or user does not have permission');
    }

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

export const deleteStockVariantById = async (variantId: number, userId: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const variantResult = await client.query(
      `SELECT sv.product_id 
       FROM stock_variants sv
       JOIN products p ON sv.product_id = p.id
       WHERE sv.id = $1 AND p.user_id = $2`,
      [variantId, userId]
    );
    const productId = variantResult.rows[0]?.product_id;

    if (!productId) {
      throw new Error('Variant not found or user does not have permission');
    }

    await client.query('DELETE FROM stock_variants WHERE id = $1', [variantId]);

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
