import { NextRequest, NextResponse } from 'next/server';
import { getProductStatistics } from '@/server/domain/statistics/statistics.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../../_utils/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const statistics = await getProductStatistics(query, userId);
    return NextResponse.json(statistics);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
