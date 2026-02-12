import * as repo from './products.repo';
import { Product } from './products.types';
import { productBulkCreateSchema } from '@/server/validators/product';
import { saveBase64Image } from '@/server/utils/file';
import { normalizeImageUrl } from '@/server/utils/image';

export const getProducts = async (userId: number, filters: { supplierId?: number, category?: string }): Promise<Product[]> => {
  const products = await repo.findAllProducts(userId, filters);
  return products.map(product => ({
    ...product,
    imageUrl: normalizeImageUrl(product.imageUrl) ?? product.imageUrl,
    hasSizes: product.category === '반지',
  }));
};

export const getProduct = async (id: number, userId: number): Promise<Product | null> => {
  const product = await repo.findProductById(id, userId);
  if (!product) return null;
  return {
    ...product,
    imageUrl: normalizeImageUrl(product.imageUrl) ?? product.imageUrl,
    hasSizes: product.category === '반지',
  };
};

export const createBulkProducts = async (data: any, userId: number): Promise<Product[]> => {
  const validatedData = productBulkCreateSchema.parse(data);

  const productsToCreate = validatedData.items.map(item => {
    const imageUrl = item.imageBase64 ? saveBase64Image(item.imageBase64) : null;
    const hasSizes = item.hasSizes ?? item.category === '반지';
    return {
      name: item.name,
      sku: item.sku,
      price: item.price,
      category: item.category,
      supplierId: validatedData.supplierId,
      imageUrl: imageUrl,
      hasSizes,
    };
  });

  return await repo.createBulkProducts(productsToCreate, userId);
};

export const updateProductOrder = async (
  userId: number,
  supplierId: number,
  items: { productId: number; rowIndex: number; colIndex: number }[]
): Promise<void> => {
  return await repo.updateProductOrder(userId, supplierId, items);
};

export const deleteProduct = async (id: number, userId: number): Promise<boolean> => {
  return await repo.deleteProduct(id, userId);
};
