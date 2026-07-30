# Prompt to paste into Claude Design

Copy everything below the line into the SSSIHMS Website design project
(claude.ai/design, project `f3cca125-321f-4519-b989-c580afe8354e`) to extend
the build with the pages that were left out of the first pass.

---

We need to extend the SSSIHMS Whitefield site with pages that exist on the
live site (whitefield.sssihms.org) but weren't included in the first design
pass. Keep the same "Sacred Warmth" style (warm cream/brown, primary
`#c8813a`, EB Garamond + Nunito Sans) and the same data-driven page structure
already used for the other department pages.

## 1. Department sub-page template (build once, apply per department)

Each clinical department needs the same set of sub-pages as tabs/children off
its main department page, matching what's already live. Not every department
has every tab — use this exact roster per department:

**Cardiology** (main page already exists): Faculty, Infrastructure, Achievements
(fold into an existing section if simpler), Events, DNB, MSc Echocardiography,
BSc Cardiac Care Technology, Fellowship.

**Cardiac Surgery / CTVS** (main page already exists): Faculty,
Infrastructure, DNB, BSc Perfusion Technology.

**Neurosurgery** (main page already exists): Events, Faculty, DNB,
Achievements, Infrastructure, Services.

**Anesthesiology** (main page already exists — align its slug to `anesthesiology`,
not `anesthesiology1`): DNB, Faculty, Infrastructure, Achievements, Events,
Cardiac Anesthesia, Fellowship, BSc Anesthesia Technology.

**Radiology** (main page already exists): Infrastructure, Faculty, BSc Medical
Imaging Technology. (SACRED CME content goes to the blog archive in section 3,
not here.)

**Neurology** (main page already exists, slug `neurology`): Infrastructure,
Services. Note: on the live site, Neurology currently has **no top-nav entry**
at all — it's only reachable from a homepage link. Please give it a proper
nav entry under Departments alongside the other five.

For content on each of these (real faculty names, credentials, equipment,
seat numbers, etc.), pull from the live site rather than inventing anything —
`whitefield.sssihms.org/<department>/<tab>/` for each. Ask if a specific
roster isn't visible/current; don't fabricate staff names or credentials.

## 2. SSSGH sub-specialty pages (new template — 9 pages)

Sri Sathya Sai General Hospital (`sssgh.json`) is currently one consolidated
page. The live site has 9 distinct sub-specialty pages under it that never
got folded in: **Ophthalmology, OBGYN, Orthopedics, ENT, General Medicine,
Pediatrics, General Surgery, Dental, plus a Statistics-GH and History-GH
page.** Build these as a repeating sub-page template off the SSSGH page,
same pattern as the department tabs above.

## 3. Past-conference / CME archive blogs (consolidate, don't rebuild per-year)

Instead of a page per year, build **one archive/blog-style page per named
conference series**, listing past editions as entries (title, year, short
description, and a link out or PDF if one exists):

- **`/sacred/`** — SACRED CME (Radiology). Past editions: SACRED-23, SACRED-22
  (Advanced MR Imaging Neuro-Oncology), SACRED-20 (Pediatric Neuroradiology),
  SACRED-19 (Skull Base Imaging), SACRED-18 (MSK MRI), SACRED-17 (MRI in
  Practice), SACRED-15 (plus its Posters and Pre-Conference Warm-up material).
- **`/speed/`** — SPEED CME (Cardiology). Past edition: SPEED 2020 (CME in
  Clinical Cardiology). **Do not fold in the current/upcoming SPEED 2026
  registration or staff pages** — those are live operational forms and stay
  as-is, separate from this archive.
- **`/score/`** — SCORE (IACTS, Cardiac Surgery). Past edition: IACTS SCORE
  2019. Just needs to exist and be ready to receive future editions.
- **`/conferences/`** (general archive) — everything else that doesn't belong
  to a named recurring series: CMR Hands-on Course 2019, UPENN-SCMR CMR
  Hands-on Course 2020, 4th Indo-US Critical Care Medicine Update 2019, and
  the State-level Conference on Recent Innovations in Nursing Education.

Do **not** include in this consolidation: Panchadasha-Crystal-Anniversary,
the 25th Anniversary/Silver Jubilee page, or Anthardhwani — these are
institutional milestones/cultural events, not CMEs. Leave them out for now;
we'll decide separately whether they need their own page.

## 4. Standalone programme pages (6 pages, no template needed)

These are simple one-off pages, one per academic programme, not currently
anywhere in the design: MSc Echocardiography, BSc Cardiac Care Technology,
BSc Perfusion Technology, BSc Anesthesia Technology, BSc Medical Imaging
Technology, BSc Medical Lab Technology. (Some of these are also referenced
as department sub-pages in section 1 — if a programme is only ever linked
from one department, a single page is fine; don't duplicate content.)

## 5. Slug alignment (so these update the live site instead of duplicating it)

A few pages already exist in the design under a different slug than the live
site uses. Please rename these to match the **live** slug so a future import
updates the existing page instead of creating a duplicate:

| Design's current slug | Rename to (live slug) |
|---|---|
| `about` | `about-hospital` |
| `philosophy` | `guiding-philosophy` |
| `departments` | `specialties` |
| `treatments` | `treatment` |
| `appointments` | `appointments-admission` |
| `helpdesk` | `help-desk` |
| `involved` | `getinvolved` |
| `nursing` | `nursing-and-allied-health` |

Everything else (Cardiology, Cardiac Surgery, Neurosurgery, Sevadal, Bhagawan,
Go Green, Careers, Manohriday, SSSGH, Genesis, Patient Speak, Visitor Speak,
Academics, DNB, Services, Facilities, Home, Statistics) already matches — no
change needed there.

Note: `songs.json` is a **hub/landing page** ("Songs & Poems") that links out
to Songs-Baba, Poems, Swami Poems (Telugu), and an external Bhajans archive —
it is a new page, not a duplicate of anything live, so it keeps its own
`songs` slug. Do not rename it to `songs-baba` — that's a different page (see
below).

## 6. Poetry archive pages — confirmed content match, use these exact slugs

The three self-contained poetry pages (`divine-poetry`, `padya-sudha`,
`sai-compositions`) were checked verse-by-verse against the live site's
content. Two of them must be **renamed to update an existing live page in
place** rather than keep their current design slug:

| Design page | Correct slug | Why |
|---|---|---|
| `divine-poetry` | `divine-poetry` (no change) | Already live at this exact slug with this exact content (updated 2026-06-24) — nothing to do. |
| `padya-sudha` | **`sai_padhyam`** | Verse text and reference codes (e.g. `008-230688`) are identical to the live page currently titled "Swami poems telugu" at `/sai_padhyam/`. Update it in place — do not use the `ssspadhyasudha` slug (an empty, abandoned draft page from 2026-07-01 that can be deleted). |
| `sai-compositions` | **`songs-baba`** | Same devotional-song/bhajan format as the live `/songs-baba/` page (e.g. "Chinni Krishna", "Daya Cheta Dhanyulu Kaavalera"). Update it in place. |

Both `sai_padhyam` and `songs-baba` are still running the site's old 2023
Divi layout — updating them with the new design replaces that layout, same
as every other page in this rebuild.
