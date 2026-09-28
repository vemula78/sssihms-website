# Server-side WordPress code

Code that lives on the web VM rather than in the static build. Unlike `scripts/`, which
holds one-shot migration helpers, everything here is **deployed and stays running**.

## `mu-plugins/`

Must-use plugins load automatically and cannot be deactivated from wp-admin, so they are
the right home for fixes that must survive a Divi update.

### `sssihms-wfd-patient-access.php`

Patient-facing usability fixes for **whitefield.sssihms.org** (blog 4 of the multisite):

- **Restores pinch-zoom.** Divi's `et_add_viewport_meta()` hard-codes
  `maximum-scale=1.0, user-scalable=0`, which fails WCAG 1.4.4 and blocks zoom for elderly
  patients. The plugin removes that action and emits a zoomable viewport.
- **Tap-to-call.** A `the_content` filter wraps the hospital's published phone numbers in
  `tel:` links. It splits the content into tags and text and tracks anchor depth, so it
  never nests a link or rewrites a tag attribute.
- **Sticky mobile call bar.** Calling the Help Desk is the only way to get an OPD
  appointment, so on screens under 980px a fixed bar offers "Call Help Desk" and
  "Contact & Directions".
- **Contact aliases.** 301s `/reach-us/`, `/directions/`, `/how-to-reach/` and `/enquiry/`
  to `/contact-us/`; they used to 404.

Every hook is gated on `get_current_blog_id() === 4`, so the other blogs in the multisite
(sssihms.org, prasanthigram, ssssst.in) are untouched. Verified after deployment.

#### Deploying

```bash
scp -i <key> -P 2222 wordpress/mu-plugins/sssihms-wfd-patient-access.php \
    azureuser@<vm>:/tmp/
ssh -i <key> -p 2222 azureuser@<vm> \
    'php -l /tmp/sssihms-wfd-patient-access.php \
     && sudo cp /tmp/sssihms-wfd-patient-access.php /srv/www/wordpress/wp-content/mu-plugins/ \
     && sudo chown www-data:www-data /srv/www/wordpress/wp-content/mu-plugins/sssihms-wfd-patient-access.php'
```

Then purge both caches — Divi's static CSS **and** WP Super Cache:

```bash
sudo rm -rf /srv/www/wordpress/wp-content/cache/page_enhanced/whitefield.sssihms.org \
            /srv/www/wordpress/wp-content/cache/page_enhanced/whitefield.sssihms.org:443 \
            /srv/www/wordpress/wp-content/et-cache/*/whitefield.sssihms.org
```

Only ever delete the whitefield directories — those trees also hold the other sites.

#### If a phone number changes

Edit `sssihms_wfd_numbers()`. Keys are `tel:` targets in E.164; values are every literal
spelling that appears in page content. The literals are matched longest-first so a partial

### `sssihms-wfd-site-updates.php`

A **Site Updates** screen in wp-admin (whitefield only, for anyone who can edit pages) that
adds one item to a section already on a page, without the Divi builder:

| Tab | Goes into | Card markup | Position |
|---|---|---|---|
| Newsletter issue | any `cover-grid` (AntharDhwani, Manohriday) | `a.cover-cell` — PDF + cover (medium size) | first |
| Faculty member | any grid of `faculty-card` | photo card (medium_large), or initials if no photo | last |
| Event | `info-card` grids on pages whose path contains `event` | title, pill, text, optional link | first |
| Photos | any `photo-grid` | up to six `figure.photo-cell`, caption required (large size) | last |

The "Where" list is found by scanning every published page for a `<div>` whose first child
is one of those cards, so a new grid built in the same markup appears automatically. The
card is built from escaped form fields (`[`/`]` become entities so Divi cannot read them as
shortcodes, text is kept on one line so `et_pb_text` does not wrap it in `<p>`), inserted,
and saved with `wp_update_post`, which records a normal revision. kses is switched off for
that one save: blog admins and editors do not have `unfiltered_html` on a multisite, and
kses would otherwise strip every page's `<style>` block and inline styles. The form
carries the page's content hash; if the page changed after the form opened, nothing is
written. After saving it flushes W3 Total Cache for the page and Divi's static CSS.
The last 50 additions are listed on the screen (option `sssihms_up_log`) with a link to the
page's revisions for undo.

Photo and faculty-photo uploads require a consent tick. The tool only adds; removing or
editing an item is still done by editing the page.
form cannot win over a full one.
