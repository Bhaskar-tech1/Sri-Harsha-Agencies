'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Send, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { findProduct } from '@/data/products';
import { formatCurrency } from '@/lib/pricing';
import { buildOrderMessage, openWhatsAppMessage } from '@/lib/whatsapp';

export default function CartContent() {
  const { items, count, hydrated, changeQuantity, removeItem } = useCart();
  const [feedback, setFeedback] = useState(null);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', pinCode: '' });
  const orderDialogRef = useRef(null);
  const lines = items.map((item) => {
    const product = item.product || findProduct(item.productId);
    if (!product) return null;
    const variant = item.variant || product.variants?.find((option) => option.id === item.variantId);
    const price = Number(item.price ?? variant?.salePrice ?? product.salePrice ?? 0);
    const variantLabel = item.variantLabel || variant?.label || product.variantLabel || '';
    return { ...item, product, variant, price, variantLabel };
  }).filter(Boolean);
  const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);

  useEffect(() => {
    if (!orderFormOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOrderFormOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    orderDialogRef.current?.querySelector('input')?.focus();
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [orderFormOpen]);

  function openOrderForm() {
    if (!lines.length) return;
    setFeedback(null);
    setOrderFormOpen(true);
  }

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function orderViaWhatsApp(event) {
    event.preventDefault();
    if (!lines.length) return;
    const result = openWhatsAppMessage(buildOrderMessage(lines, subtotal, customer));
    setOrderFormOpen(false);
    if (result === 'opened') setFeedback({ kind: 'success', text: 'WhatsApp has opened with your order summary. Review the details and press Send to complete your enquiry.' });
    else if (result === 'blocked') setFeedback({ kind: 'error', text: 'Your browser blocked the WhatsApp tab. Allow pop-ups to continue. Your cart is saved and the order has not been sent.' });
    else setFeedback({ kind: 'error', text: 'WhatsApp contact is not configured yet. Your cart is saved and your order has not been sent.' });
  }

  if (!hydrated) return <div className="cart-loading" aria-live="polite">Loading your saved cart…</div>;

  if (!lines.length) return (
    <div className="cart-empty"><span><ShoppingBag size={25} /></span><p className="eyebrow">A little room for something good</p><h2>Your cart is waiting.</h2><p>Browse the collection and add a few pantry favourites to get started.</p><Link className="button button--navy" href="/products">Browse products <ArrowLeft size={16} /></Link></div>
  );

  return (
    <>
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
        <aside className="cart-summary"><p className="eyebrow">Order overview</p><h2>Subtotal</h2><div className="cart-summary__line"><span>{count} {count === 1 ? 'item' : 'items'}</span><strong>{formatCurrency(subtotal)}</strong></div><div className="cart-summary__total"><span>Cart subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><p className="cart-summary__note">Shipping and other charges are not included and can be discussed when your order is confirmed.</p><button className="button button--orange button--checkout" type="button" onClick={openOrderForm}>Order via WhatsApp <ArrowLeft size={16} /></button><p className="cart-summary__secure">Your cart stays saved until you choose to change it.</p>{feedback && <p className={`form-feedback form-feedback--${feedback.kind}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>{feedback.text}</p>}</aside>
      </div>

      {orderFormOpen && (
        <div className="order-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOrderFormOpen(false); }}>
          <section className="order-dialog" ref={orderDialogRef} role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
            <button className="order-dialog__close" type="button" onClick={() => setOrderFormOpen(false)} aria-label="Close order form"><X size={20} /></button>
            <h2 id="order-dialog-title">Complete your order</h2>
            <p>Enter your details to send the order via WhatsApp.</p>
            <form onSubmit={orderViaWhatsApp}>
              <label className="order-dialog__field"><span>Your name <b>*</b></span><input value={customer.name} onChange={(event) => updateCustomer('name', event.target.value)} autoComplete="name" placeholder="Enter your full name" required /></label>
              <label className="order-dialog__field"><span>Phone number <b>*</b></span><input value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value)} type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() .-]{7,18}" placeholder="Enter your phone number" required /></label>
              <label className="order-dialog__field"><span>Delivery address <b>*</b></span><textarea value={customer.address} onChange={(event) => updateCustomer('address', event.target.value)} autoComplete="street-address" rows="4" placeholder="Enter your full delivery address" required /></label>
              <label className="order-dialog__field"><span>PIN code <b>*</b></span><input value={customer.pinCode} onChange={(event) => updateCustomer('pinCode', event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" title="Enter a 6-digit PIN code" placeholder="Enter your 6-digit PIN code" required /></label>
              <div className="order-dialog__actions"><button className="order-dialog__cancel" type="button" onClick={() => setOrderFormOpen(false)}>Cancel</button><button className="button button--orange order-dialog__send" type="submit"><Send size={17} /> Send order</button></div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
