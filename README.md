# SSSIHMS Whitefield — Hospital Website

Static multi-page implementation of the **SSSIHMS Website** Claude Design project
(claude.ai/design project `f3cca125-321f-4519-b989-c580afe8354e`), in the
**"Sacred Warmth"** variation selected in the design (warm cream/brown, primary
`#c8813a`, EB Garamond + Nunito Sans).

## Layout

```
design-handoff/    Current design handoff bundle from Claude Design (source of truth)
design-source/     Earlier design export (13-Jun snapshot, reference only)
  sssihms-data.jsx   All inner-page content (window.PAGES)
  sssihms-render.jsx Data-driven section renderers (React prototype)
  template.html      App shell: nav, home page, themes, CSS
src/
  sssihms-data.js,
  sssihms-dept-pages.js,
  sssihms-extra-pages.js   The design's data files — kept VERBATIM so updated
                           exports from Claude Design drop in directly
  stats-pages/       12 self-contained Chart.js statistics dashboards (iframed)
  poetry-pages/      3 self-contained poetry pages (iframed)
  css/site.css       Site stylesheet ("Sacred Warmth" resolved as the theme)
  js/site.js         Mobile menu toggle + iframe auto-resize listener
build.mjs          Zero-dependency static site generator (Node ≥18)
dist/              Build output — 82 plain HTML pages + embeds, deployable anywhere
screenshots/       Verification screenshots (Playwright)
```

## Build

```bash
node build.mjs        # regenerates dist/ (index.html + 81 inner pages + embeds)
```

No npm install, no framework at runtime — the React/Babel prototype has been
compiled away into plain HTML/CSS with real `<a>` links per page (SEO-friendly,
works without JavaScript).

## Updating content

- Page content: edit the `src/sssihms-*.js` data files (or replace them with fresh
  `.jsx` exports from the design project), then rebuild.
- Home page copy / navigation / footer: edit the constants in `build.mjs`.
- Images are hot-linked from whitefield.sssihms.org (same URLs the design uses).

## Deploy

Live prototype: **https://vemula78.github.io/sssihms-website/**
(GitHub Pages, served from the `gh-pages` branch of
github.com/vemula78/sssihms-website).

To redeploy after changes:

```bash
node build.mjs
cd dist && git init -q && git checkout -q -b gh-pages && touch .nojekyll \
  && git add -A && git commit -q -m "Deploy" \
  && git push -f https://github.com/vemula78/sssihms-website.git gh-pages \
  && rm -rf .git
```

`dist/` is fully static, so the same output also suits the on-prem VM
(nginx `root` at `dist/`).
