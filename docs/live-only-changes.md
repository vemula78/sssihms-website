# Live-only changes on whitefield.sssihms.org

Changes applied directly to the live database that are **not** reflected in
`design-handoff-v2/` or the `divi-export` import pack. Re-importing an affected page
reverts them.

## 21-Sep-2026 — patient-access pass

Applied directly to the live site because the pages involved are either Theme Builder
layouts (outside the import pipeline entirely) or the home page, which must not be
re-imported — see the warning at the bottom.

| What | Where | In the prototype? |
|---|---|---|
| Header helpline corrected from `080-471004600` (one digit too many) to `080-4710 4600`, now a `tel:` link | Theme Builder header **54939** | n/a — outside the pipeline |
| Footer rebuilt with address, Help Desk + hours, general enquiries, patient/HR/registrar emails, Google Maps link, "How to reach us"; Help Desk and Contact Us added to Quick Links | Theme Builder footer **54940** | n/a — outside the pipeline |
| `Contact` added to the primary nav (menu term **116** → page **71**) | menu | n/a |
| Helpline printed in the home hero; Book Appointment card now carries the number and hours | page **54830** | **no — drifted** |
| Expired 19-Jun-2026 B.Sc Nursing deadline removed from the three places advertising admissions as open | page **54830** | **no — drifted** |
| "Walk-in OPD" removed — OP consultations are by prior appointment only | page **54969** | **no — drifted** |
| Stale COVID RT-PCR requirement deleted | page **735** | **no — drifted** |
| Help Desk page now prints the number it describes | page **52858** | **no — drifted** |
| Patient-enquiry email corrected to `helpdeskblr@sssihms.org.in` | pages **71** (Yoast metadesc), **1214**, **39190**; footer | n/a |

The prototype still carries the superseded copy in four parallel files
(`design-source/sssihms-data.jsx`, `design-handoff-v2/sssihms-data.jsx`,
`design-handoff/sssihms-website/project/sssihms-data.jsx`, `src/sssihms-data.js`).
They need reconciling before any of these pages is regenerated.

## Do not re-import the home page

`scripts/regen-page-json.py` decides whether a section becomes an `et_pb_code` module or an
`et_pb_text` module using the GRID regex:

```
class="[^"]*(auto-grid|faculty-grid|gallery-grid|stat-grid|table-wrap|subnav)
```

The home page's sections (`hero`, `admit-section`, and plain `section`) do not match, so
they are emitted as **text** modules. WordPress applies `wpautop` to text modules but not to
code modules, and it injects stray `<p>`/`</p>` into hand-written markup — which is what
broke the card layouts on 19-Sep-2026. The importer compounds it: it de-duplicates admin
labels by appending "(2)" rather than matching the existing module, so the hero was
*appended* instead of replaced and rendered twice.

Until the regex is widened to cover those classes, or the home page is excluded from the
pack, **the live home page is the source of truth**.

## The `52.148.87.145` migration damage

A past migration replaced `sssihms.org` with the server's IP throughout the database,
producing addresses that look plausible but bounce, and asset URLs pointing at a dead
`webhostbox.net` host.

### Fixed, 21-Sep-2026 — page content

`@52.148.87.145.in` → `@sssihms.org.in` across 24 non-revision rows of `sai_4_posts`
(`sacred@`, `hrblr@`, `radiologyblr@`, `anaesthesiablr@`, `neurosurgeryblr@`,
`registrarblr@`, `shravankumar.m@`). The match was anchored on `@` so it could not touch
the asset URLs, which contain the same IP string but no `@`. Two malformed spellings were
repaired by hand (`...org.inwith` → `...org.in with`, `...org.in/Ph:` → `...org.in / Ph:`).

The Divi **contact form on the Contact Us page (post 71) was delivering to
`hostmaster@52.148.87.145.in`**, so every enquiry submitted through "Write to Us" was
being sent to a non-existent mailbox. It now goes to `helpdeskblr@sssihms.org.in`.

Deliberately **not** rewritten, because they are records of what was actually sent rather
than content: 287 post revisions, 1 `postman_sent_mail` row, and 416 `sai_4_postmeta` rows
of mail logs (`to_header`, `original_to`, `from_header`, `original_message`). Rewriting a
log would falsify it. The 12 `_application` rows were left for the same reason.

### Fixed, 21-Sep-2026 — mail configuration

Six `sai_4_options` rows held the bad domain inside **PHP-serialized** values, where a
string replace corrupts the data: the `s:<len>:` byte-length prefix stops matching and the
option no longer unserialises. `scripts/fix-option-emails.php` instead unserialises, walks
the structure, and lets WordPress re-serialize, refusing to write anything that fails a
round-trip first. Repaired: `wp_mail_smtp` and `postman_options` (sender address on all
site email), `_caldera_forms` and `CF5667d73741237` (form notification recipients),
`itsec-storage` (security alert recipients), `auto_core_update_notified`.

