import ProductCatalogue from '@/components/products/ProductCatalogue';
import { getAllProducts } from '@/lib/products-store';
import { siteConfig } from '@/config/site';

export const metadata = { title: 'Products' };
export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  let products = [];
  try {
    products = await getAllProducts();
  } catch (err) {
    console.error('Error fetching products on server:', err);
  }

  const standardProducts = products.filter((p) => p.type === 'product');

  return (
    <>
      <section className="page-hero page-hero--products">
        <div className="container page-hero__content">
          <p className="eyebrow">The {siteConfig.shortName} collection</p>
          <h1>Explore our products</h1>
          <p>Dry fruits, nuts, seeds, snacks and more for your home.</p>
        </div>
      </section>
      <section className="section section--catalogue">
        <div className="container">
          <ProductCatalogue
            initialCategory={params?.category || ''}
            initialProducts={standardProducts}
          />
        </div>
      </section>
    </>
  );
}
