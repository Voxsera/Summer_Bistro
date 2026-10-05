import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';
import Photo from './Photo.jsx';
import Magnetic from './Magnetic.jsx';

const SPACES = ['🌿 Garden seating', '💧 Waterfall views', '🛋 Lounge corners', '🚪 Private dining', '📺 Live sports', '📶 Free Wi-Fi'];

export default function Story() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-speed]', root.current).forEach((el) => {
        const speed = parseFloat(el.dataset.speed);
        gsap.fromTo(
          el,
          { yPercent: speed * 20 },
          { yPercent: -speed * 20, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
      gsap.from('.story-text .reveal-up', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.story-text', start: 'top 75%' },
      });
      gsap.from('.story-collage .photo', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.4,
        stagger: 0.15,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.story-collage', start: 'top 75%' },
      });
      gsap.to('.story-stamp', {
        rotate: -360,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="story" id="story" ref={root}>
      <div className="container story-grid">
        <div className="story-collage">
          <div className="sc sc-1" data-speed="0.6">
            <Photo src="/photos/garden.jpg" art="garden" color="#A9DBEA" alt="The Summer Bistro garden and waterfall" />
          </div>
          <div className="sc sc-2" data-speed="-0.5">
            <Photo src="/photos/interior.jpg" art="lounge" color="#F6E3C6" alt="Lounge seating inside Summer Bistro" />
          </div>
          <div className="sc sc-3" data-speed="1">
            <Photo src="/photos/night.jpg" art="night" color="#232C5A" alt="Summer Bistro at night" />
          </div>
          <svg className="story-stamp" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="storyCircle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
            </defs>
            <circle cx="100" cy="100" r="98" />
            <text>
              <textPath href="#storyCircle">SUMMER BISTRO • JUBILEE HILLS • HYDERABAD • </textPath>
            </text>
            <text x="100" y="118" textAnchor="middle" className="stamp-mid">☕</text>
          </svg>
        </div>

        <div className="story-text">
          <p className="eyebrow reveal-up">Our story</p>
          <h2 className="h2 reveal-up">
            Made for night owls <span className="script">&amp; early birds</span>
          </h2>
          <p className="reveal-up">
            Summer Bistro started with a simple idea: a great café shouldn't have a closing time. Wrapping up a late
            shift, catching up after a movie, or grabbing breakfast before the city wakes up — our doors, and our
            espresso machine, are always on.
          </p>
          <p className="reveal-up">
            Tucked under the metro on Road No. 5, Jubilee Hills, we built a little green escape: a garden with a
            gentle waterfall, cosy lounge corners and a kitchen serving continental and fusion favourites at every
            hour.
          </p>
          <ul className="spaces reveal-up">
            {SPACES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="reveal-up">
            <Magnetic>
              <a className="btn btn-dark btn-lg" href="#visit">
                Come say hi <span className="arr">→</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
