import { fetcher } from './fetcher';
import type { Supplier } from '../types';

export const getSuppliers = (): Promise<Supplier[]> => {
  return fetcher<Supplier[]>('/suppliers');
};

export const addSupplier = (name: string): Promise<Supplier> => {
  return fetcher<Supplier>('/suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
};

export const updateSupplier = (id: string, name: string): Promise<Supplier> => {
  return fetcher<Supplier>(`/suppliers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
};

export const deleteSupplier = (id: string): Promise<void> => {
  return fetcher<void>(`/suppliers/${id}`, {
    method: 'DELETE',
  });
};
