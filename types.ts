
export type Color = '골드' | '로즈' | '실버';
export type RingSize = '3호' | '5호' | '7호' | '9호' | '11호' | '13호' | '15호' | '17호' | '19호' | '21호' | '23호';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  imageUrl: string;
  supplierId: string;
  supplierName?: string;
  stock: number;
  hasSizes?: boolean;
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
  PENDING = '대기',
  COMPLETED = '완료'
}

export interface OrderItem extends Product {
  quantity: number;
  selectedColor: Color;
  selectedSize?: RingSize;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  supplierId: string;
  supplierName?: string;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
  items?: OrderItem[]; // 상세 내역 조회를 위한 아이템 리스트 추가
}

export interface StockVariant {
  color: Color;
  size?: RingSize;
  quantity: number;
}

export interface StockDetail {
  productId: string;
  total: number;
  variants: StockVariant[];
}

export interface ProductStat {
  id: string;
  name: string;
  imageUrl?: string;
  category: string;
  supplierId: string;
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
