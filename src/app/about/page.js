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
          <div className="about-hero__copy"><p className="eyebrow">A little about us</p><h1>Good things belong in everyday life.</h1><p>{siteConfig.name} brings together a considered range of wholesale dry fruits, nuts, seeds, snacks and curated combinations for homes and businesses.</p><Link className="button button--navy" href="/products">Browse the collection <ArrowRight size={17} /></Link></div>
          <div className="about-hero__image"><Image src={heroImages[0]} alt="A collection of pantry favourites arranged on a dark tabletop" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><span className="about-hero__caption">A collection of pantry favourites</span></div>
          <span className="about-hero__index">01 / OUR APPROACH</span>
        </div>
      </section>
      <section className="section section--about-statement">
        <div className="container about-statement"><span className="about-statement__mark"><Image src={siteConfig.logo} alt={`${siteConfig.name} logo`} width={140} height={140} /></span><div><p className="eyebrow">Thoughtfully brought together</p><h2>A collection for the cupboard, the gathering and everything in between.</h2><p>We want it to be easy to explore a broad range in one place, whether you are choosing something for home, planning a celebration, or looking into a larger business requirement.</p></div></div>
      </section>
      <section className="section section--about-range">
        <div className="container"><div className="about-range-heading"><div><p className="eyebrow">A broad pantry</p><h2>One collection.<br /><em>Many good reasons.</em></h2></div><p>From familiar favourites to curated combinations, browse the range and find a starting point that feels right for you.</p></div>
          <div className="about-range-grid"><article><span><Leaf size={19} /></span><small>01</small><h3>Everyday favourites</h3><p>Nuts, dry fruits, seeds, honey and snack options for a well-stocked pantry.</p></article><article><span><Boxes size={19} /></span><small>02</small><h3>Selections to share</h3><p>Curated combinations that bring a few familiar things together in one place.</p></article><article><span><PackageCheck size={19} /></span><small>03</small><h3>Made for larger needs</h3><p>A straightforward enquiry path for businesses, events and gifting requirements.</p></article></div>
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
