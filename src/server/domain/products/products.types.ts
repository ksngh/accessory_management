import { CategoryName } from '@/types'; // Import CategoryName

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
  hasSizes: boolean;
  displayRow: number;
  displayCol: number;
}
