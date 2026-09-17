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

## Divi gotchas — found by actually building the homepage draft (17-Sep-2026)

Validated against Divi on WordPress 7.0.4 by creating page ID 54830 as a draft, enabling the
Divi Builder on it, and saving. Apply these to every template before generating at scale:

- **`clamp()` is rejected in Divi font-size fields.** `header_font_size="clamp(24px,3vw,32px)"`
  is silently ignored. Use a fixed px value (take the clamp's max) and let Divi's own
  responsive tabs handle the tablet/phone sizes instead.
- **Blurb descriptions must be inner text, not a `content=` attribute.**
  `[et_pb_blurb content="..."][/et_pb_blurb]` renders an empty card; the text has to sit
  between the opening and closing tags.
- **Buttons need `custom_button="on"`** or every `button_*` styling attribute is ignored and
  you get Divi's default button.
- **`background_color_gradient_stops=` is not a real attribute.** Use
  `background_color_gradient_start=` / `_end=` with `use_background_color_gradient="on"`.
- **Images need `force_fullwidth="on"`** to span their column — `width="100%"` alone leaves the
  image at its natural size, left-aligned, with blank space beside it.
- **Body text needs an explicit size.** 13.5px (matching the source CSS) reads far too small in
  Divi's rendering; 15px is the working equivalent.
- **Divi normalises `et_full_width_page` to `et_no_sidebar`** when saving the page layout — both
  remove the sidebar, so this is harmless, just don't be surprised by the value changing.

Round-trip result: the builder parsed the hand-authored shortcode into 12 sections / 22 rows /
49 native modules with nothing dropped, and saving from the builder *added* default attributes
rather than stripping the custom ones (31,687 → 34,446 chars; all 27 `custom_css_main_element`
blocks, 38 EB Garamond and 37 saffron references survived). The approach works.

Still unstyled on that draft: Blurb images render as Divi's small centred icons rather than the
source design's full-bleed card-top images, the theme prints the page title above the content,
and header/footer are still the live site's (Theme Builder scope).
