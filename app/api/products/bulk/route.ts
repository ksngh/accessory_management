import { NextResponse } from 'next/server';
import { createBulkProducts } from '@/server/domain/products/products.service';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProducts = await createBulkProducts(body);
    return NextResponse.json(newProducts, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
