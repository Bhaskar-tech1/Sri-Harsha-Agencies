'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useCart } from '@/context/CartContext';

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/combos', label: 'Combos' },
  { href: '/bulk-orders', label: 'Bulk orders' },
  { href: '/about', label: 'Our story' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <div className="announcement">{siteConfig.announcement}</div>
      <header className={`site-header ${open ? 'is-open' : ''}`}>
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label={`${siteConfig.name} home`} onClick={close}>
            <span className="brand__logo"><Image src={siteConfig.logo} alt="" width={58} height={58} priority /></span>
            <span className="brand__name">Sri Harsha<span>Agencies</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? 'is-active' : ''} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}
          </nav>
          <div className="header-actions">
            <Link href="/cart" className="cart-link" aria-label={count ? `Shopping cart with ${count} ${count === 1 ? 'item' : 'items'}` : 'Shopping cart, empty'}>
              <ShoppingBag size={20} strokeWidth={1.8} /><span className="cart-link__label">Cart</span>{count > 0 && <span className="cart-count">{count}</span>}
            </Link>
            <button className="mobile-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <div id="mobile-navigation" className={`mobile-nav ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
          <nav aria-label="Mobile navigation">
            {links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? 'is-active' : ''} onClick={close}>{link.label}</Link>)}
            <Link href="/cart" onClick={close}>Shopping cart <span className="mobile-nav__count">{count} {count === 1 ? 'item' : 'items'}</span></Link>
          </nav>
        </div>
      </header>
      {open && <button className="mobile-nav-backdrop" type="button" onClick={close} aria-label="Close navigation menu" />}
    </>
  );
}
