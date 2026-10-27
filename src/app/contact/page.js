import { ArrowUpRight, Clock3, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { siteConfig } from '@/config/site';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  const instagram = siteConfig.socials[0];
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}`;

  return (
    <main className="contact-page">
      <section className="section contact-page-section">
        <div className="container contact-card">
          <aside className="contact-card__aside">
            <p className="eyebrow">We’re here to help</p>
            <h1>Get in touch</h1>
            <p className="contact-card__intro">Whether you’re choosing something for home or planning a larger order, our team is ready to help.</p>
            <div className="contact-card__details">
              <a className="contact-card__detail" href={siteConfig.locationUrl} target="_blank" rel="noreferrer">
                <span><MapPin size={19} /></span><span><small>Visit our store</small><strong>{siteConfig.address}</strong></span>
              </a>
              <a className="contact-card__detail" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>
                <span><Phone size={19} /></span><span><small>Call us</small><strong>{siteConfig.phone}</strong></span>
              </a>
              {instagram && <a className="contact-card__detail" href={instagram.href} target="_blank" rel="noreferrer">
                <span><Instagram size={19} /></span><span><small>Instagram</small><strong>{instagram.label}</strong></span>
              </a>}
            </div>
            <div className="contact-card__note">
              <span><Clock3 size={19} /></span>
              <div><strong>Store hours</strong><p>Message us on WhatsApp to confirm today’s opening hours before your visit.</p></div>
            </div>
            <div className="contact-card__actions">
              <a className="button button--light" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp us <ArrowUpRight size={15} /></a>
              <a className="button button--outline-light" href={siteConfig.locationUrl} target="_blank" rel="noreferrer">Directions <ArrowUpRight size={15} /></a>
            </div>
          </aside>
          <div className="contact-card__form">
            <div className="contact-card__form-heading"><p className="eyebrow">A note to our team</p><h2>Send an enquiry</h2><p>Fill out the form and we’ll prepare your message in WhatsApp.</p></div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
