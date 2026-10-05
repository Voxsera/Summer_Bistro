import * as THREE from 'three';

// Paints a latte surface (crema + rosetta/tulip art) onto a canvas texture.
export function makeLatteTexture(renderer) {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const cx = S / 2;
  const cy = S / 2;

  // crema base
  const base = g.createRadialGradient(cx, cy, 0, cx, cy, S / 2);
  base.addColorStop(0, '#C98F55');
  base.addColorStop(0.55, '#B47440');
  base.addColorStop(0.86, '#8E5530');
  base.addColorStop(1, '#5A2E18');
  g.fillStyle = base;
  g.fillRect(0, 0, S, S);

  // speckles
  for (let i = 0; i < 2600; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * S * 0.48;
    g.fillStyle = Math.random() > 0.5 ? 'rgba(90,46,24,0.18)' : 'rgba(255,230,190,0.12)';
    g.beginPath();
    g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.random() * 3 + 0.6, 0, Math.PI * 2);
    g.fill();
  }

  const milk = '#FFF4E2';
  g.filter = 'blur(2px)';

  // rosetta leaves, bottom to top
  const layers = 7;
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1);
    const y = cy + 250 - t * 330;
    const w = 300 - t * 170;
    const h = 70 - t * 26;
    g.fillStyle = milk;
    g.beginPath();
    g.ellipse(cx, y, w, h, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#B47440';
    g.beginPath();
    g.ellipse(cx, y - h * 0.42, w * 0.9, h * 0.72, 0, 0, Math.PI * 2);
    g.fill();
  }

  // heart on top
  const hx = cx;
  const hy = cy - 150;
  const hs = 120;
  g.fillStyle = milk;
  g.beginPath();
  g.moveTo(hx, hy + hs * 0.9);
  g.bezierCurveTo(hx - hs * 1.4, hy + hs * 0.1, hx - hs * 0.9, hy - hs * 0.95, hx, hy - hs * 0.35);
  g.bezierCurveTo(hx + hs * 0.9, hy - hs * 0.95, hx + hs * 1.4, hy + hs * 0.1, hx, hy + hs * 0.9);
  g.fill();

  // pull-through line
  g.strokeStyle = '#B47440';
  g.lineWidth = 14;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx, cy - 250);
  g.quadraticCurveTo(cx + 8, cy, cx, cy + 300);
  g.stroke();

  // foam ring
  g.filter = 'blur(6px)';
  g.strokeStyle = 'rgba(255,240,215,0.55)';
  g.lineWidth = 26;
  g.beginPath();
  g.arc(cx, cy, S * 0.47, 0, Math.PI * 2);
  g.stroke();
  g.filter = 'none';

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}
