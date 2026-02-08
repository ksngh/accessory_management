import { pool } from '@/server/db/client';
import { ProductStat } from './statistics.types';

export const findProductStatistics = async (filters: {
  startDate: Date;
  endDate: Date;
  userId: number;
  supplierId?: string;
  category?: string;
  color?: string;
  sortBy?: 'quantity' | 'amount';
}): Promise<ProductStat[]> => {
  let query = `
    SELECT
      p.id,
      p.name,
      p.image_url as "imageUrl",
      c.name as category,
      s.id as "supplierId",
      s.name as "supplierName",
      p.price as "unitPrice",
      SUM(oi.quantity) as "totalQty",
      SUM(oi.quantity * p.price) as "totalAmount"
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    JOIN suppliers s ON o.supplier_id = s.id
    WHERE o.date >= $1 AND o.date < $2 AND o.user_id = $3
  `;
  const queryParams: any[] = [filters.startDate, filters.endDate, filters.userId];
  let paramIndex = 4;

  if (filters.supplierId) {
    query += ` AND o.supplier_id = $${paramIndex++}`;
    queryParams.push(filters.supplierId);
  }
  if (filters.category) {
    query += ` AND c.name = $${paramIndex++}`;
    queryParams.push(filters.category);
  }
  if (filters.color) {
    query += ` AND oi.selected_color = $${paramIndex++}`;
    queryParams.push(filters.color);
  }

  query += `
    GROUP BY p.id, c.name, s.id, s.name, p.price
    ORDER BY ${filters.sortBy === 'amount' ? '"totalAmount"' : '"totalQty"'} DESC
  `;

  const result = await pool.query(query, queryParams);
  return result.rows;
};
