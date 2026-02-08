import * as repo from './suppliers.repo';
import { Supplier } from './suppliers.types';
import { supplierCreateSchema, supplierUpdateSchema } from '@/server/validators/supplier';

export const getSuppliers = async (userId: number): Promise<Supplier[]> => {
  return await repo.findAllSuppliers(userId);
};

export const createSupplier = async (data: { name: string }, userId: number): Promise<Supplier> => {
  const validatedData = supplierCreateSchema.parse(data);
  return await repo.createSupplier(validatedData.name, userId);
};

export const updateSupplier = async (id: number, data: { name?: string }, userId: number): Promise<Supplier | null> => {
  const validatedData = supplierUpdateSchema.parse(data);
  if (!validatedData.name) {
    // Or handle as an error, depending on desired behavior for empty updates
    const existing = await repo.findAllSuppliers(userId);
    return existing.find(s => s.id === id) || null;
  }
  return await repo.updateSupplier(id, validatedData.name, userId);
};

export const deleteSupplier = async (id: number, userId: number): Promise<boolean> => {
  return await repo.deleteSupplier(id, userId);
};
