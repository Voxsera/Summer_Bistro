import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { CupScene } from '../three/CupScene.js';
import Magnetic from './Magnetic.jsx';
import { INFO } from '../data/content.js';

const START_MIN = 8 * 60; // 08:00 AM
const SPAN_MIN = 19 * 60; // → 03:00 AM

function formatClock(p) {
  const m = Math.round((START_MIN + p * SPAN_MIN) / 5) * 5 % 1440;
  const h24 = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  const h12 = ((h24 + 11) % 12) + 1;
  return `${String(h12).padStart(2, '0')}:${mm} ${h24 < 12 ? 'AM' : 'PM'}`;
}

export default function Hero({ ready }) {
  const root = useRef(null);
  const canvasWrap = useRef(null);
  const scene = useRef(null);
  const clock = useRef(null);
  const dayRef = useRef(null);
  const nightRef = useRef(null);

  const stars = useMemo(() => {
    let s = 11;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 80 }, () => ({
      left: `${r() * 100}%`,
      top: `${r() * 70}%`,
      size: r() * 2.4 + 1,
      delay: `${r() * 4}s`,
    }));
  }, []);

  // three.js scene
  useEffect(() => {
    let s;
    try {
      s = new CupScene(canvasWrap.current);
      scene.current = s;
    } catch (err) {
      console.warn('WebGL unavailable', err);
      root.current.classList.add('no-webgl');
    }
    return () => s && s.destroy();
  }, []);

  // scroll: day → night
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (scene.current) scene.current.progress = p;
            if (clock.current) clock.current.textContent = formatClock(p);
            root.current.classList.toggle('is-night', p > 0.5);
            dayRef.current.style.pointerEvents = p < 0.35 ? 'auto' : 'none';
            nightRef.current.style.pointerEvents = p > 0.6 ? 'auto' : 'none';
          },
        },
      });
      tl.to('.sky-night', { opacity: 1, duration: 1 }, 0)
        .to('.sun', { yPercent: 280, xPercent: -30, duration: 0.6, ease: 'power1.in' }, 0)
        .to('.clouds', { opacity: 0, y: -80, duration: 0.45 }, 0)
        .fromTo('.moon', { yPercent: 240, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.4)
        .to('.stars', { opacity: 1, duration: 0.5 }, 0.45)
        .to('.hero-day', { yPercent: -18, opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.2)
        .fromTo('.hero-night', { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.32, ease: 'power2.out' }, 0.56)
        .to(root.current, { '--hero-ink': '#FFF6E9', '--big-stroke': 'rgba(244,241,222,0.22)', duration: 0.3 }, 0.42)
        .to('.hero-big', { xPercent: -6, duration: 1 }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  // entrance once the preloader lifts
  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from('.hero-day .line > span', { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.12, ease: 'expo.out' })
        .from('.hero-day .kicker, .hero-day .lead, .hero-day .cta-row', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, '-=0.95')
        .from('.hero-foot > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.8')
        .from('.hero-big', { opacity: 0, scale: 0.92, duration: 1.6, ease: 'expo.out' }, 0)
        .from('.sun', { scale: 0.4, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0);
      if (scene.current) gsap.to(scene.current, { intro: 1, duration: 2.4, ease: 'power2.out' });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="sky sky-day" />
      <div className="sky sky-night" />
      <div className="stars" aria-hidden="true">
        {stars.map((st, i) => (
          <i key={i} style={{ left: st.left, top: st.top, width: st.size, height: st.size, animationDelay: st.delay }} />
        ))}
      </div>
      <div className="sun" aria-hidden="true" />
      <div className="moon" aria-hidden="true" />
      <div className="clouds" aria-hidden="true">
        <span className="cloud c1" />
        <span className="cloud c2" />
        <span className="cloud c3" />
      </div>
      <div className="hero-big" aria-hidden="true">24/7</div>
      <div className="hero-canvas" ref={canvasWrap} aria-hidden="true" />

      <div className="hero-content container">
        <div className="hero-copy hero-day" ref={dayRef}>
          <p className="kicker">
            <span className="pill">☀ Good morning, Hyderabad</span>
          </p>
          <h1 className="display">
            <span className="line"><span>Sip slow.</span></span>
            <span className="line"><span className="script">stay late.</span></span>
          </h1>
          <p className="lead">
            Jubilee Hills' round-the-clock garden café. Iced lattes, photo-printed coffee and comfort food —
            served beside the waterfall, at any hour.
          </p>
          <div className="cta-row">
            <Magnetic>
              <a className="btn btn-dark btn-lg" href="#menu" data-cursor="Hungry?">
                Explore the menu <span className="arr">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost btn-lg" href={INFO.district} target="_blank" rel="noopener">
                Reserve a table
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="hero-copy hero-night" ref={nightRef}>
          <p className="kicker">
            <span className="pill pill-night">☾ Still up? So are we.</span>
          </p>
          <div className="display" role="heading" aria-level="2">
            <span className="line"><span>3 AM cravings?</span></span>
            <span className="line"><span className="script">we're open.</span></span>
          </div>
          <p className="lead">
            Hot pasta, iced lattes and Biscoff cheesecake — every night of the year. The kitchen never sleeps, and
            neither do we.
          </p>
          <div className="cta-row">
            <a className="btn btn-sun btn-lg" href={`tel:${INFO.phone}`}>
              Call the café
            </a>
            <a className="btn btn-ghost-light btn-lg" href={INFO.zomato} target="_blank" rel="noopener">
              Order on Zomato
            </a>
          </div>
        </div>
      </div>

      <div className="hero-foot container">
        <div className="clock-chip">
          <span className="live" /> Now serving · <b ref={clock}>08:00 AM</b>
        </div>
        <div className="scroll-hint">
          Scroll to stay up late <span className="mouse"><i /></span>
        </div>
        <div className="hero-rating">
          <b>4.3★</b> Swiggy Dineout · <b>1.9K+</b> ratings
        </div>
      </div>
    </section>
  );
}
