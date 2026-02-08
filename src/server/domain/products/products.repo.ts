import { pool } from '@/server/db/client';
import { Product } from './products.types';

export const findAllProducts = async (userId: number, filters: { supplierId?: number, category?: string }): Promise<Product[]> => {
  let query = `
    SELECT 
      p.id, p.name, p.sku, p.price, c.name as category, p.image_url as "imageUrl", 
      s.id as "supplierId", s.name as "supplierName", p.stock, p.has_sizes as "hasSizes"
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN suppliers s ON p.supplier_id = s.id
  `;

  const queryParams: any[] = [userId];
  let whereClause = 'p.user_id = $1';

  if (filters.supplierId) {
    queryParams.push(filters.supplierId);
    whereClause += ` AND s.id = $${queryParams.length}`;
  }

  if (filters.category) {
    queryParams.push(filters.category);
    whereClause += ` AND c.name = $${queryParams.length}`;
  }

  query += ' WHERE ' + whereClause;

  const result = await pool.query(query, queryParams);
  return result.rows;
};

export const findProductById = async (id: number, userId: number): Promise<Product | null> => {
  const result = await pool.query(
    `
      SELECT 
        p.id, p.name, p.sku, p.price, c.name as category, p.image_url as "imageUrl", 
        s.id as "supplierId", s.name as "supplierName", p.stock, p.has_sizes as "hasSizes"
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = $1 AND p.user_id = $2
    `,
    [id, userId]
  );
  return result.rows[0] || null;
};

export const createBulkProducts = async (products: any[], userId: number): Promise<Product[]> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const createdProducts: Product[] = [];
    for (const product of products) {
      // Find category_id based on category name and user_id
      const categoryResult = await client.query('SELECT id FROM categories WHERE name = $1 AND user_id = $2', [product.category, userId]);
      const categoryId = categoryResult.rows[0]?.id;

      if (!categoryId) {
        // If you want to auto-create categories, that logic would go here.
        // For now, we'll throw an error if the user's category doesn't exist.
        throw new Error(`Category not found for this user: ${product.category}`);
      }

      const result = await client.query(
        `INSERT INTO products (name, sku, price, category_id, image_url, supplier_id, has_sizes, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING id, name, sku, price, (SELECT name FROM categories WHERE id = $4) as category, image_url as "imageUrl", supplier_id as "supplierId", (SELECT name FROM suppliers WHERE id = $6) as "supplierName", stock, has_sizes as "hasSizes", user_id as "userId"`,
        [
          product.name,
          product.sku,
          product.price,
          categoryId,
          product.imageUrl,
          product.supplierId,
          product.hasSizes || false,
          userId
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
