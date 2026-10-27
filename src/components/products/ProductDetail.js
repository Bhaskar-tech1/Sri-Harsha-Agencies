'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, ChevronRight, Minus, PackageCheck, Plus, Share2, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/categories';
import { formatCurrency, getDiscountPercent, getProductPrice } from '@/lib/pricing';
import ProductCard from '@/components/products/ProductCard';
import { siteConfig } from '@/config/site';

export default function ProductDetail({ product, category, relatedProducts }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const { price, mrp } = getProductPrice(product, selectedVariant);
  const discount = getDiscountPercent(mrp, price);
  const relatedCategory = product.category ? categories.find((item) => item.id === product.category) : null;

  async function shareProduct() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: `${product.name} from ${siteConfig.name}`, url });
        setShareMessage('Product shared.');
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage('Product link copied.');
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setShareMessage('Product link copied.');
      } catch {
        setShareMessage('Sharing is unavailable in this browser. You can copy the page address to share it.');
      }
    }
  }

  function addSelection(goToCart = false) {
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    if (goToCart) {
      router.push('/cart');
      return;
    }
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <section className="detail-page">
        <div className="container">
          <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><ChevronRight size={15} />
            <Link href="/products">Products</Link><ChevronRight size={15} />
            {category && <><Link href={`/products?category=${category.id}`}>{category.label}</Link><ChevronRight size={15} /></>}
            <span aria-current="page">{product.name}</span>
          </nav>

          <div className="detail-layout">
            <div className="detail-visual">
              <div className="detail-image-wrap">
                <Image src={product.image} alt={product.imageAlt || product.name} fill priority sizes="(max-width: 820px) 100vw, 50vw" />
                {product.featured && <span className="detail-featured">Featured selection</span>}
              </div>
              <p className="detail-image-caption"><span>{siteConfig.name}</span><span>Thoughtful pantry favourites</span></p>
            </div>

            <div className="detail-copy">
              <div className="detail-label-row">
                <span className="eyebrow">{product.type === 'combo' ? 'Curated combination' : category?.label || 'The collection'}</span>
                {product.inStock && <span className="detail-availability"><i /> Available</span>}
              </div>
              <div className="detail-title-row">
                <h1>{product.name}</h1>
                <button className="detail-share" type="button" onClick={shareProduct} aria-label={`Share ${product.name}`}><Share2 size={17} /><span>Share</span></button>
              </div>
              <p className="detail-description">{product.description}</p>

              <div className="detail-price-row">
                <strong>{formatCurrency(price)}</strong>
                {mrp > price && <><del>{formatCurrency(mrp)}</del><span>Save {discount}%</span></>}
              </div>

              <div className="detail-divider" />

              {product.variants?.length > 0 ? (
                <fieldset className="detail-variant-picker">
                  <legend>Choose your pack</legend>
                  <div className="detail-variant-options">
                    {product.variants.map((variant) => (
                      <button key={variant.id} type="button" className={`detail-variant ${selectedVariant?.id === variant.id ? 'is-selected' : ''}`} onClick={() => setSelectedVariant(variant)} aria-pressed={selectedVariant?.id === variant.id}>
                        <span>{variant.label}</span><small>{formatCurrency(variant.salePrice)}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <div className="detail-combo-pack"><span>Selection</span><strong>{product.variantLabel}</strong></div>
              )}

              <div className="detail-quantity-row">
                <span>Quantity</span>
                <div className="detail-quantity" aria-label="Choose quantity">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" disabled={quantity <= 1}><Minus size={16} /></button>
                  <output aria-live="polite">{quantity}</output>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(99, value + 1))} aria-label="Increase quantity" disabled={quantity >= 99}><Plus size={16} /></button>
                </div>
              </div>

              <div className="detail-actions">
                <button className={`button button--navy detail-add ${added ? 'is-added' : ''}`} type="button" onClick={() => addSelection()} disabled={!product.inStock}>
                  {added ? <><Check size={18} /> Added to cart</> : <><ShoppingBag size={18} /> Add to cart</>}
                </button>
                <button className="button button--outline-navy detail-buy" type="button" onClick={() => addSelection(true)} disabled={!product.inStock}>Continue to cart <ArrowRight size={17} /></button>
              </div>
              <p className="detail-feedback" role="status" aria-live="polite">{shareMessage || (added ? `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.` : '')}</p>

              <div className="detail-promises">
                <div><span><PackageCheck size={19} /></span><p><strong>Carefully selected</strong><small>Thoughtful pantry favourites</small></p></div>
                <div><span><Truck size={19} /></span><p><strong>Need a larger order?</strong><small><Link href="/bulk-orders">Ask about bulk orders</Link></small></p></div>
              </div>
            </div>
          </div>

          <section className="detail-about" aria-labelledby="detail-about-title">
            <div><p className="eyebrow">A little more about it</p><h2 id="detail-about-title">A good pick for your pantry.</h2></div>
            <p>{product.description} Choose the pack that suits your table, then add it to your selection. For product or order questions, <Link href="/contact">get in touch with our team</Link>.</p>
            <div className="detail-about-tags"><span>{product.type === 'combo' ? 'Curated selection' : category?.label || `${siteConfig.shortName} collection`}</span>{selectedVariant && <span>{selectedVariant.label} pack</span>}</div>
          </section>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section detail-related">
          <div className="container">
            <div className="detail-related-heading"><div><p className="eyebrow">Picked to go well together</p><h2>Related favourites</h2><p>{relatedCategory ? `More from ${relatedCategory.label}, plus a few nearby pantry picks.` : 'A few more thoughtful selections from our collection.'}</p></div><Link className="text-link" href={product.type === 'combo' ? '/combos' : '/products'}>Explore the collection <ArrowRight size={16} /></Link></div>
            <div className="product-grid product-grid--catalogue">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
