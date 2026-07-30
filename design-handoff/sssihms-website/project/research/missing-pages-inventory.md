# Live-site inventory & gap list for Claude Design (Jul 2026)

Source: WP-CLI + live browse of whitefield.sssihms.org (multisite blog_id 4, WordPress + Divi).

## Quick answers

- **223** WordPress Pages exist on whitefield.sssihms.org today. Separately there are **127** blog Posts (not pages) — old news/blog content, not part of this inventory.
- **8 top-level items** are directly visible in the main nav: Bhagawan Sri Sathya Sai Baba, About Hospital, For Patients, Departments, Education & Training, Get Involved, Go Green, Opportunities. Their dropdowns expand to **100 total menu items** (2nd/3rd-level department tabs, programmes, etc.) — that's the "visible via menu" surface.
- The new Claude Design build (`dist/`) currently produces **82 pages**; only **47** have a matching Divi JSON layout in `divi-export/` (35 main + 12 stats dashboards). The other 35 dist pages, plus a further batch of live-only pages never carried into the new design at all (below), still need Divi layouts.

## Status legend
✅ covered by current design (slug matches live, or a JSON exists) · ⚠️ design has a page but at a **different slug** than the live one (would create a duplicate, not update) · ❌ exists live, no equivalent anywhere in the new design yet

## Departments (under live `/specialties/`, design's `departments.json`)

| Section | Live sub-pages | Status |
|---|---|---|
| Cardiology | main ✅, Faculty ❌, Infrastructure ❌, Achievements ❌, Events ❌, DNB (own page, separate from academics/dnb) ❌, MSc Echocardiography ❌, BSc Cardiac Care Tech ❌, Fellowship (dept-specific) ❌, Blog ❌ (likely retire) |
| Cardiac Surgery (CTVS) | main ✅, Faculty ❌, Infrastructure ❌, DNB (dept) ❌, BSc Perfusion Tech ❌, Blog ❌ (retire) |
| Neurosurgery | main ✅, Events ❌, Faculty ❌, DNB (dept) ❌, Achievements ❌, Infrastructure ❌, Services ❌, Blog ❌ (retire) |
| Anesthesiology | main ✅ (design slug `anesthesiology`; live is `anesthesiology1`), DNB (dept) ❌, Faculty ❌, Infrastructure ❌, Achievements ❌, Events ❌, Cardiac Anesthesia ❌, Fellowship (dept) ❌, BSc Anesthesia Tech ❌ |
| Radiology | main ✅, Infrastructure ❌, Faculty ❌, BSc Medical Imaging Tech ❌, SACRED CME series ❌ (large — many individual CME event pages, likely out of scope/retire) |
| Neurology | **live page has no top-nav entry at all** — only reachable from homepage "Read more" link (`/neurology1/`). Design's `neurology.json` ✅ exists (slug `neurology`, live is `neurology1`) — Infrastructure ❌, Services ❌ sub-pages also live-only |
| SSSGH (Sri Sathya Sai General Hospital) | main ✅ single consolidated page in new design. Live has **9 separate sub-specialty pages** never folded in: Statistics-GH ❌, History-GH ❌, Ophthalmology ❌, OBGYN ❌, Orthopedics ❌, ENT ❌, General Medicine ❌, Pediatrics ❌, General Surgery ❌, Dental ❌ |
| Services (Clinical Support) | main ✅ (`services.json`). Live children not yet in design: Lab & Blood Bank (+ BSc MLT, Lab Infrastructure) ❌, Physiotherapy ❌, Telemedicine ❌, Counseling — marked *"APPLIED"* in prior research (folded into services.json), HMIS — marked *"APPLIED"* |

## Other top-level sections

