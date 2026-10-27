'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { homeSliderImages } from '@/data/images';
import { Autoplay, Pagination, A11y, EffectFade, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  { kicker: 'A GOOD PLACE TO BEGIN', title: 'Goodness in every handful.', copy: 'A colourful mix of everyday favourites, ready to make their way to your table.', image: homeSliderImages[0], alt: 'Bowls of almonds, pistachios, cashews and dates on a dark tabletop', cta: 'Explore the collection', href: '/products', secondary: 'Shop dry fruits', secondaryHref: '/products?category=dry-fruits', position: '58% 52%' },
  { kicker: 'SIMPLE PANTRY FAVOURITES', title: 'Make room for a little crunch.', copy: 'Browse seeds and snack essentials for the everyday moments in between.', image: homeSliderImages[1], alt: 'Ceramic bowls of pumpkin, sunflower, flax and mixed seeds beside honey', cta: 'Shop seeds', href: '/products?category=seeds', secondary: 'Browse all products', secondaryHref: '/products', position: '58% 50%' },
  { kicker: 'SOMETHING TO SHARE', title: 'A sweet note for the table.', copy: 'Discover familiar laddus, snack-time favourites and curated combinations.', image: homeSliderImages[2], alt: 'Golden laddus and festive Indian sweets arranged on a serving platter', cta: 'Explore snacks', href: '/products?category=laddus-snacks', secondary: 'See our combos', secondaryHref: '/combos', position: '58% 52%' },
  { kicker: 'FOR HOMES & BUSINESSES', title: 'A thoughtful mix, at your scale.', copy: 'Tell us what you are looking for and we will help you explore bulk options.', image: homeSliderImages[3], alt: 'An elegant unbranded gift box filled with assorted nuts and dried fruit', cta: 'Make a bulk enquiry', href: '/bulk-orders', secondary: 'Talk to our team', secondaryHref: '/contact', position: '60% 50%' },
];

export default function HeroSlider() {
  return (
    <section className="hero-slider" aria-label="Featured collections">
      <Swiper modules={[Autoplay, Pagination, A11y, EffectFade, Keyboard]} effect="fade" fadeEffect={{ crossFade: true }} loop autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }} pagination={{ clickable: true }} speed={1200} keyboard={{ enabled: true, onlyInViewport: true }} a11y={{ enabled: true }}>
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className={`hero-slide ${index === 3 ? 'hero-slide--soft' : ''}`}>
              <Image className="hero-slide__image" src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="100vw" style={{ objectPosition: slide.position }} />
              <div className="hero-slide__veil" />
              <div className="container hero-slide__content">
                <p className="hero-kicker"><span />{slide.kicker}</p>
                <h1>{slide.title}</h1>
                <p className="hero-slide__copy">{slide.copy}</p>
                <div className="hero-actions">
                  <Link className="button button--light" href={slide.href}>{slide.cta}<ArrowRight size={17} /></Link>
                  <Link className="button button--outline-light" href={slide.secondaryHref}>{slide.secondary}</Link>
                </div>
                <span className="hero-slide__index">0{index + 1} <i /> 0{slides.length}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-slider__note"><span>01</span><span>Small joys, thoughtfully gathered</span></div>
    </section>
  );
}
