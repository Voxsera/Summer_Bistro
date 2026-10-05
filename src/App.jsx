import { useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap.js';
import { initSmoothScroll, scrollToTarget, lockScroll } from './lib/smoothScroll.js';
import Preloader from './components/Preloader.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import ScrollVideo from './components/ScrollVideo.jsx';
import Marquee from './components/Marquee.jsx';
import Favourites from './components/Favourites.jsx';
import Menu from './components/Menu.jsx';
import Features from './components/Features.jsx';
import Stats from './components/Stats.jsx';
import Story from './components/Story.jsx';
import Gallery from './components/Gallery.jsx';
import Visit from './components/Visit.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const destroy = initSmoothScroll();
    lockScroll(true);
    window.scrollTo(0, 0);

    // smooth-scroll in-page anchor links
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        scrollToTarget(id);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      destroy && destroy();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    lockScroll(false);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => clearTimeout(id);
  }, [ready]);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <ScrollVideo ready={ready} />
        <Marquee />
        <Favourites />
        <Menu />
        <Features />
        <Stats />
        <Story />
        <Gallery />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
