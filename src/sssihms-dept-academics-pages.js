// sssihms-dept-academics-pages.jsx — Department DNB / Fellowship / Cardiac
// Anesthesia sub-pages, mirroring the live site's per-department tab roster.
// Content sourced from whitefield.sssihms.org (see research/live-site-content.md).
// Mutates window.PAGES and window.DEPT_SUBNAV.
(function(){
const PAGES = window.PAGES;
const SUBNAV = window.DEPT_SUBNAV;
const R = window.__resources || {};

// ── Subnav rosters (match live site tabs; Statistics tabs are design additions) ──
SUBNAV.cardiology = [
  ['Overview','cardiology'], ['Faculty','cardiology-faculty'], ['Infrastructure','cardiology-infrastructure'],
  ['Achievements','cardiology-achievements'], ['Events','cardiology-events'], ['DrNB','drnb-cardiology'],
  ['Fellowship','fellowship-cardiology'], ['MSc Echo','msecho'], ['BSc CCT','bsc-cardiac-care-technology'],
  ['Statistics','cardiology-statistics']
];
SUBNAV['cardiac-surgery'] = [
  ['Overview','cardiac-surgery'], ['Faculty','ctvs-faculty'], ['Infrastructure','ctvs-infrastructure'],
  ['DNB','dnb-cardiac-surgery'], ['BSc Perfusion','bsc-perfusion'], ['Statistics','cardiac-surgery-statistics']
];
SUBNAV.neurosurgery = [
  ['Overview','neurosurgery'], ['Services','nesu-services'], ['Faculty','nesu-faculty'],
  ['Infrastructure','nesu-infrastructure'], ['DNB','nesu-dnb'], ['Achievements','nesu-achievements'],
  ['Events','nesu-events'], ['Statistics','neurosurgery-statistics']
];
SUBNAV.anesthesiology = [
  ['Overview','anesthesiology'], ['DNB','anes-dnb'], ['Faculty','anes-faculty'],
  ['Infrastructure','anes-infrastructure'], ['Achievements','anes-achievements'], ['Events','anes-events'],
  ['Cardiac Anesthesia','cardiac-anesthesia'], ['Fellowship','anes-fellowship'],
  ['BSc Anesthesia Tech','bsc-anesthesia-technology']
];
SUBNAV.radiology = [
  ['Overview','radiology'], ['Faculty','radiology-faculty'], ['Infrastructure','radiology-infrastructure'],
  ['BSc MIT','bsc-mit'], ['SACRED CME','sacred']
];
SUBNAV.services = [
  ['Overview','services'], ['Lab Infrastructure','lab-infrastructure'], ['BSc MLT','bsc-mlt']
];

// The consolidated "Academics" tabs are replaced by the explicit tabs above.
delete PAGES['cardiology-academics'];
delete PAGES['ctvs-academics'];
delete PAGES['nesu-academics'];
delete PAGES['anes-academics'];
delete PAGES['radiology-academics'];

// ── CARDIOLOGY: DrNB ─────────────────────────────────────────────────────────
PAGES['drnb-cardiology'] = {
  title:'DrNB Cardiology', crumb:'Departments · Cardiology · DrNB', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'Where commitment meets excellence in cardiology training — a three-year super-specialty residency, offered free of cost.',
  sections:[
    { type:'intro', eyebrow:'The Programme', title:'A Premier Centre for Cardiology Training',
      body:[
        'Since 2002, the Department of Cardiology has been recognised by the National Board of Examinations, Ministry of Health, Government of India, as a premier centre for cardiology super-specialty training. Each year, two highly motivated candidates are accepted into the three-year full-time DrNB programme.',
        'The programme has consistently attracted top-ranking NEET-SS candidates, and its trainees have earned multiple gold medals in the national-level final examinations. The department also serves as a DNB examination centre, with a 100% pass percentage.',
        'In keeping with the Founder’s philosophy, the course is offered entirely free of cost, with a stipend paid as per National Board guidelines.'
      ], pill:'Offered Free of Cost' },
    { type:'features', eyebrow:'Clinical Exposure', title:'The Full Spectrum of Cardiac Disease', alt:true, items:[
      'Congenital, rheumatic and atherosclerotic heart disease',
      'Heart failure, electrophysiological disorders and structural heart pathology',
      'Cardiac emergencies and elective cardiac care',
      'Hands-on management of critically ill patients in the CCU',
      'Pre- and post-operative care in interventional and surgical settings',
      'Vascular disorders through the integrated non-cardiac vascular programme',
      'Referrals from neurology, neurosurgery, paediatrics, gynaecology and beyond',
      'Continuous exposure to paediatric and congenital cardiology throughout the tenure'
    ] },
    { type:'features', eyebrow:'Cath-Lab Training', title:'Procedural Proficiency', items:[
      'Coronary and peripheral interventions',
      'Rheumatic and congenital valvuloplasties',
      'Device closures — ASD, VSD, PDA, RSoV, AP Window, VSR',
      'EP studies, 3D mapping and RF ablations',
      'Pacemakers, ICDs, CRT-P/D and conduction-system pacing',
      'TEVAR and EVAR procedures'
    ] },
    { type:'intro', eyebrow:'Academic Culture', title:'Cultivating Cardiology Leaders', alt:true, narrow:true,
      body:[
        'Trainees become proficient in transthoracic and transoesophageal echocardiography, stress ECGs, exercise and dobutamine stress echo, and Holter interpretation — skills carried into the cath lab as confidence in coronary angiograms, cardiac catheterisation, pacemaker implantation, device closures and electrophysiology procedures.',
        'Daily academic presentations are held in collaboration with the sister institution at SSSIHMS Prasanthigram, with mentorship from visiting cardiologists from India and abroad, support to present at national and international conferences, and participation in organising in-house CMEs.'
      ], link:{ label:'Admission via NBE Counselling', page:'dnb' } }
  ]
};

// ── CARDIOLOGY: Fellowship ───────────────────────────────────────────────────
PAGES['fellowship-cardiology'] = {
  title:'Fellowship in Interventional Cardiology', crumb:'Departments · Cardiology · Fellowship', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'A super-specialty fellowship for DM/DNB cardiologists, affiliated to the Rajiv Gandhi University of Health Sciences.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Advanced Interventional Training',
      body:[
        'The Fellowship in Interventional Cardiology is a 12-month super-specialty training programme for cardiologists who have completed DM or DNB in Cardiology, focused on high-level clinical expertise and procedural proficiency in interventional cardiology.',
        'The programme is conducted under the aegis of the Rajiv Gandhi University of Health Sciences. There are no institutional fees — candidates bear only the applicable university fees — and a stipend of ₹1,00,000 per month is paid.'
      ], pill:'No Institutional Fees' },
    { type:'features', eyebrow:'Goals & Objectives', title:'What the Fellowship Builds', alt:true, items:[
      'Clinical decision-making — assessing the appropriateness and limitations of coronary interventions',
      'Informed patient selection and procedural strategy',
      'Advanced cognitive and technical skills for safe, precise intervention',
      'Hands-on experience across coronary and structural interventions',
      'Critical thinking and evidence-based, continuous learning',
      'A culture of excellence in procedural outcomes and patient safety'
    ] },
    { type:'cards', eyebrow:'Training Environment', title:'Equipment You Will Train On', cols:4, items:[
      { title:'Siemens Artis Zee Biplane Cathlab', desc:'Interventional workhorse for coronary and structural work.' },
      { title:'Philips FD10 Cathlab', desc:'Second dedicated cardiac catheterisation laboratory.' },
      { title:'GE Vivid E95 & S70 Echo', desc:'Advanced echocardiography, including portable imaging.' },
      { title:'Rotablator, IVUS & EnSite 3D', desc:'Rotational atherectomy, intravascular ultrasound and 3D electro-anatomical mapping.' }
    ] },
    { type:'intro', eyebrow:'How to Apply', title:'Applications & Enquiries', narrow:true, alt:true,
      body:['For application windows and details, contact the academic section: 080-28004640/41 · academicblr@sssihms.org.in'],
      link:{ label:'All Fellowships', page:'fellowship' } }
  ]
};

