import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Boxes, Leaf, PackageCheck, Sparkles } from 'lucide-react';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TestimonialsSlider from '@/components/home/TestimonialsSlider';
import SectionHeading from '@/components/shared/SectionHeading';
import CategoryCard from '@/components/shared/CategoryCard';
import { homeCategories } from '@/data/categories';
import { testimonials } from '@/data/testimonials';
import { heroImages, productImages } from '@/data/images';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <section className="section section--categories">
        <div className="container">
          <SectionHeading eyebrow="Explore our collection" title="Shop by category" text="Find something for the pantry, the snack bowl, or a moment worth celebrating." />
          <div className="category-grid" data-aos="fade-up">
            {homeCategories.map((category) => <CategoryCard key={category.id} category={category} />)}
          </div>
        </div>
      </section>

      <section className="section section--featured">
        <div className="container">
          <SectionHeading eyebrow="Handpicked for you" title="Our finest picks" text="Featured pantry picks and curated combinations from our collection." />
          <FeaturedProducts />
          <div className="featured-products__action"><Link className="button button--navy" href="/products">View all products <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="section section--combos">
        <div className="container">
          <div className="combo-feature" data-aos="fade-up">
            <div className="combo-feature__photo combo-feature__photo--banner">
              <div className="combo-feature__banner-frame">
                <Image src={productImages.comboBanner} alt="A curated assortment of dry fruits, seeds, honey and sweets for sharing" fill sizes="(max-width: 800px) 100vw, 50vw" />
              </div>
            </div>
            <div className="combo-feature__copy">
              <p className="eyebrow">Four easy ways to share</p>
              <h2>Your favourites, <em>already gathered.</em></h2>
              <p>Explore ready-made mixes, from a ten-item dry fruit selection to honey, seeds and berry favourites. Find a little goodness for snack time, tiffin, gifting or travel.</p>
              <div className="combo-picks" aria-label="Combo selections shown in the banner">
                <div className="combo-pick"><span className="combo-pick__number">01</span><span><strong>Dry fruit mix</strong><small>Ten familiar favourites</small></span></div>
                <div className="combo-pick"><span className="combo-pick__number">02</span><span><strong>Honey & pantry</strong><small>A sweet and savoury pairing</small></span></div>
                <div className="combo-pick"><span className="combo-pick__number">03</span><span><strong>Seed selection</strong><small>Everyday seeds, together</small></span></div>
                <div className="combo-pick"><span className="combo-pick__number">04</span><span><strong>Berry mix</strong><small>Fruit, seeds and a little treat</small></span></div>
              </div>
              <div className="combo-feature__foot">
                <Link href="/combos" className="button button--navy">Explore all combos <ArrowRight size={17} /></Link>
                <span>Made for the moments you share</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--bulk-promo">
        <div className="container">
          <div className="bulk-banner" data-aos="fade-up">
            <Image src={heroImages[0]} alt="A generous arrangement of pantry ingredients and dried fruit" fill sizes="100vw" />
            <div className="bulk-banner__shade" />
            <div className="bulk-banner__content">
              <span className="bulk-banner__icon"><Boxes size={20} /> A little more to share</span>
              <p className="eyebrow">For teams, events & gifting</p>
              <h2>Bulk orders, made personal.</h2>
              <p>Looking for a considered selection for your business, a gathering or a gift? Tell us what you have in mind and start a conversation with our team.</p>
              <div className="hero-actions">
                <Link href="/bulk-orders" className="button button--light">Explore bulk orders <ArrowRight size={17} /></Link>
                <Link href="/contact" className="button button--outline-light">Contact us</Link>
              </div>
            </div>
            <span className="bulk-banner__side-note">Quality you can taste, trust you can feel</span>
          </div>
        </div>
      </section>

      <section className="section section--promise">
        <div className="container">
          <SectionHeading eyebrow={`The ${siteConfig.shortName} promise`} title="Room for the everyday, and the special." text="A considered range for home cupboards, thoughtful gifting and larger business requirements." />
          <div className="promise-grid">
            <article data-aos="fade-up"><span className="promise-icon"><Leaf size={20} /></span><p className="eyebrow">A considered range</p><h3>Everyday pantry favourites</h3><p>Nuts, dried fruit, seeds, snacks, honey and more, brought together in one browseable collection.</p></article>
            <article data-aos="fade-up" data-aos-delay="80"><span className="promise-icon"><Sparkles size={20} /></span><p className="eyebrow">For the moments that matter</p><h3>Combinations to share</h3><p>Explore ready-to-browse selections for everyday enjoyment, gifting and get-togethers.</p></article>
            <article data-aos="fade-up" data-aos-delay="160"><span className="promise-icon"><PackageCheck size={20} /></span><p className="eyebrow">A conversation first</p><h3>Flexible bulk enquiries</h3><p>Share your product mix, approximate quantity and timeline so your requirement can be understood clearly.</p></article>
          </div>
        </div>
      </section>

      <section className="section section--testimonials">
        <div className="container">
          <SectionHeading eyebrow="Client Experiences" title="Trusted by families & businesses" text="Hear what our valued patrons and corporate partners say about our quality and service." />
          <TestimonialsSlider testimonials={testimonials} />
        </div>
      </section>
      <div className="home-endline"><span>Quality you can taste, trust you can feel</span><span className="home-endline__rule" /><span>{siteConfig.name}</span></div>
    </>
  );
}
