import { NextRequest, NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '@/server/domain/categories/categories.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../../_utils/auth';

interface Params {
  params: {
    categoryId: string;
  };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.categoryId, 10);
    const body = await request.json();
    const updatedCategory = await updateCategory(id, body, userId);

    if (!updatedCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCategory);
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
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.categoryId, 10);
    const success = await deleteCategory(id, userId);
    if (!success) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
