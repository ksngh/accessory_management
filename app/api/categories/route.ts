import { NextResponse } from 'next/server';
import { getCategories } from '@/server/domain/categories/categories.service';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
