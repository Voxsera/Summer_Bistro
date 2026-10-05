import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { lockScroll } from '../lib/smoothScroll.js';
import { INFO } from '../data/content.js';

const LINKS = [
  ['Favourites', '#favourites'],
  ['Menu', '#menu'],
  ['Our story', '#story'],
  ['Visit', '#visit'],
];

export default function Nav() {
  const nav = useRef(null);
  const overlay = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        nav.current.classList.toggle('is-scrolled', y > 40);
        if (y > 400 && self.direction === 1) nav.current.classList.add('is-hidden');
        else if (self.direction === -1) nav.current.classList.remove('is-hidden');
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    lockScroll(open);
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      gsap.fromTo(
        overlay.current.querySelectorAll('.mo-link'),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', delay: 0.15 }
      );
    }
  }, [open]);

  return (
    <>
      <header className="nav" ref={nav}>
        <div className="nav-inner">
          <a href="#top" className="nav-logo" aria-label="Summer Bistro Café — home">
            <img src="/logo.svg" alt="Summer Bistro Café" />
          </a>
          <nav className="nav-links" aria-label="Main">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href}>
                <span data-text={label}>{label}</span>
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <span className="nav-open">
              <i /> Open now
            </span>
            <a className="btn btn-dark btn-sm" href={INFO.district} target="_blank" rel="noopener">
              Reserve
            </a>
            <button
              className={`burger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-overlay ${open ? 'is-open' : ''}`} ref={overlay} aria-hidden={!open}>
        <div className="mo-links">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              <span className="mo-link">{label}</span>
            </a>
          ))}
        </div>
        <div className="mo-foot">
          <a href={`tel:${INFO.phone}`}>{INFO.phoneDisplay}</a>
          <span>{INFO.shortAddress} · Open 24/7</span>
        </div>
      </div>
    </>
  );
}
