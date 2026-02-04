import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/server/domain/orders/orders.service';
import { OrderStatus } from '@/server/domain/orders/orders.enums';
import { ZodError } from 'zod';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | undefined;
    const supplierId = searchParams.get('supplierId') || undefined;
    
    const orders = await getOrders({ status, supplierId });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await createOrder(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
