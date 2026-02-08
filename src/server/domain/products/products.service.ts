import * as repo from './products.repo';
import { Product } from './products.types';
import { productBulkCreateSchema } from '@/server/validators/product';
import { saveBase64Image } from '@/server/utils/file';

export const getProducts = async (userId: number, filters: { supplierId?: number, category?: string }): Promise<Product[]> => {
  return await repo.findAllProducts(userId, filters);
};

export const getProduct = async (id: number, userId: number): Promise<Product | null> => {
  return await repo.findProductById(id, userId);
};

export const createBulkProducts = async (data: any, userId: number): Promise<Product[]> => {
  const validatedData = productBulkCreateSchema.parse(data);

  const productsToCreate = validatedData.items.map(item => {
    const imageUrl = item.imageBase64 ? saveBase64Image(item.imageBase64) : null;
    return {
      name: item.name,
      sku: item.sku,
      price: item.price,
      category: item.category,
      supplierId: validatedData.supplierId,
      imageUrl: imageUrl,
    };
  });

  return await repo.createBulkProducts(productsToCreate, userId);
};
