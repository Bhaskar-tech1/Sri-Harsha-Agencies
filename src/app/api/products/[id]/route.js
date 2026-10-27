import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getProductById, updateProduct, deleteProduct } from '@/lib/products-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET â€” Fetch a single product by ID (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}

// PUT â€” Update a product (admin only)
export async function PUT(request, { params }) {
  const isAdmin = await verifySession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const updated = await updateProduct(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}

// DELETE â€” Delete a product (admin only)
export async function DELETE(request, { params }) {
  const isAdmin = await verifySession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}

// PATCH â€” Toggle stock status (admin only)
export async function PATCH(request, { params }) {
  const isAdmin = await verifySession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const updated = await updateProduct(id, { inStock: data.inStock === true });
    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating stock status:', error);
    return NextResponse.json({ error: 'Failed to update stock status.' }, { status: 500 });
  }
}

