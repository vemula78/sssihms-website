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

**Attendant accommodation** is dormitory accommodation in the **Sai Salarpuria block** at
**₹20 per day**. On the day of admission the attendant pays the charge at the
administration area and then goes to the block. The page gives this as two numbered steps.

**Meals** are split three ways, because they work differently for each: food for the
admitted patient is free, along with consultation, investigations, medicines, surgery and
intensive care; **attendants eat at the canteen**; and the canteen also serves outpatients.

### The one place on this site where something is not free

The ₹20 dormitory charge is the only charge named anywhere on the site, so it is stated
precisely and immediately qualified — "for the attendant's dormitory bed only. The
patient's treatment, medicines, surgery, intensive care and food remain entirely free."

A sentence written here a few hours earlier, "There is nothing to pay, and no billing
counter to pay it at", was true of the patient but wrong once the attendant charge was
known. It has been narrowed to the patient. Anything that generalises "everything is free"
beyond medical care and the patient's own food is now inaccurate, and the claim is worth
checking before it is repeated on another page.

## 21-Sep-2026 — Bhagawan menu: Songs & Poems, and the Vahini readers

### Songs & Poems rendered nothing

`/poems/` and its three children — Divine Poetry, Sai Compositions, Padya Sudha — were
banner-only shells. Each held the 37 KB shared stylesheet plus a page banner and nothing
else, about 1.5 KB of real content.

The content was never missing. It had been deployed all along as static payloads at
`/static/poetry-pages/` (divine-poetry 1.2 MB, sai-compositions 1.8 MB, padya-sudha
6.9 MB) — the Divi pages simply never linked to them, and the `/poems/` hub pointed at the
empty shells instead. Fixed by repointing the hub at the static files and giving each shell
an "Open the collection" card, with the file size shown, since Padya Sudha is 6.9 MB and
that matters on mobile data.

### The Vahini readers worked; their navigation did not

The 16 readers render correctly — *Prema Vahini* alone is 190,000 characters with chapter
navigation, and the dc-component runtime and `support.js` are all present and working. The
fault was narrower: the two header links, **← SSSIHMS** and **Bhagawan**, pointed at
`../SSSIHMS%20Website.html#vahinis` and `#bhagawan` — the local prototype file, which
404s on the server. A reader who opened a book had no way back into the site.

Only two files carried it, `Reader.dc.html` (shared by all 16 books) and `Library.dc.html`,
two occurrences each. Rewritten to `/vahinis/` and `/about-hospital/bhagawan/`.

`/static/` sends no `Cache-Control`, so browsers revalidate against `Last-Modified` and
ETag; returning visitors pick the fix up on their next revalidation.

### The deploy script now prevents the regression

`scripts/deploy-static.sh` rewrites those prototype links in `dist/` at deploy time, so the
source keeps working in local preview, and then **fails the deploy** if any reference to
`SSSIHMS Website.html` survives — the same shape as the existing guard against shipping
stats pages still pointed at the CDN. Without this the next deploy would have quietly
restored both 404s.

It also deletes `.DS_Store` before shipping. One was already live under `/static/vahinis/`
and has been removed; they leak directory contents and should never be served.

## 21-Sep-2026 — Poetry pages: the contents lists were inert

The three poetry collections opened and read fine, but **no poem could be reached**.

Each page renders a contents list — 132 entries for Divine Poetry, 51 for Sai Compositions,
**717 for Padya Sudha** — and every poem carries an `id` (`dp-p-1` … `dp-p-718`). But the
entries were drawn by the bundled prototype component as
`<a class="dp-toc-link" data-n="7" data-i="6">` with **no `href` and no click handler**.
`document.querySelectorAll('a[href]')` returned zero on all three pages. The index looked
complete and did nothing; a reader could only scroll, through 6.9 MB in Padya Sudha's case.

`src/poetry-pages/toc-nav.js` wires them up. It sets a real `href` rather than scrolling
from JS, so entries stay keyboard focusable, middle-clickable and copyable and the browser
does the scrolling, and it tracks the current poem with an `IntersectionObserver` so the
list stays in step with the reader.

Numbering cannot be assumed: Padya Sudha lists 717 poems but its ids run to `dp-p-718`, so
the script resolves `data-n` to an id first and falls back to `data-i` as a position. All
717 wire up, none unwired, and the final entry `#dp-p-718` resolves.

The script is in `src/poetry-pages/`, which `build.mjs:83` copies wholesale, and the three
source HTML files now load it. `deploy-static.sh` fails the deploy if any poetry page ships
without it, since the failure is silent — the page looks right and the index just does
nothing.

## 21-Sep-2026 — Clickable cards, and a fix to the TOC script

### Whole-card click targets

On `/poems/` the card headings were not clickable; only the small "Open →" was. The four
cards are now marked `.card-clickable` with their single anchor marked `.card-link`, and the
mu-plugin stretches that one link across the card with an `::after` overlay.

Deliberately **not** done by wrapping each card in an `<a>`: that makes a screen reader
announce the heading, the description and the button as one long link. The overlay keeps one
link per card, leaves the heading a heading, and keyboard focus still lands on the link —
with `:focus-within` outlining the whole card so the focus ring is visible. Anything else
inside a card is lifted above the overlay with `z-index` so it stays clickable.

The styling is opt-in on `.card-clickable`, so the identical `.info-card` grids elsewhere
(For Patients, Get Involved, home) are untouched until the class is added.

### The TOC script gave up too early

The first version of `toc-nav.js` polled 60 times at 250 ms — a 15-second window. Divine
Poetry and Sai Compositions wire up well inside that, but **Padya Sudha's 717 poems can
take longer**, and when they do the script gave up and left the index dead. Exactly the
bug it was written to fix, on the one page where it matters most.

Replaced with a `MutationObserver`, which also handles the bundle re-rendering and dropping
the hrefs again. Padya Sudha now reports 717 of 717 wired immediately.

## 21-Sep-2026 — The three poetry menu links led to dead-end shells

`/divine-poetry/`, `/songs-baba/` and `/sai_padhyam/` all returned 200, so a link crawl
called them healthy. They were dead ends: a banner and a link onward, nothing more. Earlier
today those shells were given an "Open the collection" card, which made them *usable* but
still an extra, pointless hop from the menu.

The three menu items now point **straight at the content**, and the three slugs 301 to the
same place so old links, bookmarks and search results land on the collection rather than a
shell.

### Why not an iframe

The established pattern for these payloads is a Divi page embedding the static file — the
statistics pages do exactly that (`<div class="dash-frame"><iframe src="/static/stats-pages/…">`),
and the poetry pages already `postMessage` an `ssdash-height` for a parent to size them by,
which is clearly what was intended.

It was the wrong fit here. These are long documents with a sticky contents sidebar, and
Padya Sudha holds 717 poems: an iframe either double-scrolls or grows to a height that
breaks the sticky positioning. So they are linked directly, as the Vahini readers are.

### Which reintroduced the Vahini problem, so it is fixed the same way

