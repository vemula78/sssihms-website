#!/usr/bin/env bash
#
# deploy.sh — runs on your MAC. Uploads this whole folder (layouts + scripts)
# to the VM, then SSHes in and runs the importer. One command, end to end.
#
# Usage (on your Mac):   bash deploy.sh
#
set -euo pipefail

# ---- connection details (from the SPEED-2026 cheat sheet) -----------------
KEY="${SSSIHMS_KEY:-$HOME/Downloads/sssihms-web-vm2023_key.pem}"
HOST="azureuser@20.219.253.136"
PORT=2222

SSH_OPTS=(-i "$KEY" -p "$PORT" -o ServerAliveInterval=60)
SCP_OPTS=(-i "$KEY" -P "$PORT")

HERE="$(cd "$(dirname "$0")" && pwd)"

if [[ ! -f "$KEY" ]]; then
  echo "✗ SSH key not found at: $KEY"
  echo "  Fix the path, or run:  SSSIHMS_KEY=/path/to/key.pem bash deploy.sh"
  exit 1
fi

echo "→ Uploading layouts + scripts to VM (/tmp/divi-export) ..."
ssh "${SSH_OPTS[@]}" "$HOST" 'rm -rf /tmp/divi-export'
scp "${SCP_OPTS[@]}" -r "$HERE" "$HOST:/tmp/divi-export"

echo "→ Running importer on the VM ..."
ssh "${SSH_OPTS[@]}" "$HOST" 'bash /tmp/divi-export/import-on-vm.sh'

cat <<'EOF'

✓ Deploy complete.

Next, in a PRIVATE / INCOGNITO browser window:
  1. Visit  https://whitefield.sssihms.org/   — the home page should be live.
  2. Header & footer: Divi -> Theme Builder -> import header.json / footer.json
     (Portability / arrows icon). These are NOT auto-imported.
  3. Build your nav menu under Appearance -> Menus, then assign it to the
     Menu module inside the imported header.

EOF