// ── CARDIAC SURGERY: DNB ─────────────────────────────────────────────────────
PAGES['dnb-cardiac-surgery'] = {
  title:'DNB Cardiothoracic & Vascular Surgery', crumb:'Departments · Cardiac Surgery · DNB', subnav:'cardiac-surgery', icon:R.imgCTVS,
  subtitle:'A six-year direct residency in CTVS, accredited by the National Board of Examinations since 2002 — offered free of cost.',
  sections:[
    { type:'intro', eyebrow:'The Programme', title:'Six Years of Rigorous Surgical Training',
      body:[
        'The Department of Cardiothoracic and Vascular Surgery is accredited by the National Board of Examinations to offer a comprehensive residency in CTVS, first accredited in 2002. The programme is a direct six-year course post-MBBS.',
        'The course is structured as two years of General Surgery and allied specialties, followed by an NBE examination; then three years focused on cardiovascular and thoracic specialties with comprehensive training in operative skills and clinical techniques; and a final year placed in a centre of excellence, working alongside experienced professionals.',
        'Residents may take the exit examination at the end of five or six years, with certification granted on completing the full six-year training. Candidates are supported with stipends as per National Board guidelines, and the programme is offered free of cost.'
      ], pill:'Offered Free of Cost' },
    { type:'intro', eyebrow:'Visits & Enquiries', title:'Come and See the Department', alt:true, narrow:true,
      body:[
        'Visits can be arranged by appointment through the Public Relations office or the Head of the Department.',
        'Contact: HR Department, Academic Section, SSSIHMS, EPIP Area, Whitefield, Bangalore-560 066 · 080-28411500 ext 415 · academicsblr@sssihms.org.in'
      ], link:{ label:'Admission via NBE Counselling', page:'dnb' } }
  ]
};

