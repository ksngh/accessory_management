export interface StockVariant {
  id?: number;
  color: string;
  size?: string;
  quantity: number;
}

export interface StockDetail {
  productId: number;
  total: number;
  variants: StockVariant[];
}
