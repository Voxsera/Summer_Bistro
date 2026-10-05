import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import Magnetic from './Magnetic.jsx';
import { INFO } from '../data/content.js';

export default function Visit() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.visit-card, .visit-map', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.visit-grid', start: 'top 80%' },
      });
      gsap.from('.late-title .line > span', {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.late', start: 'top 75%' },
      });
      gsap.to('.late-moon', {
        y: -60,
        rotate: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.late', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="visit" id="visit" ref={root}>
      <div className="container">
        <div className="visit-grid">
          <div className="visit-card">
            <p className="eyebrow">Find us</p>
            <h2 className="h2">
              Come by. <span className="script">anytime.</span>
            </h2>
            <ul className="visit-list">
              <li>
                <span className="vi">📍</span>
                <div>
                  <b>Address</b>
                  {INFO.address}
                </div>
              </li>
              <li>
                <span className="vi">🕒</span>
                <div>
                  <b>Hours</b>
                  <span className="big">Open 24 hours</span> · every day of the year
                </div>
              </li>
              <li>
                <span className="vi">📞</span>
                <div>
                  <b>Call</b>
                  <a href={`tel:${INFO.phone}`}>{INFO.phoneDisplay}</a>
                </div>
              </li>
              <li>
                <span className="vi">💳</span>
                <div>
                  <b>Good to know</b>
                  {INFO.costForTwo} · Free Wi-Fi · Kids &amp; groups welcome
                </div>
              </li>
            </ul>
            <div className="cta-row">
              <a className="btn btn-dark" href={INFO.district} target="_blank" rel="noopener">
                Reserve a table
              </a>
              <a className="btn btn-ghost" href={INFO.mapsLink} target="_blank" rel="noopener">
                Get directions ↗
              </a>
            </div>
          </div>
          <div className="visit-map">
            <iframe title="Summer Bistro on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={INFO.mapsEmbed} />
            <span className="map-pin">☕ Summer Bistro</span>
          </div>
        </div>
      </div>

      <div className="late">
        <svg className="late-moon" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M70 8 A44 44 0 1 0 92 72 A36 36 0 1 1 70 8Z" />
        </svg>
        <div className="container late-inner">
          <h2 className="late-title">
            <span className="line"><span>Hungry at 3 AM?</span></span>
            <span className="line"><span className="script">we're up.</span></span>
          </h2>
          <div className="late-ctas">
            <Magnetic>
              <a className="btn btn-sun btn-xl" href={`tel:${INFO.phone}`} data-cursor="Call">
                Call {INFO.phoneDisplay}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                className="btn btn-ghost-light btn-xl"
                href={`https://wa.me/${INFO.whatsapp}?text=${encodeURIComponent('Hi Summer Bistro! 👋')}`}
                target="_blank"
                rel="noopener"
              >
                WhatsApp us
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
