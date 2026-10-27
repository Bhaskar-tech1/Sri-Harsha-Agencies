import CartContent from '@/components/cart/CartContent';

export const metadata = { title: 'Your cart' };

export default function CartPage() {
  return <section className="section section--cart"><div className="container"><div className="cart-page-heading"><p className="eyebrow">Your selection</p><h1>Your cart</h1><p>Review your items and let us know when you are ready.</p></div><CartContent /></div></section>;
}
