import { NextRequest, NextResponse } from 'next/server';
import { createBulkProducts } from '@/server/domain/products/products.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../../_utils/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newProducts = await createBulkProducts(body, userId);
    return NextResponse.json(newProducts, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