| Section | Status |
|---|---|
| About Hospital | Hospital Overview ⚠️ (live `about-hospital`, design `about`), Guiding Philosophy ⚠️ (live `guiding-philosophy`, design `philosophy`), Genesis ✅, Statistics ✅ (live page is **private** — import will publish it, confirm intended), Manohriday ✅, Patient Speak ✅, Visitor Speak ✅, About Trust ❌ (external link on live; design has its own `trust.json`) |
| For Patients | Treatments ⚠️ (live `treatment`, design `treatments`), Appointments ⚠️ (live `appointments-admission`, design `appointments`), Help Desk ⚠️ (live `telemedicine/tele-consultations`, design `helpdesk`), Facilities ✅ |
| Education & Training | Education & Training landing ⚠️ (live `academics`, matches ✅ actually — design slug is also `academics`), DNB — marked *APPLIED*, Fellowship — marked *APPLIED*, Nursing & Allied Health — marked *APPLIED* (design slug `nursing`, live `nursing-and-allied-health` — confirm content, not just slug, was carried over) |
| Get Involved | landing ⚠️ (live `getinvolved`, design `involved`), Sevadal ✅, Volunteer Expertise ⚠️ (live `volunteer-expertise`, design has generic `volunteer.json` — confirm content matches), Help Desk (dup of For Patients one) |
| Go Green | landing ✅ — marked *APPLIED* (single consolidated page; live has 7 sub-pages: Rain Water, Solar, Trees, Biomedical Waste, Power, Water — confirm all content folded in, not just landing) |
| Opportunities / Careers | ✅ (design `careers.json`, live `careers` under `/opportunities/` parent) |
| Bhagawan Sri Sathya Sai Baba | ✅ landing. Poetry pages confirmed verse-by-verse: `divine-poetry` ✅ already live at same slug (updated 2026-06-24). `padya-sudha` → rename to **`sai_padhyam`**, update in place (ignore the empty abandoned draft at `ssspadhyasudha`). `sai-compositions` → rename to **`songs-baba`**, update in place. `songs.json` is a separate hub page ("Songs & Poems") linking to these plus `/poems/` and an external Bhajans archive — keeps its own `songs` slug, not a duplicate of anything. Live `/poems/` has no new-design replacement yet. |
| Blog | ❌ no single design equivalent — live has per-department blogs (Cardiology, CTVS, Neurosurgery, Anesthesiology, SSSIHMS-general) + 127 blog Posts. Likely a scope decision (retire vs. consolidate), not a straightforward rebuild. |

## Recommended framing for the Claude Design prompt

The rebuild isn't "82 pages" flat — it's **the department template** (Faculty / Infrastructure / Achievements / Events / DNB tabs) that repeats 5-6 times (Cardiology, CTVS, Neurosurgery, Anesthesiology, Radiology, +Neurology once it gets a real nav entry), plus **SSSGH's 9 sub-specialty pages** as a second repeating template, plus the Go Green/Services sub-pages if "APPLIED" consolidation turns out to be too shallow on a content check.

Suggest checking with Praveen on scope for: per-department blogs (retire vs. merge into one `/blog/`), the BSc/MSc programme pages (msecho, bsc-cardiac-care-technology, bsc-perfusion, bsc-anesthesia-technology, bsc-mit, bsc-mlt) — 6 pages with no equivalent anywhere yet — and three institutional-milestone pages that aren't CMEs (Panchadasha-Crystal-Anniversary, wfd25/Silver Jubilee 25th Anniversary, Anthardhwani) — unclear if these should fold into a "Milestones" page or stay standalone.

## Decision: past-conference/CME pages → one blog per event name (2026-07-15)

Every individual year's edition of a recurring CME collapses into **one archive blog page per series name**, instead of a separate page per year:

- **SACRED** (Radiology CME) — editions found: SACRED-23, SACRED-22 (Advanced MR Imaging Neuro-Oncology), SACRED-20 (Pediatric Neuroradiology), SACRED-19 (Skull Base Imaging), SACRED-18 (MSK MRI), SACRED-17 (MRI in Practice), SACRED-15 (+ its own Posters and Pre-Conference Warm-up sub-pages) → all become entries/posts on one `/sacred/` blog page.
- **SPEED** (Cardiology CME) — SPEED 2020 (CME in Clinical Cardiology) → archived entry on one `/speed/` blog page. **Registration and Staff pages for the live/upcoming edition (SPEED 2026) stay separate** — those are operational forms, not archival content, and must keep working.
- **SCORE** (IACTS SCORE, Cardiac Surgery) — IACTS SCORE 2019 → one `/score/` blog page, ready to receive future editions.
- **General CME/conference archive** for one-offs that aren't part of a named recurring series — CMR Hands-on Course 2019, UPENN-SCMR CMR Hands-on Course 2020, 4th Indo-US Critical Care Medicine Update 2019, State-level Conference on Recent Innovations in Nursing Education — fold into one general "Past Conferences & CMEs" blog page rather than three separate ones.
- **Not folded in — flag for Praveen:** Panchadasha-Crystal-Anniversary, wfd25 (Silver Jubilee 25th Anniversary), Anthardhwani — these read as institutional milestones/cultural events, not CMEs, so they weren't assumed into the conference-blog consolidation.
