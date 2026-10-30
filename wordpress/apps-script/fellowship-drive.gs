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
 * Job applications that name departments are also filed per department, under
 * "Job applications / Departments / <department>": a folder per application (CV, certificates,
 * photograph) and one Google Sheet per department, "<department> applications". The columns in
 * DEPT_HIDE stay out of the department sheet. A "folders" request creates every department
 * folder and sheet in advance (wp-admin → Job Applications → Create department folders).
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
// Columns the HR sheet keeps but the department sheets do not (pending the hospital's decision).
const DEPT_HIDE = ['Current monthly salary in ₹ (0 if not working)'];

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
    if (p.action === 'folders') return reply_({ ok: true, folders: ensureDepartments_(root, p.depts || []) });
    const name = p.ref + ' - ' + (p.name || p.row['Name of the applicant'] || '');
    const found = root.getFoldersByName(name);
    if (found.hasNext()) return reply_({ ok: true, folder: found.next().getUrl() }); // Already copied.
    const folder = root.createFolder(name);
    p.files.forEach(function (f) {
      folder.createFile(Utilities.newBlob(Utilities.base64Decode(f.data), f.mime, f.name));
    });
    appendRow_(sheet_(root, form), p.row, folder.getUrl(), []);
    if (form === 'jobs' && p.depts && p.depts.length) copyToDepartments_(root, p, name);
    return reply_({ ok: true, folder: folder.getUrl() });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Match columns by name: add a column for any new question, leave removed ones blank. */
function appendRow_(sheet, row, folderUrl, hide) {
  const keys = Object.keys(row).filter(function (k) { return hide.indexOf(k) < 0; }).concat(['Drive folder']);
  let header = sheet.getLastRow() === 0 ? [] : sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const added = keys.filter(function (k) { return header.indexOf(k) < 0; });
  if (added.length) {
    sheet.getRange(1, header.length + 1, 1, added.length).setValues([added]).setFontWeight('bold');
    header = header.concat(added);
    sheet.setFrozenRows(1);
  }
  const data = Object.assign({}, row, { 'Drive folder': folderUrl });
  // A leading ' keeps text such as "+91…" or "=…" from being read as a formula.
  sheet.appendRow(header.map(function (k) {
    const v = data[k] === undefined || hide.indexOf(k) >= 0 ? '' : String(data[k]);
    return /^[=+\-@]/.test(v) ? "'" + v : v;
  }));
}

function subfolder_(parent, name) {
  const found = parent.getFoldersByName(name);
  return found.hasNext() ? found.next() : parent.createFolder(name);
}

/** "<department> applications" Google Sheet inside the department folder, created on first use. */
function deptSheet_(dfolder, dept) {
  const title = dept + ' applications';
  const found = dfolder.getFilesByName(title);
  while (found.hasNext()) {
    const f = found.next();
    if (f.getMimeType() === MimeType.GOOGLE_SHEETS) return SpreadsheetApp.openById(f.getId());
  }
  const ss = SpreadsheetApp.create(title);
  DriveApp.getFileById(ss.getId()).moveTo(dfolder);
  return ss;
}

/** Creates (or finds) Departments/<dept> and its sheet for each name; returns { dept: {folder, sheet} }. */
function ensureDepartments_(root, depts) {
  const droot = subfolder_(root, 'Departments');
  const out = {};
  depts.forEach(function (d) {
    const f = subfolder_(droot, d);
    out[d] = { folder: f.getUrl(), sheet: deptSheet_(f, d).getUrl() };
  });
  return out;
}

/** A copy of the application (files and one row) in each department the applicant chose. */
function copyToDepartments_(root, p, name) {
  const droot = subfolder_(root, 'Departments');
  p.depts.forEach(function (d) {
    const dfolder = subfolder_(droot, d);
    const mine = subfolder_(dfolder, name);
    p.files.forEach(function (f) {
      mine.createFile(Utilities.newBlob(Utilities.base64Decode(f.data), f.mime, f.name));
    });
    appendRow_(deptSheet_(dfolder, d).getSheets()[0], p.row, mine.getUrl(), DEPT_HIDE);
  });
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
