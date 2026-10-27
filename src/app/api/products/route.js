import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getAllProducts, addProduct } from '@/lib/products-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getAllProducts(), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Products could not be loaded from the configured data store.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'Product details are required.' }, { status: 400 });
    }

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name || !['product', 'combo'].includes(data.type)) {
      return NextResponse.json({ error: 'A product name and valid type are required.' }, { status: 400 });
    }

    const created = await addProduct({ ...data, name });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    const message = process.env.NODE_ENV === 'development' && error instanceof Error
      ? error.message
      : 'Product could not be saved. Check the configured storage and try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
