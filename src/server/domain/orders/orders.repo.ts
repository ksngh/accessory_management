import { pool } from '@/server/db/client';
import { Order, OrderItem } from './orders.types';
import { OrderStatus } from './orders.enums';

export const findOrderById = async (id: string): Promise<Order | null> => {
  const orderResult = await pool.query(
    `
      SELECT 
        o.id, o.order_number as "orderNumber", o.date, s.id as "supplierId", s.name as "supplierName", 
        o.item_count as "itemCount", o.total_amount as "totalAmount", o.status
      FROM orders o
      JOIN suppliers s ON o.supplier_id = s.id
      WHERE o.id = $1
    `,
    [id]
  );
  if (orderResult.rows.length === 0) return null;

  const order = orderResult.rows[0];

  const itemsResult = await pool.query(
    `
      SELECT
        oi.product_id as "productId", p.name, p.sku, p.price, c.name as category, p.image_url as "imageUrl",
        p.supplier_id as "supplierId", s.name as "supplierName", oi.quantity, 
        oi.selected_color as "selectedColor", oi.selected_size as "selectedSize"
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE oi.order_id = $1
    `,
    [id]
  );
  order.items = itemsResult.rows;

  return order;
};

export const findAllOrders = async (filters: { status?: OrderStatus, supplierId?: string }): Promise<Order[]> => {
  let query = `
    SELECT 
      o.id, o.order_number as "orderNumber", o.date, s.id as "supplierId", s.name as "supplierName", 
      o.item_count as "itemCount", o.total_amount as "totalAmount", o.status
    FROM orders o
    JOIN suppliers s ON o.supplier_id = s.id
  `;
  const queryParams: any[] = [];
  let whereClause = '';

  if (filters.status) {
    queryParams.push(filters.status);
    whereClause += `o.status = $${queryParams.length}`;
  }
  if (filters.supplierId) {
    queryParams.push(filters.supplierId);
    if (whereClause) whereClause += ' AND ';
    whereClause += `o.supplier_id = $${queryParams.length}`;
  }

  if (whereClause) {
    query += ' WHERE ' + whereClause;
  }
  
  query += ' ORDER BY o.date DESC';

  const result = await pool.query(query, queryParams);
  return result.rows;
};

export const createOrder = async (order: any): Promise<Order> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderNumber = `PO-${Math.floor(Date.now() / 1000)}`;
    let totalAmount = 0;
    let itemCount = 0;

    for (const item of order.items) {
      const productResult = await client.query('SELECT price FROM products WHERE id = $1', [item.productId]);
      const productPrice = productResult.rows[0].price;
      totalAmount += productPrice * item.quantity;
      itemCount += item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, supplier_id, item_count, total_amount, status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, order_number as "orderNumber", date, supplier_id as "supplierId", item_count as "itemCount", total_amount as "totalAmount", status`,
      [orderNumber, order.supplierId, itemCount, totalAmount, OrderStatus.PENDING]
    );
    const newOrder = orderResult.rows[0];

    for (const item of order.items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, selected_color, selected_size) VALUES ($1, $2, $3, $4, $5)',
        [newOrder.id, item.productId, item.quantity, item.selectedColor, item.selectedSize]
      );
    }
    
    await client.query('COMMIT');
    return findOrderById(newOrder.id);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order | null> => {
  const result = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  if (result.rows.length === 0) return null;
  return findOrderById(id);
};
