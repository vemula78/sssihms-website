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
 *   1. script.google.com → New project; paste this file and appsscript.json; fill in SECRET
 *      (shown on wp-admin → Fellowship Applications).
 *   2. Run setup() once and authorise. It creates the folder "Fellowship applications 2026-27"
 *      in My Drive with the spreadsheet inside (or set FOLDER_ID to use an existing folder).
 *   3. Deploy → New deployment → Web app; Execute as: Me; Who has access: Anyone.
 *   4. Paste the web app URL (ends in /exec) into wp-admin → Fellowship Applications → Save.
 * Never commit a filled-in copy of this file: the repository is public.
 */
const FOLDER_ID = ''; // Optional: an existing Drive folder ID; empty = setup() creates one.
const SECRET = 'PASTE-SECRET-FROM-WP-ADMIN';
const TITLE = 'Fellowship applications 2026-27';

/** Run once from the editor: authorises Drive and Sheets, creates the folder and spreadsheet. */
function setup() {
  const root = root_();
  sheet_(root);
  Logger.log('Folder: ' + root.getUrl());
}

function root_() {
  const props = PropertiesService.getScriptProperties();
  const id = FOLDER_ID || props.getProperty('FOLDER_ID');
  if (id) return DriveApp.getFolderById(id);
  const folder = DriveApp.createFolder(TITLE);
  props.setProperty('FOLDER_ID', folder.getId());
  return folder;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.secret !== SECRET) return reply_({ ok: false, error: 'Wrong secret' });
    const root = root_();
    const name = p.ref + ' - ' + (p.row['Name of the applicant'] || '');
    const found = root.getFoldersByName(name);
    if (found.hasNext()) return reply_({ ok: true, folder: found.next().getUrl() }); // Already copied.
    const folder = root.createFolder(name);
    p.files.forEach(function (f) {
      folder.createFile(Utilities.newBlob(Utilities.base64Decode(f.data), f.mime, f.name));
    });
    const sheet = sheet_(root);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(Object.keys(p.row).concat(['Drive folder']));
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
    }
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

function sheet_(root) {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id).getSheets()[0];
  const ss = SpreadsheetApp.create(TITLE);
  DriveApp.getFileById(ss.getId()).moveTo(root);
  props.setProperty('SHEET_ID', ss.getId());
  return ss.getSheets()[0];
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
