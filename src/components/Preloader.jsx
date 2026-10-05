import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap.js';
import { onFrameProgress, startLoading } from '../lib/frames.js';

// Counts 00 → 24 while the scroll-video frames load, then lifts away.
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const num = useRef(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    document.documentElement.classList.add('is-loading');
    startLoading();
    const shown = { v: 0 };
    let target = 0;
    let finished = false;
    const started = performance.now();

    const ctx = gsap.context(() => {
      gsap.from('.pl-logo', { scale: 0.85, autoAlpha: 0, duration: 0.9, ease: 'expo.out' });
    }, root);

    const finish = () => {
      if (finished) return;
      finished = true;
      ctx.add(() => {
        gsap
          .timeline({
            onComplete: () => {
              document.documentElement.classList.remove('is-loading');
              setGone(true);
            },
          })
          .to(shown, { v: 24, duration: 0.4, ease: 'power2.out', onUpdate: paint })
          .to('.pl-bar span', { scaleX: 1, duration: 0.4 }, '<')
          .to('.pl-inner', { yPercent: -15, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')
          .add(() => onDone && onDone())
          .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '<');
      });
    };

    function paint() {
      if (num.current) num.current.textContent = String(Math.round(shown.v)).padStart(2, '0');
    }

    // ease the counter towards the real load progress
    const tick = () => {
      if (finished) return;
      shown.v += (target * 24 - shown.v) * 0.12;
      paint();
      gsap.set(root.current.querySelector('.pl-bar span'), { scaleX: shown.v / 24 });
      const elapsed = performance.now() - started;
      // enough frames to scrub smoothly, or we've waited long enough
      if ((target >= 0.6 && elapsed > 1400) || elapsed > 7000) finish();
    };
    gsap.ticker.add(tick);
    const off = onFrameProgress((p) => (target = p));

    return () => {
      gsap.ticker.remove(tick);
      off();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-inner">
        <img className="pl-logo" src="/logo-light.svg" alt="" />
        <div className="pl-count">
          <span ref={num}>00</span>
          <small>hours a day</small>
        </div>
        <div className="pl-bar"><span /></div>
      </div>
    </div>
  );
}
