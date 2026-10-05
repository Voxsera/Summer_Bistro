import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import Photo from './Photo.jsx';
import Magnetic from './Magnetic.jsx';
import { GALLERY, INFO } from '../data/content.js';

export default function Gallery() {
  const root = useRef(null);
  const cols = [GALLERY.slice(0, 3), GALLERY.slice(3, 6), GALLERY.slice(6, 9)];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const speeds = [-18, 14, -24];
      gsap.utils.toArray('.g-col', root.current).forEach((col, i) => {
        gsap.fromTo(
          col,
          { yPercent: -speeds[i] },
          { yPercent: speeds[i], ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
      gsap.from('.gallery-title .line > span', {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.gallery-title', start: 'top 75%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="gallery" ref={root}>
      <div className="gallery-cols" aria-hidden="true">
        {cols.map((col, i) => (
          <div className="g-col" key={i}>
            {col.map((g) => (
              <figure className="g-tile" key={g.photo}>
                <Photo src={g.photo} art={g.art} color={g.color} alt={g.caption} />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
      <div className="gallery-overlay">
        <h2 className="gallery-title">
          <span className="line"><span>Snap it.</span></span>
          <span className="line"><span className="script">tag it.</span></span>
        </h2>
        <p>Latte-art selfies, 3 AM pizza runs and golden-hour garden tables. Share your Summer Bistro moments with us.</p>
        <Magnetic>
          <a className="btn btn-sun btn-lg" href={INFO.instagram} target="_blank" rel="noopener" data-cursor="Follow">
            Follow on Instagram
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
