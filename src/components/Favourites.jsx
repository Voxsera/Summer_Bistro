import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import Photo from './Photo.jsx';
import { FAVOURITES } from '../data/content.js';

export default function Favourites() {
  const root = useRef(null);
  const track = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faves-head .reveal-up', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });

      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth + 64;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.faves-progress span', { scaleX: self.progress }),
          },
        });
        // cards gently rotate as they travel
        gsap.utils.toArray('.fave-card', root.current).forEach((card) => {
          gsap.fromTo(
            card.querySelector('.photo .art, .photo img'),
            { xPercent: 12, scale: 1.12 },
            {
              xPercent: -12,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        });
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  const tilt = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.6, ease: 'power3.out' });
  };
  const untilt = (e) => gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });

  return (
    <section className="faves" id="favourites" ref={root}>
      <div className="faves-head container">
        <div>
          <p className="eyebrow reveal-up">Crowd favourites</p>
          <h2 className="h2 reveal-up">
            The ones everyone <span className="script">orders</span>
          </h2>
        </div>
        <div className="faves-side reveal-up">
          <p>Six things our regulars order on repeat — day, night, and that weird hour in between.</p>
          <div className="faves-progress"><span /></div>
        </div>
      </div>

      <div className="faves-track" ref={track}>
        {FAVOURITES.map((f, i) => (
          <article
            className="fave-card"
            key={f.name}
            style={{ '--c': f.color }}
            data-cursor="Yum"
            onPointerMove={tilt}
            onPointerLeave={untilt}
          >
            <Photo src={f.photo} art={f.art} color={f.color} alt={f.name} className="fave-photo">
              <span className="fave-no">{String(i + 1).padStart(2, '0')}</span>
              {f.tag && <span className="fave-tag">{f.tag}</span>}
            </Photo>
            <div className="fave-body">
              <span className="fave-pair">{f.pair}</span>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
            </div>
          </article>
        ))}
        <a className="fave-card fave-cta" href="#menu" data-cursor="Menu">
          <span className="script">and so</span>
          <strong>much more</strong>
          <span className="fave-cta-btn">See the full menu →</span>
        </a>
      </div>
    </section>
  );
}
