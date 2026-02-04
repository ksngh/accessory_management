import * as repo from './products.repo';
import { Product } from './products.types';
import { productBulkCreateSchema } from '@/server/validators/product';

export const getProducts = async (filters: { supplierId?: string, category?: string }): Promise<Product[]> => {
  return await repo.findAllProducts(filters);
};

export const getProduct = async (id: string): Promise<Product | null> => {
  return await repo.findProductById(id);
};

export const createBulkProducts = async (data: any): Promise<Product[]> => {
  const validatedData = productBulkCreateSchema.parse(data);
  // Here you would normally handle image upload (from imageBase64) and get a URL.
  // For now, we'll assume imageUrl is provided or imageBase64 is a data URL that can be stored directly.
  const productsToCreate = validatedData.items.map(item => ({
    ...item,
    supplierId: validatedData.supplierId,
  }));
  return await repo.createBulkProducts(productsToCreate);
};
