# Code-heavy pages: Bhagawan menu + Statistics

**The split already exists in the mock.** These pages are not monolithic. Each is an ordinary
page of Divi-able sections plus **one iframe** pointing at a standalone HTML file. So
"rebuild in Divi" and "keep as separate HTML" are not alternatives — do both, exactly as the
mock already does.

## Group A — wrapper pages → full Divi rebuild (16 pages)

These use only existing block templates. No new template work.

| Page | WP id | Sections | Iframe |
|---|---|---|---|
| `bhagawan` | 609 | intro, 3× covers, cards, cta | none — pure Divi |
| `songs-baba` | 52921 | prose/covers + embed | `poetry-pages/sai-compositions.html?embed=1` |
| `divine-poetry` | 54756 | prose/covers + embed | `poetry-pages/divine-poetry.html?embed=1` |
| `sai_padhyam` | 53609 | prose/covers + embed | `poetry-pages/padya-sudha.html?embed=1` |
| 12 × `*-statistics` | new | intro + embed | `stats-pages/<slug>.html` |

Each iframe becomes **one Divi Code module** carrying the `<iframe>` and the postMessage
height-sync snippet (see LIMITATIONS.md). Everything above and below it is normal blocks.

This resolves 12 of the 21 "new page" rows in slug-map.csv — the whole `*-statistics` group.

## Group B — payload files → stay static HTML, never rebuilt in Divi (15 files)

| Set | Files | Size | Notes |
|---|---|---|---|
| `poetry-pages/` | 3 | **9.9 MB** | `padya-sudha.html` alone is 6.9 MB |
| `stats-pages/` | 12 | ~250 KB | each pulls Chart.js 4.4.2 from jsdelivr |

The poetry weight is **pure text** — no images, no embedded fonts. It is a large verse corpus.
It gzips roughly 5–10×, so confirm nginx gzip is on for `.html` before worrying about it.

**These stay Claude-edited source files in this repo**, rebuilt by `build.mjs` and redeployed.
They must NOT be edited in WP admin — a WP-side edit is silently lost on the next deploy.
Say this on the page in an HTML comment so a future editor sees it.

## Must-do: host the payloads same-origin

The iframe height-sync uses `postMessage`, and the parent reads the child's height. Serving the
payload files from a different origin turns that into a cross-origin call and the sync breaks
(the iframe renders but sits at a fixed height). **Host them under
`whitefield.sssihms.org/...`, not on a second domain or an object store.**

WordPress's media library rejects `.html` uploads by default, so these need a real path on the
web server plus a deploy step. That path is the open decision — see below.

## Settled (18-Sep-2026)

1. **Hosting — done.** Files live at `/srv/www/wordpress/static/`, served at
   `https://whitefield.sssihms.org/static/`. That is the whitefield DocumentRoot, and the
   WordPress rewrite is guarded by `!-f`/`!-d`, so a real directory is served directly with
   **no Apache config change and no restart**. Deploy with `./scripts/deploy-static.sh`
   (dry run) / `--apply`. Atomic swap, idempotent, verifies over HTTPS afterwards.
   The server runs **Apache, not nginx** — an earlier note here said nginx and was wrong.
2. **Chart.js — self-hosted.** Vendored to `src/stats-pages/vendor/chart.umd.min.js` (4.4.2,
   sha256 `08dfa473…`); all 11 CDN references rewritten. The deploy script refuses to ship if
   a `cdn.jsdelivr.net` reference reappears.
3. **`divine-poetry` — added** to the Baba menu (item 54903, position 9).
4. **`songs` vs `songs-baba` — different pages.** `songs` is the "Songs & Poems" landing with
   no iframe and maps to live `/poems/` (53061, CONFIRM pending); `songs-baba` is
   "Sri Sathya Sai Compositions" and maps to 52921.
5. **gzip is on** (mod_deflate covers `text/html`). Measured on the largest file:
   6733 KiB → 1751 KiB over the wire, ~3.8×.

## Still open

- **`padya-sudha` at 6.9 MB** renders as one enormous DOM, 1.75 MB even gzipped. It will work
  but will feel heavy on a phone. Pagination or lazy-rendering is a real improvement and a
  real rewrite — flagging, not fixing, unless asked.
- **Deploying from macOS needs `COPYFILE_DISABLE=1`** or bsdtar emits AppleDouble `._*`
  sidecars into the web root. The first deploy shipped 19 of them; the script now sets the
  variable, asserts zero `._*` remain, and asserts the remote file count matches what was sent.

## Why not rebuild the payloads as Divi content

Not a capability limit — a maintenance one. The verse corpus and the chart configs are
structured data with markup, edited as text. Divi would turn each into hundreds of modules
that are slower to edit, impossible to diff in git, and unversioned. Keeping them as files in
this repo keeps them reviewable and Claude-editable, which is the stated requirement.
