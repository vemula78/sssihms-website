#!/usr/bin/env bash
# Deploy the code-heavy static payloads (poetry-pages, stats-pages) to the live web VM.
#
#   ./scripts/deploy-static.sh            # dry run: build, show what would ship, change nothing
#   ./scripts/deploy-static.sh --apply    # actually deploy
#
# Serves at https://whitefield.sssihms.org/static/...
# Same-origin with the Divi pages, which the iframe postMessage height sync requires.
#
# Why this path: /srv/www/wordpress is the whitefield DocumentRoot, and its WordPress
# .htaccess rewrite is guarded by "RewriteCond %{REQUEST_FILENAME} !-f / !-d", so a real
# directory is served directly with no Apache config change and no restart. WordPress core
# updates only touch wp-admin/, wp-includes/ and the root php files, so static/ survives them.
#
# Deploy is atomic: files land in static.new, then swap. A failed extract never leaves a
# half-updated tree live. Re-running produces the same result (idempotent).

set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/Downloads/sssihms-web-vm2023_key.pem}"
SSH_HOST="${SSH_HOST:-azureuser@20.219.253.136}"
SSH_PORT="${SSH_PORT:-2222}"
REMOTE_ROOT="${REMOTE_ROOT:-/srv/www/wordpress/static}"
BASE_URL="${BASE_URL:-https://whitefield.sssihms.org/static}"

ROOT="$(cd "$(dirname "${BASE_SOURCE:-$0}")/.." && pwd)"
cd "$ROOT"

APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

SSH=(ssh -i "$SSH_KEY" -p "$SSH_PORT" -o ServerAliveInterval=60 -o BatchMode=yes "$SSH_HOST")

echo "==> Building"
node build.mjs >/dev/null
for d in dist/poetry-pages dist/stats-pages; do
  [[ -d "$d" ]] || { echo "FATAL: $d missing after build" >&2; exit 1; }
done

# Guard: the stats pages must not reach production still pointing at the CDN.
if grep -rl "cdn.jsdelivr.net" dist/stats-pages >/dev/null 2>&1; then
  echo "FATAL: dist/stats-pages still references cdn.jsdelivr.net; Chart.js must be self-hosted" >&2
  exit 1
fi
[[ -f dist/stats-pages/vendor/chart.umd.min.js ]] || {
  echo "FATAL: dist/stats-pages/vendor/chart.umd.min.js missing" >&2; exit 1; }

FILES=$(find dist/poetry-pages dist/stats-pages -type f | wc -l | tr -d ' ')
BYTES=$(find dist/poetry-pages dist/stats-pages -type f -exec cat {} + | wc -c | tr -d ' ')
echo "    $FILES files, $(( BYTES / 1024 )) KiB uncompressed"

if [[ $APPLY -eq 0 ]]; then
  echo
  echo "==> DRY RUN — nothing will be changed. Would deploy to $SSH_HOST:$REMOTE_ROOT"
  find dist/poetry-pages dist/stats-pages -type f | sed 's/^dist\//    /' | sort
  echo
  echo "    Re-run with --apply to deploy."
  exit 0
fi

echo "==> Shipping to $SSH_HOST:$REMOTE_ROOT"
# COPYFILE_DISABLE stops macOS bsdtar emitting AppleDouble "._*" sidecar files, which would
# otherwise land in the web root and be served publicly.
COPYFILE_DISABLE=1 tar czf - -C dist poetry-pages stats-pages | "${SSH[@]}" "
  set -euo pipefail
  sudo rm -rf '$REMOTE_ROOT.new'
  sudo mkdir -p '$REMOTE_ROOT.new'
  sudo tar xzf - -C '$REMOTE_ROOT.new'
  sudo chown -R www-data:www-data '$REMOTE_ROOT.new'
  sudo find '$REMOTE_ROOT.new' -type d -exec chmod 755 {} +
  sudo find '$REMOTE_ROOT.new' -type f -exec chmod 644 {} +
  sudo rm -rf '$REMOTE_ROOT.old'
  if [ -d '$REMOTE_ROOT' ]; then sudo mv '$REMOTE_ROOT' '$REMOTE_ROOT.old'; fi
  sudo mv '$REMOTE_ROOT.new' '$REMOTE_ROOT'
  sudo rm -rf '$REMOTE_ROOT.old'
  junk=\$(sudo find '$REMOTE_ROOT' -name '._*' | wc -l)
  [ \"\$junk\" -eq 0 ] || { echo \"FATAL: \$junk AppleDouble files reached the web root\" >&2; exit 1; }
  echo \"    deployed: \$(sudo find '$REMOTE_ROOT' -type f | wc -l) files\"
"

REMOTE_COUNT=$("${SSH[@]}" "sudo find '$REMOTE_ROOT' -type f | wc -l" | tr -d ' ')
if [[ "$REMOTE_COUNT" != "$FILES" ]]; then
  echo "FATAL: shipped $FILES files but $REMOTE_COUNT are on the server" >&2
  exit 1
fi
echo "    file count matches ($FILES)"

echo "==> Verifying over HTTPS"
fail=0
for path in stats-pages/cardiology-statistics.html stats-pages/vendor/chart.umd.min.js poetry-pages/divine-poetry.html; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE_URL/$path")
  enc=$(curl -sI -H 'Accept-Encoding: gzip' "$BASE_URL/$path" | tr -d '\r' \
        | awk -F': ' 'tolower($1)=="content-encoding"{print $2}')
  printf '    %-45s HTTP %s  encoding:%s\n' "$path" "$code" "${enc:-identity}"
  [[ "$code" == "200" ]] || fail=1
done
[[ $fail -eq 0 ]] || { echo "FATAL: some assets did not return 200" >&2; exit 1; }
echo "==> Done. Base URL: $BASE_URL/"
