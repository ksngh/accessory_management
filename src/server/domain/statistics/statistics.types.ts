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
