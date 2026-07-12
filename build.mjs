#!/usr/bin/env node
// SSSIHMS Whitefield website — static site generator.
// Renders src/sssihms-data.js (page content from the Claude Design project) plus the
// home page into plain multi-page HTML in dist/. No dependencies: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

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

// ── Load PAGES from the design data files (kept verbatim for easy re-import) ──
// Order matters: dept-pages / extra-pages mutate window.PAGES and window.DEPT_SUBNAV
// that sssihms-data.js establishes first.
const sandbox = { window: { __resources: RES } };
vm.createContext(sandbox);
for (const f of ['sssihms-data.js', 'sssihms-dept-pages.js', 'sssihms-extra-pages.js']) {
  vm.runInContext(readFileSync(join(ROOT, 'src', f), 'utf8'), sandbox);
}
const PAGES = sandbox.window.PAGES;
const DEPT_SUBNAV = sandbox.window.DEPT_SUBNAV || {};
const STATS_DASHBOARDS = sandbox.window.STATS_DASHBOARDS || [];
if (!PAGES || !Object.keys(PAGES).length) throw new Error('PAGES failed to load from src/sssihms-data.js');

// ── Helpers ──────────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const href = (page) => (page === 'home' ? 'index.html' : `${page}.html`);
const attrStyle = (s) => (s ? ` style="${s}"` : '');

function linkBtn(link, variant = 'btn-outline', style = 'margin-top:8px') {
  if (!link) return '';
  if (link.href) return `<a href="${esc(link.href)}" target="_blank" rel="noopener" class="btn ${variant}"${attrStyle(style + ';display:inline-flex')}>${esc(link.label)} →</a>`;
  return `<a class="btn ${variant}" href="${href(link.page)}"${attrStyle(style + ';display:inline-flex')}>${esc(link.label)} →</a>`;
}

function sectionHead({ eyebrow, title, sub, center }) {
  if (!eyebrow && !title && !sub) return '';
  const wrapStyle = center
    ? 'text-align:center;margin-bottom:40px;max-width:680px;margin-left:auto;margin-right:auto'
    : 'margin-bottom:34px';
  return `<div style="${wrapStyle}">
    ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
    ${title ? `<h2 class="section-title">${esc(title)}</h2>` : ''}
    ${sub ? `<p class="section-sub"${center ? ' style="margin:0 auto"' : ''}>${esc(sub)}</p>` : ''}
  </div>`;
}

const sectionOpen = (s, extra = '') => `<section class="section${s.alt ? ' section-alt' : ''}${extra}">`;

