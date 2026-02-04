import { pool } from '@/server/db/client';
import { Product } from './products.types';

export const findAllProducts = async (filters: { supplierId?: string, category?: string }): Promise<Product[]> => {
  let query = `
    SELECT 
      p.id, p.name, p.sku, p.price, c.name as category, p.image_url as "imageUrl", 
      s.id as "supplierId", s.name as "supplierName", p.stock, p.has_sizes as "hasSizes"
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN suppliers s ON p.supplier_id = s.id
  `;

  const queryParams: any[] = [];
  let whereClause = '';

  if (filters.supplierId) {
    queryParams.push(filters.supplierId);
    whereClause += `s.id = $${queryParams.length}`;
  }

  if (filters.category) {
    queryParams.push(filters.category);
    if (whereClause) whereClause += ' AND ';
    whereClause += `c.name = $${queryParams.length}`;
  }

  if (whereClause) {
    query += ' WHERE ' + whereClause;
  }

  const result = await pool.query(query, queryParams);
  return result.rows;
};

export const findProductById = async (id: string): Promise<Product | null> => {
  const result = await pool.query(
    `
      SELECT 
        p.id, p.name, p.sku, p.price, c.name as category, p.image_url as "imageUrl", 
        s.id as "supplierId", s.name as "supplierName", p.stock, p.has_sizes as "hasSizes"
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = $1
    `,
    [id]
  );
  return result.rows[0] || null;
};

export const createBulkProducts = async (products: any[]): Promise<Product[]> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const createdProducts: Product[] = [];
    for (const product of products) {
      const categoryResult = await client.query('SELECT id FROM categories WHERE name = $1', [product.category]);
      const categoryId = categoryResult.rows[0]?.id;

      const result = await client.query(
        `INSERT INTO products (name, sku, price, category_id, image_url, supplier_id, has_sizes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id, name, sku, price, (SELECT name FROM categories WHERE id = $4) as category, image_url as "imageUrl", supplier_id as "supplierId", (SELECT name FROM suppliers WHERE id = $6) as "supplierName", stock, has_sizes as "hasSizes"`,
        [
          product.name,
          product.sku,
          product.price,
          categoryId,
          product.imageUrl,
          product.supplierId,
          product.hasSizes || false,
        ]
      );
      createdProducts.push(result.rows[0]);
    }
    await client.query('COMMIT');
    return createdProducts;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