All six verified afterwards as still unserialising to arrays of the expected size.

### Fixed, 21-Sep-2026 — asset URLs

`http://52.148.87.145.in.md-in-25.webhostbox.net/wfd/wp-content/uploads/` →
`https://whitefield.sssihms.org/wp-content/uploads/sites/4/`, with a second rule mapping
the bare `/wfd` prefix (used by `wp-admin` and `wp-login.php` links in the Events Manager
email templates) onto the site root. Applied to 42 non-revision post rows, four `dbem_*`
option templates, and `theme_mods_Divi` — which held the `custom-background` image that
every page requested from the dead host on load.

The target was established empirically, not assumed: uploads for blog 4 live under
`sites/4/`, and the non-`sites` path returns 404.

74 of the 105 distinct referenced files exist at the new location. The other 31 are listed
in [missing-upload-assets.md](missing-upload-assets.md) — they 404 now as they 404ed
before, since the host they pointed at is dead; the rewrite removed a third-party request
rather than recovering a file.

Left alone: 745 revision rows, and `sm_status` (a Google Sitemap Generator status object
that regenerates on the next build).

## 21-Sep-2026 — Phase 2

| What | Where | Status |
|---|---|---|
| `Hospital` JSON-LD on the front page — address, geo, telephone, email, opening hours, `priceRange: Free`, `isAcceptingNewPatients`, specialties, parent Trust | mu-plugin | live |
| Meta descriptions written for the seven key pages that had none (home, For Patients, Help Desk, Get Involved, Sevadal, Departments, Academics) | Yoast postmeta | live |
| "How to Reach the Hospital" — distances, BMTC routes, Gate No. 2, embedded map | page **735**, as a **code** module | live |
| "Patient Stories" — three real published accounts, linked | page **54830** | live |
| "The People You Would Be Serving" — links Get Involved to the patient stories | page **52837** | live |
| Support the Mission (donate) | page **55654** | **draft** |
| Emergency Care | page **55655** | **draft** |
| Coming From Outside Bengaluru | page **55656** | **draft** |

The schema values are all taken from the hospital's own published pages; the geo coordinates
are the ones already in the Contact Us map pin.

### Published 21-Sep-2026

**Support the Mission** (`/donate/`, page 55654) and **Emergency Care** (`/emergency/`,
page 55655) are live, and wired in:

- primary menu — Emergency Care leads *For Patients*; the existing *Donations* entry under
  *Get Involved* was repointed at `/donate/` rather than adding a second near-identical item
- footer Quick Links — both added
- home page — the "Emergency Care — 24/7" card now goes to `/emergency/` instead of the
  generic For Patients page, and "Support the Mission" to `/donate/`
- Get Involved — its two off-site links to the Trust's generic page now go to `/donate/`

**Coming From Outside Bengaluru** (`/outstation-patients/`, page 55656) is live. The
answer on accommodation turned out to be a warning rather than a detail: it is provided
**only for the attendants of admitted in-patients**, so an outpatient travelling for a
consultation must arrange their own stay or plan to return the same day. The page says that
plainly, because someone travelling from West Bengal on the assumption that the hospital
would house them is the person this page exists for.

All three pages are built entirely from `et_pb_code` modules, so `wpautop` cannot reach them.

## 21-Sep-2026 — Phase 3

| # | What | Where | State |
|---|---|---|---|
| 14 | Site search in the header top bar, with an sr-only label | header **54939** | live |
| 15 | Essential Information for Patients in Kannada, Hindi, Telugu and Bengali | pages **55667–55670** | live |
| 16 | Transparency — registrations plus all 15 Trust annual reports, 2010-11 to 2024-25 | page **55664** | live |
| 17 | Our Impact — page shell naming the figures still needed | page **55676** | **draft** |
| 18 | WCAG 2.1 AA pass — contrast, focus, skip link, touch targets, reduced motion | mu-plugin + footer **54940** | live |

### Languages

Rather than translating eight long pages into four languages badly, each language gets
**one** page carrying what a patient must actually know: care is free, nobody should ever
be paid, OP is by appointment with the number and hours, what to bring, where to report,
that emergency needs no call and no appointment, admission timing, revisit rule and
visiting hours. Every heading and paragraph carries a `lang` attribute, and each page links
to the other three and to the English pages.

Reachable from the header top bar on every page, and from the For Patients menu.

