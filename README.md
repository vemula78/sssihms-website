# SSSIHMS Whitefield — Hospital Website

Static multi-page implementation of the **SSSIHMS Website** Claude Design project
(claude.ai/design project `f3cca125-321f-4519-b989-c580afe8354e`), in the
**"Dignified Modern"** variation selected in the design (navy `#1e2d4a` / orange
`#e8922a`, Libre Baskerville + DM Sans).

## Layout

```
design-source/     Source extracted from the design export (reference only)
  sssihms-data.jsx   All inner-page content (window.PAGES)
  sssihms-render.jsx Data-driven section renderers (React prototype)
  template.html      App shell: nav, home page, themes, CSS
src/
  sssihms-data.js    Copy of the design's data file — kept VERBATIM so an updated
                     export from Claude Design can be dropped in directly
  css/site.css       Site stylesheet ("Dignified Modern" resolved as the theme)
  js/site.js         Mobile menu toggle (only JS on the site)
build.mjs          Zero-dependency static site generator (Node ≥18)
dist/              Build output — 34 plain HTML pages, deployable anywhere
screenshots/       Verification screenshots (Playwright)
```

## Build

```bash
node build.mjs        # regenerates dist/ (index.html + 33 inner pages)
```

No npm install, no framework at runtime — the React/Babel prototype has been
compiled away into plain HTML/CSS with real `<a>` links per page (SEO-friendly,
works without JavaScript).

## Updating content

- Page content: edit `src/sssihms-data.js` (or replace it with a fresh
  `sssihms-data.jsx` from the design project), then rebuild.
- Home page copy / navigation / footer: edit the constants in `build.mjs`.
- Images are hot-linked from whitefield.sssihms.org (same URLs the design uses).

## Deploy

`dist/` is fully static — suitable for GitHub Pages (prototype review) or the
on-prem VM (nginx `root` at `dist/`).
