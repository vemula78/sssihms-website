# Converting an SSSIHMS site to Divi — methodology and traps

Written from the Whitefield (`whitefield.sssihms.org`) conversion, for anyone doing
the same work on another site of the multisite — Prasanthigram/Puttaparthi in
particular. The scripts referenced live in `scripts/` of this repo and are generic
enough to port.

**Context.** Whitefield is blog 4 of the WordPress multisite at `/srv/www/wordpress`
(blog 1 = sssihms.org). Puttaparthi is another blog on the **same** multisite, so
everything below applies with a different `--url` and table prefix. DB
`sssihms_master_db`; Whitefield's prefix is `sai_4_*`.

VM access:

```bash
ssh -i ~/Downloads/sssihms-web-vm2023_key.pem -p 2222 azureuser@20.219.253.136
```

---

## 1. Every WP-CLI call must carry `--url`

```bash
sudo -u www-data wp --path=/srv/www/wordpress --url=<host> ...
```

Omit it and you silently operate on blog 1. This is the most dangerous failure mode
on this multisite: a page on sssihms.org was overwritten this way, and the bad
revision (#370) is still sitting there awaiting a manual `wp post delete 370 --force`.

## 2. A 200 is not proof a link is correct

WordPress fuzzy-matches near-miss slugs and redirects somewhere else entirely,
returning 200 from the wrong page. `/neurology`, `/anesthesiology` and `/radiology`
all returned 200 while landing on blog listings. Verify the *final* URL:

```bash
curl -sL -o /dev/null -w '%{http_code} %{url_effective}\n' <url>
```

Check it equals what you asked for. Do this for every link in any inventory you
produce, or the inventory will be confidently wrong.

## 3. Inventory the Theme Builder separately — page tooling cannot see it

Header, footer and per-page template overrides are `et_template` posts, **not**
pages. Nothing walking `post_type=page` will find them, and links inside them go
stale silently — this is how the live front page ended up serving the old navigation.

The live set is identified by the **absence** of the meta key
`_et_theme_builder_marked_as_unused`. Many rows share identical titles, so matching
on title picks the wrong one. Relevant meta: `_et_default`, `_et_enabled`,
`_et_use_on` (e.g. `singular:post_type:page:id:54830`), `_et_header_layout_id`,
`_et_footer_layout_id`.

## 4. Two caches, both must be purged — and only your own site's

- Divi static CSS: `wp-content/et-cache/<net>/<site>/<id>/*.css`
- WP Super Cache pages: `wp-content/cache/page_enhanced/<host>{,:443}/`

Purge the `<host>` directories for **your** site only. That directory holds
sssihms.org, demo, ssssst.in and others side by side — a wildcard purge hits every
site on the box.

## 5. Yoast caches permalinks in its own table

`sai_<blog>_yoast_indexable`. A page published after having been private keeps a
stale `?page_id=N` permalink and advertises it as canonical, og:url and schema. A
no-op `wp post update` does **not** refresh it (WP skips unchanged saves). Delete
the row; Yoast regenerates on the next request.

Worth auditing as part of any inventory: find indexables whose permalink contains
`page_id` and cross-check `post_status`. For a published page that is always a
defect; for drafts and private pages it is correct. On Whitefield 45 rows matched
and exactly 1 was a real problem.

## 6. `_wp_page_template` will bite bulk updates

137 Whitefield pages carry `page-template-fullwidth.php` from the **inactive** Extra
theme. `wp_update_post` re-validates the template and silently rewrites it. If you
script any bulk page update: read the meta first, pass `default`, then restore the
meta verbatim.

## 7. Private pages poison link inventories

A private page gets a `?page_id=N` permalink and 404s for anonymous visitors. Any
menu or sub-nav linking to one bakes that `?page_id=` into every page carrying that
nav. Grep rendered HTML for `page_id=` across the whole site as a standing check —
it should be zero. This caught ten bad pages.

## 8. Check the real source before calling a page empty

Several pages looked like they had content but were 2015 scaffolding — a banner plus
toggles never filled. Read revisions (`wp_get_post_revisions`) and date them before
concluding anything about what a page "has".

Conversely, once a page has been overwritten by an import, the newest revision from
**before** the import cutoff is the real legacy content.
`scratchpad/extract2.php` does exactly this dump and is worth copying.

## 9. Two mistakes that cost real time

**Do not build a generic sub-nav sync tool.** I wrote one twice and threw it away
both times. The built output and the stored markup differ cosmetically
(`opacity:.5` vs `0.5`), so a byte comparison flags 80 of 112 pages as stale. Diff
semantically, or make targeted edits.

**Guard clauses silently kill link extraction.** `ssr/babel-plugin-navigate.mjs`
only recognises an `onClick` whose body is a *bare* `navigate(X)` call. Writing
`() => s.key && navigate(s.key)` is a LogicalExpression and produces zero links with
no error — it stripped every link from all five home-page specialty cards. A missing
key already yields a plain div, which is the correct way to make a card non-linking.

## 10. Deliverable shape that worked

Per page: slug, post ID, status, live URL, **final URL after redirect**, whether it
appears in a menu, which sub-nav it belongs to, outbound links with resolved targets,
and provenance (`live` / `rev#N dated` / `no match`).

Emit JSON and reconcile counts — pages found vs pages in the menu vs pages
reachable. Report the unreachable ones explicitly rather than dropping them.

---

## Standing constraints

From the global CLAUDE.md, binding on anything published:

- **Never fabricate clinical or operational values** — not as a placeholder, not for
  a demo. If a value is missing, the output says missing.
- **No patient-identifiable data anywhere.** A patient name and paediatric ages had
  to be stripped from a source document before its aggregate counts were used; two
  historic photographs were withheld because a patient appears in frame.

## Reusable scripts

| Script | What it does |
|---|---|
| `scripts/divi-import-safe.php` | Importer: nested slug matching, ambiguity refusal, opt-in creation, cache clearing, batch mode |
| `scripts/regen-page-json.py` | Rebuild a pack page from built HTML, preserving the stylesheet and banner modules byte for byte |
| `scripts/divi_labels.py` | Derive an `admin_label` per module from its own heading, so Divi's layers panel is navigable |
| `scripts/label-modules.py` | CLI applying the above across the pack |
| `scripts/new-page-json.py` | Build a pack layout for a page the design pass never exported |
| `scripts/link-map.json` | slug → live permalink |

**Known limitation:** module labels are derived, so renaming a module inside Divi is
overwritten by the next regeneration of that page.