Linking straight to a static page means arriving somewhere with no site chrome, and these
pages had **no links at all** — the exact stranding this morning's Vahini fix addressed.
`toc-nav.js` now also prepends a slim sticky bar with **← SSSIHMS**, **Bhagawan** and
**Songs & Poems**, plus the current collection's name.

Two bugs of my own on the way, both now guarded:

- the bar silently never appeared, because the `MutationObserver` fires while the document
  is still parsing, when `document.body` is null — `insertBefore` threw and, being the
  first call in `run()`, took the contents-list wiring down with it on that pass;
- so `run()` now wraps each half in its own `try`, and the bar checks for a body first.
  The bar is a convenience and must never be able to break the index.

## 21-Sep-2026 — Vahini series, checked the same way

### The hub had two faults

**15 cards displayed literal `<em>` tags.** The italic markup in every volume's subtitle was
double-escaped, so visitors read `<em>Stream of Love</em> — Short, urgent chapters…` with
the angle brackets showing. Unescaped; 16 italics now render properly and 0 literal tags
remain.

**The cards were not clickable** beyond the small "Read →", the same as the poetry cards.
All 15 now carry `.card-clickable` / `.card-link`.

### The readers' Contents panel was inert

This is the poetry-index bug again, in a different place. Each reader has a Contents panel
of chapter buttons — 73 in Prema Vahini, 42 in Bhagavatha Vahini — and every chapter sits
in the document with an id (`ch-1` … `ch-73`). Clicking a chapter **closed the panel and
did nothing else**, on a page 92,000px tall. Chapter 73 was reachable only by scrolling to
it.

`src/vahinis/reader-nav.js` wires the buttons to their chapters. Notes on two things that
had to be got right:

- **Instant, not smooth.** A `behavior: 'smooth'` jump across Bhagavatha Vahini's 204,000px
  never practically arrives. A chapter jump has to behave like an ordinary anchor.
- **The landing drifts.** These books keep growing as images and later chapters lay out, so
  the target moves *after* the jump — the bigger the book, the further out you land. The
  script re-seats at intervals up to 7s, and only while the target is more than 4px off.
  That took Bhagavatha Vahini's worst case from ~204,000px out to a few thousand.

Residual drift on the largest books is a few screens rather than exact. Landing in the
right region beats not moving at all, but it is not finished work.

### Verified clean

All 15 stubs resolve to an existing data file (74 KB–757 KB) with no orphans, the Library
lists 16 links with none broken and no unrendered templates, and every reader's header
links (**← SSSIHMS**, **Bhagawan**, **Reading Library**) return 200.

`deploy-static.sh` fails if a reader ships without `reader-nav.js`.

### A menu item I broke and fixed

Repointing the three poetry menu items at the static collections converted them from
`post_type` to `custom` links. A `post_type` item inherits its label from the page; a
`custom` one needs `post_title` set — and item 55212's was empty, so **Divine Poetry
vanished from the menu** while the other two, which had explicit titles, stayed. Title set,
and the leftover `_menu_item_object` values tidied from `page` to `custom`.

## 25-Sep-2026 — Old home pages set to noindex

The previous front page and a 2015 leftover were still published and indexable, so search
engines could show visitors the old home page with pre-21-Sep contact details.

| Page | ID | Change |
|---|---|---|
| `/home/` — previous front page (2015–Aug 2026, 268 revisions) | **37** | Yoast `_yoast_wpseo_meta-robots-noindex = 1` |
| `/home-2/` — "Home 2", actually a 2015 Cardiology header/slider stub | **442** | same |

Both stay **published** so they remain reachable for comparison; both now emit
`noindex, follow` (verified), and the live front page (54830) still emits `index, follow`.
Reverting to the old front page remains a one-setting change (`page_on_front` 37).

## 25-Sep-2026 — Fellowship 2026 admissions notice, RGUHS notification, new stipends

Source: RGUHS notification RGUHS/FELLOW/COE/69316/2026-27 dated 22-Sep-2026, and the two
department flyers (Interventional Cardiology; Cardio Vascular Anaesthesia), 2026-27.

| What | Where | State |
|---|---|---|
| Static notice in the home hero, between the free-care band and Vision/Mission: "FELLOWSHIP 2026 ADMISSIONS … Application window 05 October 2026 – 19 October 2026", linking to `/academics/fellowship/#fellowship-admissions`. Static, not scrolling (WCAG 2.2.2). | home **54830**, hero code module | live |
| PDFs uploaded: RGUHS notification **55692**, IC flyer **55693**, CVA flyer **55694** (`uploads/sites/4/2026/09/`) | media | live |
| "Application Status and Contact" (still said Aug-2025, closed) replaced with Fellowship 2026 Admissions: window, RGUHS calendar of events, ₹22,400 RGUHS admission fee, the three downloads, existing contact line. Divi `module_id="fellowship-admissions"`. | Fellowship **255** | live |
| Stipends: CTV Anaesthesia Rs 85,000 → **Rs 1,02,000/- per month**; Interventional Cardiology Rs 1,00,000 → **Rs 1,20,000/- per month** | Fellowship **255**, "Applications and Stipends" | live |
| Anchor fallback script `#fa-anchor-fix`: Divi's on-load hash scroll did not fire; the script scrolls to the section only if the page is still >200px away 1.5 s after load | Fellowship **255** | live |

**Remove or change the home notice after 19-Oct-2026** — it has no expiry.

## 25-Sep-2026 — Follow-ups

| What | Where | State |
|---|---|---|
| ANES-Fellowship: stipend "as per RGUHS guidelines" → **Rs 1,02,000/- per month** (prose + card); "Admission session: July/August" → 2026–27 window 05–19 Oct 2026, classes 02 Nov 2026, link to the RGUHS notification | **681** | live |
| Eyebrow above the stipend cards: "Fellowship in Pediatric Cardiac Surgery" → "Fellowship Programmes 2026–27" | Fellowship **255** | live |
| "No Tuition Fees" pill removed from the B.Sc Nursing card — no tuition fee applies to every course, and the section subtitle already says so | home **54830**, Building Future Healers | live |
| Nursing-only "No tuition fees" removed in three more places: Nursing card, B.Sc Nursing Programme section, "Latest from SSSIHMS" news card. Only the all-programmes subtitle mention remains. | home **54830** | live |
| Interventional Cardiology prose: "Stipend at par with senior residents in this institute" → "a stipend of Rs 1,20,000/- per month" | Fellowship **255** | live |

## 25-Sep-2026 — Header: Trust line into the logo, top bar trimmed

Header Theme Builder layout **54939** (every page):

