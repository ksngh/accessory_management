export interface StockVariant {
  color: string;
  size?: string;
  quantity: number;
}

export interface StockDetail {
  productId: string;
  total: number;
  variants: StockVariant[];
}
