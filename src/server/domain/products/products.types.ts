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
  hasSizes: boolean;
}