// ── NEUROSURGERY: DNB & Services ─────────────────────────────────────────────
PAGES['nesu-dnb'] = {
  title:'DNB Neurosurgery', crumb:'Departments · Neurosurgery · DNB', subnav:'neurosurgery', icon:R.imgNeurosurgery,
  subtitle:'Training and equipping future neurosurgeons with the best skills and practices — free of cost.',
  sections:[
    { type:'intro', eyebrow:'The Programme', title:'NBE-Accredited Neurosurgical Residency',
      body:[
        'SSSIHMS is accredited by the National Board of Examinations to offer a residency programme in Neurosurgery, first accredited in 2003 to train one candidate every year. The six-year residential programme starts in January–February; candidates must have passed MBBS with internship, cleared the NBE CET, and registered for NBE centralised counselling.',
        'The six-year course is structured as 2 + 3 + 1: two years of General Surgery and allied specialty postings followed by an NBE examination; three years of neurosurgical training across all aspects of operative skills and clinical techniques; and a final year placed in a centre of excellence. The exit examination may be taken at the end of five or six years, with certification on completing the full six years.',
        'Candidates are paid a stipend as per National Board guidelines. In keeping with the philosophy of Sathya Sai institutions, the course is offered free of cost.'
      ], pill:'Offered Free of Cost' },
    { type:'intro', eyebrow:'Visits & Enquiries', title:'Contact the Academic Section', alt:true, narrow:true,
      body:[
        'Visits to the department can be arranged by prior appointment through the Public Relations office or the Head of the Department.',
        'Contact: HR Department, Academic Section, SSSIHMS, EPIP Area, Whitefield, Bangalore-560 066 · 080-28411500 ext 415 · registrarblr@sssihms.org.in'
      ], link:{ label:'Admission via NBE Counselling', page:'dnb' } }
  ]
};

