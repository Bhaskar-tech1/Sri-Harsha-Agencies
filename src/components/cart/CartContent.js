'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { findProduct } from '@/data/products';
import { formatCurrency } from '@/lib/pricing';
import { buildOrderMessage, openWhatsAppMessage } from '@/lib/whatsapp';

export default function CartContent() {
  const { items, count, hydrated, changeQuantity, removeItem } = useCart();
  const [feedback, setFeedback] = useState('');
  const lines = items.map((item) => {
    const product = item.product || findProduct(item.productId);
    if (!product) return null;
    const variant = item.variant || product.variants?.find((option) => option.id === item.variantId);
    const price = Number(item.price ?? variant?.salePrice ?? product.salePrice ?? 0);
    const variantLabel = item.variantLabel || variant?.label || product.variantLabel || '';
    return { ...item, product, variant, price, variantLabel };
  }).filter(Boolean);
  const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);

  function orderViaWhatsApp() {
    if (!lines.length) return;
    const result = openWhatsAppMessage(buildOrderMessage(lines, subtotal));
    if (result === 'opened') setFeedback('WhatsApp has opened with your order summary. Review the details and press Send to complete your enquiry.');
    else if (result === 'blocked') setFeedback('Your browser blocked the WhatsApp tab. Allow pop-ups to continue. Your cart is saved and the order has not been sent.');
    else setFeedback('WhatsApp contact is not configured yet. Your cart is saved and your order has not been sent.');
  }

  if (!hydrated) return <div className="cart-loading" aria-live="polite">Loading your saved cart…</div>;

  if (!lines.length) return (
    <div className="cart-empty"><span><ShoppingBag size={25} /></span><p className="eyebrow">A little room for something good</p><h2>Your cart is waiting.</h2><p>Browse the collection and add a few pantry favourites to get started.</p><Link className="button button--navy" href="/products">Browse products <ArrowLeft size={16} /></Link></div>
  );

  return (
    <div className="cart-layout">
      <div className="cart-items">
        <div className="cart-list-heading"><span>Your selection</span><span>{count} {count === 1 ? 'item' : 'items'}</span></div>
        {lines.map((line) => <article className="cart-item" key={`${line.productId}-${line.variantId}`}>
          <div className="cart-item__image"><Image src={line.product.image} alt={line.product.imageAlt || line.product.name} fill sizes="120px" /></div>
          <div className="cart-item__details"><p className="eyebrow">{line.product.type === 'combo' ? 'Curated combo' : 'Pantry selection'}</p><h2>{line.product.name}</h2>{line.variantLabel && <span>{line.variantLabel}</span>}<button className="cart-remove" type="button" onClick={() => removeItem(line.productId, line.variantId)}><Trash2 size={14} />Remove</button></div>
          <div className="cart-item__controls"><span className="cart-item__price">{formatCurrency(line.price)}</span><div className="quantity-control"><button type="button" aria-label={`Decrease quantity of ${line.product.name}`} onClick={() => changeQuantity(line.productId, line.variantId, -1)}><Minus size={14} /></button><span>{line.quantity}</span><button type="button" aria-label={`Increase quantity of ${line.product.name}`} onClick={() => changeQuantity(line.productId, line.variantId, 1)}><Plus size={14} /></button></div></div>
          <strong className="cart-item__subtotal">{formatCurrency(line.price * line.quantity)}</strong>
        </article>)}
        <Link className="cart-continue" href="/products"><ArrowLeft size={15} /> Continue browsing</Link>
      </div>
      <aside className="cart-summary"><p className="eyebrow">Order overview</p><h2>Subtotal</h2><div className="cart-summary__line"><span>{count} {count === 1 ? 'item' : 'items'}</span><strong>{formatCurrency(subtotal)}</strong></div><div className="cart-summary__total"><span>Cart subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><p className="cart-summary__note">Shipping and other charges are not included and can be discussed when your order is confirmed.</p><button className="button button--orange button--checkout" type="button" onClick={orderViaWhatsApp}>Order via WhatsApp <ArrowLeft size={16} /></button><p className="cart-summary__secure">Your cart stays saved until you choose to change it.</p>{feedback && <p className="form-feedback form-feedback--error" role="status">{feedback}</p>}</aside>
    </div>
  );
}
