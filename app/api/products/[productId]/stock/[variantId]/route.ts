import { NextResponse } from 'next/server';
import { deleteStockVariant } from '@/server/domain/stock/stock.service';
import { ZodError } from 'zod';

interface Params {
  params: {
    productId: string;
    variantId: string;
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await deleteStockVariant(params.variantId);
    return NextResponse.json({ message: 'Stock variant deleted successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
