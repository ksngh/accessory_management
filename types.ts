
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export enum OrderStatus {
  COMPLETED = '완료',
  PENDING = '대기',
  CANCELED = '취소'
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  supplier: string;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
}

export interface OrderItem extends Product {
  quantity: number;
}
