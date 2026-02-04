import { NextResponse } from 'next/server';
import { getProducts } from '@/server/domain/products/products.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId') || undefined;
    const category = searchParams.get('category') || undefined;

    const products = await getProducts({ supplierId, category });
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
