/**
 * SSSIHMS Whitefield — fellowship applications to Google Drive.
 *
 * Receives each application from the website form (mu-plugin
 * sssihms-wfd-fellowship-application.php) and saves it in a Drive folder:
 *   - one sub-folder per application ("FA26-1007-AB12 - NAME") holding the photograph and CV;
 *   - one row per application in the spreadsheet "Fellowship applications 2026-27",
 *     created in the same folder on the first application.
 *
 * Set up (in the Google account that should own the files):
 *   1. Create the Drive folder; copy its ID from the URL (drive.google.com/drive/folders/<ID>).
 *   2. script.google.com → New project; paste this file; fill in FOLDER_ID and SECRET
 *      (SECRET is shown on wp-admin → Fellowship Applications).
 *   3. Deploy → New deployment → Web app; Execute as: Me; Who has access: Anyone. Authorise.
 *   4. Paste the web app URL (ends in /exec) into wp-admin → Fellowship Applications → Save.
 * Never commit a filled-in copy of this file: the repository is public.
 */
const FOLDER_ID = 'PASTE-DRIVE-FOLDER-ID';
const SECRET = 'PASTE-SECRET-FROM-WP-ADMIN';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.secret !== SECRET) return reply_({ ok: false, error: 'Wrong secret' });
    const root = DriveApp.getFolderById(FOLDER_ID);
    const name = p.ref + ' - ' + (p.row['Name of the applicant'] || '');
    const found = root.getFoldersByName(name);
    if (found.hasNext()) return reply_({ ok: true, folder: found.next().getUrl() }); // Already copied.
    const folder = root.createFolder(name);
    p.files.forEach(function (f) {
      folder.createFile(Utilities.newBlob(Utilities.base64Decode(f.data), f.mime, f.name));
    });
    const sheet = sheet_(root, Object.keys(p.row));
    // A leading ' keeps text such as "+91…" or "=…" from being read as a formula.
    const values = Object.keys(p.row).map(function (k) {
      const v = String(p.row[k]);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    });
    sheet.appendRow(values.concat([folder.getUrl()]));
    return reply_({ ok: true, folder: folder.getUrl() });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function sheet_(root, keys) {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id).getSheets()[0];
  const ss = SpreadsheetApp.create('Fellowship applications 2026-27');
  DriveApp.getFileById(ss.getId()).moveTo(root);
  const sheet = ss.getSheets()[0];
  sheet.appendRow(keys.concat(['Drive folder']));
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, keys.length + 1).setFontWeight('bold');
  props.setProperty('SHEET_ID', ss.getId());
  return sheet;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
