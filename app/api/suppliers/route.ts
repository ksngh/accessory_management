import { NextRequest, NextResponse } from 'next/server';
import { getSuppliers, createSupplier } from '@/server/domain/suppliers/suppliers.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../_utils/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const suppliers = await getSuppliers(userId);
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newSupplier = await createSupplier(body, userId);
    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
