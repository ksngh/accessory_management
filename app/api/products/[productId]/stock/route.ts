import { NextResponse } from 'next/server';
import { getStockDetail, updateStock } from '@/server/domain/stock/stock.service';
import { ZodError } from 'zod';

interface Params {
  params: {
    productId: string;
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const stockDetail = await getStockDetail(params.productId);
    return NextResponse.json(stockDetail);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    await updateStock(params.productId, body);
    const updatedStockDetail = await getStockDetail(params.productId);
    return NextResponse.json(updatedStockDetail);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
