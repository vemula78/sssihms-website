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

## THE BIG ONE: `header_font` styles H1 only

Divi's `header_font` / `header_font_size` / `header_text_color` on a Text module generate CSS
for **`h1` only** — `.et_pb_text_6 h1 { … }`. Every block template here writes its section
title as `<h2>`, so for a long time *none* of the heading styling applied and every heading
silently fell back to Divi's theme default (Open Sans 26px #333). The same is true of `<h3>`.

Use the level-specific attributes:
- `<h2>` → `header_2_font`, `header_2_font_size`, `header_2_text_color`
- `<h3>` → `header_3_font`, `header_3_font_size`, `header_3_text_color`
- `<h1>` → plain `header_font` (correct as-is; only page-banner.txt uses h1)

Related: a Text module's `text_font` / `text_font_size` / `text_text_color` styles the module's
body copy. A heading module that also carries a `.section-sub` paragraph needs these set too,
or that paragraph falls back to 14px Open Sans #666 while the heading looks right.

**SOURCE OF TRUTH: `design-handoff-v2/SSSIHMS Website.html`, not wfd.sssihms.org.**
Confirmed 18-Sep-2026. Two prototypes exist with *different body type scales*. The deployed
mock at wfd.sssihms.org (`src/css/site.css`) uses a smaller scale; the JSX prototype raises
body copy to a **17px floor**. Every heading size is identical between the two — only body and
UI sizes differ. Build Divi against the JSX prototype.

**How to check it:** eyeballing screenshots never reveals a mis-set size, because Divi's
fallback looks like a deliberate (if flat) design rather than an error. Fingerprint instead —
read `getComputedStyle` for h2/h3/p in each section and diff against the table below. Anything
rendering "Open Sans / 14px / rgb(102,102,102)" is unstyled, not styled-differently.

| element | value |
|---|---|
| section h2 | 42px EB Garamond #2a1f14, line-height 1.2 |
| section sub (`.section-sub`) | **17.5px** Nunito Sans #7a6a55, lh 1.75 |
| body prose (`.prose-p`, card bodies) | **17px** — this is the floor, never go below |
| eyebrow | **14px** 700 #c8813a, letter-spacing .14em |
| news card h3 / desc | 19px / **17px** |
| news date / tag | 13px / 12px |
| stat value / label | 46px / **15.5px** |
| button `.btn` / `.btn-inv` | **15px** / 13px |
| pill `.free-pill` | **13px** |
| free strip item `.fi` | **14.5px** |
| vision-mission body `.vm-card p` | 14.5px (unchanged) |
| quote text / attribution | clamp(19,2.4vw,26) / **14.5px** |
| top bar | 13.5px |
| section padding | 72px top and bottom (64px for the CTA band) |

Rules from the design system: body copy floor is 17px for prose, 14px for UI chrome; do not
invent sizes between existing steps; uppercase text always carries letter-spacing .07–.15em
with weight 600–700.

**Divi sets every heading's line-height to 1.0.** Unless you pass `header_2_line_height` etc., a
42px h2 sits in a 42px box against the mock's 50.4px, and two-line headings nearly touch. Always
pair a `*_font_size` with a `*_line_height`: h1 `1.14em`, h2 `1.2em`, h3 `1.3em`, Blurb titles
`1.2em` (`1.25em` for the 20px academics cards).

**Blurb titles are `<h4>` and are styled by plain `header_*`.** They are NOT covered by
`header_2_*`/`header_3_*`, and a heading scan that only looks at h1–h3 will not see them at all —
16 card titles on the homepage sat at Divi's default 18px/600 long after the h2 fix, because
nothing in the audit was looking at h4. Set `header_font`, `header_font_size`, `header_line_height`
and `header_text_color` on the Blurb itself. Target sizes from the mock: specialty cards 21px 700
`#7a4a2e`, academics 20px 700 `#2a1f14`, patient 21px 700 `#2a1f14`, get-involved 24px 700 white.

**Shortcode attributes are last-wins, so a failed "replace" silently becomes a no-op.** When
editing an existing tag, strip every occurrence of the attribute before appending the new one. A
rewrite that prepends its value while the old one survives later in the tag looks like it worked
(the content changes, the length grows) but renders the old value — *added* attributes take effect
while *replaced* ones do not, which is the signature of this bug.

**The same trap via inheritance:** raw `<a>`/`<div>` markup inside a Text module inherits Divi's
Open Sans unless it sets `font-family` itself. The hero buttons set weight, size and colour but
not family, and rendered in Open Sans for weeks without looking broken. Any inline-styled element
that should use EB Garamond or Nunito Sans must name the family explicitly.

