import Link from 'next/link';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import ComboProducts from '@/components/products/ComboProducts';

export const metadata = { title: 'Curated combos' };

export default function CombosPage() {
  return (
    <>
      <section className="page-hero page-hero--combos">
        <div className="container page-hero__content">
          <p className="eyebrow">A little of everything</p>
          <h1>Our combo packs</h1>
          <p>Ready-made packs with dry fruits, seeds, honey and snacks.</p>
        </div>
      </section>
      <section className="section section--combo-list" id="combo-list">
        <div className="container">
          <div className="combo-value-strip"><span><Gift size={18} /> Ready-to-browse selections</span><i /><span><Sparkles size={18} /> Good for sharing or gifting</span><i /><span><ArrowRight size={18} /> Ask us about a larger order</span></div>
          <ComboProducts />
          <div className="combo-contact-strip"><p><span>Have a specific mix in mind?</span> We can start with your requirements and talk through the options.</p><Link className="button button--navy" href="/bulk-orders">Ask about a custom selection <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </>
  );
}
