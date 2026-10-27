import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Boxes, Leaf, PackageCheck } from 'lucide-react';
import { heroImages } from '@/data/images';
import { siteConfig } from '@/config/site';

export const metadata = { title: 'Our story' };

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container about-hero__grid">
          <div className="about-hero__copy"><p className="eyebrow">Our Heritage &amp; Quality</p><h1>Pure goodness, curated for life’s finest moments.</h1><p>{siteConfig.name} delivers an exceptional collection of premium dry fruits, wholesome nuts, nutrient-dense seeds, and festive gift boxes for healthy households and esteemed corporate partners.</p><Link className="button button--navy" href="/products">Browse the collection <ArrowRight size={17} /></Link></div>
          <div className="about-hero__image"><Image src={heroImages[0]} alt="A collection of pantry favourites arranged on a dark tabletop" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><span className="about-hero__caption">A curated collection of nature’s finest</span></div>
          <span className="about-hero__index">01 / OUR APPROACH</span>
        </div>
      </section>
      <section className="section section--about-statement">
        <div className="container about-statement"><span className="about-statement__mark"><Image src={siteConfig.logo} alt={`${siteConfig.name} logo`} width={140} height={140} /></span><div><p className="eyebrow">Crafted With Excellence</p><h2>From handpicked harvests straight to your home.</h2><p>We believe in authentic nourishment. Every almond, walnut, cashew, and date in our collection is carefully graded, meticulously sorted, and vacuum-sealed fresh to deliver unrivaled taste, crisp aroma, and lasting wellness.</p></div></div>
      </section>
      <section className="section section--about-range">
        <div className="container"><div className="about-range-heading"><div><p className="eyebrow">Uncompromising Standards</p><h2>One Collection.<br /><em>Pure Distinction.</em></h2></div><p>From everyday nutrition to festive celebrations and bespoke corporate hampers, explore a selection crafted with passion, authenticity, and care.</p></div>
          <div className="about-range-grid"><article><span><Leaf size={19} /></span><small>01</small><h3>Everyday Nutrition</h3><p>Hand-selected almonds, cashews, walnuts, raisins, and superfood seeds for a wholesome daily routine.</p></article><article><span><Boxes size={19} /></span><small>02</small><h3>Artisanal Hampers</h3><p>Exquisitely curated gift boxes and festive assortments designed to share moments of joy and celebration.</p></article><article><span><PackageCheck size={19} /></span><small>03</small><h3>Commercial &amp; Bulk</h3><p>Reliable wholesale supply, tailored custom packing, and transparent bulk pricing for corporate and festive needs.</p></article></div>
        </div>
      </section>
      {siteConfig.address && (
        <section className="section about-store" aria-labelledby="about-store-title">
          <div className="container">
            <div className="about-store__heading"><h2 id="about-store-title">Visit our store</h2><span aria-hidden="true" /><p>Find {siteConfig.name} in {siteConfig.address}.</p></div>
            {siteConfig.locationUrl ? (
              <a className="about-store__address" href={siteConfig.locationUrl} target="_blank" rel="noreferrer">{siteConfig.address} <ArrowRight size={16} /></a>
            ) : (
              <span className="about-store__address">{siteConfig.address}</span>
            )}
            {siteConfig.mapEmbedUrl && (
              <div className="about-store__map"><iframe title={`Map showing ${siteConfig.name}`} src={siteConfig.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
