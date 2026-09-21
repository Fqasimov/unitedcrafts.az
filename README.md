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

## Notes

- Copy is Azerbaijani; `latin-ext` font subsets are required for `ə ğ ş ı`.
- Everything animated respects `prefers-reduced-motion`; smooth scrolling
  (Lenis) is skipped entirely when it is set.
- Placeholders to fill in before launch: the phone number in
  `ContactSection.vue`, and the client list in `PartnersSection.vue` /
  `src/data/works.js` (tirajes and material notes are illustrative).
