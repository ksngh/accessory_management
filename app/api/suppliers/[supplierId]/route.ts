import { NextResponse } from 'next/server';
import { updateSupplier, deleteSupplier } from '@/server/domain/suppliers/suppliers.service';
import { ZodError } from 'zod';

interface Params {
  params: {
    supplierId: string;
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const updatedSupplier = await updateSupplier(params.supplierId, body);
    if (!updatedSupplier) {
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }
    return NextResponse.json(updatedSupplier);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const success = await deleteSupplier(params.supplierId);
    if (!success) {
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
