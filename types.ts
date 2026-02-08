export type Color = '골드' | '로즈' | '실버';
export type RingSize = '3호' | '5호' | '7호' | '9호' | '11호' | '13호' | '15호' | '17호' | '19호' | '21호' | '23호';

export type CategoryName = string;



export interface User {
  id: number;
  username: string;
  password?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  category: CategoryName;
  imageUrl: string;
  supplierId: number;
  supplierName?: string;
  stock: number;
  hasSizes?: boolean;
  userId: number;
}

export interface Category {
  id: number;
  name: CategoryName;
  userId: number;
}

export interface Supplier {
  id: number;
  name: string;
  userId: number;
}

export enum OrderStatus {
  PENDING = '대기',
  COMPLETED = '완료'
}

export interface OrderItem extends Product {
  quantity: number;
  selectedColor: Color;
  selectedSize?: RingSize;
}

export interface Order {
  id: number;
  orderNumber: string;
  date: string;
  supplierId: number;
  supplierName?: string;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
  items?: OrderItem[]; // 상세 내역 조회를 위한 아이템 리스트 추가
  userId: number;
}

export interface StockVariant {
  id?: number;
  color: Color;
  size?: RingSize;
  quantity: number;
}

export interface StockDetail {
  productId: number;
  total: number;
  variants: StockVariant[];
}

export interface ProductStat {
  id: number;
  name: string;
  imageUrl?: string;
  category: string;
  supplierId: number;
  supplierName: string;
  totalQty: number;
  unitPrice: number;
  totalAmount: number;
}

export interface ProductStatisticsResponse {
  range: {
    start: string;
    end: string;
  };
  filters: {
    supplierId?: string;
    category?: string;
    color?: string;
    sortBy?: 'quantity' | 'amount';
  };
  totals: {
    qty: number;
    amount: number;
  };
  items: ProductStat[];
}
