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
      <section className="page-intro page-intro--catalogue">
        <div className="container page-intro__inner">
          <div>
            <p className="eyebrow">The {siteConfig.shortName} collection</p>
            <h1>Explore our products</h1>
            <p>Browse pantry favourites, easy snacks and thoughtful selections for sharing.</p>
          </div>
          <span className="page-intro__note"><span>01</span> A sample catalogue for preview</span>
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
