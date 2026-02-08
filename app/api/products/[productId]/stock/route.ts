import { NextRequest, NextResponse } from 'next/server';
import { getStockDetail, updateStock, deleteStockVariantByKey } from '@/server/domain/stock/stock.service';
import { ZodError } from 'zod';
import { getUserIdFromRequest } from '../../../_utils/auth';

interface Params {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { productId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(productId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }
    const stockDetail = await getStockDetail(id, userId);
    return NextResponse.json(stockDetail);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { productId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(productId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }
    const formData = await request.formData();
    const variantsData = formData.get('variants');
    if (!variantsData || typeof variantsData !== 'string') {
      return NextResponse.json({ message: 'Validation error', errors: [{ message: "Missing 'variants' field" }] }, { status: 400 });
    }

    const variants = JSON.parse(variantsData);
    const imageFiles = formData.getAll('images');

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file instanceof File) {
        if (file.size > 200 * 1024 * 1024) { // 200MB
          return NextResponse.json({ message: `Image ${file.name} is larger than 200MB` }, { status: 400 });
        }
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString('base64');
        const mimeType = file.type;
        const dataUrl = `data:${mimeType};base64,${base64Image}`;
        
        // The variants are a string, so we need to find which variant this image belongs to.
        // The client should send the images in the same order as the variants.
        // A better approach would be to associate images with variants by a key.
        // For now, we assume the order is correct.
        variants[i].image = dataUrl;
      }
    }
    
    await updateStock(id, { variants }, userId);
    const updatedStockDetail = await getStockDetail(id, userId);
    return NextResponse.json(updatedStockDetail);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { productId } = await params;
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(productId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const color = searchParams.get('color');
    const sizeParam = searchParams.get('size');
    const size = sizeParam ? sizeParam : null;

    if (!color) {
      return NextResponse.json({ message: 'Missing color' }, { status: 400 });
    }

    const success = await deleteStockVariantByKey(id, color, size, userId);
    if (!success) {
      return NextResponse.json({ message: 'Stock variant not found' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
