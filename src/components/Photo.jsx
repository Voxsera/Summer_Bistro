import { useState } from 'react';
import Art from './Art.jsx';

// Shows a real photo if it exists in /public/photos, otherwise a coloured illustration.
export default function Photo({ src, art, color = '#F6E3C6', alt = '', className = '', children }) {
  const [failed, setFailed] = useState(!src);
  const [loaded, setLoaded] = useState(false);
  const showArt = failed || !loaded;
  return (
    <div className={`photo ${showArt ? 'is-art' : 'is-img'} ${className}`} style={{ '--ph': color }}>
      {showArt && <Art name={art} />}
      {!failed && (
        <img
          src={src}
          alt={alt}
          decoding="async"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}
