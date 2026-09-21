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

### Still broken — mail configuration

Six `sai_4_options` rows hold the bad domain inside **PHP-serialized** values, so they
cannot be fixed with a string replace: the `s:<len>:` byte-length prefix stops matching and
the option fails to unserialize. They need `wp option patch` or a PHP round-trip, and
someone who knows which mailboxes actually exist.

| Option | Bad addresses | Consequence |
|---|---|---|
| `wp_mail_smtp`, `postman_options` | `hostmaster@` | sender address on **all** site email; may fail SPF/DMARC |
| `_caldera_forms`, `CF5667d73741237` | `hostmaster@`, `neurosurgeryblr@` | a Caldera form's notifications bounce |
| `itsec-storage` | `praveen@`, `subramaniyan.m@` | security alerts go nowhere |
| `auto_core_update_notified` | `hostmaster@` | harmless; a record of one past notification |

### Still broken — asset URLs

557 rows still reference `http://52.148.87.145.in.md-in-25.webhostbox.net/wfd/...`,
including the `custom-background` image that every page requests on load. The correct
targets need confirming before these are rewritten.
