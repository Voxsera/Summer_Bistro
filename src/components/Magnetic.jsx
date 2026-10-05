import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

// Wraps a button/link so it gently follows the cursor.
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
    };
  }, [strength]);
  return (
    <span className="magnetic" ref={ref}>
      {children}
    </span>
  );
}
