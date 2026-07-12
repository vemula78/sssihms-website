# SSSIHMS — Divi 4 Import Pack

36 self-contained Divi layouts (theme: **Dignified Modern** — navy `#1e2d4a` + amber `#e8922a`, Libre Baskerville + DM Sans). Each `.json` is a **page/post layout** (`"context":"et_builder"`) built from **native Divi modules** (Sections → Rows → Columns → Text / Button / Image / Menu / Code). The full design CSS + Google Fonts are bundled in a **Code module** at the top of every layout, so the look travels with the import — nothing else to paste.

---

## How to import a PAGE layout (home + all inner pages)

For each content page (e.g. `cardiology.json`):

1. In WordPress, create a new **Page** and give it the matching **slug** (see the table below — this makes the internal links work).
2. Click **Use Divi Builder → Build From Scratch → Start Building**.
3. In the Visual Builder, click the **••• (purple) bottom bar → the up/down arrows (Portability) icon**.
4. Open the **Import** tab → **Choose File** → pick the `.json` → **Import Divi Builder Layout**.
5. **Publish.** Done.

> These files use `context: et_builder`, so they import **directly onto a page** (not into Divi → Library). If you ever see *“This file should not be imported in this context”*, you're in the wrong place — import from **inside the page builder**, as above.

## How to import the HEADER & FOOTER (site-wide)

`header.json` and `footer.json` are best placed in the **Theme Builder** so they appear on every page:

1. Go to **Divi → Theme Builder**.
2. On the **Default Website Template**, click **Add Global Header** → **Build Global Header** (repeat later for **Add Global Footer**).
3. Inside that builder, open **Portability (arrows icon) → Import** → choose `header.json` (or `footer.json`).
4. **Save.**

Header notes:
- The nav uses a Divi **Menu module**. Assign your WordPress menu to it: select the Menu module → **Content → Menu**. (Create the menu under **Appearance → Menus** first.)
- The logo is a Divi **Image module** pointing at the live logo URL — replace it with the same image from your **Media Library** if you prefer a local copy.

---

## Page slug map

Create pages with these exact slugs so the built-in links (`/slug/`) resolve:

| File | Suggested page slug | File | Suggested slug |
|---|---|---|---|
| home.json | *(set as your front page)* | facilities.json | `facilities` |
| about.json | `about` | academics.json | `academics` |
| philosophy.json | `philosophy` | dnb.json | `dnb` |
| genesis.json | `genesis` | fellowship.json | `fellowship` |
| statistics.json | `statistics` | nursing.json | `nursing` |
| patient-speak.json | `patient-speak` | involved.json | `involved` |
| visitor-speak.json | `visitor-speak` | sevadal.json | `sevadal` |
| departments.json | `departments` | volunteer.json | `volunteer` |
| cardiology.json | `cardiology` | bhagawan.json | `bhagawan` |
| cardiac-surgery.json | `cardiac-surgery` | gogreen.json | `gogreen` |
| neurosurgery.json | `neurosurgery` | careers.json | `careers` |
| neurology.json | `neurology` | manohriday.json | `manohriday` |
| anesthesiology.json | `anesthesiology` | trust.json | `trust` |
| radiology.json | `radiology` | songs.json | `songs` |
| sssgh.json | `sssgh` | blog.json | `blog` |
| patients.json | `patients` | | |
| treatments.json | `treatments` | | |
| appointments.json | `appointments` | | |
| helpdesk.json | `helpdesk` | | |

---

## Good to know

- **Editable, not locked.** Cards, stats, and feature lists are native **Text modules** styled by the bundled CSS, sitting inside real Divi rows/columns — you can drag, duplicate, delete, and edit text visually. Buttons are native **Button modules**.
- **CSS duplication (optional cleanup).** Because the CSS rides inside every layout, a page that also has the global header will load the stylesheet twice (harmless). If you want it once: keep the **Code module** in the global Header layout only, and delete the Code module (top Section) from the individual page layouts.
- **Images** load from `whitefield.sssihms.org`. They'll display immediately; for full control, re-upload to your Media Library and swap the URLs.
- **External links** (Apply Now, Trust, srisathyasai.org) are already wired. **Internal links** point to `/slug/` — they work once the pages above exist.
- **Divi version:** authored for **Divi 4** (`_builder_version 4.27`). Divi 5 can import Divi 4 layouts.
