import * as repo from './stock.repo';
import { StockDetail, StockVariant } from './stock.types';
import { stockUpdateSchema } from '@/server/validators/stock';

export const getStockDetail = async (productId: number, userId: number): Promise<StockDetail> => {
  const variants = await repo.findStockByProductId(productId, userId);
  const total = variants.reduce((sum, v) => sum + v.quantity, 0);
  return {
    productId,
    total,
    variants,
  };
};

export const updateStock = async (productId: number, data: { variants: StockVariant[] }, userId: number): Promise<void> => {
  const validatedData = stockUpdateSchema.parse(data);
  await repo.updateStock(productId, validatedData.variants, userId);
};

export const deleteStockVariant = async (variantId: number, userId: number): Promise<void> => {
  const variant = await repo.findStockVariantById(variantId, userId);

  if (!variant) {
    throw new Error('Stock variant not found');
  }

  await repo.deleteStockVariantById(variantId, userId);
};
