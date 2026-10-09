/**
 * SSSIHMS Whitefield — fellowship applications to Google Drive.
 *
 * Receives each application from the website forms (mu-plugins
 * sssihms-wfd-fellowship-application.php and, with "form": "jobs",
 * sssihms-wfd-job-application.php) and saves it in that form's Drive folder:
 *   - one sub-folder per application ("FA26-1007-AB12 - NAME") holding the photograph and CV;
 *   - one row per application in a spreadsheet of the same name as the folder, created in
 *     the folder on the first application. Folders: "Fellowship applications 2026-27" and
 *     "Job applications", each created on first use in the owner's My Drive.
 * Nothing is ever deleted by this script.
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
const TITLES = { fellowship: 'Fellowship applications 2026-27', jobs: 'Job applications' };
// Script-property keys per form; the fellowship keys predate the jobs form.
const KEYS = { fellowship: ['FOLDER_ID', 'SHEET_ID'], jobs: ['JOBS_FOLDER_ID', 'JOBS_SHEET_ID'] };

/** Run once from the editor: authorises Drive and Sheets, creates the folder and spreadsheet. */
function setup() {
  const root = root_('fellowship');
  sheet_(root, 'fellowship');
  Logger.log('Folder: ' + root.getUrl());
}

function root_(form) {
  const props = PropertiesService.getScriptProperties();
  const id = (form === 'fellowship' && FOLDER_ID) || props.getProperty(KEYS[form][0]);
  if (id) return DriveApp.getFolderById(id);
  const folder = DriveApp.createFolder(TITLES[form]);
  props.setProperty(KEYS[form][0], folder.getId());
  return folder;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.secret !== SECRET) return reply_({ ok: false, error: 'Wrong secret' });
    const form = p.form === 'jobs' ? 'jobs' : 'fellowship';
    const root = root_(form);
    const name = p.ref + ' - ' + (p.name || p.row['Name of the applicant'] || '');
    const found = root.getFoldersByName(name);
    if (found.hasNext()) return reply_({ ok: true, folder: found.next().getUrl() }); // Already copied.
    const folder = root.createFolder(name);
    p.files.forEach(function (f) {
      folder.createFile(Utilities.newBlob(Utilities.base64Decode(f.data), f.mime, f.name));
    });
    const sheet = sheet_(root, form);
    // Match columns by name: add a column for any new question, leave removed ones blank.
    const keys = Object.keys(p.row).concat(['Drive folder']);
    let header = sheet.getLastRow() === 0 ? [] : sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const added = keys.filter(function (k) { return header.indexOf(k) < 0; });
    if (added.length) {
      sheet.getRange(1, header.length + 1, 1, added.length).setValues([added]).setFontWeight('bold');
      header = header.concat(added);
      sheet.setFrozenRows(1);
    }
    const data = Object.assign({}, p.row, { 'Drive folder': folder.getUrl() });
    // A leading ' keeps text such as "+91…" or "=…" from being read as a formula.
    sheet.appendRow(header.map(function (k) {
      const v = data[k] === undefined ? '' : String(data[k]);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    }));
    return reply_({ ok: true, folder: folder.getUrl() });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function sheet_(root, form) {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty(KEYS[form][1]);
  if (id) return SpreadsheetApp.openById(id).getSheets()[0];
  const ss = SpreadsheetApp.create(TITLES[form]);
  DriveApp.getFileById(ss.getId()).moveTo(root);
  props.setProperty(KEYS[form][1], ss.getId());
  return ss.getSheets()[0];
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
