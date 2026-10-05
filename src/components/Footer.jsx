import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { INFO } from '../data/content.js';

const WORD = 'Summer Bistro';

export default function Footer() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fw-char', {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.04,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.footer-word', start: 'top 95%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={root}>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/logo-light.svg" alt="Summer Bistro Café" />
            <p>Hyderabad's 24/7 garden café. Coffee, comfort food and good vibes — at any hour.</p>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><a href="#favourites">Favourites</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#story">Our story</a></li>
              <li><a href="#visit">Visit us</a></li>
            </ul>
          </div>
          <div>
            <h5>Order &amp; book</h5>
            <ul>
              <li><a href={INFO.zomato} target="_blank" rel="noopener">Zomato ↗</a></li>
              <li><a href={INFO.swiggy} target="_blank" rel="noopener">Swiggy Dineout ↗</a></li>
              <li><a href={INFO.district} target="_blank" rel="noopener">District ↗</a></li>
            </ul>
          </div>
          <div>
            <h5>Say hello</h5>
            <ul>
              <li><a href={`tel:${INFO.phone}`}>{INFO.phoneDisplay}</a></li>
              <li><a href={INFO.instagram} target="_blank" rel="noopener">Instagram ↗</a></li>
              <li>{INFO.shortAddress}, Hyderabad</li>
              <li className="sun-text">Open 24/7</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-word" aria-hidden="true">
        {WORD.split('').map((ch, i) => (
          <span className="fw-mask" key={i}>
            <span className="fw-char">{ch === ' ' ? ' ' : ch}</span>
          </span>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Summer Bistro Café. All rights reserved.</span>
        <span>
          Built by{' '}
          <a href="https://voxsera.com/" target="_blank" rel="noopener">
            Voxsera AI Solutions
          </a>
        </span>
      </div>
    </footer>
  );
}
