import { NextRequest, NextResponse } from 'next/server';
import { updateProductOrder } from '@/server/domain/products/products.service';
import { getUserIdFromRequest } from '../../_utils/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supplierId = Number(body?.supplierId);
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!Number.isFinite(supplierId)) {
      return NextResponse.json({ message: 'Invalid supplier id' }, { status: 400 });
    }

    const normalized = items
      .map((item: any) => ({
        productId: Number(item?.productId),
        rowIndex: Number(item?.rowIndex),
        colIndex: Number(item?.colIndex),
      }))
      .filter(item => Number.isFinite(item.productId) && Number.isFinite(item.rowIndex) && Number.isFinite(item.colIndex));

    if (normalized.length === 0) {
      return NextResponse.json({ message: 'No valid items provided' }, { status: 400 });
    }

    await updateProductOrder(userId, supplierId, normalized);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
