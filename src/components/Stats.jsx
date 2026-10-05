import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { STATS, INFO } from '../data/content.js';

export default function Stats() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.stat-num b', root.current).forEach((el) => {
        const target = parseFloat(el.dataset.value);
        const decimals = parseInt(el.dataset.decimals, 10);
        const o = { v: 0 };
        gsap.to(o, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => (el.textContent = o.v.toFixed(decimals)),
        });
      });
      gsap.from('.stat', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.stats-grid', start: 'top 80%' },
      });
      gsap.to('.badge-24 svg', { rotate: 360, duration: 18, repeat: -1, ease: 'none' });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="stats" ref={root}>
      <div className="container">
        <div className="stats-top">
          <h2 className="h2">
            Loved across <span className="script">Hyderabad</span>
          </h2>
          <div className="badge-24" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <defs>
                <path id="badgeCircle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
              </defs>
              <text>
                <textPath href="#badgeCircle">OPEN 24 HOURS • 7 DAYS A WEEK • 365 DAYS • </textPath>
              </text>
            </svg>
            <span>☾☀</span>
          </div>
        </div>

        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num">
                <b data-value={s.value} data-decimals={s.decimals}>
                  0
                </b>
                <em>{s.suffix}</em>
              </div>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="stats-links">
          <span>Book or order on</span>
          <a href={INFO.swiggy} target="_blank" rel="noopener" className="chip">Swiggy Dineout ↗</a>
          <a href={INFO.district} target="_blank" rel="noopener" className="chip">District ↗</a>
          <a href={INFO.zomato} target="_blank" rel="noopener" className="chip">Zomato ↗</a>
        </div>
      </div>
    </section>
  );
}
