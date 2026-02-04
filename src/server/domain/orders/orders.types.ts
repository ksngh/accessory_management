import { OrderStatus } from './orders.enums';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  supplierId: string;
  supplierName?: string;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
  items?: OrderItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  imageUrl: string;
  supplierId: string;
  supplierName?: string;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}
