'use client';

import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

export default function ComboProducts() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCombos() {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load combos.');

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid product response.');

        if (!cancelled) setCombos(data.filter((product) => product.type === 'combo'));
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCombos();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="empty-state" role="status"><p>Loading combos...</p></div>;
  }

  if (loadFailed) {
    return <div className="empty-state" role="status"><p>Combos are temporarily unavailable.</p></div>;
  }

  if (!combos.length) {
    return (
      <div className="empty-state">
        <span><Gift size={25} strokeWidth={1.7} aria-hidden="true" /></span>
        <h2>No combos added yet</h2>
        <p>Curated combos will appear here once added from the admin panel.</p>
      </div>
    );
  }

  return <div className="product-grid product-grid--catalogue">{combos.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
