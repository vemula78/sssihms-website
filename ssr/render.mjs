// SSR harness — renders the ACTUAL Claude Design React source (design-handoff-v2/*.jsx)
// through Babel + ReactDOMServer, instead of build.mjs's old hand-transcribed HTML
// strings. This is the fix for the repeated hand-transcription drift bugs: nothing
// here re-describes what a component renders, it runs the component.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import * as babel from '@babel/core';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import navigateDataAttr from './babel-plugin-navigate.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DESIGN = join(ROOT, '..', 'design-handoff-v2');

function transform(code, filename) {
  const out = babel.transform(code, {
    filename,
    presets: [['@babel/preset-react', { runtime: 'classic' }]],
    plugins: [navigateDataAttr],
    parserOpts: { plugins: ['jsx'] },
    babelrc: false,
    configFile: false,
  });
  return out.code;
}

// One vm context acts as `window`/global for every design-handoff-v2 file, exactly
// like loading them as sibling <script> tags in the original canvas HTML — each
// file's top-level function/var declarations land on this shared object, and any
// `window.X = ...` assignment lands on the same object too (window === globalThis
// here), matching browser semantics.
const sandbox = {};
sandbox.window = sandbox;
sandbox.React = React;
sandbox.useState = React.useState;
sandbox.useEffect = React.useEffect;
sandbox.useRef = React.useRef;
sandbox.useMemo = React.useMemo;
sandbox.console = console;
vm.createContext(sandbox);

export function buildSSRContext(resources) {
  sandbox.__resources = resources;

  const runFile = (name) => {
    const code = readFileSync(join(DESIGN, name), 'utf8');
    vm.runInContext(transform(code, name), sandbox, { filename: name });
  };

  // Content-data + content-renderer files, in the same dependency order as the
  // <script> tags in "SSSIHMS Website.html" (dept-pages/extra-pages etc. mutate
  // window.PAGES / window.DEPT_SUBNAV that sssihms-data.jsx establishes first).
  for (const f of [
    'sssihms-data.jsx',
    'sssihms-dept-pages.jsx',
    'sssihms-extra-pages.jsx',
    'sssihms-dept-academics-pages.jsx',
    'sssihms-sssgh-pages.jsx',
    'sssihms-programme-pages.jsx',
    'sssihms-cme-pages.jsx',
    'sssihms-live-about.jsx',
    'sssihms-live-depts.jsx',
    'sssihms-live-faculty.jsx',
    'sssihms-services-pages.jsx',
    'sssihms-services-physiotherapy.jsx',
    'sssihms-live-radiology.jsx',
    'sssihms-live-fac-infra.jsx',
    'sssihms-live-dnb.jsx',
    'sssihms-live-allied.jsx',
    'sssihms-live-patients.jsx',
    'sssihms-live-fellowship.jsx',
    'sssihms-live-sssgh.jsx',
    'sssihms-publications.jsx',
    'sssihms-gogreen.jsx',
    'sssihms-vahinis.jsx',
  ]) runFile(f);

  // sssihms-render.jsx, with the <image-slot> branch of Faculty neutralised: that
  // custom element only resolves an image inside Claude Design's own "omelette"
  // editing runtime (see design-handoff-v2/image-slot.js's own doc comment) — in a
  // plain static export it would render as an empty tag, so for production this
  // falls through to the same photo/avatar-initials path as everywhere else.
  {
    const raw = readFileSync(join(DESIGN, 'sssihms-render.jsx'), 'utf8');
    const marker = 'f.slot\n                ? <div className="faculty-photo"><image-slot id={f.slot} shape="rounded" radius="10" placeholder={f.name}></image-slot></div>\n                : f.photo';
    if (!raw.includes(marker)) throw new Error('sssihms-render.jsx: expected image-slot Faculty branch not found — check for source drift before rendering');
    const patched = raw.replace(marker, 'f.photo');
    vm.runInContext(transform(patched, 'sssihms-render.jsx'), sandbox, { filename: 'sssihms-render.jsx' });
  }

  // The chrome/home components + their data (TopBar, NavBar, Hero..NewsSection,
  // HomePage, NAV) live in the big inline <script> at the bottom of the canvas
  // export. Strip everything from the design-tool-only tweaks setup onward — App()
  // and the TweaksPanel overlay are never called here, and the trailing
  // ReactDOM.createRoot(...).render(<App />) would execute immediately (this vm
  // has no `document`/root element) if left in.
  {
    const html = readFileSync(join(DESIGN, 'SSSIHMS Website.html'), 'utf8');
    const startTag = '<script type="text/babel">\nconst { useState, useEffect } = React;';
    const start = html.indexOf(startTag);
    const cutMarker = '// ── APP ─';
    const cut = html.indexOf(cutMarker, start);
    if (start === -1 || cut === -1) throw new Error('SSSIHMS Website.html: expected inline chrome/home script markers not found — check for source drift before rendering');
    const chromeSrc = html.slice(start + '<script type="text/babel">\n'.length, cut);
    vm.runInContext(transform(chromeSrc, 'chrome.jsx'), sandbox, { filename: 'chrome.jsx' });
  }

  return {
    PAGES: sandbox.PAGES || sandbox.window.PAGES,
    DEPT_SUBNAV: sandbox.DEPT_SUBNAV || sandbox.window.DEPT_SUBNAV || {},
    STATS_DASHBOARDS: sandbox.STATS_DASHBOARDS || sandbox.window.STATS_DASHBOARDS || [],
  };
}

