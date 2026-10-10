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

Also 301s `?author=N` requests and author archives to the home page, and points author links there, so no page reveals a login name (29-Sep-2026).

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

### `sssihms-wfd-chatbot.php` — withdrawn, in `wordpress/pending/`

Loads the FAQ chat bubble from **chat.sssihms.org** on every public Whitefield page (blog 4
only), with the site accent, lifted above the sticky Call Help Desk bar below 980px. The bot
answers only from the hospital knowledge base; its code and tests live in the private
`sssihms-chatbot` repo.

Deployed 10-Oct-2026 and **withdrawn the same evening, pending staff review of the bot's
answers** (the 20-question test report in `sssihms-chatbot/evals/`). The file is kept in
`wordpress/pending/` so that redeploying `mu-plugins/` does not bring it back by accident; the
VM holds a copy outside WordPress in `~/wp-mu-plugins-disabled/`. To go live, move it back to
`mu-plugins/` and deploy and purge caches as for the patient-access plugin above.

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

Photo and faculty-photo uploads require a consent tick.

**Remove item** tab: choose a section, tick items (each shown with its thumbnail and label —
cover title, faculty name, event title, caption, or the file name for an uncaptioned photo),
confirm, and those cards alone are cut out of the page, with the same content-hash check
and a revision. A section cannot be emptied (at least one item must stay), so a grid never
silently disappears from the page. Uploaded files are not deleted from the Media Library.
Editing an existing item's text is still done by editing the page (or remove and re-add).
form cannot win over a full one.

### `sssihms-admin-two-factor.php` (network-wide)

Makes Kadence Security's two-factor login **mandatory for super admins and for anyone who is an
Administrator on any site** of the multisite. Kadence Security Basic has the two-factor module
but leaves "who must use it" to its Pro add-on via the `itsec_two_factor_requirement_reason`
filter; this file answers that filter. With a reason set, Kadence forces the set-up screen at
login (no Skip) and, until an authenticator app is configured, emails a one-time code.
Deliberately not gated to blog 4: user accounts are shared across the network.

Kadence settings changed alongside it (29-Sep-2026): two-factor module activated with all
methods (authenticator app, email, backup codes); **XML-RPC disabled** network-wide. XML-RPC
was taking ~3,000 login attempts a day and bypasses the login-page captcha. Its only real
user was the Jetpack connection on Whitefield, whose Jetpack Social has no social accounts
connected — re-enable XML-RPC (Security › Settings › WordPress Tweaks) if Jetpack is needed.
Settings backup: `/home/azureuser/security-bak-20260929/`.

### `sssihms-wfd-helpdesk-answers.php`

wp-admin page **Help Desk Answers** on Whitefield (blog 4, any logged-in user) for help-desk staff.
Search only, no AI: the Markdown knowledge base is split into passages (each "Common questions"
pair and each section), ranked with BM25 plus a small synonym list, and the top answers are shown
word for word with their source file and website page. Questions typed in Kannada, Telugu, Hindi or
Bengali script bring up that language's patient-information section. "To verify" sections are never
shown, and questions are not stored.

The knowledge base itself is **not in this repo**. It lives outside the web root at
`/srv/www/kb/whitefield/` (root:www-data, 750/640). To update it, copy the edited `.md` files there.
The index rebuilds on its own when any file's size or time changes. Build the archive with
`COPYFILE_DISABLE=1` on a Mac, or macOS `._*` metadata files land beside the `.md` files and are
indexed as junk.