**Editing a builder-enabled page: use the REST API, not the classic textarea.** On a page with
`et_pb_use_builder=on`, typing into `#content` and clicking Save Draft does *not* stick — Divi
re-serialises `post_content` from its own builder state on submit and silently discards the edit
(confirmed 18-Sep-2026 on page 54830: 37,340 → 37,402 chars, none of them the change made). What
works is `POST /wp-json/wp/v2/pages/<id>` with `{content, status}` and the `wpApiSettings.nonce`
header, run from an admin page; read the current value back with `?context=edit` first and count
your match targets before replacing, so a bulk regex cannot hit more than intended.

**Also:** the WordPress page cache can serve a stale render right after a save. If a change
looks like it did not apply, re-request with a cache-busting query param before debugging it.

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
- **Gradients need `background_color_gradient_stops=`.** (An earlier note here said the opposite
  — that was wrong, corrected 17-Sep-2026 after testing on the live draft.) On Divi 4.27,
  `background_color_gradient_start=` / `_end=` alone are **ignored** and the section silently
  renders Divi's default blue→teal gradient. The working form is:
  `use_background_color_gradient="on" background_color_gradient_stops="#c8813a 0%|#7a4a2e 100%"`
  (keep `_start`/`_end` alongside it for older Divi). Verify the computed
  `background-image` actually contains your colours — a wrong attribute fails silently
  and looks like a theme colour, not like an error.
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

**Accepted deviation from the mockup — do not "fix" this back.** Divi's Blurb module renders the
card image as a small centred circular icon above the title, rather than the source design's
full-bleed image across the card top. Praveen reviewed this on the live draft (17-Sep-2026) and
judged Divi's circular-icon treatment **better** than the original design, so it stays. This
applies to `cards.txt` (89 uses) and the homepage specialty/academic cards alike — keep the
native Blurb default and do not add image-sizing overrides to force the full-bleed look.

## Installing header/footer into the Theme Builder (the only route that works)

`header.txt` and `footer.txt` cannot be installed the way page shortcode is. Two dead ends,
both confirmed on 17-Sep-2026:

- **Classic editor is blocked** for `et_header_layout` / `et_footer_layout` — WordPress returns
  "Sorry, you are not allowed to edit posts in this post type."
- **Divi Library doesn't work either** if the layout is created via `post-new.php?post_type=
  et_pb_layout`. It saves fine and is editable, but never appears in Theme Builder's "Add From
  Library" picker, because that route skips Divi's hidden `layout_type` taxonomy.

**What works: Theme Builder portability import.** Theme Builder → the ↑↓ icon → Export (to learn
the schema / take a backup), then Import a JSON of this shape:

```
{ "context": "et_theme_builder",
  "templates": [ { "title": …, "use_on": ["singular:post_type:page:id:<PAGE_ID>"],
                   "layouts": { "header": {"id": 90001, "enabled": true},
                                "body":   {"id": 0,     "enabled": true},
                                "footer": {"id": 90002, "enabled": true} } } ],
  "layouts": { "90001": { "context": "et_builder", "data": {"90001": "<shortcode>"},
                          "post_type": "et_header_layout", "post_title": …,
                          "theme_builder": {"is_global": false}, "images": [],
                          "global_colors": null, "post_meta": [ … ] } },
  "presets": {}, "has_default_template": false, "has_global_layouts": false }
```

The layout ids are arbitrary — Divi remaps them on import. Sections inside each layout carry
`theme_builder_area="et_header_layout"` / `"et_footer_layout"`. `theme-builder-import.json` in
this folder is the working file; regenerate it from header.txt/footer.txt.

**Import options matter:** untick *Override Existing Default Website Template* and omit the
default template from the JSON (`has_default_template: false`), or the import will overwrite the
site-wide template. Leave *Override Existing Assignments* ticked so the scoped assignment applies.

**Scope it, don't globalise it.** Filling the Default Website Template's Global Header/Footer
applies to all 182 published pages of the live site immediately. Until the redesign is approved,
assign templates to specific page ids only. To revert, delete the template card — Theme Builder
was empty before this work, so deletion restores the original state exactly.

Installed and verified on draft page 54830: custom header (logo, trust line, Primary Menu,
Get Care button) and custom footer (4 columns + bottom bar) both render, replacing the live
site's own header/footer on that page only.

Still genuinely unbuilt: the theme prints the page title above the content. Also note every
footer link targets a redesign slug that does not exist on the live site yet, so they 404.
