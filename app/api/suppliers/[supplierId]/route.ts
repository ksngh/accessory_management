import { NextRequest, NextResponse } from 'next/server';
import { updateSupplier, deleteSupplier } from '@/server/domain/suppliers/suppliers.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../../_utils/auth';

interface Params {
  params: Promise<{
    supplierId: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { supplierId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(supplierId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid supplier id' }, { status: 400 });
    }
    console.log(`--- PATCH request received for supplierId: ${id} ---`);
    const body = await request.json();
    console.log('Request body:', body);
    const updatedSupplier = await updateSupplier(id, body, userId);
    if (!updatedSupplier) {
      console.log(`--- Supplier with ID ${id} not found in database. ---`);
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }
    console.log('--- Supplier updated successfully ---');
    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error('--- Error in PATCH handler for supplierId ---', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { supplierId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(supplierId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid supplier id' }, { status: 400 });
    }
    console.log(`--- DELETE request received for supplierId: ${id} ---`);
    const success = await deleteSupplier(id, userId);
    if (!success) {
      console.log(`--- Supplier with ID ${id} not found or could not be deleted. ---`);
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }
    console.log('--- Supplier deleted successfully ---');
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('--- Error in DELETE handler for supplierId ---', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