| What | State |
|---|---|
| Logo image module replaced by a code module: same logo image plus "A Unit of Sri Sathya Sai Central Trust" as text inside the white logo box (`.sssi-logo`, `.sssi-logo-trust`, #7a4a2e on white) | live |
| Separate "A Unit of Sri Sathya Sai Central Trust" text removed from the top bar | live |
| Telemedicine and Blog links removed from the top bar | live |
| Language links (ಕನ್ನಡ हिन्दी తెలుగు বাংলা) moved to the right end of the top bar, where the Trust line was; `lang` attributes added | live |

Pre-change content is kept as a revision of 54939.
| Main menu: "Blog" (page 1458, `/sssihms-blog/`) added as the last item under About Hospital — it lost its only site-wide link when the top-bar link was removed | menu **116**, item **55704** | live |

## 25-Sep-2026 — Logo went black in mobile dark mode

Users reported the logo showing fully black on phones in dark mode. Cause: the logo PNG is
76% transparent pixels with black text, and the site declared no colour scheme, so
Android forced-dark modes (Chrome auto-dark, Samsung Internet) darkened the white box
behind it while the text stayed black.

| What | Where | State |
|---|---|---|
| Logo flattened onto an opaque white background (`Website-full-length-logo-white.png`, media **55705**); original kept | header **54939**, footer **54940** | live |
| `<meta name="color-scheme" content="only light">` + `:root{color-scheme:only light}` — the site has no dark theme, so forced darkening is opted out of | mu-plugin `sssihms_wfd_color_scheme()` | live |

The mu-plugin was backed up on the server before the edit (`/tmp/mu-backup-*.php`).

## 25-Sep-2026 — Home: patient actions section, "We Are Here for You" moved up

Home **54830**. Responds to the patient-centric heuristic evaluation (patient tasks buried
10.6 screens down on mobile).

| What | State |
|---|---|
| New code module "Patient Actions — Your First Visit" directly after Service in Numbers: "How can we help you today?", four steps — call the Help Desk (+91 80 4710 4600, 10 AM–4 PM Mon–Fri) and take an appointment → receive an SMS with date and time → show the SMS to Security at Gate No. 2 at the appointment time → proceed to the Screening / Reception block. Then buttons: Call Help Desk, Emergency, How to reach us (/contact-us/), What to bring (/appointments-admission/), Coming from outside Bengaluru (/outstation-patients/). | live |
| "We Are Here for You" moved from after Building Future Healers to directly below the new section | live |

Process per Praveen 25-Sep-2026; Gate No. 2 and the Screening / Reception block are from the live Appointments page (735).
Mobile position (375 px): "How can we help" 3.4 screens, "We Are Here for You" 10.6 → 5.1 screens.
Section backgrounds still alternate (section / alt / section / alt).

## 25-Sep-2026 — Facility Management Services page; Go Green pages updated

Sources: FMS summary (Admin Office, 24-Sep-2026); Sustainability master report; Solid Waste,
Water, Tree Plantation and Electrical notes; "Water Management" and "Water Conservation
Award Nomination" decks; one photo; OWC and STP videos.

**Figure decisions (Praveen, 25-Sep-2026), where sources conflicted:**
- Aerators: **1,648 aerators + 1,691 taps replaced** (FluxGen), not "1,691 aerators" (FMS email).
- Recharge: **120 percolation wells** (FMS email), not "3 borewell units + 5 pits → 19 → 50"
  (nomination). The nomination's 19/50 roadmap is therefore omitted.
- Water: **FluxGen measured** 17.98% / 17,289 KL (Apr 2025–Apr 2026, baseline 7,396 m³/month);
  the "300 → 280 KLD" figure is not used.
- Trees: live figures kept (108 transplanted, 25 Rudraksha); only "1,000+ plants" added.

**Not used, deliberately:** solar "~1,000 units/day" (conflicts with 3,16,831 kWh in 2025 ≈ 868/day);
"₹9 lakh more per annum" from dry waste (doesn't match the deck's own table); borewell count (7 vs 9);
the water award as a win (it is a nomination); the master report PDF (internal/archival); the
pipe-and-filter image (possibly AI-enhanced — awaiting confirmation); staff email addresses;
the BSWML ₹12/kg arrangement.

| What | Where | State |
|---|---|---|
| New page **Facility Management Services** — intro, six impact cards, five service areas, commitment; linked to Go Green | page **55711**, `/facility-management-services/`; menu item **55712** under About Hospital after About the Trust | live |
| "Sustainability in Numbers" stats + Awards and Recognition; five initiative cards refreshed (solar 280 kW, LED/BLDC/VFD chiller, 120 wells, aerators, H.E.L.P. award) | Go Green **52084** | live |
| "Solar Power Today" — 280 kW, 3,16,831 kWh in 2025, ~10% of electricity, −9.45% consumption | Solar **52658** | live |
| "Eco-Friendly Energy" — LED 5,500, BLDC 550, VFD chiller, pump 50→35 kW, 8,000 L solar water heaters; BLDC fan photo (media **55708**, GPS stripped) | Power Conservation **52973** | live |
| "Water, Measured. Water, Saved." (AquaGen, aerators, before/after table, ₹30/KL caveat) + "All Wastewater Treated and Reused" (300 KLD STP, 150 KLD sullage, KSPCB table); STP video (media **55710**) | Water Use **52966** | live |
| "120 Percolation Wells" — construction and capacity | Rain Water Harvesting **52712** | live |
| "Waste Management Today" (wet/BMW/dry/mixed/Bintix/sewage) + 2024 results table, reduction steps, awards; OWC video (media **55709**) | Waste Management **52680** | live |
| "Prema Taru — Growing a Greener Tomorrow" (1,000+ plants) | Trees **52721** | live |

All seven Go Green pages were checked against their exported copy before writing, and a
pre-change revision saved. Verified: no shortcode leakage, no horizontal scroll at 375 px.
| FMS menu item **55712** moved from About Hospital to **Departments › Services** (last, after HMIS); page breadcrumb changed to Home › Departments › Services › Facility Management Services | menu **116**, page **55711** | live |

## 2026-09-26 — Fellowship flyers withdrawn (corrections pending)
- Page 255 (Fellowship): removed the two flyer entries from the Fellowship 2026 Admissions → Downloads list; only the RGUHS notification (55692) remains.
- Page 681 (ANES-Fellowship): link text "RGUHS notification & flyer →" → "RGUHS notification →".
- Page 54830 (home): notice link text "Details, RGUHS notification & flyers →" → "Details & RGUHS notification →".
- Media 55693 / 55694 left in the library (not deleted); replace when corrected flyers arrive.

## 2026-09-26 — Biomedical waste menu → BMW Tracker plugin pages
Requested via the BMW Tracker plugin session. Plugin pages 54787 (`/bmw-tracker/`) and 54788 (`/biomedical-waste-management/`) not edited.
- Menu 116, item **55204** (Go Green): repointed from page 51982 "Biomedical Waste Report" to page **54788** "Biomedical Waste Management".
- Menu 116, new item **55716** "BMW Staff Login" → page 54787, child of FMS item 55712 (Departments › Services › Facility Management Services).
- Page **51982** `/biomedical-waste-report/` set to draft (not deleted).
- mu-plugin `sssihms-wfd-patient-access.php`: added `sssihms_wfd_bmw_redirect` — 301 `/biomedical-waste-report/` → `/biomedical-waste-management/`. Pre-change backup kept on the server.
- The seven Go Green pages already linked to `/biomedical-waste-management/`; no content changes needed.

## 2026-09-26 — FMS submenu: staff and booking links
Requested by Praveen (also relayed from the Facility Management WordPress session). No page content changed.
- Menu 116, under FMS item 55712 (Departments › Services › Facility Management Services), in order:
  **55719** Dashboard → page 54778 `/maintenance-staff-portal/`; **55720** Guest House Booking → page 55718 `/guest-house-booking/`;
  **55721** Staff Login → custom `/login/` (Theme My Login route, not a page); **55722** Fleet → custom `/fleet/` (separate Apache app);
  then the existing **55716** BMW Staff Login.
- Page cache purged. Server backups kept outside the web root (home directory), per the shared-host rule.

## 2026-09-27 — College of Nursing page: content from the SSSIHC display deck
Source: "College of Nursing - SSSIHC Display.pptx". Page **259** `/academics/nursing-and-allied-health/`; revision saved first; four `et_pb_text` modules inserted before "B.Sc Nursing — 2026–27". Existing modules untouched.
- **Vision & Mission** (deck slide 3, verbatim).
- **Milestones, 2008–2025** — all 30 entries from the deck's four timeline images (slides 4–7), grouped by year. Confirms 1 Sep 2008 = start of College, 4 Oct 2008 = formal inauguration.
- **Sri Sathya Sai Education in Human Values** — programme text, AWR 100–700 curriculum, eight SSSEHV teachers (names only), Counselling the SAI Way, Moral Class (slides 13–19).
- **Classrooms & Laboratories / Life at the College** — lab list + two 6-photo grids.
- Media **55723–55735** (13 photos, re-encoded ≤1600 px, EXIF/GPS stripped; 12 used, library photo unused). Photos with unclear subject not captioned or not used; teacher portraits not used (name-to-photo mapping unverified).
- Not changed: "no tuition fees" mentions (home-page removal of 26-Sep did not cover this page); bottom CTA still reads "Admissions Open 2026–27 … apply by 19th June 2026" — awaiting instruction.

## 2026-09-27 — Nursing: student batches added, admissions marked closed
- Page **259**: new "Our Students — Batches of the College" grid: I Semester (**55736**), III Semester (**55737**), V Semester (55735, moved from Life at the College), IV Year (**55738**). Labels mapped from slide 12 layout; unlabelled centre photo (appears to be faculty) not used. Teacher portraits not used, per instruction.
- Admissions closed: page 259 "Apply Online" button removed; bottom banner on pages **259**, **63** (Academics) and **1458** (Blog) → "Admissions 2026–27 Closed", "Applications … closed on 20th June 2026", enquiry numbers, button → tel:+918028004763. Revisions saved.
- Left as dated notices: Blog 1458 news card "Applications Now Open … Deadline 19th June 2026" (still links the form) and home 54830 "Latest" card (already past tense).

## 2026-09-27 — Department pages: content from the SSSIHC display decks
Same approach as the Nursing page: new `et_pb_text` modules built from the shared stylesheet classes, inserted without editing existing modules (except where noted); revision saved before every write; section backgrounds kept alternating. Photos re-encoded ≤1600 px with EXIF/GPS stripped. **Not used anywhere:** doctor/teacher portraits, patient or caregiver photos, intra-operative images, case studies (consent not confirmed), and any deck figure that conflicts with a figure already on the site.

| Department | Pages | Added | Media |
|---|---|---|---|
| Cardiac Surgery (CTVS) | 116 Faculty, 112 Infrastructure, 590 Achievements | Heads of Department (8); 4 visiting-surgeon legends; theatre/ICU equipment; DNB gold medals, BSc Perfusion ranks, awards; 7 publications + Dafodil valve study; 2021 talks, papers, conferences; outcomes database, COVID masterclass, CPR drive, Healing Little Hearts | — |
| Neurosurgery | 87, 122 Infrastructure, 669 Achievements | Milestones 2001–2022 + early trajectory; Dr. A. S. Hegde; HODs 2001–present; 4 international faculty; wards/OT/equipment; honours; research highlights (NEJM, Radiology, SSSIHMS-model papers); DNB programme | 3 photos |
| Lab & Blood Bank | 412, 1247 Infrastructure, 1256 BSc MLT | Milestones 2001–2025 (deck timeline images); blood bank facts + 3 test-volume trend charts (images); doctors by section; research & CMEs; gallery; equipment by section; MLT graduates & visiting faculty. **1247: placeholder "(Class __ and Class __)" removed.** | 13 |
| OBGYN | 53292 | Chronicles 1976–2025, key expertise, infrastructure photos; legends, HODs, 10 honorary consultants; conferences & presentations, initiatives, conclave photos | 8 |
| Dental | 53304 | Chronicle 1971–2023; scope, infrastructure, yearly department totals 2016–2024; academics, outreach, plans | 4 |
| Physiotherapy | 206 | Chronicles & clinical work (4,28,750 patients Jan 2001–Mar 2025); equipment + photos; former heads, internship, presentations, proposed neuro-rehab centre. Existing textbook sections left in place. | 9 |
| Counselling | 210 | Three-stage process, tools, BRMC beneficiaries Jan–May 2025 (charts); academic model, Dr. Mia Leijssen, Norwich/Mayo/INSEAD/Springer; origins 1976/2001, gratitude, team & training photos | 9 |
| CSSD | **new draft page 55801** `/cssd/` | Generic CSSD functions, process, QC and safety from the deck's 13 teaching posters; poster gallery. Deck has no department-specific facts — left as **draft**, not in menu. | 13 |

Discrepancies found and deliberately not reconciled (awaiting departments): CTVS total 28,362 (deck, to FY 2024–25) vs 30,837 (site); Neurosurgery 34,761 vs 41,185; OBGYN "established 1976" (site) vs department formed 2012 (deck); OBGYN "50–60 deliveries/month" vs 554 newborns in 2024; spellings Vijendra/Vijayendra, Nikhita/Nikita (site spelling used), Ravi/Ravindra Goyal (neurosurgery main page now shows both).

## 2026-09-27 — Poetry pages: contents list on mobile, sticky-bar overlap
`/static/poetry-pages/` (Divine Poetry, Sai Compositions, Padya Sudha) — static files outside WordPress, shared script `toc-nav.js`.
- The bundled page stylesheet hides `.dp-toc-list` below 880 px with no way to open it, so phones had no index. `toc-nav.js` now turns the "Contents" heading into a Show/Hide toggle below 880 px (role=button, keyboard operable, aria-expanded); the list opens in a 60vh scroll box and closes when a poem is tapped. Desktop sidebar unchanged.
- The site bar injected by `toc-nav.js` (sticky, top 0) was covering the page's own sticky toolbar and hiding the search box after scrolling, at all widths. The toolbar is now pinned below the bar, and poem jump offset / desktop TOC top are computed from the real bar heights.
- `toc-nav.js` is served with a 1-year Cache-Control, so the three HTML files' script tag became `toc-nav.js?v=20260927` (only change to those files). Bump the version on any future edit to the script.
- Backups on the VM: `/home/azureuser/toc-nav.js.bak-20260927`, `/home/azureuser/poetry-pages.bak-20260927/`.

## 2026-09-27 — Poetry pages: fixes from an independent code audit
Same three pages. Script now `toc-nav.js?v=20260927b`.
- TOC taps are handled by `toc-nav.js` in the capture phase: one scroll that clears both sticky bars (previously the bundle's smooth scroll and the browser's #anchor jump ran together). Focus moves to the poem, the URL hash is updated, Ctrl/Cmd/middle-click still open a new tab, reduced-motion is respected.
- Toggle, keyboard and link handling are delegated from the document (no per-element wiring to leak or lose on a re-render); the heading carries `aria-controls`; a second copy of the script exits immediately.
- Sticky offsets re-measure through a ResizeObserver (border box) and once per frame on resize, so a late font load or re-wrapping site bar no longer leaves the toolbar under it.
- On a phone the list opens at the current poem and is capped to the space under the bars (`dvh`, `vh` fallback); the page scrolls the heading up under the bars if the list would run off screen. Desktop TOC height also uses `dvh`.
- Removed the script's own IntersectionObserver highlight; it disagreed with the bundle's scroll handler. The bundle's handler (inside each page's base64 bundle) now measures from the toolbar's bottom edge instead of its height, so it allows for the site bar: `var off=(tb?tb.getBoundingClientRect().bottom:0)+30;` — the only change inside the bundles (base64 round-trip verified byte-identical before editing).
- Backups on the VM: `/home/azureuser/poetry-pages.bak-20260927b/` (all four files as they were before this change).

## 2026-09-27 — Poetry pages: fixes from the second audit
Same three pages; `toc-nav.js` only (HTML files changed only in the script tag, now `?v=20260927c`).
- History: a new entry only when the poem changes (re-tapping the same poem no longer adds Back steps); a refused `pushState` falls back to setting the hash.
- Back/Forward between poems moves keyboard focus to the poem now showing (`popstate`).
- Focus on a poem after a jump shows a saffron ring when it came from the keyboard (`:focus-visible`), none after a tap.
- Focus is moved after the smooth scroll ends (`scrollend`, 1 s fallback) — iOS Safari before 15.5 ignored `preventScroll` and jumped mid-scroll.
- With the list open on a phone, the highlighted entry is kept in view inside the list as the page scrolls.
- Removed the list's 120 px minimum height (it overflowed short landscape screens); the open-list page scroll measures the visual viewport.
- Backups on the VM: `/home/azureuser/poetry-pages.bak-20260927c/`.

## 2026-09-27 — Poetry pages: highlight after a search
`toc-nav.js` only; script tag now `?v=20260927d`.
- The bundle's search hides non-matching poems but re-picks the highlighted contents entry only on the next scroll, so a search that did not move the page (e.g. at the top) left a hidden poem lit. After each search input or Clear, `toc-nav.js` fires a synthetic `scroll` so the bundle's own handler re-picks among the poems still showing. No bundle change.
- Backups on the VM: `/home/azureuser/poetry-pages.bak-20260927d/`.

## 2026-09-28 — Faces blurred in four archive photos (History-GH, Dental)
Faces blurred at the hospital's request (the person had been marked out in black on screenshots): `opd-inauguration-1.jpg`, `ganesha-1.jpg`, `ganesha-3.jpg` (History page, 53322) and `dental-inauguration-1.jpg` (Dental page, 53304). Pixelate + Gaussian blur with a feathered edge over the marked area; nothing else in the photos changed.
- Every copy was replaced: the WordPress originals (attachments 55593, 55582, 55584, 55579) with all sizes regenerated from them, `uploads/sssihms-assets/sssgh/`, the higher-resolution copies served by wfd.sssihms.org (`/srv/www/wfd/assets/sssgh/`), and `src/assets/sssgh/` in this repo.
- Site-wide check: all ~23,500 images under `/srv/www` were compared (same-shape candidates, 32×32 greyscale match) — these four photos exist only in those locations. Related event photos were checked by eye for the Dental person; no other appearance found. Different photos of the same person cannot be found automatically (no face recognition).
- Images are served with a 1-year cache, so the page image URLs now carry `?v=20260928` (History: 3 URLs, Dental: 1). wfd.sssihms.org sends no long cache header and its HTML was left unchanged.
- Backups on the VM: `/home/azureuser/history-gh-faceblur-bak-20260928/`, `/home/azureuser/faceblur-bak-20260928/`.
- The unblurred versions remain in this repo's git history (commits before this one).


## 2026-09-28 — Home: multi-specialty surgeries stat 1,700+ → 3,300+
Home page (54830), "Service in Numbers": "Multi-Specialty Surgeries per Year" changed from 1,700+ to 3,300+ at the hospital's request. Only that one value changed.
- Same change made on "Support the Mission" (55654, /donate/) and the draft "Our Impact" (55676) — the only other places the figure appeared.
- Backup on the VM: `/home/azureuser/home-stat-bak-20260928/`.

## 2026-09-28 — Home: second Swami photo replaced
The home page (54830) showed `Swami-with-stethoscope-e1487392181378.jpg` twice — beside the 2003 quote and in "The Guiding Light" portrait. The portrait now uses `2026/09/baba-12.jpg` (attachment 55578: close portrait, orange robe, blessing hand). The quote photo is unchanged.
- Backup on the VM: `/home/azureuser/home-photo-bak-20260928/`.

## 2026-09-28 — About Hospital: trustees and executive committee restored
"More About the Hospital" (page 2) had been migrated as loose paragraphs: the name column of the old Board of Trustees and Hospital Executive Committee tables was lost, several role lines were cut at "Dr."/"Sr.", the Vision/Mission labels were dropped, and the old side-image captions ("Ariel View of Hospital Diwali View") came through as a stray line.
- Rebuilt from the last pre-redesign revision (54281, 23-Jul-2025): Vision and Mission labels restored; both groups shown as name + roles cards (2 columns, 1 on phones), styles scoped with an `ah-` prefix inside the module. The stray caption line was removed (those photos are already in the Campus section).
- Text is as in 54281 except missing spaces fixed ("of Commercial", "Research Foundation", "High Court of") and trailing commas dropped. Membership is as of July 2025 — not re-verified.
- Backup on the VM: `/home/azureuser/about-hospital-bak-20260928/`.

## 2026-09-28 — Genesis: chandelier photo added
The chandelier section of Genesis (page 587) had no photo — none of its revisions back to 2015, nor the wfd prototype, ever had one. Added `2017/09/Onam-2017-with-chandelier-681x1024.jpg` (attachment 10087, from the Whitefield post "Onam 2017 at SSSIHMS": the chandelier in the dome above the atrium pookalam) beside the text, using the page's existing `intro-grid` + `prose-figure` pattern. The image has inline `height:auto;max-height:none` so the 460 px `prose-figure` cap doesn't crop the chandelier out of the portrait photo.
- Backup on the VM: `/home/azureuser/genesis-chandelier-bak-20260928/`.

## 2026-09-28 — Manohriday: 2020 cover restored
The 2020 cover on Manohriday (page 625) had an empty `src`. Set to `2020/01/Manohriday-2020-cover-page-213x300.jpg` (attachment 33805), as in the pre-redesign revision 54635.
- Backup on the VM: `/home/azureuser/manohriday-bak-20260928/`.

## 2026-09-28 — Cardiology: Cathlab Facilities photo
The "Cathlab Facilities" section of Cardiology (page 81) showed `2022/11/ROTABLATOR.jpg`. Replaced with `2026/09/cardio-equip-siemens-biplane-cathlab.jpg` (attachment 55535, the empty Siemens biplane lab; not used elsewhere on the page), alt and caption "Siemens Biplane Cathlab". The Rotablator photo no longer appears on the page.
- Backup on the VM: `/home/azureuser/cardiology-cathlab-bak-20260928/`.

## 2026-09-28 — Cardiology Faculty: photo cards no longer crop faces
On Cardiology › Faculty (page 108) the Honorary and Visiting photo cards used the shared full-width 280 px photo band inside 2-column cards (560×280, `object-position: center top`). Most photos are portrait headshots, so heads and chins were cut off.
- Those two grids now carry a `fac-side` class; a scoped `<style>` in the Honorary module lays photo cards out as a 150×188 portrait beside the text (112×140 on phones ≤480 px), matching the initials cards. The shared stylesheet and the Consultants cards are unchanged.
- Each of the 18 photos has an inline `object-position` computed from its face box (macOS Vision, `sai-photo-band/scripts/detect_faces.swift`) so the face is centred in the frame.
- Backup on the VM: `/home/azureuser/cardio-faculty-bak-20260928/`.

## 2026-09-28 — Cardiology Infrastructure: ATHMA and MedDream PACS
On Cardiology › Infrastructure (page 104) the "e-HIS, PACS and Echo View Sai" section (heading and module label) is now "ATHMA and MedDream PACS", at the hospital's request. Two paragraphs describe ATHMA (replacing e-HIS) and MedDream PACS (replacing Fuji PACS and Echo View Sai), using only facts already on the HMIS page (212), plus a "More about HMIS →" button to `/hmis/`. "Echo" was added to the list of images archived on MedDream, since Echo View Sai is replaced.
- Not changed: the HMIS page's own "The System in Detail" section still describes the old Dedalus EM system.
- Backup on the VM: `/home/azureuser/cardio-infra-bak-20260928/`.

## 2026-09-28 — MSc Echocardiography: Programme Details rebuilt
The "Programme Details" module on MSc Echo (page 54169) was an unformatted dump of the old page: sub-headings dropped, lists flattened into paragraphs, sentence starts lost ("…Echocardiography programme are well-positioned for roles in:", "in Echocardiography at SSSIHMS is…"), four of five career roles missing, and text from sections that were disabled on the old page mixed in.
- Rebuilt from the last pre-redesign revision (54358, 03-Nov-2025), visible sections only: Programme Overview, Key Highlights (11, bold labels), What We Expect from the Student (6), What the Student Can Expect (8), Career Opportunities (intro + 5), closing paragraph. Scoped `pd-` styles inside the module. Wording is the original.
- The old "CLICK HERE TO APPLY M.Sc ECHOCARDIOGRAPHY ACADEMIC YEAR 2025-26" line (a 2025 edumerge form; its link had already been lost) was not carried over — the page's "Join the MSc Echocardiography Programme" section covers applications.
- Backup on the VM: `/home/azureuser/msecho-bak-20260928/`.

## 2026-09-28 — Cardiology Faculty: 15 visiting-faculty photos added, 4 affiliations updated
At the hospital's request, official profile headshots were sourced from each doctor's employer (or, for Patel/Nannapaneni, society/CME faculty pages) and added to page 108 as attachments 55831–55845 (`2026/09/cardio-visiting-<name>.jpg`, resized ≤600 px): Abhiram Prasad, Arvin Narula, Brahmajee Nallamothu, Collin Cowley, David Nykanen, Eric Nordsieck, Hari Chaliki, Jon Donnelly, Krishna Rao, Madhu Reddy, Mehul Patel, Nischala Nannapaneni, Sanket Shah, Satish Goel, Scott Wall. Same `fac-side` card layout; `object-position` from Vision face boxes. Photos are the employers' copyright — consent from the faculty is advisable.
- Affiliations updated from current official pages: Nordsieck → Mercy Clinic, St. Louis; Tisma-Dupanovic → Director of EP Services, Nemours Children's Hospital, Orlando; "Sunil Agarwal" → Dr. Suneil Aggarwal, Barts Heart Centre, London (Cromwell Hospital bio: formerly Liverpool, trained in Puttaparthi); Airey → MercyOne North Iowa Heart Center, Mason City (LinkedIn/directories; no official profile found).
- Not changed: Mehul Patel (left Methodist Le Bonheur; current post unconfirmed), and the uncertain / not-found photos (Dhanekula, Airey, Nayak, Aggarwal; Park, Wijetunga, Tisma-Dupanovic, Swarna).
- Backup on the VM: `/home/azureuser/cardio-faculty-bak-20260928b/`; source files in `/home/azureuser/visiting-photos-20260928/`.

## 2026-09-28 — Cardiac Surgery Faculty: page stylesheet repaired
Cardiac Surgery › Faculty (page 116) rendered as raw text with the CSS printed on the page (and 1826 px wide). The 22-Sep-2026 save (revision 55689, consistent with a Divi visual-builder save) had stripped the `<style>`/`</style>` tags from the "Page Stylesheet" code module and HTML-escaped its contents (`>` → `&gt;` ×6, `&` → `&amp;` ×4 in the Google Fonts URL), which also broke the faculty-card text padding and some nav dropdown rules.
- Fix: re-wrapped the module in `<style>…</style>` and unescaped `&gt;`/`&amp;` inside it only. All content added in that save (Heads of Department, Legends, gallery) kept as is.
- Checked all 390 pages/posts on the site with a Page Stylesheet module: no other page has the problem.
- **Avoid opening these pages in the Divi visual builder** — it rewrites the code modules this way.
- Backup on the VM: `/home/azureuser/ctvs-faculty-bak-20260928/`.

## 2026-09-28 — Neurosurgery Events: "Events in Detail" removed
At the hospital's request, removed the "Events in Detail" text module from NESU Events (page 671) — stale 2022 CME notes (venue, fee, KMC credits, registration dates) carried over from the old page. The rest of the page is unchanged.
- Backup on the VM: `/home/azureuser/nesu-events-bak-20260928/`.

## 2026-09-28 — Anaesthesiology Events: "Events in Detail" removed
Removed the "Events in Detail" text module from Anes Events (page 687): a migration leftover whose event names had been lost (only descriptions remained) and which still carried an old goo.gl registration form link. The "Academic Events" cards are unchanged.
- Backup on the VM: `/home/azureuser/anes-events-bak-20260928/`.

## 2026-09-28 — Radiology SACRED: "About SACRED" removed
At the hospital's request, removed the "About SACRED" text module from Radiology › SACRED (page 547) — old delegate notes (registration mail, Gate-2 entry, breakfast coupons, hotels) carried over from the old page. "A Decade of Radiology Teaching" and "The SACRED Archive" are unchanged.
- Backup on the VM: `/home/azureuser/sacred-bak-20260928/`.

## 2026-09-28 — History-GH: "The Story in Full" rebuilt; Ganesha photo rotated
- "The Story in Full" (page 53322) was a fragment dump. Rebuilt from the last pre-redesign revision (54220, 02-Jun-2025): Introduction (Sathya Sai Speaks vol. 13 quote + 6 paragraphs), Early Days, Excerpts from the Inauguration Discourse, An Excerpt from the Discourse of 10 June 2001 (7 paragraphs), The Move to the SSSIHMS Campus, 2016 (3 paragraphs). Scoped `sf-` styles. Discourse text verbatim; fixed only "event eth least" → "even the least" and "This was clinic was donated" → "This clinic was donated". The old departments list and statistics were not repeated (already in their own sections).
- `ganesha-3.jpg` (attachment 55584, the face-blurred file) was sideways: rotated 90° clockwise (now 1800×1240), sizes regenerated, page URL now `?v=20260928b`. The copies in `sssihms-assets/sssgh/`, wfd.sssihms.org and this repo's `src/assets/sssgh/` were not rotated.
- Backup on the VM: `/home/azureuser/history-gh-rotate-bak-20260928/`.

## 2026-09-28 — SSSGH: "The General Hospital in Detail" removed
The module on /sssgh/ (page 53243) was fragments of the *old* page's content, which was a copy of the SSSIHMS home-page teasers (Cardiology, Neurology, CTVS, Anaesthesia with the old "1700 multi-speciality" figure, Neurosurgery, Radiology, DNB, Nursing, Fellowships) plus a broken 2003 quote — nothing about the General Hospital. Removed; the designed SSSGH sections are unchanged.
- Backup on the VM: `/home/azureuser/sssgh-bak-20260928/`.

## 2026-09-28 — OBGYN: cardiotocography photo rotated
`2022/12/obg-cardiotocography.jpg` (attachment 55764) was sideways; rotated 90° clockwise (now 1138×924), sizes regenerated, OBGYN page (53292) URL now `?v=20260928`.
- Backup on the VM: `/home/azureuser/obg-ctg-rotate-bak-20260928/`.

## 2026-09-28 — Orthopedics: hero photo crop
The hero (`Dr.-Sundaresh-with-Swami.jpg`, 2049×1423 in a 1144×560 `cover` frame) was centre-cropped, cutting off the top of Dr. Sundaresh's head. Added inline `object-position:50% 4%` on that img (page 53288) — both heads in frame; phones already showed the whole photo.
- Backup on the VM: `/home/azureuser/ortho-hero-bak-20260928/`.

## 2026-09-28 — General Medicine: Late Dr. Ramkumar; Dr. Swapna HOD
At the hospital's request (page 53280): Dr. Ramkumar G has passed away and Dr. Swapna is now HOD.
- Hero caption "Dr. Ramkumar G, HOD" → "Late Dr. Ramkumar G — a legend who carried the department for several decades" (photo kept; alt updated).
- His card removed from "The Department Team"; Dr. Swapna (was spelled "Dr. Sapna", Consultant) now "Dr. Swapna", HOD. Archive photo "Bhagawan with Dr. Ramkumar" unchanged.
- The "Dr Ramkumar, KMC, Manipal" on Anesthesiology Achievements (685) is a different person — unchanged.
- Backup on the VM: `/home/azureuser/genmed-bak-20260928/`.

## 2026-09-28 — Dental: second inauguration photo rotated
`2026/09/dental-inauguration-2.jpg` (attachment 55580) was sideways; rotated 90° clockwise (1800×1275), sizes regenerated, Dental page (53304) URL now `?v=20260928`. Backup: `/home/azureuser/dental-rotate-bak-20260928/`.

## 2026-09-28 — Stat grids no longer overflow phones (mu-plugin)
The 2-column mobile `.stats-grid` used `1fr` columns, which cannot shrink below the widest number, so pages with large figures ("1,43,500+", "29.9 Lakh+") scrolled sideways (About Hospital, History-GH, …). Added `sssihms_wfd_stats_css()` to the server-only mu-plugin `sssihms-wfd-patient-access.php` (footer CSS, blog 4 only): `minmax(0,1fr)` columns ≤768 px; smaller value font, gap and padding ≤480 px. (Earlier note blaming the sub-nav bar was wrong — `.subnav-inner` scrolls within itself.) Backup: `/home/azureuser/muplugin-bak-20260928/`.

## 2026-09-28 — Migration "dump" sections: 17 pages fixed
Text modules appended at the bottom of redesigned pages that were dumps of the old page (headings dropped, lists flattened, sentences cut, unrelated/hidden text mixed in). Each compared with the page's last pre-redesign revision; rebuilt with original headings/lists/quotes (scoped `rb-` styles) where the content is real and not shown elsewhere, removed where stale, unrelated or duplicated. Wording from the old pages only (typo fixes).
- **Rebuilt:** Genesis (587) ×3 interviews (Nayak; Rajan Sood Q/R; Ravi Shankar Q/R) · Treatment (733) ×4 (Valve & Vessel Procedures; How Each Group Is Managed; Cranial Surgery Procedures; Paediatric Tumours & Developmental Disorders) · Physiotherapy (206) · DNB (257) · Blood Donation Information (52021) · Sevadal (52845) · Help Desk (52858) · Volunteer Expertise (52990, now the Nishkama Karma quotes) · Careers (65; ~2023 vacancies/pay dropped) · Cardiac Surgery (85) · Neurosurgery (87) · Anesthesiology (89).
- **Removed:** Treatment "Further Detail" · HMIS "The System in Detail" (old Dedalus/Fuji/IMS text) · BSc MIT "Programme Details" · Specialities / Services "… in Detail" (home-page teaser blurbs) · Facilities "Facilities in Detail" (all already shown).
- Checked live on desktop and 390 px: no CSS-as-text, no horizontal scroll.
- **For the departments to confirm** (from the old pages, not re-verified): Blood Bank — 3-month (men) / 4-month (women) gap vs the page's "every 90 days", and 080-28004715; Treatment — AVBD sentence ("pulmonary" dropped as apparently wrong), "handful of centres" and acoustic-tumour claims, in-house psychiatrist; Neurosurgery — 158 beds/38 ICU, "first Neuro Navigation in India", Dr. Ravi vs Ravindra Goyal; Anesthesiology — 6 vs 3 ICUs; Help Desk volumes; Careers WhatsApp 080-28004641 (also listed as HR landline); Genesis "Srivatsan/Srivathsan" and "presently CEO, Vidal Health". External Google-Form links on Volunteer/Careers were not carried over.
- Backups: `/home/azureuser/bulk-20260928/` (`<id>.cur` = before, `new/<id>.new` = after).

## 2026-09-28 — Header menu: duplicate Radiology removed
Menu 116 had Radiology twice — under Departments (55160, with sub-items) and under Services (55177). Deleted item 55177 at the hospital's request. Details saved in `/home/azureuser/menu-bak-20260928/` (item: parent 55176 "Services", position 69, object page 202).

## 2026-09-28 — Physiotherapy: PM lamp-lighting photo removed
At the hospital's request, removed the gallery figure "Sri Atal Behari Vajpayee, PM Lighting the Lamp" (`cdn.sssihms.org/…/2015/05/lighting-lamp-close-up.jpg`) and its caption from Physiotherapy (page 206). Other gallery photos unchanged. Backup: `/home/azureuser/physio-photo-bak-20260928/`.

## 2026-09-28 — Physiotherapy: Advanced Rehabilitation (06-Dec-2025) added
From the hospital's write-up "Inauguration of Advanced Rehabilitation Facility" (file dated 2026-12-06; the text says 06 December 2025, used here). Page 206:
- New module "Advanced Rehabilitation" after "Chronicles & Clinical Work": ₹53.47 lakh suite; six equipment cards (Rehametrics VR, Dyaco 7.0T MED treadmill, Rymo Mobi-L upper/lower-limb robotics, Arjo Maxi Sky 8 m unweighing track, Moto Life cycle-ergometer, recumbent bike); aims; inauguration by Sri R. J. Rathnakar with Padma Shri Dr. V. Mohan, Sri Ramesh Kumar and Dr. Sundaresh D. C.; tour led by Ms. Deepika Rani K.
- Milestones: "6 Dec 2025 — Advanced rehabilitation suite inaugurated…".
- Our Team: added "Head of the Department — Ms. Deepika Rani K, Head of Physiotherapy and Rehabilitation"; "Proposed: Neuro Rehabilitation Centre" card replaced by "Neuro Rehabilitation — Now Open".
- Not used here (other departments): GE MAC 5 ECGs, Appasamy visual field analyzer, PulzCAD demo, SAI SPARSH launch.
- Backup: `/home/azureuser/physio-rehab-bak-20260928/`.

## 2026-09-28 — AntharDhwani archive restored
Counseling › AntharDhwani (page 18101) had been overwritten on 25-Sep-2026 16:19–16:21 by a staff account (revisions 55700–55702) with an old-style block showing only Vol I (Jan 2019) — apparently an attempt to add the missing Vol I cover in the classic editor. Restored the 18-Sep redesign (revision 55394: all 15 issues, Vol I Jan 2019 – Vol XV Jan 2026) and fixed two covers: Vol I now `2019/01/AntharDwani-Jan2019-cover-page-222x300.jpg` (was empty), Vol II now `2019/07/AntharDhwani-II-226x300.jpg` (was showing Vol III's cover). Verified 15 covers, none broken, desktop and phone.
- The 25-Sep version is kept at `/home/azureuser/anthardhwani-bak-20260928/18101.guna-20260925.html`.

## 2026-09-29 — Site Updates tool for staff
Added the mu-plugin `wordpress/mu-plugins/sssihms-wfd-site-updates.php` (deployed): wp-admin › **Site Updates** lets staff add a newsletter issue, a faculty member, an event or photos to an existing section without opening the Divi builder. It detects 93 sections (3 newsletter, 24 faculty, 3 event, 63 photo grids). Tested on draft copies of AntharDhwani, Cardiology Faculty, Radiology Faculty, NESU Events and Physiotherapy (trashed after): each save changed only the inserted card, the count went up by one, text was escaped, and a save against a page that had changed was refused. The browser upload step itself has not yet been run by a logged-in user.

## 2026-09-29 — Site Updates: Remove item
Added a **Remove item** tab to Site Updates: pick a section, tick the items, confirm; only those cards are removed, saved as a revision, and logged as "Removed …" in Recent changes. Media files are kept. Tested on draft copies of AntharDhwani, Cardiology Faculty, NESU Events and Physiotherapy (trashed after): the result equalled the original minus exactly the two ticked cards, removing every item in a section was refused, a stale form was refused, and adding still worked afterwards. The item parser finds all 441 cards in the 93 sections, matching the per-section counts.

## 2026-09-29 — Treatment: Neurology hidden
Neurology services are paused for lack of staff, so the two Neurology sections of Treatment (page 733) — "Neurological Conditions Evaluated and Treated Routinely" and "Neurology in Detail" — were switched off with Divi's `disabled="on"` module attribute. Divi then omits them from the page entirely; the content is untouched and they show greyed out in the builder. **To restore:** re-enable the two modules in the builder, or delete ` disabled="on"` from the two `[et_pb_text` tags. Before-copy: `/home/azureuser/treatment-bak-20260929/733.before.html`; revision 55897. No menu item or separate page offered Neurology.

## 2026-09-29 — Site Updates: fix saves on pages with the missing template
135 pages (34 of the tool's 93 sections) still name `page-template-fullwidth.php`, which the current Divi theme does not have. `wp_update_post` saved the content and then returned "Invalid page template" before creating the revision or running the save hooks, so the tool would have shown an error for a change that had in fact been made, with no revision to undo it. Reproduced on a draft carrying that template, then fixed by passing an empty `page_template` so the check is skipped and the template meta is left alone; the same draft then saved with one new revision. `wp post update` from WP-CLI has the same failure on these pages.

## 2026-09-29 — Appointments & Admission: Metro route
Added a "By Metro" card, first in the How to Reach the Hospital grid on Appointments & Admission (page 735): Namma Metro Purple Line to Sri Sathya Sai Hospital Metro Station (wording from the hospital; no distance or walking time given). Revision 55898; before-copy `/home/azureuser/appt-bak-20260929/735.before.html`.
- Same day, expanded (revision 55899): "close to the hospital. From Majestic (Nadaprabhu Kempegowda station), take a train towards Whitefield (Kadugodi) and get off at the stop after Nallurhalli. Use the exit on the hospital side." Sources: Wikipedia's station article (Purple Line, adjacent stations Nallurhalli / Pattandur Agrahara, an exit towards the hospital). No walking distance added — none found in a reliable source.

## 2026-09-29 — Facilities: Metro route
Facilities (page 734) had no Metro information. Added the same Metro wording as the first point of "Getting to the Hospital". Revision 55900; before-copy `/home/azureuser/fac-bak-20260929/734.before.html`.

## 2026-09-29 — Header menu: Career Opportunities removed from Academics
Deleted menu item 55193 (Academics › Career Opportunities → /careers/) from the header menu (menu 116). Career Opportunities stays under Opportunities (item 55227), so /careers/ is still reachable. Menu backup before the change: `/home/azureuser/menu116-bak-20260929.json`.

## 2026-09-29 — Rain Water Harvesting: percolation well photos
Added two photos from the Water Conservation Award nomination deck (slides 2 and 8) under "120 Percolation Wells" on Rain Water Harvesting (page 52712): a finished well (media 55901) and the joint inauguration with community partners and the OBD team (media 55902, the deck's own caption). Both re-encoded at 2000 px with all EXIF removed — the originals carried GPS. Also added one line from the deck: well sites are chosen using GIS, contour and hydrology studies. The 25-Sep figure decision stands: 120 wells kept, the deck's 3 units + 5 pits → 19 → 50 roadmap not used. Photo height is set by a scoped `.gg-pw` rule (440 px desktop, natural height under 700 px). Revision 55905; before-copy `/home/azureuser/rwh-bak-20260929/52712.before.html`.
