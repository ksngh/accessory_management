import * as repo from './statistics.repo';
import { ProductStatisticsResponse } from './statistics.types';
import { productStatisticsSchema } from '@/server/validators/statistics';

export const getProductStatistics = async (query: any): Promise<ProductStatisticsResponse> => {
  const validatedQuery = productStatisticsSchema.parse(query);

  const { startYear, startMonth, endYear, endMonth, sortBy, ...filters } = validatedQuery;
  
  const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, 1);
  const endDate = new Date(parseInt(endYear), parseInt(endMonth), 1);

  const items = await repo.findProductStatistics({ startDate, endDate, sortBy, ...filters });

  const totals = items.reduce(
    (acc, item) => {
      acc.qty += Number(item.totalQty);
      acc.amount += Number(item.totalAmount);
      return acc;
    },
    { qty: 0, amount: 0 }
  );

  return {
    range: {
      start: `${startYear}.${startMonth}`,
      end: `${endYear}.${endMonth}`,
    },
    filters: {
      ...filters,
      sortBy: sortBy,
    },
    totals,
    items,
  };
};
