import { NextResponse } from 'next/server';
import { getOrder, updateOrderStatus } from '@/server/domain/orders/orders.service';
import { ZodError } from 'zod';

interface Params {
  params: {
    orderId: string;
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const order = await getOrder(params.orderId);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const updatedOrder = await updateOrderStatus(params.orderId, body);
    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
