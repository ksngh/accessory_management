import { NextResponse } from 'next/server';
import { getStockDetail, updateStock } from '@/server/domain/stock/stock.service';
import { ZodError } from 'zod';

interface Params {
  params: {
    productId: string;
  }
}

export async function GET(request: Request, { params }: Params) {
  const { productId } = params;
  try {
    const id = parseInt(productId, 10);
    const stockDetail = await getStockDetail(id);
    return NextResponse.json(stockDetail);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { productId } = params;
  try {
    const id = parseInt(productId, 10);
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
    
    await updateStock(id, { variants });
    const updatedStockDetail = await getStockDetail(id);
    return NextResponse.json(updatedStockDetail);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