// data-page={X} (see babel-plugin-navigate.mjs) is how an SSR'd onClick={() =>
// navigate(X)} / go(X) survives renderToStaticMarkup, which drops event-handler
// props entirely. Rewrite it into a real href here. The source uses onClick+
// navigate on plain <div>s too (e.g. the home page's whole spec-card is a click
// target), so div/button/a all get renamed to <a> when they carry data-page,
// matching open/close tags via a single document-order stack (valid because
// these tags must be well-nested in real markup); an <a> that already had a real
// href just gets left alone.
export function resolveDataPageLinks(html) {
  const hrefFor = (slug) => (slug === 'home' ? 'index.html' : `${slug}.html`);
  const tagRe = /<(div|button|a)\b([^>]*)>|<\/(div|button|a)>/g;
  let out = '';
  let last = 0;
  const stack = [];
  let m;
  while ((m = tagRe.exec(html))) {
    out += html.slice(last, m.index);
    last = tagRe.lastIndex;
    if (m[1]) {
      const attrs = m[2];
      const dp = attrs.match(/\sdata-page="([^"]*)"/);
      if (dp && !(m[1] === 'a' && /\shref="/.test(attrs))) {
        const rest = attrs.replace(/\sdata-page="[^"]*"/, '');
        out += `<a href="${hrefFor(dp[1])}"${rest}>`;
        stack.push('rename');
      } else {
        out += m[0];
        stack.push(m[1]);
      }
    } else {
      const frame = stack.pop();
      out += frame === 'rename' ? '</a>' : `</${m[3]}>`;
    }
  }
  out += html.slice(last);
  return out;
}

const NOOP_NAVIGATE = (p) => p;

export function renderTopBar() {
  return resolveDataPageLinks(renderToStaticMarkup(React.createElement(sandbox.TopBar, { navigate: NOOP_NAVIGATE })));
}

export function renderNavBar(pageKey) {
  return resolveDataPageLinks(renderToStaticMarkup(React.createElement(sandbox.NavBar, { page: pageKey, navigate: NOOP_NAVIGATE })));
}

export function renderFooter() {
  return resolveDataPageLinks(renderToStaticMarkup(React.createElement(sandbox.Footer, { navigate: NOOP_NAVIGATE })));
}

export function renderHomeBody() {
  return resolveDataPageLinks(renderToStaticMarkup(React.createElement(sandbox.HomePage, { navigate: NOOP_NAVIGATE })));
}

export function renderContentBody(pageKey) {
  return resolveDataPageLinks(renderToStaticMarkup(React.createElement(sandbox.ContentPage, { pageKey, navigate: NOOP_NAVIGATE })));
}
