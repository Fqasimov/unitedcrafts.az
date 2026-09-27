# unitedcrafts.az

Vue 3 + Vite single-page site for The United Crafts — a Baku atelier making
corporate gift boxes, packaging and handmade wooden objects.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

## Structure

```
public/works/         project photography
public/fonts/         self-hosted Cormorant Garamond + Jost (latin + latin-ext)
src/data/works.js     portfolio entries rendered by the arc gallery
src/components/       one file per section
src/composables/      scroll-reveal observer
src/styles/           design tokens, reveal + drift primitives, @font-face
```

## Brief wizard

`BriefModal.vue` is a three-step flow opened from anywhere via
`stores/ui.js` → `openBrief()`:

1. the raw idea as free text, plus contact / quantity / deadline
2. optional reference images (drag-drop, local object URLs only)
3. a three.js box configurator — construction, size, colour, foil, contents

There is **no backend**. `submit()` shows a summary and offers a prefilled
`mailto:` plus a JSON download. `payload()` in that file already returns the
complete brief, so wiring a real endpoint is a one-line change at `submit()`.
Reference images are not uploaded anywhere — only their filenames travel.

three.js is a dynamic import, so it is fetched the first time someone opens
the wizard rather than on page load.

## Notes

- Copy is Azerbaijani; `latin-ext` font subsets are required for `ə ğ ş ı`.
- Motion uses one curve (`--ease-out`) and three durations (`--t-fast/mid/slow`)
  from `styles/main.css`. Adding a bespoke duration is how it starts to look
  sloppy — reach for a token. Everything respects `prefers-reduced-motion`.
- Placeholders to replace before launch: `src/data/briefOptions.js` (the
  configurator's boxes, colours and gift items), `src/data/site.js` (phone
  number and the social URLs — the handles are guesses), and the tiraj /
  material notes in `src/data/works.js`.