// ── Section renderers (mirror design-source/sssihms-render.jsx) ─────────────
const SECTIONS = {
  intro(s) {
    const text = `<div>
      ${s.eyebrow ? `<span class="eyebrow">${esc(s.eyebrow)}</span>` : ''}
      ${s.title ? `<h2 class="section-title">${esc(s.title)}</h2>` : ''}
      ${(s.body || []).map((p) => `<p class="prose-p">${esc(p)}</p>`).join('\n')}
      ${s.pill ? `<span class="free-pill" style="margin-top:6px;display:inline-block">✦ ${esc(s.pill)}</span>` : ''}
      ${s.link ? `<div>${linkBtn(s.link)}</div>` : ''}
    </div>`;
    const media = s.image
      ? `<div class="intro-media"><img src="${esc(s.image)}" alt="${esc(s.title || '')}" loading="lazy"></div>`
      : s.imageLabel
        ? `<div class="intro-media media-fallback" data-label="${esc(s.imageLabel)}"></div>`
        : '';
    const inner = media
      ? `<div class="intro-grid"${s.reverse ? ' style="direction:rtl"' : ''}>
           <div${s.reverse ? ' style="direction:ltr"' : ''}>${text}</div>
           <div${s.reverse ? ' style="direction:ltr"' : ''}>${media}</div>
         </div>`
      : `<div${s.narrow ? ' style="max-width:760px;margin:0 auto"' : ''}>${text}</div>`;
    return `${sectionOpen(s)}<div class="wrap">${inner}</div></section>`;
  },

  cards(s) {
    const items = s.items.map((c) => `<div class="info-card">
      ${c.icon ? `<div class="info-card-icon">${esc(c.icon)}</div>` : ''}
      <div class="info-card-head">
        <h3>${esc(c.title)}</h3>
        ${c.badge ? `<span class="free-pill-sm">${esc(c.badge)}</span>` : ''}
      </div>
      ${c.desc ? `<p>${esc(c.desc)}</p>` : ''}
      ${c.link ? linkBtn(c.link, 'btn-outline', '') : ''}
    </div>`).join('\n');
    return `${sectionOpen(s)}<div class="wrap">
      ${sectionHead(s)}
      <div class="auto-grid" style="--cols:${s.cols || 3}">${items}</div>
    </div></section>`;
  },

  features(s) {
    const items = s.items.map((f) => `<div class="feature-item"><span class="feature-tick">✓</span><span>${esc(f)}</span></div>`).join('\n');
    return `${sectionOpen(s)}<div class="wrap">${sectionHead(s)}<div class="feature-grid">${items}</div></div></section>`;
  },

  stats(s) {
    const items = s.items.map((st, i) => `<div class="stat-card" style="animation-delay:${(i * 0.06).toFixed(2)}s">
      <div class="stat-val">${esc(st.v)}</div><div class="stat-lbl">${esc(st.l)}</div>
    </div>`).join('\n');
    return `${sectionOpen(s)}<div class="wrap">${sectionHead({ ...s, center: true })}<div class="stats-grid">${items}</div></div></section>`;
  },

  quote(s) {
    return `<section class="section section-dark"><div class="wrap" style="max-width:780px;margin:0 auto;text-align:center">
      ${s.eyebrow ? `<span class="eyebrow" style="color:var(--primary)">${esc(s.eyebrow)}</span>` : ''}
      <span class="quote-mark" style="display:block">“</span>
      <p class="quote-text">${esc(s.text)}</p>
      <div class="quote-attr">— ${esc(s.attr)}</div>
    </div></section>`;
  },

  split(s) {
    const cols = s.cols.map((c) => `<div>
      ${c.eyebrow ? `<span class="eyebrow">${esc(c.eyebrow)}</span>` : ''}
      ${c.title ? `<h3 class="split-title">${esc(c.title)}</h3>` : ''}
      ${(c.body || []).map((p) => `<p class="prose-p">${esc(p)}</p>`).join('\n')}
      ${c.link ? linkBtn(c.link) : ''}
    </div>`).join('\n');
    return `${sectionOpen(s)}<div class="wrap">${sectionHead(s)}<div class="split-grid">${cols}</div></div></section>`;
  },

  testimonials(s) {
    const items = s.items.map((t) => `<div class="testimonial-card">
      <span class="t-quote">“</span>
      <p class="t-text">${esc(t.quote)}</p>
      <div class="t-attr"><strong>${esc(t.name)}</strong>${t.place ? `<span>${esc(t.place)}</span>` : ''}</div>
    </div>`).join('\n');
    return `${sectionOpen(s)}<div class="wrap">${sectionHead({ ...s, center: true })}<div class="auto-grid" style="--cols:${s.cols || 3}">${items}</div></div></section>`;
  },

  faculty(s) {
    const items = s.items.map((f) => {
      const initials = f.name.split(' ').filter(Boolean).slice(-2).map((w) => w[0]).join('');
      return `<div class="faculty-card">
        <div class="faculty-avatar">${esc(initials)}</div>
        <div><div class="faculty-name">${esc(f.name)}</div><div class="faculty-role">${esc(f.role)}</div></div>
      </div>`;
    }).join('\n');
    return `${sectionOpen(s)}<div class="wrap">${sectionHead(s)}<div class="auto-grid" style="--cols:${s.cols || 4}">${items}</div></div></section>`;
  },

  cta(s) {
    const action = s.action.href
      ? `<a href="${esc(s.action.href)}" target="_blank" rel="noopener" class="btn btn-white">${esc(s.action.label)} →</a>`
      : `<a class="btn btn-white" href="${href(s.action.page)}">${esc(s.action.label)} →</a>`;
    return `<section class="admit-section"><div class="wrap admit-inner">
      <div>
        ${s.pill ? `<span class="free-pill" style="margin-bottom:14px;display:inline-block">${esc(s.pill)}</span>` : ''}
        <h2>${esc(s.title)}</h2>
        ${s.body ? `<p style="margin-top:10px">${s.body}</p>` : ''}
      </div>
      <div class="admit-cta">${action}</div>
    </div></section>`;
  },

  banner(s) {
    return `<div class="full-banner"><img src="${esc(s.src)}" alt="" loading="lazy"></div>`;
  },

  statsdash(s) {
    const pills = STATS_DASHBOARDS.map((d) => `<a class="dash-pill${d.slug === s.slug ? ' active' : ''}" href="${href(d.slug)}">${esc(d.label)}</a>`).join('');
    return `<section class="section" style="padding-top:36px"><div class="wrap">
      <div class="dash-switch">${pills}</div>
      <div class="dash-frame"><iframe src="stats-pages/${esc(s.slug)}.html" data-slug="${esc(s.slug)}" title="Statistics dashboard" style="width:100%;height:1200px;border:none;display:block"></iframe></div>
    </div></section>`;
  },

  framepage(s) {
    return `<div style="background:${esc(s.bg || '#fff')}"><iframe src="${esc(s.src)}" data-slug="${esc(s.slug)}" title="${esc(s.slug)}" style="width:100%;height:900px;border:none;display:block"></iframe></div>`;
  },
};

