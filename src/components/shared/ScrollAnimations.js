'use client';

import { useEffect } from 'react';
import 'aos/dist/aos.css';

export default function ScrollAnimations() {
  useEffect(() => {
    let instance;
    let active = true;
    import('aos').then(({ default: AOS }) => {
      if (!active) return;
      instance = AOS;
      AOS.init({ duration: 650, once: true, offset: 55, easing: 'ease-out-cubic', disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches });
    });
    return () => {
      active = false;
      instance?.refreshHard();
    };
  }, []);
  return null;
}
