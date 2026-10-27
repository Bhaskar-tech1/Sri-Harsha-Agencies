import Link from 'next/link';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import ComboProducts from '@/components/products/ComboProducts';

export const metadata = { title: 'Curated combos' };

export default function CombosPage() {
  return (
    <>
      <section className="section section--combo-list" id="combo-list">
        <div className="container">
          <SectionHeading eyebrow="A little of everything" title="Meet the combinations" text="Browse our curated combinations and gift packs thoughtfully gathered for every occasion." />
          <div className="combo-value-strip"><span><Gift size={18} /> Ready-to-browse selections</span><i /><span><Sparkles size={18} /> Good for sharing or gifting</span><i /><span><ArrowRight size={18} /> Ask us about a larger order</span></div>
          <ComboProducts />
          <div className="combo-contact-strip"><p><span>Have a specific mix in mind?</span> We can start with your requirements and talk through the options.</p><Link className="button button--navy" href="/bulk-orders">Ask about a custom selection <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </>
  );
}