function deptSubNav(subnavKey, currentKey) {
  const items = DEPT_SUBNAV[subnavKey];
  if (!items) return '';
  return `<div class="subnav"><div class="wrap subnav-inner">
    ${items.map(([label, key]) => `<a class="subnav-link${key === currentKey ? ' active' : ''}" href="${href(key)}">${esc(label)}</a>`).join('')}
  </div></div>`;
}

function pageBanner({ title, subtitle, crumb, icon }) {
  return `<section class="page-banner"><div class="wrap">
    ${crumb ? `<div class="breadcrumb"><a href="index.html">Home</a><span style="opacity:.5;margin:0 6px">›</span><span style="color:var(--primary)">${esc(crumb)}</span></div>` : ''}
    <div style="display:flex;align-items:center;gap:18px">
      ${icon ? `<div class="banner-icon"><img src="${esc(icon)}" alt=""></div>` : ''}
      <h1>${title}</h1>
    </div>
    ${subtitle ? `<p style="margin-top:12px;opacity:.8;font-size:16px;max-width:640px;line-height:1.7">${esc(subtitle)}</p>` : ''}
  </div></section>`;
}

// ── Site chrome ──────────────────────────────────────────────────────────────
// Each top-level item: [label, page, items]. Each item: [label, key, children?].
// `children` (a further [label, key] array) renders as a nested flyout on desktop
// and as extra-indented links on mobile — see NAV in the design handoff.
const NAV = [
  { label: 'About Hospital', page: 'about', items: [['Hospital Overview', 'about'], ['Guiding Philosophy', 'philosophy'], ['Genesis', 'genesis'], ['Statistics', 'statistics'], ['Patient Speak', 'patient-speak'], ['Visitor Speak', 'visitor-speak'], ['Manohriday Newsletter', 'manohriday'], ['About the Trust', 'trust']] },
  { label: 'Departments', page: 'departments', items: [
    ['Cardiology', 'cardiology', [['Faculty', 'cardiology-faculty'], ['Infrastructure', 'cardiology-infrastructure'], ['Achievements', 'cardiology-achievements'], ['Events', 'cardiology-events'], ['Academics', 'cardiology-academics'], ['Statistics', 'cardiology-statistics']]],
    ['Cardiac Surgery', 'cardiac-surgery', [['Faculty', 'ctvs-faculty'], ['Infrastructure', 'ctvs-infrastructure'], ['Academics', 'ctvs-academics'], ['Statistics', 'cardiac-surgery-statistics']]],
    ['Neurosurgery', 'neurosurgery', [['Faculty', 'nesu-faculty'], ['Infrastructure', 'nesu-infrastructure'], ['Achievements', 'nesu-achievements'], ['Events', 'nesu-events'], ['Academics', 'nesu-academics'], ['Statistics', 'neurosurgery-statistics']]],
    ['Neurology', 'neurology', [['Services', 'neurology-services'], ['Infrastructure', 'neurology-infrastructure']]],
    ['Anesthesiology', 'anesthesiology', [['Faculty', 'anes-faculty'], ['Infrastructure', 'anes-infrastructure'], ['Achievements', 'anes-achievements'], ['Events', 'anes-events'], ['Academics', 'anes-academics']]],
    ['Radiology', 'radiology', [['Faculty', 'radiology-faculty'], ['Infrastructure', 'radiology-infrastructure'], ['Academics', 'radiology-academics']]],
    ['General Hospital (SSSGH)', 'sssgh', [['History', 'sssgh-history'], ['Statistics — Multi-Specialty', 'multi-specialty-statistics'], ['Statistics — Ophthalmology', 'ophthalmology-statistics'], ['Statistics — Obs & Gynae', 'obs-gynae-statistics'], ['Statistics — Orthopaedics', 'orthopaedics-statistics'], ['Statistics — ENT', 'ent-statistics'], ['Statistics — General Surgery', 'general-surgery-statistics'], ['Statistics — Paediatrics', 'paediatrics-statistics'], ['Statistics — Urology', 'urology-statistics']]],
    ['Support Services', 'services', [['Lab Infrastructure', 'lab-infrastructure']]],
  ] },
  { label: 'For Patients', page: 'patients', items: [['Conditions & Treatments', 'treatments'], ['Appointments & Admission', 'appointments'], ['Help Desk / Telemedicine', 'helpdesk'], ['Facilities', 'facilities']] },
  { label: 'Academics', page: 'academics', items: [['DNB Programmes', 'dnb'], ['Fellowship Courses', 'fellowship'], ['Nursing & Allied Health', 'nursing'], ['Career Opportunities', 'careers']] },
  { label: 'Get Involved', page: 'involved', items: [['Sevadal – Volunteer', 'sevadal'], ['Donations', 'involved'], ['Volunteer Expertise', 'volunteer'], ['Go Green', 'gogreen', [['Solar Power Plant', 'gg-solar'], ['Rain Water Harvesting', 'gg-rainwater'], ['Water Use Maximization', 'gg-water'], ['Trees on Campus', 'gg-trees'], ['Power Conservation', 'gg-power'], ['Waste Management', 'gg-waste'], ['Biomedical Waste', 'gg-biomedical']]]] },
  { label: 'Bhagawan', page: 'bhagawan', items: [['Life & Mission', 'bhagawan'], ['Teachings & Discourses', 'bhagawan'], ['Songs & Poems', 'songs', [['Divine Poetry', 'divine-poetry'], ['Sai Compositions', 'sai-compositions'], ['Padya Sudha (Telugu)', 'padya-sudha']]], ['Sai Projects', 'bhagawan']] },
];

