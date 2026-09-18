// sssihms-cme-pages.jsx — Past-conference / CME archive pages, one per named
// series (sacred, speed, score) plus a general conferences archive.
// Editions listed per the consolidation brief; current/upcoming editions
// (e.g. SPEED 2026 registration) stay on their live operational pages.
(function(){
const PAGES = window.PAGES;

// ── SACRED (Radiology) ───────────────────────────────────────────────────────
PAGES['sacred'] = {
  title:'SACRED CME — Radiology', crumb:'Academics · CME Archive · SACRED',
  subtitle:'The Department of Radiology’s continuing medical education series, with national and international teaching faculty.',
  sections:[
    { type:'intro', eyebrow:'The Series', title:'A Decade of Radiology Teaching', narrow:true,
      body:[
        'SACRED is the continuing-education programme of the Department of Radiology at SSSIHMS Whitefield, bringing national and international faculty together for focused imaging education. This archive collects its past editions.'
      ], link:{ label:'Department of Radiology', page:'radiology' } },
    { type:'cards', eyebrow:'Past Editions', title:'The SACRED Archive', cols:3, alt:true, items:[
      { badge:'2023', title:'SACRED-23', desc:'The 2023 edition of the SACRED CME.' },
      { badge:'2022', title:'SACRED-22', desc:'Advanced MR Imaging in Neuro-Oncology.' },
      { badge:'2020', title:'SACRED-20', desc:'Pediatric Neuroradiology.' },
      { badge:'2019', title:'SACRED-19', desc:'Skull Base Imaging.' },
      { badge:'2018', title:'SACRED-18', desc:'Musculoskeletal (MSK) MRI.' },
      { badge:'2017', title:'SACRED-17', desc:'MRI in Practice.' },
      { badge:'2015', title:'SACRED-15', desc:'The 2015 edition — including its poster presentations and pre-conference warm-up material.' }
    ] }
  ]
};

// ── SPEED (Cardiology) ───────────────────────────────────────────────────────
PAGES['speed'] = {
  title:'SPEED CME — Cardiology', crumb:'Academics · CME Archive · SPEED',
  subtitle:'The Sathya Sai Preparatory course for Exam-going DM/DNB students — past editions.',
  sections:[
    { type:'intro', eyebrow:'The Series', title:'Preparing India’s Cardiology Trainees', narrow:true,
      body:[
        'SPEED — the Sathya Sai Preparatory course for Exam-going DM/DNB students — prepares cardiology trainees across the country for their exit examinations. This archive collects its past editions.',
        'The current edition (SPEED 2026) has its own live registration and staff pages, separate from this archive.'
      ], link:{ label:'Department of Cardiology', page:'cardiology' } },
    { type:'cards', eyebrow:'Past Editions', title:'The SPEED Archive', cols:3, alt:true, items:[
      { badge:'2020', title:'SPEED 2020', desc:'CME in Clinical Cardiology.' }
    ] }
  ]
};

// ── SCORE (IACTS / Cardiac Surgery) ──────────────────────────────────────────
PAGES['score'] = {
  title:'SCORE — Cardiac Surgery', crumb:'Academics · CME Archive · SCORE',
  subtitle:'IACTS SCORE review course editions hosted at SSSIHMS.',
  sections:[
    { type:'intro', eyebrow:'The Series', title:'SCORE at SSSIHMS', narrow:true,
      body:[
        'SCORE is the review course of the Indian Association of Cardiovascular and Thoracic Surgeons (IACTS) hosted by the Department of Cardiac Surgery. Future editions will be added to this archive.'
      ], link:{ label:'Department of Cardiac Surgery', page:'cardiac-surgery' } },
    { type:'cards', eyebrow:'Past Editions', title:'The SCORE Archive', cols:3, alt:true, items:[
      { badge:'2019', title:'IACTS SCORE 2019', desc:'The 2019 edition of the IACTS SCORE course.' }
    ] }
  ]
};

// ── GENERAL CONFERENCE ARCHIVE ───────────────────────────────────────────────
PAGES['conferences'] = {
  title:'Conference & CME Archive', crumb:'Academics · CME Archive',
  subtitle:'Past conferences, workshops and CMEs hosted across the Institute.',
  sections:[
    { type:'cards', eyebrow:'Named Series', title:'Recurring CME Series', cols:3, items:[
      { title:'SACRED', desc:'The Radiology department’s CME series — seven past editions.', link:{ label:'SACRED Archive', page:'sacred' } },
      { title:'SPEED', desc:'Cardiology’s preparatory course for exam-going DM/DNB students.', link:{ label:'SPEED Archive', page:'speed' } },
      { title:'SCORE', desc:'The IACTS review course in cardiac surgery.', link:{ label:'SCORE Archive', page:'score' } }
    ] },
    { type:'cards', eyebrow:'One-Off Events', title:'Past Conferences & Courses', cols:2, alt:true, items:[
      { badge:'2019', title:'CMR Hands-on Course', desc:'Hands-on training course in cardiac magnetic resonance imaging.' },
      { badge:'2020', title:'UPENN–SCMR CMR Hands-on Course', desc:'Cardiac MR hands-on course held with the University of Pennsylvania and SCMR.' },
      { badge:'2019', title:'4th Indo-US Critical Care Medicine Update', desc:'The fourth edition of the Indo-US update in critical care medicine.' },
      { badge:'Nursing', title:'State-level Conference on Recent Innovations in Nursing Education', desc:'Hosted by the College of Nursing.' }
    ] },
    { type:'intro', eyebrow:'Academics', title:'Learning Never Stops', narrow:true,
      body:['Regular CMEs, journal clubs, teaching rounds and teleconferences run across all departments through the year.'],
      link:{ label:'Education & Training', page:'academics' } }
  ]
};

// ── Cross-links from existing pages ──────────────────────────────────────────
// Cardiology Events → SPEED archive
const ev = PAGES['cardiology-events'];
if (ev) ev.sections.forEach(s => {
  if (s.type === 'cards' && s.items) s.items.forEach(it => {
    if (it.title && it.title.indexOf('SPEED') !== -1) it.link = { label:'SPEED Archive', page:'speed' };
  });
});
// Academics page "Conferences & CME" card → archive
const ac = PAGES['academics'];
if (ac) ac.sections.forEach(s => {
  if (s.type === 'cards' && s.items) s.items.forEach(it => {
    if (it.title === 'Conferences & CME') it.link = { label:'CME & Conference Archive', page:'conferences' };
  });
});

})();
