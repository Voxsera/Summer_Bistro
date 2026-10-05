import { MARQUEE } from '../data/content.js';

function Row({ outline = false }) {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="mq-track">
      {[0, 1].map((k) => (
        <div className="mq-group" key={k} aria-hidden={k === 1}>
          {items.map((t, i) => (
            <span key={i} className={outline ? 'mq-item outline' : 'mq-item'}>
              {t}
              <svg className="mq-star" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16Z" />
              </svg>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-label="Open 24/7 · Iced lattes · Photo-print coffee · Matcha bar · Garden and waterfall">
      <div className="mq mq-a">
        <Row />
      </div>
      <div className="mq mq-b">
        <Row outline />
      </div>
    </div>
  );
}
