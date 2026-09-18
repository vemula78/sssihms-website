# Plugin-generated pages → HMIS sub-menu

These are app front-ends rendered by plugin shortcodes, **not** Divi design pages. They are
out of scope for the block-template rebuild: do not run the generator against them, do not
transplant Divi shortcode into them. The only work needed is menu placement — add each as a
child item under **HMIS** (page id 212, menu-linked) in the Primary Menu.

None of them is currently linked from any menu, so they are reachable only by direct URL.

| Page | id | slug | Source |
|---|---|---|---|
| BMW Tracker | 54787 | `bmw-tracker` | sssihms-bmw-tracker, `[bmw_tracker_app]` |
| Equipment service requests | 54775 | `equipment-service-requests` | equipment maintenance plugin |
| Equipment QR detail | 54777 | `equipment-qr-detail` | equipment maintenance plugin |
| Maintenance staff portal | 54778 | `maintenance-staff-portal` | equipment maintenance plugin |
| Conference registration | 54733 | `conference-registration` | conference hub |
| Conference staff | 54736 | `conference-staff` | conference hub |

## Decide before adding

- `equipment-qr-detail` (54777) is a QR landing target, reached by scanning a code — it is
  probably not meant to be a menu entry at all. Confirm before adding.
- `conference-staff` (54736) and `maintenance-staff-portal` (54778) are staff-facing. If HMIS
  is a public menu, these expose internal tooling in the public nav. Consider whether they
  belong behind a login rather than in the menu.
- `biomedical-waste-management` (54788) is a BMW **plugin** page, not the mock's Go Green
  `gg-biomedical` content page. The mock's Go Green waste content most likely maps to
  `biomedical-waste-report` (51982), which IS menu-linked. Confirm before mapping.
