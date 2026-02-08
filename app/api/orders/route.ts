import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/server/domain/orders/orders.service';
import { OrderStatus } from '@/server/domain/orders/orders.enums';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../_utils/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | undefined;
    const supplierIdRaw = searchParams.get('supplierId');
    const supplierId = supplierIdRaw ? parseInt(supplierIdRaw, 10) : undefined;
    
    const orders = await getOrders(userId, { status, supplierId });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newOrder = await createOrder(body, userId);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
