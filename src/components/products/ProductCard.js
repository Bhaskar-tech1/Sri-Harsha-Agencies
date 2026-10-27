'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { categoryById } from '@/data/categories';
import { formatCurrency, getDiscountPercent, getProductPrice } from '@/lib/pricing';

export default function ProductCard({ product }) {
  const firstVariant = product.variants?.[0] || null;
  const [selectedVariant, setSelectedVariant] = useState(firstVariant);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { price, mrp } = getProductPrice(product, selectedVariant);
  const discount = getDiscountPercent(mrp, price);
  const detailHref = `/products/${product.id}`;

  function handleAdd() {
    addItem(product, selectedVariant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link className="product-card__image-link" href={detailHref} aria-label={`View ${product.name} details`}>
          <Image src={product.image} alt={product.imageAlt || product.name} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 24vw" />
        </Link>
        {discount > 0 && <span className="discount-badge">Save {discount}%</span>}
        {product.featured && <span className="product-tag">Featured</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.type === 'combo' ? 'Curated combo' : product.categoryLabel || categoryById[product.category]?.label}</p>
        <h3><Link href={detailHref}>{product.name}</Link></h3>
        {product.variants?.length > 0 && (
          <div className="variant-list" aria-label={`Choose pack size for ${product.name}`}>
            {product.variants.map((variant) => (
              <button key={variant.id} type="button" className={`variant-chip ${selectedVariant?.id === variant.id ? 'is-selected' : ''}`} onClick={() => setSelectedVariant(variant)} aria-pressed={selectedVariant?.id === variant.id}>
                {variant.label}
              </button>
            ))}
          </div>
        )}
        {product.type === 'combo' && <span className="combo-variant">{product.variantLabel}</span>}
        <div className="product-card__bottom">
          <div className="price-line">
            <span className="price-current">{formatCurrency(price)}</span>
            {mrp > price && <span className="price-mrp">{formatCurrency(mrp)}</span>}
          </div>
          <button type="button" className={`button button--add ${added ? 'is-added' : ''}`} onClick={handleAdd} disabled={!product.inStock}>
            {added ? <><Check size={16} /> Added</> : <><ShoppingBag size={16} /> {product.inStock ? 'Add to cart' : 'Out of stock'}</>}
          </button>
        </div>
      </div>
    </article>
  );
}