function chrome(pageKey) {
  const activeGroup = (g) => g.page === pageKey || g.items.some(([, k]) => k === pageKey);
  const chevron = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const topbar = `<div class="topbar"><div class="wrap topbar-inner">
    <span>Sri Sathya Sai Institute of Higher Medical Sciences</span>
    <span>
      <span>Emergency: +91 80 2801 4901</span>
      <span class="tb-sep">|</span><a href="helpdesk.html">Telemedicine</a>
      <span class="tb-sep">|</span><a href="blog.html">Blog</a>
    </span>
  </div></div>`;
  const dropdownItem = ([label, key, children]) => children
    ? `<div class="dd-item">
        <a href="${href(key)}">${esc(label)}<span class="dd-arrow">›</span></a>
        <div class="dd-flyout">${children.map(([l2, k2]) => `<a href="${href(k2)}">${esc(l2)}</a>`).join('')}</div>
      </div>`
    : `<a href="${href(key)}">${esc(label)}</a>`;
  const navLinks = NAV.map((g) => `<li class="nav-item">
      <a class="nav-btn${activeGroup(g) ? ' active' : ''}" href="${href(g.page)}">${esc(g.label)} ${chevron}</a>
      <div class="dropdown">${g.items.map(dropdownItem).join('')}</div>
    </li>`).join('\n');
  const mobileSubs = (items) => items.map(([label, key, children]) => `<a href="${href(key)}">${esc(label)}</a>
      ${(children || []).map(([l2, k2]) => `<a href="${href(k2)}" style="padding-left:58px;opacity:.55">${esc(l2)}</a>`).join('')}`).join('\n');
  const mobileMenu = NAV.map((g) => `<div class="mm-group">
      <a class="mm-head" href="${href(g.page)}">${esc(g.label)}</a>
      <div class="mm-subs">${mobileSubs(g.items)}</div>
    </div>`).join('\n');
  const navbar = `<nav class="navbar">
    <div class="nav-inner">
      <a class="nav-brand" href="index.html">
        <img class="nav-logo" src="${RES.logo}" alt="SSSIHMS — Sri Sathya Sai Institute of Higher Medical Sciences" loading="lazy">
      </a>
      <ul class="nav-links">
        ${navLinks}
        <li><a class="nav-btn nav-cta" href="appointments.html">Get Free Care →</a></li>
      </ul>
      <button class="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><rect width="22" height="2" rx="1" fill="currentColor"/><rect y="7" width="22" height="2" rx="1" fill="currentColor"/><rect y="14" width="22" height="2" rx="1" fill="currentColor"/></svg>
      </button>
    </div>
    <div class="mobile-menu">
      ${mobileMenu}
      <a class="btn btn-primary mm-cta" href="appointments.html">Get Free Care →</a>
    </div>
  </nav>`;
  const footCol = (title, links) => `<div class="footer-col"><h4>${title}</h4><ul>${links.map(([l, p]) => `<li><a href="${href(p)}">${esc(l)}</a></li>`).join('')}</ul></div>`;
  const footer = `<footer class="footer"><div class="wrap">
    <div class="footer-grid">
      <div>
        <img class="footer-logo" src="${RES.logo}" alt="SSSIHMS" loading="lazy">
        <p class="footer-tagline">Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Bengaluru. Providing world-class medical care, completely free of charge, in the spirit of love and service — since 2001.</p>
        <span class="footer-free-badge">100% Free Healthcare for All</span>
      </div>
      ${footCol('Hospital', [['About Hospital', 'about'], ['Guiding Philosophy', 'philosophy'], ['Genesis', 'genesis'], ['Patient Speak', 'patient-speak'], ['Visitor Speak', 'visitor-speak']])}
      ${footCol('Departments', [['Cardiology', 'cardiology'], ['Cardiac Surgery', 'cardiac-surgery'], ['Neurosurgery', 'neurosurgery'], ['Neurology', 'neurology'], ['Anesthesiology', 'anesthesiology'], ['Radiology', 'radiology']])}
      ${footCol('Quick Links', [['Appointments', 'appointments'], ['Academics', 'academics'], ['Get Involved', 'involved'], ['Bhagawan Sri Sathya Sai Baba', 'bhagawan'], ['Career Opportunities', 'careers'], ['Go Green', 'gogreen']])}
    </div>
    <div class="footer-bottom">
      <span>© 2026 Sri Sathya Sai Institute of Higher Medical Sciences. All rights reserved.</span>
      <span>A service of Sri Sathya Sai Central Trust</span>
    </div>
  </div></footer>`;
  return { topbar, navbar, footer };
}

