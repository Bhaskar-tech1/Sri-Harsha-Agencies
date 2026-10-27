import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import { categories } from '@/data/categories';
import { getAllProducts, getProductById } from '@/lib/products-store';
import { getRelatedProducts } from '@/lib/recommendations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'Product not found' };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const products = await getAllProducts();
  const category = categories.find((item) => item.id === product.category);
  const relatedProducts = getRelatedProducts(product, products);

  return <ProductDetail product={product} category={category} relatedProducts={relatedProducts} />;
}
