import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/server/domain/products/products.service';
import { getUserIdFromRequest } from '../_utils/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const supplierIdRaw = searchParams.get('supplierId');
    const supplierId = supplierIdRaw ? parseInt(supplierIdRaw, 10) : undefined;
    const category = searchParams.get('category') || undefined;

    const products = await getProducts(userId, { supplierId, category });
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
