import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrderStatus, deleteOrder } from '@/server/domain/orders/orders.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../../_utils/auth';

interface Params {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { orderId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(orderId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid order id' }, { status: 400 });
    }
    const order = await getOrder(id, userId);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { orderId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(orderId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid order id' }, { status: 400 });
    }
    const body = await request.json();
    const updatedOrder = await updateOrderStatus(id, body, userId);
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

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { orderId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(orderId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid order id' }, { status: 400 });
    }

    const success = await deleteOrder(id, userId);
    if (!success) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
