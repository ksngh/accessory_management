import { NextRequest, NextResponse } from 'next/server';
import { deleteStockVariant } from '@/server/domain/stock/stock.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../../../../_utils/auth';

interface Params {
  params: Promise<{
    productId: string;
    variantId: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { variantId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const variantIdNumber = parseInt(variantId, 10);
    if (!Number.isFinite(variantIdNumber)) {
      return NextResponse.json({ message: 'Invalid variant id' }, { status: 400 });
    }
    await deleteStockVariant(variantIdNumber, userId);
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
