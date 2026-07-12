# SPEED 2026 — Quick Command Cheat Sheet

The commands you'll reach for most. Full details in SPEED-2026-VM-Reference.md.

---

## Connect to the VM (run on your Mac)
```bash
ssh -i ~/Downloads/sssihms-web-vm2023_key.pem -p 2222 -o ServerAliveInterval=60 azureuser@20.219.253.136
```

## The two pages
- Public (delegates):  https://whitefield.sssihms.org/speed-2026-registration/
- Staff (check-in):    https://whitefield.sssihms.org/speed-2026-staff/

## Purge cache after ANY change (run on the VM)
```bash
sudo rm -rf /srv/www/wordpress/wp-content/cache/page_enhanced/*
sudo rm -rf /srv/www/wordpress/wp-content/cache/minify/*
```
Then test in a PRIVATE/INCOGNITO browser window.

## Database password
`SSSIHMS9asdqwe`   (DB: sssihms_master_db, user: wordpress)

## See all delegates
```bash
mysql -u wordpress -p sssihms_master_db -e "SELECT id,name,email,ticket,role,checked_in FROM speed_delegates ORDER BY id;"
```

## See staff accounts
```bash
mysql -u wordpress -p sssihms_master_db -e "SELECT id,name,email,active FROM speed_staff;"
```

## Delete a test delegate by email
```bash
mysql -u wordpress -p sssihms_master_db -e "DELETE FROM speed_delegates WHERE email='test@example.com';"
```

## Upload a file (Mac → VM)
On Mac:
```bash
scp -P 2222 -i ~/Downloads/sssihms-web-vm2023_key.pem FILENAME azureuser@20.219.253.136:/tmp/
```
On VM (example: an app file):
```bash
sudo cp /tmp/FILENAME /srv/www/wordpress/wp-content/plugins/speed2026/assets/FILENAME
sudo chown www-data:www-data /srv/www/wordpress/wp-content/plugins/speed2026/assets/FILENAME
```

## Apache: test + reload after config edits (VM)
```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## Check error log when something breaks (VM)
```bash
sudo tail -n 50 /var/log/apache2/error.log
```

## Add staff via WordPress admin (easiest)
whitefield.sssihms.org/wp-admin → SPEED 2026 (sidebar) → Add Staff Account

## Export delegates
WordPress admin → SPEED 2026 → Download CSV

---

## Remember
- Mac prompt ends in `%` → used for `scp`
- VM prompt ends in `$` → used for everything else
- Always purge cache + test in a private window
- If timed out, just reconnect (nothing is lost)
