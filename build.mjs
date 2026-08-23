#!/usr/bin/env node
// SSSIHMS Whitefield website — static site generator.
// Renders design-handoff-v2/*.jsx (the actual Claude Design React source) through
// Babel + ReactDOMServer (see ssr/render.mjs) into plain multi-page HTML in dist/.
// This replaced an earlier hand-transcribed-HTML generator: every render call here
// runs the real component, so there is no re-description of it left to drift.
// Run: node build.mjs (needs `npm install` once for react/react-dom/@babel/core).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { buildSSRContext, renderTopBar, renderNavBar, renderFooter, renderHomeBody, renderContentBody } from './ssr/render.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const hashOf = (path) => createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 10);
const CSS_VER = hashOf(join(ROOT, 'src/css/site.css'));
const JS_VER = hashOf(join(ROOT, 'src/js/site.js'));

// ── Image resources (same URLs the design project uses) ─────────────────────
const RES = {
  logo: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/05/Website-full-length-logo-scaled.png',
  building: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/04/Website-full-length-image-1.png',
  swami: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2015/05/Swami-with-stethoscope-e1487392181378.jpg',
  imgCardiology: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/Cardiology.png',
  imgCTVS: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/CTVS.png',
  imgNeurosurgery: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/Neurosurgery.png',
  imgNeurology: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/Neurology.png',
  imgAnesthesiology: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/Anesthesiology.png',
  imgRadiology: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/Radiology.png',
  imgDNB: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/DNB.png',
  imgNursing: 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/Nursing.png',
};
const FAVICON = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2017/02/cropped-hospital-logo-e1487405066482-270x270.png';

const esc = (s) => String(s ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

// ── Load PAGES from the real design source, via the SSR harness ─────────────
const { PAGES } = buildSSRContext(RES);
if (!PAGES || !Object.keys(PAGES).length) throw new Error('PAGES failed to load from design-handoff-v2/sssihms-data.jsx');

const TOPBAR_HTML = renderTopBar();
const FOOTER_HTML = renderFooter();

function document_(pageKey, title, description, main) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${RES.building}">
  <link rel="icon" href="${FAVICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Nunito+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/site.css?v=${CSS_VER}">
</head>
<body>
${TOPBAR_HTML}
${renderNavBar(pageKey)}
<main>
${main}
</main>
${FOOTER_HTML}
<script src="js/site.js?v=${JS_VER}" defer></script>
</body>
</html>
`;
}

// ── Build ────────────────────────────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'src/css'), join(DIST, 'css'), { recursive: true });
cpSync(join(ROOT, 'src/js'), join(DIST, 'js'), { recursive: true });
cpSync(join(ROOT, 'src/stats-pages'), join(DIST, 'stats-pages'), { recursive: true });
cpSync(join(ROOT, 'src/poetry-pages'), join(DIST, 'poetry-pages'), { recursive: true });
cpSync(join(ROOT, 'src/assets'), join(DIST, 'assets'), { recursive: true });
cpSync(join(ROOT, 'src/vahinis'), join(DIST, 'vahinis'), { recursive: true });

const SITE_NAME = 'SSSIHMS Whitefield';
const HOME_TITLE = 'SSSIHMS — Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield';
const HOME_DESC = 'Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Bengaluru — world-class tertiary medical care, completely free of charge, for all.';

writeFileSync(join(DIST, 'index.html'), document_('home', HOME_TITLE, HOME_DESC, renderHomeBody()));

let count = 1;
for (const [key, data] of Object.entries(PAGES)) {
  const title = `${data.title.replace(/<[^>]+>/g, '')} — ${SITE_NAME}`;
  const desc = data.subtitle || HOME_DESC;
  writeFileSync(join(DIST, `${key}.html`), document_(key, title, desc, renderContentBody(key)));
  count++;
}

console.log(`Built ${count} pages into dist/`);
