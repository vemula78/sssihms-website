# SSSIHMS — SSH Deploy Kit (auto-import into Divi)

This folder now contains everything to push the 36 Divi layouts straight onto
the live WordPress VM over SSH — no clicking through 34 manual imports.

```
divi-export/
├── *.json              ← the 36 Divi layouts (unchanged)
├── divi-import.php     ← creates/updates pages via WP-CLI (runs on the VM)
├── import-on-vm.sh     ← VM-side runner (wp-cli + cache purge)
├── deploy.sh           ← Mac-side: upload + run, one command
├── README.md           ← the original manual-import guide (still valid)
└── DEPLOY.md           ← this file
```

## The one-liner (run on your Mac)

```bash
cd /path/to/divi-export
bash deploy.sh
```

That uploads this folder to `/tmp/divi-export` on the VM and runs the importer.
If your key isn't at `~/Downloads/sssihms-web-vm2023_key.pem`:

```bash
SSSIHMS_KEY=/path/to/your_key.pem bash deploy.sh
```

## What it does

- **Creates/updates 34 Pages** (home + 33 inner pages) with the correct slugs,
  Divi Builder switched **on**, and `home` set as the **front page**.
- **Idempotent** — re-running updates the same pages by slug, never duplicates.
- Uses **WP-CLI** (downloads it to `/tmp` automatically if it isn't installed).
- Purges WP cache + Divi's `et-cache` so the result shows immediately.

## What it does NOT do (do these in the browser, once)

1. **Header & footer** → `Divi → Theme Builder` → Add Global Header / Footer →
   Portability (arrows icon) → Import `header.json` / `footer.json`.
2. **Nav menu** → `Appearance → Menus` (build it), then select the Menu module
   in the imported header → `Content → Menu` → pick your menu.

## Run it manually instead (if you prefer step-by-step)

```bash
# 1. on your Mac — upload
scp -P 2222 -i ~/Downloads/sssihms-web-vm2023_key.pem -r divi-export \
    azureuser@20.219.253.136:/tmp/divi-export

# 2. SSH in
ssh -i ~/Downloads/sssihms-web-vm2023_key.pem -p 2222 azureuser@20.219.253.136

# 3. on the VM — import
bash /tmp/divi-export/import-on-vm.sh
```

## Safety / rollback

- The importer only touches Pages (by slug) and the front-page option. It does
  not delete anything.
- To remove a page it created: `wp post delete <id> --force` (id is printed in
  the import log), or trash it from `wp-admin → Pages`.
- Always test in a **private/incognito** window after deploying (cache).
