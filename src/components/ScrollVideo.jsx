import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { FRAME_COUNT, getFrame, onFrameProgress, startLoading } from '../lib/frames.js';
import Magnetic from './Magnetic.jsx';
import { INFO } from '../data/content.js';

const START_MIN = 8 * 60; // clock runs 08:00 AM → 03:00 AM while you scroll
const SPAN_MIN = 19 * 60;
function formatClock(p) {
  const m = (Math.round((START_MIN + p * SPAN_MIN) / 5) * 5) % 1440;
  const h24 = Math.floor(m / 60);
  const h12 = ((h24 + 11) % 12) + 1;
  return `${String(h12).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
}

export default function ScrollVideo({ ready }) {
  const root = useRef(null);
  const frameWrap = useRef(null);
  const canvas = useRef(null);
  const clock = useRef(null);
  const counter = useRef(null);
  const state = useRef({ frame: 0, drawn: -1 });

  // ── canvas drawing ───────────────────────────────────────────
  useEffect(() => {
    startLoading();
    const c = canvas.current;
    const ctx = c.getContext('2d');
    let raf = 0;

    const draw = (force) => {
      const i = Math.round(state.current.frame);
      const img = getFrame(i);
      if (!img) return;
      if (!force && i === state.current.drawn && img === state.current.img) return;
      state.current.drawn = i;
      state.current.img = img;

      const cw = c.width;
      const ch = c.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      ctx.fillStyle = '#140906';
      ctx.fillRect(0, 0, cw, ch);

      const portrait = cw / ch < 0.9;
      if (!portrait) {
        // cover
        const s = Math.max(cw / iw, ch / ih);
        const w = iw * s;
        const h = ih * s;
        ctx.drawImage(img, (cw - w) * 0.52, (ch - h) / 2, w, h);
      } else {
        // phones: ambient full-bleed backdrop + a sharp, wider "window" band
        const s1 = Math.max(cw / iw, ch / ih);
        ctx.globalAlpha = 0.35;
        ctx.drawImage(img, (cw - iw * s1) * 0.52, (ch - ih * s1) / 2, iw * s1, ih * s1);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(20,9,6,0.62)';
        ctx.fillRect(0, 0, cw, ch);

        const s2 = cw / (iw * 0.46);
        const w = iw * s2;
        const h = Math.round(ih * s2);
        const y = ch * 0.31 - h / 2;
        // draw the band on an offscreen canvas and fade its top/bottom with an alpha mask
        const off = state.current.off || (state.current.off = document.createElement('canvas'));
        if (off.width !== cw || off.height !== h) {
          off.width = cw;
          off.height = h;
        }
        const o = off.getContext('2d');
        o.globalCompositeOperation = 'source-over';
        o.clearRect(0, 0, cw, h);
        o.drawImage(img, (cw - w) * 0.53, 0, w, h);
        const g = o.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.22, 'rgba(0,0,0,1)');
        g.addColorStop(0.72, 'rgba(0,0,0,1)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        o.globalCompositeOperation = 'destination-in';
        o.fillStyle = g;
        o.fillRect(0, 0, cw, h);
        ctx.drawImage(off, 0, y);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      draw(true);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      draw(false);
    };

    resize();
    window.addEventListener('resize', resize);
    const off = onFrameProgress(() => {
      if (state.current.drawn === -1) draw(true);
    });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      off();
    };
  }, []);

  // ── scroll timeline ─────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=320%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (clock.current) clock.current.textContent = formatClock(p);
            root.current.style.setProperty('--sv-p', p.toFixed(4));
            root.current.classList.toggle('ch1', p < 0.1);
            root.current.classList.toggle('ch3', p > 0.66);
          },
        },
      });

      // frames play across most of the scroll
      tl.to(state.current, {
        frame: FRAME_COUNT - 1,
        duration: 0.86,
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.round(state.current.frame) + 1).padStart(3, '0');
        },
      }, 0);

      // slow camera push-in
      tl.fromTo('.sv-media', { scale: 1.02 }, { scale: 1.14, duration: 0.86 }, 0);

      // chapter 1 → out
      tl.to('.sv-1', { autoAlpha: 0, y: -80, rotateX: 18, filter: 'blur(8px)', duration: 0.1, ease: 'power2.in' }, 0.1);
      // chapter 2
      tl.fromTo('.sv-2', { autoAlpha: 0, scale: 0.8, filter: 'blur(14px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.1, ease: 'power2.out' }, 0.26)
        .to('.sv-2', { autoAlpha: 0, scale: 1.25, filter: 'blur(10px)', duration: 0.09, ease: 'power2.in' }, 0.47);
      // chapter 3
      tl.fromTo('.sv-3 .sv-big span', { yPercent: 110 }, { yPercent: 0, duration: 0.12, stagger: 0.02, ease: 'power3.out' }, 0.6)
        .fromTo('.sv-3', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.6)
        .fromTo('.sv-3 .sv-sub', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.7);

      // outro: the whole film folds back into a 3D card
      tl.to('.sv-frame', {
        scale: 0.84,
        rotateX: 14,
        y: -30,
        borderRadius: 44,
        duration: 0.14,
        ease: 'power2.inOut',
      }, 0.86)
        .to('.sv-hud', { autoAlpha: 0, duration: 0.05 }, 0.86)
        .to('.sv-3', { y: -40, duration: 0.14 }, 0.86);
    }, root);
    return () => ctx.revert();
  }, []);

  // ── entrance + mouse depth ─────────────────────────────────
  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.1 })
        .from('.sv-media canvas', { scale: 1.3, duration: 2.2, ease: 'expo.out' }, 0)
        .from('.sv-1 .line > span', { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.12, ease: 'expo.out' }, 0.2)
        .from('.sv-1 .kicker, .sv-1 .lead, .sv-1 .cta-row', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.6)
        .from('.sv-hud > *', { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.8);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = frameWrap.current.querySelector('.sv-media');
    gsap.set(el, { transformPerspective: 1200 });
    const rx = gsap.quickTo(el, 'rotationY', { duration: 1.2, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationX', { duration: 1.2, ease: 'power3' });
    const layers = root.current.querySelectorAll('[data-depth]');
    const movers = [...layers].map((l) => ({
      x: gsap.quickTo(l, 'x', { duration: 1.2, ease: 'power3' }),
      y: gsap.quickTo(l, 'y', { duration: 1.2, ease: 'power3' }),
      d: parseFloat(l.dataset.depth),
    }));
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      rx(nx * 4);
      ry(-ny * 3);
      movers.forEach((m) => {
        m.x(nx * m.d * 40);
        m.y(ny * m.d * 30);
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <section className="sv" id="top" ref={root}>
      <div className="sv-stage">
        <div className="sv-frame" ref={frameWrap}>
          <div className="sv-media">
            <canvas ref={canvas} aria-label="A latte on a café table bursting into a splash of coffee and milk" role="img" />
          </div>
          <div className="sv-shade" />
        </div>

        {/* chapter 1 */}
        <div className="sv-copy sv-1 container">
          <div className="sv-1-inner" data-depth="0.6">
            <p className="kicker">
              <span className="pill pill-glass">
                <i className="live" /> Open now · Jubilee Hills
              </span>
            </p>
            <h1 className="display">
              <span className="line"><span>Sip slow.</span></span>
              <span className="line"><span className="script">stay late.</span></span>
            </h1>
            <p className="lead">
              Hyderabad's round-the-clock garden café. Coffee, comfort food and good vibes — served at any hour, every
              day of the year.
            </p>
            <div className="cta-row">
              <Magnetic>
                <a className="btn btn-sun btn-lg" href="#menu" data-cursor="Hungry?">
                  Explore the menu <span className="arr">→</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-ghost-light btn-lg" href={INFO.district} target="_blank" rel="noopener">
                  Reserve a table
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* chapter 2 */}
        <div className="sv-copy sv-2" aria-hidden="true">
          <div data-depth="1.2">
            <p className="sv-eyebrow">Every single cup</p>
            <p className="sv-mid">
              brewed to <span className="script">burst.</span>
            </p>
          </div>
        </div>

        {/* chapter 3 */}
        <div className="sv-copy sv-3">
          <div data-depth="0.9">
          <p className="sv-big" aria-label="Open 24/7">
            <span className="sv-mask"><span>Open</span></span>
            <span className="sv-mask"><span className="sun-num">24/7</span></span>
          </p>
          <div className="sv-sub">
            <p>Breakfast at 4 AM. Pasta at midnight. Coffee whenever.</p>
            <a className="btn btn-sun" href="#favourites">
              See what's brewing <span className="arr">↓</span>
            </a>
          </div>
          </div>
        </div>

        <div className="sv-hud container">
          <div className="clock-chip">
            <span className="live" /> Now serving · <b ref={clock}>08:00 AM</b>
          </div>
          <div className="sv-progress">
            <span className="sv-count" ref={counter}>001</span>
            <span className="sv-bar"><i /></span>
            <span className="sv-count">{FRAME_COUNT}</span>
          </div>
          <div className="scroll-hint">
            Scroll <span className="mouse"><i /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
