# CLAUDE.md — SSSIHMS Whitefield website

**This repository is public.** No VM addresses, key paths, credentials or patient data in
anything committed here.

Static prototype (`src/` → `build.mjs` → `dist/`) plus the Divi/WordPress conversion of it
live on **whitefield.sssihms.org**. `design-handoff-v2/` is the approved design;
`~/Downloads/divi-export/pages/*.json` is the import pack.

```bash
node build.mjs                      # src/ -> dist/ (113 pages)
./scripts/deploy-static.sh          # dry run: build, list what would ship
./scripts/deploy-static.sh --apply  # ship poetry-pages, stats-pages, vahinis
```

## The live site

WordPress **multisite**; Whitefield is **blog 4**, DB prefix `sai_4_`. Every WP-CLI call
must carry `--url=whitefield.sssihms.org` or it silently operates on the wrong site.

Two caches, both need purging after any change — Divi's static CSS
(`wp-content/et-cache/*/whitefield.sssihms.org`) **and** WP Super Cache
(`wp-content/cache/page_enhanced/whitefield.sssihms.org{,:443}`). Delete only the
whitefield directories; those trees hold the other sites too.

VM access and deploy commands: [wordpress/README.md](wordpress/README.md).

## Read these before changing a live page

- **[docs/live-only-changes.md](docs/live-only-changes.md)** — every change made directly to
  the database, which pages have drifted from the prototype, and why. Read it first; it is
  the difference between the repo and reality.
- [wordpress/README.md](wordpress/README.md) — the `mu-plugins` patient-access plugin.
  **It exists only on the server**; a VM rebuild loses it unless redeployed from here.
- [docs/multisite-conversion-methodology.md](docs/multisite-conversion-methodology.md)
- [docs/missing-upload-assets.md](docs/missing-upload-assets.md)

## Gotchas that have each cost real time

**`wpautop` mangles `et_pb_text` modules.** Text modules get WordPress's auto-paragraph
filter; `et_pb_code` modules do not. Hand-written markup in a text module gets stray
`<p>`/`</p>` injected, which breaks flex and grid layouts. Symptom:
`<span class="vm-label">Vision</span></p>`. **Write layout markup into code modules, and
keep replacement strings on a single line.**

**The import pack turns home-page sections into text modules.** The GRID regex in
`scripts/regen-page-json.py` does not match `hero`, `section` or `admit-section`, so they
are emitted as text and `wpautop` breaks them. The importer also de-duplicates admin labels
by appending "(2)", so a re-import *appends* a second hero instead of replacing it.
**Do not re-import the home page** until that regex is widened — the live page is the
source of truth.

**Theme Builder layouts sit outside the import pipeline.** Header **54939**, footer
**54940**. Safe to hand-edit; never regenerated.

**HTTP 200 is not "works".** Pages can return 200 and be empty shells, and WordPress
silently serves a *guessed* page for an unknown slug, also with a 200. Check main-area
content length and compare requested path to final path, not just the status code.

**Static payloads are authored against the local prototype.** Their relative links point at
`../SSSIHMS Website.html`, which 404s on the server. `deploy-static.sh` rewrites them and
then **fails the deploy** if any survive. It also fails if a poetry page ships without
`toc-nav.js` or a Vahini reader without `reader-nav.js` — both of those failures are
invisible, because the page renders perfectly and only its index is dead.

**Module labels are derived**, so renaming a module inside Divi is overwritten by the next
regeneration of that page.

## Conventions

Patient-facing copy: state what is free and what is not, precisely. Medical care, medicines,
surgery, ICU and the patient's food are free; the attendant's dormitory is ₹20 per day. Do
not generalise "everything is free" beyond that.

Never invent a clinical, operational or costed figure. If a value is missing the page says
so, or the section is left out.