A script-contamination check runs over the source strings (the same failure mode as the
discourse transcripts — Devanagari characters landing inside Telugu). It caught one real
case, `सारांశం` for `సారాంశం`, before publishing. U+0964/U+0965 danda are whitelisted as
shared Indic punctuation.

These were published without native-speaker review, at the user's explicit instruction
after that risk was raised. A review by Kannada, Hindi, Telugu and Bengali speakers at the
hospital is still worth doing.

### Accessibility

Contrast was measured with a checker that composites alpha layers and reads gradient stops,
not by eye. The first pass found 19 genuine failures; all are fixed, and a re-run across
nine pages (home, For Patients, Appointments, Donate, Emergency, Transparency, Kannada,
Bengali, Help Desk) reports **zero**.

The interesting part was that the fix is not one colour. `--primary` `#c8813a` fails on
light backgrounds (2.90:1 on paper) but *passes* on the dark panels (5.28:1), so darkening
it globally broke `.quote-attr` and the `.section-dark` eyebrows. The rules are therefore
context-scoped: `#96591a` on light, `#c8813a` retained inside `.section-dark`, `#a4581f`
behind white text, ink on the pale pill, and the admissions gradient restarted at `#a4581f`
because white body text over its light end was 3.15:1.

Also added: a skip link as the first focusable element on every page, `:focus-visible`
outlines (Divi suppresses them in several places), 44px minimum touch targets under 980px,
and `prefers-reduced-motion` support. The a11y CSS loads on `wp_footer` because the shared
page stylesheet is emitted inside the page body and would otherwise win on source order.

### Still outstanding

- **Our Impact** (55676) needs per-procedure costs, state-wise and country-wise patient
  counts, and whichever outcome figures the hospital will publish. The page names each ask
  and states the rules for supplying them — aggregate only, with period, source and
  denominator, and nothing estimated.
- **Coming From Outside Bengaluru** (55656) still needs the attendant accommodation detail.
- Search results pages show the author and a full-page text dump as the excerpt. Functional
  but ugly; worth a template pass.

## 21-Sep-2026 — Search results

The stock Divi/WordPress search had three faults. All are fixed in the mu-plugin.

**No relevance ranking.** WordPress orders search results by date, so "cardiology"
returned a 2019 CME notice and never the Cardiology department page. A `posts_orderby`
filter now ranks an exact title match first, then titles containing the term, then
everything else. Search is also limited to pages and posts, ten per page.

**Excerpts were the whole page flattened to text.** Divi's `truncate_post()` strips tags
but not shortcodes, so every result read
"Home›Departments · CardiologyCardiologyOutpatient, inpatient…". Results are now rewritten
to show the hand-written SEO description where one exists, otherwise a cleaned 32-word
summary with the breadcrumb trail and the repeated banner title peeled off. Descriptions
were added for the main department and service pages, which is the real fix — the
heuristic is only the fallback.

**Author bylines and post dates on every result**, which mean nothing to a patient looking
for a phone number. Removed, and each result now shows its URL path instead.

Also added: a "Search results — N results for X" heading with a search-again box, and a
no-results state that points at appointments, emergency, departments, donating and contact,
and gives the Help Desk number.

### Two things worth knowing for future work here

`$q->is_main_query()` is **unreliable inside the `the_posts` filter** — WordPress assigns
`$wp_the_query` only after `get_posts()` has run its filters, so the main search query
reports false. Test the query object's own `is_search()` instead.

Mutating `post_content` on the objects in `$wp_query->posts`, or on the object handed to
the `the_post` action, **does not change what Divi prints**: `truncate_post()` re-reads the
post through `get_post()`, which returns the cached `WP_Post` instance, a different object.
Both approaches were tried and neither worked. The result markup is therefore rewritten in
an output buffer started on `template_redirect`, which is also the only way to place the
heading, since `loop_start` never fires when nothing matched and Divi's search template
offers no hook that covers both cases.

One trap in that buffer: the idempotency guard must look for the `<div class="…">` element,
not the bare class name, or it matches the class name inside the injected stylesheet and
silently skips the injection every time.

## 21-Sep-2026 — Outstation page completed

`/outstation-patients/` is published and in the For Patients menu. Accommodation is
provided only for attendants of admitted in-patients; the page states that outpatients have
no on-campus accommodation and should arrange their own stay or return the same day.

A **Meals** section was added: food for admitted patients is free, alongside consultation,
investigations, medicines, surgery and intensive care, and there is a canteen on campus for
outpatients and those with them.

Not stated, because it was not supplied: whether there is any charge for attendant
accommodation, how it is requested beyond the ward sister issuing the pass, and whether the
free meals extend to an admitted patient's attendant. The page says "food for admitted
patients" and no more — attendants are a large share of the people on campus, so that one
is worth pinning down.