function document_(pageKey, title, description, main) {
  const { topbar, navbar, footer } = chrome(pageKey);
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
  <link rel="stylesheet" href="css/site.css">
</head>
<body>
${topbar}
${navbar}
<main>
${main}
</main>
${footer}
<script src="js/site.js" defer></script>
</body>
</html>
`;
}

// ── Home page (mirror of template.html components) ───────────────────────────
function homePage() {
  const SPECIALTIES = [
    { name: 'Cardiology', key: 'cardiology', img: RES.imgCardiology, desc: 'Complete cardiac services — OPD, inpatient and critical care — entirely free. Leading institution for adult and paediatric cardiac interventions nationwide.' },
    { name: 'Cardiac Surgery', key: 'cardiac-surgery', img: RES.imgCTVS, desc: 'Full range of invasive and minimally invasive cardiothoracic and vascular surgical services for adults and children.' },
    { name: 'Neurosurgery', key: 'neurosurgery', img: RES.imgNeurosurgery, desc: 'Among the finest neuroscience centres in India. Complex cases from across the country and abroad, all treated free of charge.' },
    { name: 'Neurology', key: 'neurology', img: RES.imgNeurology, desc: 'Well-equipped centre providing the latest facilities for a broad range of neurological conditions and ailments.' },
    { name: 'Anesthesiology', key: 'anesthesiology', img: RES.imgAnesthesiology, desc: 'Serving 12 modular operation theatres, 6 ICUs, 3 catheterisation labs, emergency department and CT/MRI suite — round the clock.' },
    { name: 'Radiology', key: 'radiology', img: RES.imgRadiology, desc: 'Expert diagnostic and interventional imaging — X-ray, ultrasound, CT, MRI, DSA — using state-of-the-art technology, free for all.' },
  ];
  const STATS = [
    { v: '3,000+', l: 'Cardiac & Neuro Surgeries per Year' },
    { v: '1,700+', l: 'Multi-Specialty Surgeries per Year' },
    { v: '12', l: 'Modular Operation Theatres' },
    { v: '6', l: 'Intensive Care Units' },
    { v: '25+', l: 'Years of Compassionate Service' },
    { v: '100%', l: 'Free Medical Care for All' },
  ];
  const ACADEMICS = [
    { title: 'DNB PG Programmes', badge: null, desc: 'Post-graduate training in Cardiothoracic Surgery, Cardiology, Neurosurgery, Anesthesiology and Radio-Diagnosis, accredited by the National Board of Examinations, New Delhi.' },
    { title: 'B.Sc Nursing — Admissions Open', badge: '2026–27', desc: '4-year degree programme, 40 seats. Affiliated to RGUHS, Bengaluru. Exclusively for women, fully residential. No tuition fees. Deadline: 19th June 2026.' },
    { title: 'Allied Health Sciences', badge: null, desc: 'BSc programmes in Cardiac Care Technology, Perfusion Technology, Anesthesia Technology, Medical Imaging Technology and Medical Lab Technology.' },
    { title: 'Fellowship Courses', badge: null, desc: 'Fellowship in Interventional Cardiology, Paediatric Cardiac Surgery, Cardiac Anesthesia and Radiology — for experienced professionals seeking advanced specialisation.' },
  ];
  const NEWS = [
    { tag: 'Admissions', title: 'B.Sc Nursing Applications Now Open — 2026–27', date: 'June 2026', desc: 'Online applications for the 4-year B.Sc Nursing program are open. Deadline: 19th June 2026. No tuition fees charged. Residential programme.' },
    { tag: 'Notice', title: 'Allied Health Science Admissions Paused for 2026–27', date: 'May 2026', desc: 'AHS programme admissions are temporarily paused for this academic year. Candidates are advised to visit the website regularly for updates.' },
    { tag: 'Newsletter', title: 'Manohriday Newsletter — Latest Edition', date: 'April 2026', desc: 'The new Manohriday newsletter is available, featuring hospital updates, patient stories and highlights from our departments.' },
  ];

  const hero = `<section class="hero">
    <div class="hero-banner"><img src="${RES.building}" alt="SSSIHMS Hospital — front view"></div>
    <div class="hero-text">
      <span class="free-pill">✦ 100% Free Medical Care for All</span>
      <h1>Healing Through Love &amp; Selfless Service</h1>
      <p class="hero-desc">Sri Sathya Sai Institute of Higher Medical Sciences provides world-class tertiary care — completely free of charge — to all patients, regardless of caste, creed, religion or financial status.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="appointments.html">Book Appointment</a>
        <a class="btn btn-outline" href="about.html">Our Mission</a>
      </div>
    </div>
  </section>`;

  const freeStrip = `<div class="free-strip"><div class="wrap free-strip-inner">
    ${[['♥', 'No Charges. Ever.'], ['◆', 'All Religions Welcome'], ['◆', 'All Castes Welcome'], ['◆', 'All Financial Statuses'], ['◆', 'Emergency to Critical Care — Free']]
      .map(([sym, text]) => `<div class="fi"><span style="opacity:.75">${sym}</span>${esc(text)}</div>`).join('')}
  </div></div>`;

  const stats = `<section class="section"><div class="wrap">
    <div style="text-align:center;margin-bottom:40px">
      <span class="eyebrow">Our Impact</span>
      <h2 class="section-title">Service in Numbers</h2>
      <p class="section-sub" style="margin:0 auto">Decades of compassionate, free healthcare — touching millions of lives across India and beyond.</p>
    </div>
    <div class="stats-grid">${STATS.map((s, i) => `<div class="stat-card" style="animation-delay:${(i * 0.07).toFixed(2)}s"><div class="stat-val">${esc(s.v)}</div><div class="stat-lbl">${esc(s.l)}</div></div>`).join('')}</div>
  </div></section>`;

  const specialties = `<section class="section section-alt"><div class="wrap">
    <div class="section-hd">
      <div class="section-hd-left">
        <span class="eyebrow">Clinical Specialties</span>
        <h2 class="section-title">World-Class Care. Zero Cost.</h2>
        <p class="section-sub">Advanced tertiary and super-specialty care across all major disciplines — entirely free for every patient who walks through our doors.</p>
      </div>
      <a class="btn btn-outline" href="departments.html">All Departments →</a>
    </div>
    <div class="spec-grid">${SPECIALTIES.map((s, i) => `<a class="spec-card" href="${href(s.key)}" style="animation-delay:${(i * 0.06).toFixed(2)}s">
      <img class="spec-img" src="${s.img}" alt="${esc(s.name)}" style="background:var(--bg-alt)" loading="lazy">
      <div class="spec-body">
        <div class="spec-head"><h3 class="spec-name">${esc(s.name)}</h3><span class="free-pill-sm">Free</span></div>
        <p class="spec-desc">${esc(s.desc)}</p>
        <span class="spec-link">Learn more →</span>
      </div>
    </a>`).join('')}</div>
  </div></section>`;

  const philosophy = `<section class="section section-dark"><div class="wrap"><div class="phil-inner">
    <div>
      <span class="eyebrow" style="color:var(--primary)">The Foundation</span>
      <span class="quote-mark">“</span>
      <p class="quote-text">Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. Medicine should not be commercialised. It is meant to promote a heart-to-heart and love-to-love relationship between doctor and patient. A true doctor is one who realises this truth and conducts himself accordingly.</p>
      <div class="quote-attr">— Bhagawan Sri Sathya Sai Baba, 2003</div>
    </div>
    <div><img class="phil-img" src="${RES.swami}" alt="Bhagawan Sri Sathya Sai Baba" loading="lazy"></div>
  </div></div></section>`;

  const bhagawan = `<section class="section"><div class="wrap bhag-inner">
    <div class="bhag-portrait"><img src="${RES.swami}" alt="Bhagawan Sri Sathya Sai Baba" loading="lazy"></div>
    <div class="bhag-content">
      <span class="eyebrow">The Guiding Light</span>
      <h2 class="section-title">Bhagawan Sri Sathya Sai Baba</h2>
      <p>SSSIHMS stands as a living testament to the compassionate vision of Bhagawan Sri Sathya Sai Baba — that every human being deserves the highest quality medical care, regardless of their ability to pay.</p>
      <p>Founded under the auspices of the Sri Sathya Sai Central Trust, this hospital embodies His teaching that service to man is service to God. The institution has served millions of patients from across India and the world, always entirely free of charge.</p>
      <p>His life and teachings continue to inspire the dedicated doctors, nurses and volunteers who serve here every single day.</p>
      <a class="btn btn-outline" style="margin-top:8px;display:inline-flex" href="bhagawan.html">Life &amp; Teachings →</a>
    </div>
  </div></section>`;

  const academics = `<section class="section section-alt"><div class="wrap">
    <div class="section-hd">
      <div class="section-hd-left">
        <span class="eyebrow">Education &amp; Training</span>
        <h2 class="section-title">Building Future Healers</h2>
        <p class="section-sub">Post-graduate and undergraduate programmes rooted in the spirit of selfless service — with no tuition fees.</p>
      </div>
      <a class="btn btn-outline" href="academics.html">All Programmes →</a>
    </div>
    <div class="acad-grid">${ACADEMICS.map((a) => `<div class="acad-card">
      <div class="acad-icon">◆</div>
      <div class="acad-body">
        <h3>${esc(a.title)}${a.badge ? ` <span class="free-pill-sm" style="margin-left:8px;vertical-align:middle">${esc(a.badge)}</span>` : ''}</h3>
        <p>${esc(a.desc)}</p>
      </div>
    </div>`).join('')}</div>
  </div></section>`;

  const patients = `<section class="section"><div class="wrap">
    <div style="text-align:center;margin-bottom:16px">
      <span class="eyebrow">For Patients</span>
      <h2 class="section-title">We Are Here for You</h2>
      <p class="section-sub" style="margin:0 auto 24px">Every service at SSSIHMS — from consultation to complex surgery — is provided completely free of charge to every patient.</p>
      <span class="free-pill" style="font-size:13px;padding:8px 24px">✦ All services 100% free — No payment or insurance needed</span>
    </div>
    <div class="pat-grid" style="margin-top:36px">${[
      { title: 'Book Appointment', desc: 'Walk in to our OPD or schedule in advance. Our team registers and guides you at every step — at no cost whatsoever.' },
      { title: 'Telemedicine / Help Desk', desc: 'Access medical guidance remotely via our telemedicine portal. Especially valuable for patients unable to travel to Bengaluru.' },
      { title: 'Emergency Care — 24/7', desc: 'Our Emergency Department is open round the clock, every day of the year. Critical care, ICU and all emergency services are free.' },
    ].map((c) => `<div class="pat-card">
      <div class="pat-icon" style="font-family:var(--f-head);font-size:36px;opacity:.5">◆</div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <a class="btn btn-outline pat-card-btn" style="margin-top:18px;font-size:13px;display:inline-flex" href="patients.html">Learn More →</a>
    </div>`).join('')}</div>
  </div></section>`;

  const admissions = `<section class="admit-section"><div class="wrap admit-inner">
    <div>
      <span class="free-pill" style="margin-bottom:16px;display:inline-block">Admissions Open 2026–27</span>
      <h2>B.Sc Nursing Programme</h2>
      <p style="margin-top:10px">Applications are open for the 4-year B.Sc Nursing programme. Last date: <strong>19th June 2026</strong>. No tuition fees. Fully residential, exclusively for women. Affiliated to Rajiv Gandhi University of Health Sciences.</p>
    </div>
    <div class="admit-cta"><a href="https://tinyurl.com/sssihmsnc" target="_blank" rel="noopener" class="btn btn-white" style="display:inline-flex">Apply Now →</a></div>
  </div></section>`;

  const involved = `<section class="section section-alt"><div class="wrap">
    <div style="text-align:center;margin-bottom:36px">
      <span class="eyebrow">Get Involved</span>
      <h2 class="section-title">Join the Mission of Love</h2>
      <p class="section-sub" style="margin:0 auto">Be part of this extraordinary mission — serve with love, contribute with care, transform lives with purpose.</p>
    </div>
    <div class="inv-grid">${[
      { title: 'Sevadal — Volunteer', desc: 'Join our dedicated volunteer programme and serve patients and families with love and compassion, embodying the spirit of selfless service.' },
      { title: 'Support the Mission', desc: 'Your contribution helps sustain free healthcare for all. Every gift ensures world-class care remains accessible regardless of financial status.' },
      { title: 'Volunteer Expertise', desc: "Medical professionals can offer their expertise to support the hospital's mission — on a short or long-term basis." },
    ].map((c) => `<div class="inv-card">
      <div class="inv-icon">◆</div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <a class="btn btn-inv" href="involved.html">Learn More</a>
    </div>`).join('')}</div>
  </div></section>`;

  const news = `<section class="section"><div class="wrap">
    <div class="section-hd">
      <div>
        <span class="eyebrow">News &amp; Updates</span>
        <h2 class="section-title">Latest from SSSIHMS</h2>
      </div>
      <a class="btn btn-outline" href="blog.html">View All News →</a>
    </div>
    <div class="news-grid">${NEWS.map((n) => `<div class="news-card">
      <span class="news-tag">${esc(n.tag)}</span>
      <h3 class="news-title">${esc(n.title)}</h3>
      <p class="news-desc">${esc(n.desc)}</p>
      <div class="news-date">${esc(n.date)}</div>
    </div>`).join('')}</div>
  </div></section>`;

  return [hero, freeStrip, stats, specialties, philosophy, bhagawan, academics, patients, admissions, involved, news].join('\n');
}

// ── Build ────────────────────────────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'src/css'), join(DIST, 'css'), { recursive: true });
cpSync(join(ROOT, 'src/js'), join(DIST, 'js'), { recursive: true });
cpSync(join(ROOT, 'src/stats-pages'), join(DIST, 'stats-pages'), { recursive: true });
cpSync(join(ROOT, 'src/poetry-pages'), join(DIST, 'poetry-pages'), { recursive: true });

const SITE_NAME = 'SSSIHMS Whitefield';
const HOME_TITLE = 'SSSIHMS — Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield';
const HOME_DESC = 'Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Bengaluru — world-class tertiary medical care, completely free of charge, for all.';

writeFileSync(join(DIST, 'index.html'), document_('home', HOME_TITLE, HOME_DESC, homePage()));

let count = 1;
for (const [key, data] of Object.entries(PAGES)) {
  const sections = (data.sections || []).map((s) => {
    const render = SECTIONS[s.type];
    if (!render) throw new Error(`Unknown section type "${s.type}" on page "${key}"`);
    return render(s);
  }).join('\n');
  const subnav = data.subnav ? deptSubNav(data.subnav, key) : '';
  const main = pageBanner(data) + '\n' + subnav + '\n' + sections;
  const title = `${data.title.replace(/<[^>]+>/g, '')} — ${SITE_NAME}`;
  const desc = data.subtitle || HOME_DESC;
  writeFileSync(join(DIST, `${key}.html`), document_(key, title, desc, main));
  count++;
}

console.log(`Built ${count} pages into dist/`);
