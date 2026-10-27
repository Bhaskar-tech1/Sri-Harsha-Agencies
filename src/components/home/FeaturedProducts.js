'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedProducts() {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load products.');

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid product response.');

        if (!cancelled) {
          setProducts(data.filter((product) => product.featured).slice(0, 8));
        }
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFeaturedProducts();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <p className="featured-products__empty" role="status">Loading featured products...</p>;
  }

  if (loadFailed) {
    return <p className="featured-products__empty" role="status">Featured products are temporarily unavailable.</p>;
  }

  if (!products.length) {
    return <p className="featured-products__empty">Freshly curated selections arriving soon. Products will be showcased here once added.</p>;
  }

  return (
    <div className="product-grid product-grid--four" data-aos="fade-up">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
