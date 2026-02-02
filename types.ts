
export type Color = '골드' | '로즈' | '실버';
export type RingSize = '3호' | '5호' | '7호' | '9호' | '11호' | '13호' | '15호' | '17호' | '19호' | '21호' | '23호';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  imageUrl: string;
  supplier: string;
  stock: number; // 재고 수량 추가
  hasSizes?: boolean; // True for Rings
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface Supplier {
  id: string;
  name: string;
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
  selectedColor: Color;
  selectedSize?: RingSize;
}