PAGES['nesu-services'] = {
  title:'Services — Neurosurgery', crumb:'Departments · Neurosurgery · Services', subnav:'neurosurgery', icon:R.imgNeurosurgery,
  subtitle:'The full breadth of cranial, spinal and paediatric neurosurgery — free for every patient.',
  sections:[
    { type:'cards', eyebrow:'Cranial Surgery', title:'Cranial Procedures', cols:3, items:[
      { title:'AVM Excision', desc:'Meticulous dissection and complete removal of cranial and spinal arterio-venous malformations.' },
      { title:'Aneurysm Clipping', desc:'Clipping of intracranial aneurysms in any location of the brain, following digital subtraction angiography (DSA).' },
      { title:'Giant Aneurysms under Circulatory Arrest', desc:'For giant or exquisitely located aneurysms, clipping under cardiopulmonary bypass, profound hypothermia and total circulatory arrest — expertise available in only a handful of centres worldwide.' },
      { title:'Dural AV Fistula & Cavernomas', desc:'Operative disconnection of DAVFs, and neuro-navigation-guided excision of cavernomas in eloquent or deep-seated locations.' },
      { title:'Trigeminal Neuralgia', desc:'Microsurgical separation of the offending vessel from the nerve — a very gratifying operation for this painful condition.' },
      { title:'Brain Tumours', desc:'Gliomas (Grade I–IV), acoustic tumours, meningiomas, complex cranial-base tumours, pituitary tumours (trans-nasal trans-sphenoidal), skull tumours, metastases and intraventricular tumours.' }
    ] },
    { type:'features', eyebrow:'Paediatric Neurosurgery', title:'Children’s Neurosurgical Care', alt:true, items:[
      'Posterior fossa tumours — medulloblastoma, ependymoma',
      'Optochiasmatic / hypothalamic tumours & craniopharyngiomas',
      'Pineal region tumours',
      'Chiari malformation & encephalocoele',
      'Hydrocephalus — shunts & endoscopic third ventriculostomy',
      'Spinal dysraphism repair & craniovertebral junction anomalies'
    ] },
    { type:'cards', eyebrow:'Spinal Surgery', title:'Spinal Procedures', cols:3, items:[
      { title:'Lumbar Degenerative Disease', desc:'Micro lumbar discectomy and laminectomy, using the operating microscope or endoscope.' },
      { title:'Spondylolisthesis Correction', desc:'Pedicle screw fixation with posterior (PLIF) or anterior (ALIF) lumbar instrumentation and fusion.' },
      { title:'Cervical Spine', desc:'Anterior cervical discectomy, laminectomy, laminoplasty, corpectomy with instrumentation and lateral mass fixation.' },
      { title:'Thoracic Disc Disease', desc:'Laminectomy and discectomy via complex approaches around the heart and lungs.' },
      { title:'Spinal Tumours', desc:'Intramedullary tumours (glioma, ependymoma) and intradural extramedullary tumours, handled with precision.' },
      { title:'Spinal Infections', desc:'Surgery for tuberculous and pyogenic spinal infection, followed by appropriate chemotherapy.' }
    ] },
    { type:'features', eyebrow:'Other Procedures', title:'Beyond Cranium & Spine', alt:true, items:[
      'Stereotactic biopsy, abscess/cyst drainage and reservoir placement',
      'Cardiogenic intracranial abscesses — frequent given the large cardiac department',
      'Otogenic and other intracranial infections',
      'Peripheral nerve surgery — carpal tunnel release, ulnar nerve release'
    ] }
  ]
};

// ── ANESTHESIOLOGY: DNB, Cardiac Anesthesia, Fellowship ──────────────────────
PAGES['anes-dnb'] = {
  title:'DNB Anaesthesiology', crumb:'Departments · Anesthesiology · DNB', subnav:'anesthesiology', icon:R.imgAnesthesiology,
  subtitle:'Integrated training in all areas of anaesthesia and critical care — free of cost, with human values at its heart.',
  sections:[
    { type:'intro', eyebrow:'The Programme', title:'NBE Residency in Anaesthesiology',
      body:[
        'The Department of Anaesthesiology and Critical Care is accredited by the National Board of Examinations to offer three-year training for primary candidates and two-year training for secondary candidates, leading to the DNB Anaesthesiology degree (equivalent to MD Anaesthesia). First accredited in 2003 to train one candidate a year, the department is now accredited for 3 + 3 candidates annually.',
        'The programme provides integrated training in all areas of anaesthesia and critical care through clinical work, didactic lectures and seminars, and regular video conferencing with overseas faculty from the USA. Patients drawn from every corner of the country present a vast plethora of clinical pathologies.',
        'The residency starts in January–February as per NBE central counselling. Candidates are paid a stipend per National Board guidelines, with on-campus accommodation provided — shared for unmarried residents and single-bedroom family accommodation for married residents. The course is offered free of cost.'
      ], pill:'Offered Free of Cost' },
    { type:'features', eyebrow:'Rotations', title:'Rotational Postings', alt:true, items:[
      'Sri Sathya Sai General Hospital on the same campus — general surgery, obstetrics & gynaecology, orthopaedics, ENT, ophthalmology, plastic surgery, urology',
      'Postings to other multi-specialty hospitals for breadth of training',
      'Cardiac and neuro anaesthesia within the Institute’s 12 modular theatres',
      'Critical care across the hospital’s 6 intensive care units'
    ] },
    { type:'intro', eyebrow:'Enquiries', title:'Contact the DNB Coordinator', narrow:true,
      body:['Asst DNB Coordinator, Academic Section, SSSIHMS, EPIP Area, Whitefield, Bangalore-560 066 · 080-28004640/41 · Mobile 9620207698 · registrarblr@sssihms.org.in · anaesthesiablr@sssihms.org.in'],
      link:{ label:'Admission via NBE Counselling', page:'dnb' } }
  ]
};

