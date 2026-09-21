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

## Known, unfixed: the `52.148.87.145` migration damage

A past migration replaced `sssihms.org` with the server's IP across the database. 44
published rows still carry it, including working-looking but undeliverable addresses
(`sacred@`, `hrblr@`, `radiologyblr@`, `anaesthesiablr@`, `neurosurgeryblr@`,
`registrarblr@` at `52.148.87.145.in`) and 105 asset URLs pointing at a dead
`webhostbox.net` host — one of which is the `custom-background` image requested on every
page load. Only the patient-enquiry address was corrected on 21-Sep-2026; the rest needs a
scoped search-and-replace once the correct targets are confirmed.
