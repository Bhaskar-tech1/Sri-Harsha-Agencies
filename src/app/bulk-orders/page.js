import { BadgePercent, Boxes, Building2, Gift, Store } from 'lucide-react';
import BulkEnquiryForm from '@/components/forms/BulkEnquiryForm';
import { siteConfig } from '@/config/site';

export const metadata = { title: 'Corporate & bulk orders' };

const services = [
  { title: 'Corporate Gifting', description: 'Thoughtful luxury hampers & gourmet gift boxes for esteemed teams and clients', icon: Gift },
  { title: 'Wholesale Supply', description: 'Direct commercial supply of premium nuts, seeds, and dry fruits in bulk volumes', icon: Store },
  { title: 'Custom Packaging', description: 'Bespoke packing, custom assortments, and festive branding tailored for your event', icon: Boxes },
  { title: 'Direct Wholesale Rates', description: 'Unbeatable source-direct bulk pricing with transparent tiered volume discounts', icon: BadgePercent },
];

export default function BulkOrdersPage() {
  return (
    <main className="bulk-orders-page">
      <section className="bulk-orders-hero">
        <div className="bulk-orders-hero__shade" />
        <div className="bulk-orders-hero__content">
          <span className="bulk-orders-hero__badge"><Building2 size={15} /> Trusted Wholesale &amp; Gifting Partner</span>
          <h1>Corporate &amp; Bulk Orders</h1>
          <p>Premium grade dry fruits, gourmet nuts, and festive hampers curated for enterprise gifting, weddings, events, and commercial wholesale — delivered fresh by {siteConfig.name}.</p>
        </div>
      </section>

      <section className="bulk-orders-services container" aria-label="Ways we can help">
        {services.map(({ title, description, icon: Icon }) => (
          <article className="bulk-service-card" key={title}>
            <span className="bulk-service-card__icon"><Icon size={20} strokeWidth={1.8} /></span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="bulk-orders-enquiry container" aria-labelledby="bulk-enquiry-title">
        <div className="bulk-orders-enquiry__heading">
          <p className="eyebrow">Tailored Solutions</p>
          <h2 id="bulk-enquiry-title">Request a Bulk Quote</h2>
          <span aria-hidden="true" />
          <p>Share your target quantities, required products, or event timeline — our dedicated team will provide custom packing recommendations and competitive wholesale pricing.</p>
        </div>
        <BulkEnquiryForm />
      </section>
    </main>
  );
}
