import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { seedProducts } from '@/lib/products-store';
import { products } from '@/data/products';

export const runtime = 'nodejs';

export async function POST() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await seedProducts(products);
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json({ error: 'Could not seed products into the configured data store.' }, { status: 500 });
  }
}

