import { z } from 'zod';

export const productStatisticsSchema = z.object({
  startYear: z.string(),
  startMonth: z.string(),
  endYear: z.string(),
  endMonth: z.string(),
  supplierId: z.string().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  sortBy: z.enum(['quantity', 'amount']).optional(),
});
