import { NextResponse } from 'next/server';
import { getProduct } from '@/server/domain/products/products.service';

interface Params {
  params: {
    productId: string;
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const product = await getProduct(params.productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
