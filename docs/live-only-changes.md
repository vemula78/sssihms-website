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
