# Divi block templates — wfd.sssihms.org conversion

Generated from the "Sacred Warmth" static mockup (`src/css/site.css`, `design-handoff-v2/sssihms-render.jsx`).
Design tokens: primary `#c8813a`, dark `#7a4a2e` / `#2c1a0e`, paper `#f9f5ef`, card `#fefcf8`,
border `#e0d5c0`, muted text `#7a6a55`, radius `10px`. Headings **EB Garamond**, body **Nunito Sans**
(both on Google Fonts — add via Divi Theme Options → General → Typography, or `@import` in
Divi → Theme Customizer → Additional CSS).

## Status

Each `.txt` file below is a raw Divi shortcode template (paste into Divi Builder via
"Import from clipboard", or use as the `post_content` value when creating pages via WP-CLI /
`wp_insert_post`). Placeholders are `{{UPPER_SNAKE_CASE}}` — a generator script fills these
from the same `PAGES` object the current React site already reads, one block instance at a
time. **Each template must be visually validated once in the real Divi builder against its
built mockup page before being trusted for bulk generation** — these were authored by reading
`sssihms-render.jsx` + `site.css` directly, not by round-tripping through a live Divi install.

| File | Maps to `sssihms-render.jsx` component | Source usage count |
|---|---|---|
| `page-banner.txt` | `PageBanner` | every page |
| `prose-intro.txt` | `Prose` / `Intro` (merged — same shell, `s.image`/`s.reverse`/`s.narrow` toggle which layout) | 229 |
| `cards.txt` | `Cards` | 89 |
| `features.txt` | `Features` | 91 |
| `faculty.txt` | `Faculty` | 41 |
| `gallery.txt` | `Gallery` (also covers `Covers`, same grid shape) | 44 |
| `stats.txt` | `Stats` | 18 |
| `quote.txt` | `Quote` (plain + photo-split variants) | 13 |
| `cta.txt` | `CTA` | 7 |
| `split.txt` | `Split` | 5 |
| `table.txt` | `DataTable` | 2 |
| `faq.txt` | `Faq` | 2 |
| `testimonials.txt` | `Testimonials` | 1 |

Not templated as native Divi modules — see LIMITATIONS.md: `Banner` (full-width raw image,
trivial — just a Divi Image module, not worth a template), `StatsDash`/`FramePage` (iframe
embeds), `DeptSubNav` (SPA sub-tab bar).

## Build order (per the earlier recommendation)

1. `page-banner.txt` — every page depends on it, validate first.
2. `prose-intro.txt` — largest single share of content (~50% of all sections).
3. `cards.txt` + `features.txt` — next largest.
4. `faculty.txt`, `gallery.txt`, `stats.txt`, `quote.txt`, `cta.txt`, `split.txt`.
5. `table.txt`, `faq.txt`, `testimonials.txt` — low frequency, do last or drop if scope shrinks.
6. Header/Footer/Nav as WP Theme Builder templates (global, built once, not per-page).

See `LIMITATIONS.md` for what genuinely cannot be ported as a template fill and needs a
one-time decision instead.
