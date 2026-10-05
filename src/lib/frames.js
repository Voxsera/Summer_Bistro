// Preloads the scroll-video image sequence (extracted from public/video.mp4).
// Desktop gets 1600px frames, phones get 1000px frames.

export const FRAME_COUNT = 124;

const isSmall = typeof window !== 'undefined' && Math.min(window.innerWidth, window.innerHeight) < 700;
const dir = isSmall ? '/frames/m' : '/frames/d';
const src = (i) => `${dir}/f${String(i + 1).padStart(3, '0')}.webp`;

export const frames = new Array(FRAME_COUNT).fill(null);
let loaded = 0;
const listeners = new Set();

function notify() {
  const p = loaded / FRAME_COUNT;
  listeners.forEach((fn) => fn(p));
}

export function onFrameProgress(fn) {
  listeners.add(fn);
  fn(loaded / FRAME_COUNT);
  return () => listeners.delete(fn);
}

function load(i) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      frames[i] = img;
      loaded++;
      notify();
      resolve();
    };
    img.onerror = () => {
      loaded++;
      notify();
      resolve();
    };
    img.src = src(i);
  });
}

// Load the first frame first, then every 8th (so scrubbing works early), then fill the gaps.
let started = false;
export function startLoading() {
  if (started) return;
  started = true;
  const order = [];
  const seen = new Set();
  const push = (i) => {
    if (i < FRAME_COUNT && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(0);
  for (let step of [16, 8, 4, 2, 1]) for (let i = 0; i < FRAME_COUNT; i += step) push(i);
  push(FRAME_COUNT - 1);

  let cursor = 0;
  const worker = async () => {
    while (cursor < order.length) {
      const i = order[cursor++];
      await load(i);
    }
  };
  for (let k = 0; k < 6; k++) worker();
}

// Nearest loaded frame at or before i (falls back to after).
export function getFrame(i) {
  if (frames[i]) return frames[i];
  for (let d = 1; d < FRAME_COUNT; d++) {
    if (i - d >= 0 && frames[i - d]) return frames[i - d];
    if (i + d < FRAME_COUNT && frames[i + d]) return frames[i + d];
  }
  return null;
}
