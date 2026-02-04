import * as repo from './suppliers.repo';
import { Supplier } from './suppliers.types';
import { supplierCreateSchema, supplierUpdateSchema } from '@/server/validators/supplier';

export const getSuppliers = async (): Promise<Supplier[]> => {
  return await repo.findAllSuppliers();
};

export const createSupplier = async (data: { name: string }): Promise<Supplier> => {
  const validatedData = supplierCreateSchema.parse(data);
  return await repo.createSupplier(validatedData.name);
};

export const updateSupplier = async (id: string, data: { name?: string }): Promise<Supplier | null> => {
  const validatedData = supplierUpdateSchema.parse(data);
  if (!validatedData.name) {
    // Or handle as an error, depending on desired behavior for empty updates
    const existing = await repo.findAllSuppliers();
    return existing.find(s => s.id === id) || null;
  }
  return await repo.updateSupplier(id, validatedData.name);
};

export const deleteSupplier = async (id: string): Promise<boolean> => {
  return await repo.deleteSupplier(id);
};