PAGES['cardiac-anesthesia'] = {
  title:'Cardiac Anesthesia', crumb:'Departments · Anesthesiology · Cardiac Anesthesia', subnav:'anesthesiology', icon:R.imgAnesthesiology,
  subtitle:'The dedicated team behind every safe cardiac surgery, intervention and intensive-care stay.',
  sections:[
    { type:'intro', eyebrow:'The Service', title:'Anaesthesia for the Cardiac Mission',
      body:[
        'A dedicated cardiac anaesthesia team serves the Institute’s cardiac operation theatres, the two cardiac catheterisation labs, the cardiac intensive care units and the CCU — covering approximately 1,500 cardiac cases a year, about a third of them paediatric.',
        'The team provides peri-operative transoesophageal echocardiography (TEE), supports congenital and adult cardiac surgery alike, and anchors the 18-month Fellowship in Cardio-Thoracic & Vascular Anaesthesia.'
      ], pill:'Free Cardiac Care' },
    { type:'cards', eyebrow:'Scope', title:'Where the Team Serves', cols:4, alt:true, items:[
      { title:'4 Cardiac Theatres', desc:'Open and closed-heart surgery, adult and paediatric.' },
      { title:'2 Cath Labs', desc:'Sedation and anaesthesia for interventions and EP procedures.' },
      { title:'2 Cardiac ICUs + CCU', desc:'Round-the-clock post-operative and critical care.' },
      { title:'TEE Services', desc:'Intra-operative transoesophageal echocardiography.' }
    ] },
    { type:'intro', eyebrow:'Training', title:'Fellowship in Cardiac Anaesthesia', narrow:true,
      body:['Experienced anaesthesiologists can train in this high-volume paediatric-rich programme through the 18-month RGUHS fellowship.'],
      link:{ label:'ANES Fellowship', page:'anes-fellowship' } }
  ]
};

PAGES['anes-fellowship'] = {
  title:'Fellowship in Cardio-Thoracic & Vascular Anaesthesia', crumb:'Departments · Anesthesiology · Fellowship', subnav:'anesthesiology', icon:R.imgAnesthesiology,
  subtitle:'An 18-month RGUHS fellowship for MD/DNB anaesthesiologists.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Advanced Cardiac Anaesthesia Training',
      body:[
        'The Fellowship in Cardio-Thoracic & Vascular Anaesthesia is an 18-month programme under the aegis of the Rajiv Gandhi University of Health Sciences, open to MD/DNB anaesthesiologists, with a stipend of ₹85,000 per month.',
        'The fellowship covers 4 cardiac operation theatres, 2 catheterisation labs, 2 intensive care units and a CCU — approximately 1,500 cases a year, a third of them paediatric — giving fellows exceptional exposure to congenital and adult cardiac anaesthesia.',
        'No fees are charged by the Institute; only applicable RGUHS university fees are borne by the trainee. Enquiries: 080-28004640/41 · academicblr@sssihms.org.in'
      ], pill:'No Institutional Fees' },
    { type:'intro', eyebrow:'More', title:'All Fellowship Programmes', alt:true, narrow:true,
      body:['SSSIHMS also offers fellowships in Interventional Cardiology, Paediatric Cardiac Surgery and Radiology.'],
      link:{ label:'Fellowship Courses', page:'fellowship' } }
  ]
};

})();
