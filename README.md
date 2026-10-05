# Summer Bistro Café — website

React + Vite + Three.js + GSAP (ScrollTrigger) + Lenis smooth scroll.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

Deploy: push to GitHub and import into Vercel (framework preset: **Vite**).

## Edit content

All text, menu items, links and photo names are in **`src/data/content.js`**.

- Add a price to any menu item: `price: 349`
- Veg marker: `veg: true` (veg), `veg: false` (non-veg), leave out for none
- Instagram link: `INFO.instagram`

## Add real photos

Drop JPGs into **`public/photos/`** using these exact names. Anything missing
automatically falls back to the illustrated version, so you can add them one by one.

| File | Used for |
| --- | --- |
| iced-latte.jpg | Favourites card + menu hover |
| photo-print-latte.jpg | Favourites card + menu hover |
| matcha-latte.jpg | Favourites card + menu hover |
| biscoff-cheesecake.jpg | Favourites card + menu hover |
| puff-pizza.jpg | Favourites card + menu hover |
| aglio-olio.jpg | Favourites card + menu hover |
| cold-coffee.jpg, chicken-tenders.jpg, jalapeno-sticks.jpg, cajun-chicken.jpg, garlic-bread.jpg, white-sauce-pasta.jpg, mexican-rice-bowl.jpg, burger.jpg | Menu hover previews |
| garden.jpg | Story — big arched photo (garden / waterfall) |
| interior.jpg | Story — lounge / inside |
| night.jpg | Story — café at night |
| gallery-1.jpg … gallery-9.jpg | "Snap it. Tag it." gallery |

Tip: portrait or square, ~1200px on the long side, compressed (≤300 KB each).

## Scroll video hero

The hero is a scroll-scrubbed image sequence made from `public/video.mp4`
(124 frames, cropped to remove the bottom-right watermark):

- `public/frames/d/` — 1600px frames for desktop
- `public/frames/m/` — 1000px frames for phones

To swap in a new video, regenerate the frames (needs ffmpeg), then update
`FRAME_COUNT` in `src/lib/frames.js` if the frame count changes:

```bash
ffmpeg -i public/video.mp4 -vf "crop=iw:ih*0.873:0:0,scale=1600:-2" -c:v libwebp -quality 72 public/frames/d/f%03d.webp
ffmpeg -i public/video.mp4 -vf "crop=iw:ih*0.873:0:0,scale=1000:-2" -c:v libwebp -quality 68 public/frames/m/f%03d.webp
```

`video.mp4` itself is not loaded by the site; it can stay as the source file.

## Structure

```
src/
  components/ScrollVideo.jsx  scroll-scrubbed video hero
  lib/frames.js          frame preloader
  components/            one file per section
  data/content.js        all content
  styles/global.css      design system + section styles
```
