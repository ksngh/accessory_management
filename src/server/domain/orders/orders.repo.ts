import { pool } from '@/server/db/client';
import { Order, OrderItem } from './orders.types';
import { OrderStatus } from './orders.enums';

export const findOrderById = async (id: number, userId: number): Promise<Order | null> => {
  const orderResult = await pool.query(
    `
      SELECT 
        o.id, o.order_number as "orderNumber", o.date, s.id as "supplierId", s.name as "supplierName", 
        o.item_count as "itemCount", o.total_amount as "totalAmount", o.status, o.user_id as "userId"
      FROM orders o
      JOIN suppliers s ON o.supplier_id = s.id
      WHERE o.id = $1 AND o.user_id = $2
    `,
    [id, userId]
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

export const findAllOrders = async (userId: number, filters: { status?: OrderStatus, supplierId?: number }): Promise<Order[]> => {
  let query = `
    SELECT 
      o.id, o.order_number as "orderNumber", o.date, s.id as "supplierId", s.name as "supplierName", 
      o.item_count as "itemCount", o.total_amount as "totalAmount", o.status
    FROM orders o
    JOIN suppliers s ON o.supplier_id = s.id
  `;
  const queryParams: any[] = [userId];
  let whereClause = 'o.user_id = $1';

  if (filters.status) {
    queryParams.push(filters.status);
    whereClause += ` AND o.status = $${queryParams.length}`;
  }
  if (filters.supplierId) {
    queryParams.push(filters.supplierId);
    whereClause += ` AND o.supplier_id = $${queryParams.length}`;
  }

  query += ' WHERE ' + whereClause;
  
  query += ' ORDER BY o.date DESC';

  const result = await pool.query(query, queryParams);
  return result.rows;
};

export const createOrder = async (order: any, userId: number): Promise<Order> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderNumber = `PO-${Math.floor(Date.now() / 1000)}`;
    let totalAmount = 0;
    let itemCount = 0;

    for (const item of order.items) {
      const productResult = await client.query(
        'SELECT price, supplier_id as "supplierId" FROM products WHERE id = $1 AND user_id = $2',
        [item.productId, userId]
      );
      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${item.productId} not found for this user.`);
      }
      const product = productResult.rows[0];
      if (product.supplierId !== order.supplierId) {
        throw new Error(`Product with ID ${item.productId} does not belong to supplier ${order.supplierId}.`);
      }
      const productPrice = product.price;
      totalAmount += productPrice * item.quantity;
      itemCount += item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, supplier_id, item_count, total_amount, status, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, order_number as "orderNumber", date, supplier_id as "supplierId", item_count as "itemCount", total_amount as "totalAmount", status, user_id as "userId"`,
      [orderNumber, order.supplierId, itemCount, totalAmount, OrderStatus.PENDING, userId]
    );
    const newOrder = orderResult.rows[0];

    for (const item of order.items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, selected_color, selected_size) VALUES ($1, $2, $3, $4, $5)',
        [newOrder.id, item.productId, item.quantity, item.selectedColor, item.selectedSize]
      );
    }
    
    await client.query('COMMIT');
    return findOrderById(newOrder.id, userId);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const updateOrderStatus = async (id: number, status: OrderStatus, userId: number): Promise<Order | null> => {
  const result = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [status, id, userId]
  );
  if (result.rows.length === 0) return null;
  return findOrderById(id, userId);
};

export const deleteOrder = async (id: number, userId: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
  return (result.rowCount ?? 0) > 0;
};
