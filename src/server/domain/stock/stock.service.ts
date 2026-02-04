import * as repo from './stock.repo';
import { StockDetail, StockVariant } from './stock.types';
import { stockUpdateSchema } from '@/server/validators/stock';

export const getStockDetail = async (productId: string): Promise<StockDetail> => {
  const variants = await repo.findStockByProductId(productId);
  const total = variants.reduce((sum, v) => sum + v.quantity, 0);
  return {
    productId,
    total,
    variants,
  };
};

export const updateStock = async (productId: string, data: { variants: StockVariant[] }): Promise<void> => {
  const validatedData = stockUpdateSchema.parse(data);
  await repo.updateStock(productId, validatedData.variants);
};
