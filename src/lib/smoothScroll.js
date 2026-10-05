import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

let lenis = null;

export function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return null;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time) => lenis && lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function lockScroll(lock) {
  if (!lenis) return;
  lock ? lenis.stop() : lenis.start();
}
