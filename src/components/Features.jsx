import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import Art from './Art.jsx';
import { FEATURES } from '../data/content.js';

export default function Features() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.features-head .line > span', {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.features-head', start: 'top 80%' },
      });
      const cards = gsap.utils.toArray('.stack-card', root.current);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(card.querySelector('.stack-inner'), { scale: 1, filter: 'brightness(1)' }, {
          scale: 0.9,
          filter: 'brightness(0.85)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
        });
      });
      gsap.utils.toArray('.stack-art', root.current).forEach((el) => {
        gsap.fromTo(
          el,
          { rotate: -8, scale: 0.85 },
          { rotate: 6, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="features" ref={root}>
      <div className="container">
        <h2 className="features-head h2">
          <span className="line"><span>Everything a café</span></span>
          <span className="line"><span className="script">should be…</span></span>
        </h2>
        <div className="stack">
          {FEATURES.map((f, i) => (
            <article className="stack-card" key={f.no} style={{ '--i': i, '--c': f.color }}>
              <div className="stack-inner">
                <div className="stack-text">
                  <span className="stack-no">{f.no}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
                <div className="stack-art">
                  <Art name={f.art} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
