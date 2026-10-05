import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap.js';
import Photo from './Photo.jsx';
import { MENU, INFO } from '../data/content.js';

export default function Menu() {
  const root = useRef(null);
  const list = useRef(null);
  const preview = useRef(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [shown, setShown] = useState(null);
  const first = useRef(true);
  const cat = MENU[active];

  // section entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.menu-head .reveal-up', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
      gsap.from('.menu-cat', {
        x: -40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.menu-cats', start: 'top 80%' },
      });
      gsap.from('.menu-row', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.menu-list', start: 'top 80%' },
      });
      gsap.to('.menu-stamp', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // animate rows when the category changes
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo('.menu-row', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out' });
      gsap.fromTo('.menu-list-head > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 });
    }, list);
    return () => ctx.revert();
  }, [active]);

  // floating photo preview that follows the cursor
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = preview.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const rTo = gsap.quickTo(el, 'rotate', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    const move = (e) => {
      xTo(e.clientX + 30);
      yTo(e.clientY - 130);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    gsap.to(preview.current, {
      scale: hovered ? 1 : 0.4,
      opacity: hovered ? 1 : 0,
      duration: 0.45,
      ease: hovered ? 'back.out(1.6)' : 'power2.out',
    });
  }, [hovered]);

  return (
    <section className="menu" id="menu" ref={root}>
      <div className="container">
        <div className="menu-head">
          <div>
            <p className="eyebrow reveal-up">Served 24 hours</p>
            <h2 className="h2 reveal-up">
              The <span className="script">menu</span>
            </h2>
          </div>
          <p className="reveal-up">
            Continental comfort food, fusion plates, desserts and a full coffee &amp; matcha bar. Hover a dish for a
            closer look.
          </p>
        </div>

        <div className="menu-grid">
          <div className="menu-cats" role="tablist" aria-label="Menu categories">
            {MENU.map((c, i) => (
              <button
                key={c.category}
                role="tab"
                aria-selected={i === active}
                className={`menu-cat ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="menu-cat-name">{c.category}</span>
                <sup>{String(c.items.length).padStart(2, '0')}</sup>
              </button>
            ))}
            <svg className="menu-stamp" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="stampCircle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <circle cx="100" cy="100" r="98" />
              <text>
                <textPath href="#stampCircle">KITCHEN NEVER CLOSES • KITCHEN NEVER CLOSES • </textPath>
              </text>
              <text x="100" y="114" textAnchor="middle" className="stamp-mid">24/7</text>
            </svg>
          </div>

          <div className="menu-list" ref={list} role="tabpanel">
            <div className="menu-list-head">
              <h3>{cat.category}</h3>
              <span className="script">{cat.blurb}</span>
            </div>
            {cat.items.map((it) => (
              <div
                className="menu-row"
                key={it.name}
                onPointerEnter={() => {
                  setHovered(it);
                  setShown(it);
                }}
                onPointerLeave={() => setHovered(null)}
              >
                <span
                  className={`veg ${it.veg === true ? 'is-veg' : it.veg === false ? 'is-nv' : 'is-none'}`}
                  title={it.veg === true ? 'Veg' : it.veg === false ? 'Non-veg' : ''}
                />
                <div className="menu-row-main">
                  <div className="menu-row-top">
                    <h4>{it.name}</h4>
                    {it.tag && <span className="menu-tag">{it.tag}</span>}
                    <span className="leader" />
                    {it.price ? <span className="menu-price">₹{it.price}</span> : <span className="menu-arrow">↗</span>}
                  </div>
                  <p>{it.desc}</p>
                </div>
              </div>
            ))}
            <div className="menu-note">
              <span><i className="veg is-veg" /> Veg</span>
              <span><i className="veg is-nv" /> Non-veg</span>
              <a href={INFO.zomato} target="_blank" rel="noopener" className="link-underline">
                Order on Zomato →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-preview" ref={preview} aria-hidden="true">
        {shown && <Photo key={shown.name} src={shown.photo} art={shown.art} color="#F6E3C6" alt="" />}
      </div>
    </section>
  );
}
