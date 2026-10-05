import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });

    const move = (e) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e) => {
      const withLabel = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, [role="tab"]');
      ring.current.classList.toggle('is-label', !!withLabel);
      ring.current.classList.toggle('is-link', !withLabel && !!link);
      label.current.textContent = withLabel ? withLabel.getAttribute('data-cursor') : '';
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    document.documentElement.addEventListener('pointerenter', enter);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.removeEventListener('pointerenter', enter);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span ref={label} />
      </div>
    </>
  );
}
