import { NextRequest, NextResponse } from 'next/server';
import { getProduct, deleteProduct } from '@/server/domain/products/products.service';
import { getUserIdFromRequest } from '../../_utils/auth';

interface Params {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { productId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(productId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }
    const product = await getProduct(id, userId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { productId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(productId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }

    const success = await deleteProduct(id, userId);
    if (!success) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error?.code === '23503') {
      return NextResponse.json({ message: 'Product is used in orders' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
