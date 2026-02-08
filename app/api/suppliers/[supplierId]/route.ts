import { NextResponse } from 'next/server';
import { updateSupplier, deleteSupplier } from '@/server/domain/suppliers/suppliers.service';
import { ZodError } from 'zod';

interface Params {
  params: {
    supplierId: string;
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { supplierId } = params;
  try {
    const id = parseInt(supplierId, 10);
    console.log(`--- PATCH request received for supplierId: ${id} ---`);
    const body = await request.json();
    console.log('Request body:', body);
    const updatedSupplier = await updateSupplier(id, body);
    if (!updatedSupplier) {
      console.log(`--- Supplier with ID ${id} not found in database. ---`);
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }
    console.log('--- Supplier updated successfully ---');
    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error(`--- Error in PATCH handler for supplierId: ${supplierId} ---`, error);
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { supplierId } = params;
  try {
    const id = parseInt(supplierId, 10);
    console.log(`--- DELETE request received for supplierId: ${id} ---`);
    const success = await deleteSupplier(id);
    if (!success) {
      console.log(`--- Supplier with ID ${id} not found or could not be deleted. ---`);
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }
    console.log('--- Supplier deleted successfully ---');
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`--- Error in DELETE handler for supplierId: ${supplierId} ---`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
