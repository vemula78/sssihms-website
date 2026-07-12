#!/usr/bin/env bash
#
# import-on-vm.sh — runs ON THE VM. Creates/updates all SSSIHMS Divi pages
# from the layout JSON, then clears caches. Safe to re-run (idempotent).
#
# Usage (on the VM):   bash /tmp/divi-export/import-on-vm.sh
#
set -euo pipefail

WP=/srv/www/wordpress
JSON_DIR="$(cd "$(dirname "$0")" && pwd)"   # the folder this script lives in

echo "==> WordPress path: $WP"
echo "==> Layouts:        $JSON_DIR"

# ---- 1. locate (or fetch) WP-CLI ------------------------------------------
if command -v wp >/dev/null 2>&1; then
  WP_CLI="wp"
else
  echo "==> wp-cli not on PATH — downloading to /tmp/wp-cli.phar ..."
  curl -fsSL -o /tmp/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
  chmod +x /tmp/wp-cli.phar
  WP_CLI="php /tmp/wp-cli.phar"
fi

# Run WP-CLI as the web user so created posts/options have the right ownership.
run_wp() { sudo -u www-data HOME=/tmp $WP_CLI --path="$WP" "$@"; }

echo "==> WordPress: $(run_wp core version 2>/dev/null || echo '??')"

# ---- 2. import the layouts -------------------------------------------------
run_wp eval-file "$JSON_DIR/divi-import.php" "$JSON_DIR"

# ---- 3. clear caches so changes show immediately --------------------------
echo "==> Purging caches ..."
sudo rm -rf "$WP"/wp-content/cache/page_enhanced/* 2>/dev/null || true
sudo rm -rf "$WP"/wp-content/cache/minify/*        2>/dev/null || true
sudo rm -rf "$WP"/wp-content/et-cache/*            2>/dev/null || true

echo "==> Done. Test in a PRIVATE / INCOGNITO window:"
echo "    https://whitefield.sssihms.org/"
