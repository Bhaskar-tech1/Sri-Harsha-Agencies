'use client';

import { ArrowUpRight } from 'lucide-react';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

export default function TestimonialsSlider({ testimonials }) {
  return (
    <div className="testimonial-carousel">
      <Swiper
        modules={[A11y, Autoplay, Pagination]}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={12}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        speed={550}
        a11y={{ enabled: true }}
        breakpoints={{
          768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 22 },
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={item.byline}>
            <article className="testimonial-card">
              <span className="testimonial-card__mark" aria-hidden="true">“</span>
              <p>{item.quote}</p>
              <div className="testimonial-card__foot">
                <span className="testimonial-card__avatar">{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{item.byline}</strong><small>{item.context}</small></span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
