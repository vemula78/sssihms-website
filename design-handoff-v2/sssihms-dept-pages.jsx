// sssihms-dept-pages.jsx — Department sub-pages (faculty, infrastructure,
// achievements, events, services, academics) mirroring whitefield.sssihms.org
// sub-menus. Mutates window.PAGES and defines window.DEPT_SUBNAV.
(function(){
const MC = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/09/';
const PAGES = window.PAGES;

// ── Department sub-navigation (tabs shown under the page banner) ────────────
const DEPT_SUBNAV = {
  cardiology: [
    ['Overview','cardiology'], ['Faculty','cardiology-faculty'], ['Infrastructure','cardiology-infrastructure'],
    ['Achievements','cardiology-achievements'], ['Events','cardiology-events'], ['Academics','cardiology-academics'], ['Statistics','cardiology-statistics']
  ],
  'cardiac-surgery': [
    ['Overview','cardiac-surgery'], ['Faculty','ctvs-faculty'], ['Infrastructure','ctvs-infrastructure'],
    ['Achievements','ctvs-achievements'], ['Academics','ctvs-academics'], ['Statistics','cardiac-surgery-statistics']
  ],
  neurosurgery: [
    ['Overview','neurosurgery'], ['Faculty','nesu-faculty'], ['Infrastructure','nesu-infrastructure'],
    ['Achievements','nesu-achievements'], ['Events','nesu-events'], ['Academics','nesu-academics'], ['Statistics','neurosurgery-statistics']
  ],
  neurology: [
    ['Overview','neurology'], ['Services','neurology-services'], ['Infrastructure','neurology-infrastructure']
  ],
  anesthesiology: [
    ['Overview','anesthesiology'], ['Faculty','anes-faculty'], ['Infrastructure','anes-infrastructure'],
    ['Achievements','anes-achievements'], ['Events','anes-events'], ['Academics','anes-academics']
  ],
  radiology: [
    ['Overview','radiology'], ['Faculty','radiology-faculty'], ['Infrastructure','radiology-infrastructure'], ['Academics','radiology-academics']
  ],
  sssgh: [
    ['Overview','sssgh'], ['History','history-gh'], ['Statistics','multi-specialty-statistics']
  ],
  services: [
    ['Overview','services'], ['Lab Infrastructure','lab-infrastructure']
  ]
};
window.DEPT_SUBNAV = DEPT_SUBNAV;

// Attach subnav key to existing overview pages
['cardiology','cardiac-surgery','neurosurgery','neurology','anesthesiology','radiology','sssgh','services'].forEach(k => {
  if (PAGES[k]) PAGES[k].subnav = k;
});
// Statistics dashboard pages join their department's subnav
if (PAGES['cardiology-statistics']) PAGES['cardiology-statistics'].subnav = 'cardiology';
if (PAGES['cardiac-surgery-statistics']) PAGES['cardiac-surgery-statistics'].subnav = 'cardiac-surgery';
if (PAGES['neurosurgery-statistics']) PAGES['neurosurgery-statistics'].subnav = 'neurosurgery';
// SSSGH specialty dashboards share the SSSGH subnav
['multi-specialty-statistics','ophthalmology-statistics','obs-gynae-statistics','orthopaedics-statistics','ent-statistics','general-surgery-statistics','paediatrics-statistics','urology-statistics'].forEach(k => {
  if (PAGES[k]) PAGES[k].subnav = 'sssgh';
});

// ── CARDIOLOGY ───────────────────────────────────────────────────────────────
PAGES['cardiology-faculty'] = {
  title:'Faculty — Cardiology', crumb:'Departments · Cardiology · Faculty', subnav:'cardiology',
  subtitle:'The consultants and visiting faculty behind 25 years of free cardiac care.',
  sections:[
    { type:'faculty', eyebrow:'Core Faculty', title:'Consultants', cols:3, items:[
      { name:'Dr. Reeta Varyani', role:'I/C Head of Department & Sr. Consultant' },
      { name:'Dr. Prayaag Kini', role:'Sr. Consultant' },
      { name:'Dr. Barooah Banajith', role:'Sr. Consultant' }
    ] },
    { type:'faculty', eyebrow:'Honorary Faculty', title:'Honorary Consultants', cols:3, alt:true, items:[
      { name:'Dr. Pravat Kumar Dash', role:'MBBS MD DM FACC — Capitol Hospital, Bhubaneshwar' },
      { name:'Dr. Srikanth Sola', role:'Honorary Consultant' }
    ] },
    { type:'intro', eyebrow:'Visiting Faculty', title:'A Global Teaching Community', narrow:true,
      body:[
        'The department is supported by around 37 international visiting faculty — interventional cardiologists and electrophysiologists from institutions including the Mayo Clinic, UC San Diego, the University of Michigan, the University of Utah and the University of Kansas — who visit, teach and operate alongside the core team.'
      ] }
  ]
};

PAGES['cardiology-infrastructure'] = {
  title:'Infrastructure — Cardiology', crumb:'Departments · Cardiology · Infrastructure', subnav:'cardiology',
  subtitle:'Modern diagnostic and interventional facilities — every service free of charge.',
  sections:[
    { type:'cards', eyebrow:'Facilities', title:'Diagnostics & Intervention', cols:3, items:[
      { title:'Catheterisation Labs', desc:'Two dedicated cardiac cath labs supporting more than 71,000 procedures and sessions since 2001, alongside the Institute\'s bi-plane neuro cath lab.' },
      { title:'Non-Invasive Cardiology', desc:'Echocardiography, treadmill stress testing, Holter monitoring and ECG services supporting an outpatient volume of over 11.2 lakh visits.' },
      { title:'Critical Care', desc:'Dedicated cardiac intensive care within the Institute\'s 6 ICUs, with round-the-clock emergency support.' },
      { title:'Operation Theatres', desc:'Access to 12 modular operation theatres shared with cardiac surgery for the full range of adult and paediatric interventions.' },
      { title:'Imaging', desc:'On-campus GE HD 750 128-slice CT and Siemens MAGNETOM Aera 1.5T MRI for advanced cardiac imaging.' },
      { title:'Telemedicine', desc:'Cardiology consultations to nodal centres at Barrackpore (West Bengal) and Bhubaneswar (Odisha) through the Sri Sathya Sai Tele-health Network.' }
    ] },
    { type:'stats', eyebrow:'Scale', title:'Cardiology in Numbers', alt:true, items:[
      { v:'71,483', l:'Cath-Lab Procedures & Sessions Since 2001' },
      { v:'11.2 Lakh+', l:'Outpatient Visits' },
      { v:'3', l:'Catheterisation Labs on Campus' }
    ] }
  ]
};

PAGES['cardiology-achievements'] = {
  title:'Achievements — Cardiology', crumb:'Departments · Cardiology · Achievements', subnav:'cardiology',
  subtitle:'Recognition earned in the course of selfless service.',
  sections:[
    { type:'cards', eyebrow:'Recognition', title:'Milestones & Honours', cols:3, items:[
      { title:'Five DrNB Gold Medalists', desc:'Dr. Keshav Murthy (2005), Dr. Deepak Krishnamurthy (2006), Dr. Rohit Dixit (2012), Dr. Booma S (2017) and Dr. Ravi Kachhela (2018) — gold medals in the DrNB Cardiology programme.' },
      { title:'CSI Conference Awards', desc:'Multiple Best Oral Abstract, Best Poster and Original Research awards at Cardiological Society of India conferences from 2013 to 2025.' },
      { title:'Modi Mundi Award', desc:'Best Original Study, 2018.' },
      { title:'Prof. D.P. Basu Memorial Award', desc:'For India’s first AI/ML-based risk score for hypertrophic obstructive cardiomyopathy (HOCM), 2021–22.' },
      { title:'Research & Publications', desc:'Faculty actively participate in research projects and clinical studies, publishing regularly in reputed national and international journals.' },
      { title:'National Standing', desc:'Among the leading national institutions performing a wide variety of adult and paediatric cardiac interventions — all free of cost.' }
    ] },
    { type:'quote', image:'assets/baba/baba-02.jpg', text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this.', attr:'Bhagawan Sri Sathya Sai Baba' }
  ]
};

PAGES['cardiology-events'] = {
  title:'Events — Cardiology', crumb:'Departments · Cardiology · Events', subnav:'cardiology',
  subtitle:'Teaching courses, workshops, CMEs and the visiting-faculty camps that bring specialist skills to patients who could not otherwise reach them.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Courses & Workshops', cols:3, items:[
      { badge:'Annual', title:'SPEED — Sathya Sai Preparatory Course', desc:'The Sathya Sai Preparatory course for Exam-going DM/DNB students (SPEED) prepares cardiology trainees across the country for their exit examinations. The 2025 edition, held on 8–9 November, was the tenth and drew 157 delegates.' },
      { badge:'Annual', title:'CRYSTAL', desc:'A day-long refresher course for final-year Cardiac Care Technology students and MSc Echocardiography postgraduates, run under the theme “For the Students, By the Students”. CRYSTAL 2026 brought together 139 participants from SSSIHMS and three partner institutions.' },
      { badge:'Workshop', title:'Heart Rhythm Update — Pace for Life', desc:'An electrophysiology conference organised with the Pace4life Foundation, UK, held in the Dhanvantari Hall of the hospital on 19 October 2024.' },
      { badge:'Structural', title:'SPACE', desc:'The structural heart conference, held in 2019 and 2022, including a session on point-of-care ultrasound in heart failure with Dr. Bruce Kimura.' },
      { badge:'Allied Health', title:'FACTS', desc:'A day-long teaching programme for RGUHS BSc Cardiac Care Technology students. FACTS2, organised with KAHPA on 12 March 2025, included a live transmission from the cathlab to Dhanvantari Hall and was attended by 220 candidates.' },
      { badge:'Online', title:'ELEKTRA', desc:'An electrophysiology teaching programme for EP fellows, technicians and early-career cardiologists, initiated in 2022 under Dr. Komandoor Srivathsan of Mayo Clinic Arizona.' },
      { badge:'Collaboration', title:'GESSSICA', desc:'A day-long training programme run jointly by GE Healthcare and SSSIHMS, held in 2024 and 2025.' },
      { badge:'Weekly', title:'Academic Meetings', desc:'Regular journal clubs, case discussions and teaching rounds with core, honorary and international visiting faculty.' },
      { badge:'Since 2005', title:'Bangalore Chapter CSI Annual Conference', desc:'The department has hosted the annual conference of the Bangalore chapter of the Cardiological Society of India from 2005 to 2025.' }
    ] },

    { type:'gallery', eyebrow:'In the Hall', title:'Conferences & Teaching Programmes', alt:true, items:[
      { src:MC + 'cardio-conf-speed-a.jpg', caption:'SPEED \u2014 the preparatory course for exam-going DM/DNB students' },
      { src:MC + 'cardio-conf-speed-b.jpg', caption:'SPEED session in progress' },
      { src:MC + 'cardio-conf-speed-c.jpg', caption:'Case-based discussion at SPEED' },
      { src:MC + 'cardio-conf-hall-a.jpg', caption:'A full Dhanvantari Hall' },
      { src:MC + 'cardio-conf-ep-conclave.jpg', caption:'EP Conclave' },
      { src:MC + 'cardio-conf-hru-a.jpg', caption:'Heart Rhythm Update \u2014 Pace for Life' },
      { src:MC + 'cardio-conf-hru-b.jpg', caption:'Heart Rhythm Update, October 2024' }
    ] },

    { type:'intro', eyebrow:'Specialised Camps', title:'Bringing Visiting Expertise to the Bedside', alt:true, narrow:true,
      body:[
        'Senior specialists from India and abroad visit the Institute to proctor complex work that needs particular skills, materials and equipment. Between 7 May 2025 and 10 June 2026 the department held eight such camps across three programme lines — electrophysiology, complex coronary intervention and paediatric structural heart disease — recording 170 procedure sessions in 164 patients. All of this care was given free of charge; the Sri Sathya Sai Central Trust and partner organisations supported the high-cost consumables and devices.'
      ] },

    { type:'table', eyebrow:'2025–26', title:'Camps Held', 
      cols:['Date','Programme','Proctor(s)','Sessions','Patients'],
      rows:[
        ['07-May-2025','Complex Coronary','Dr. D. S. Chadha','12','12'],
        ['14-May-2025','Paediatric Structural','Dr. Nageshwar Rao','14','14'],
        ['24–27-Sep-2025','Electrophysiology','Dr. Sivaraman Yegyaraman, Dr. Ashok Garg, Dr. K. S. Srivathsan','37','36'],
        ['08-Oct-2025','Complex Coronary','Dr. D. S. Chadha','11','11'],
        ['20-Dec-2025','Paediatric Structural','Dr. Nageshwar Rao','18','18'],
        ['03–07-Mar-2026','Electrophysiology','Dr. Ashok Garg','48','45'],
        ['13-May-2026','Complex Coronary','Dr. D. S. Chadha','9','9'],
        ['10-Jun-2026','Paediatric Structural','Dr. Nageshwar Rao','21','19'],
        ['Total','8 camps','','170','164']
      ],
      note:'Procedure sessions exceed patient numbers because a patient may undergo more than one procedure in a single camp. The March 2026 electrophysiology workshop additionally included 13 diagnostic coronary angiograms performed alongside the EP work.' },

    { type:'achievements', eyebrow:'Visiting Faculty', title:'Camps, Workshops & Mentorship Visits',
      sub:'The department’s record of visiting-faculty programmes. Open a group to read it.',
      groups:[
        { title:'Camps, Workshops & Training Visits', count:22,
          entries:[
            {"text": "Dr. D. S. Chadda, a senior cardiac interventionalist from Manipal Hospital, Bengaluru and former Head of Cardiology at Command Hospital Bengaluru, visited SSSIHMS Whitefield multiple times to mentor the team in complex coronary interventions. His visits supported the management of patients with complex coronary disease requiring advanced skills, materials, and equipment. Sri Sathya Sai Central Trust supported these patients by providing high-cost consumables such as IVL catheters, rotablator consumables, and IVUS catheters."},
            {"text": "Dr. Ashok Garg and Dr. Sivaraman Yegyaraman, electrophysiologists who have been visiting the Institute twice yearly for more than two decades, visited from 18 April 2024 to 22 April 2024. During their visit, 18 patients with arrhythmias were treated, 13 devices for heart failure were implanted, and the SSSIHMS Whitefield team received updates in electrophysiology. Heart Valve Bank India and Medtronic USA supported the device implantations.", "year": "2024"},
            {"text": "Dr. Nageshwar Rao, a well-known pediatric cardiologist who has developed a device for closure of holes in the heart, visited the hospital on 8 June 2024 to mentor SSSIHMS cardiologists in complex device implantations. Seventeen children benefited from this workshop. Observing the variety of anatomic malformations, Dr. Nageshwar Rao noted that these cases could be part of an international live conference.", "year": "2024"},
            {"text": "Dr. Komandoor Srivathsan, Head of Electrophysiology at Mayo Clinic Arizona, joined Dr. Sivaraman Yegyaraman and Dr. Ashok Garg, the Institute’s regular volunteering faculty, from 9 September 2024 to 13 September 2024. During this five-day programme, the team performed 10 heart failure device implantations and 32 radiofrequency ablations for correction of arrhythmias.", "year": "2024"},
            {"text": "Dr. Girish joined Dr. Mark Davis, with support from AA-PFL Charity, for volunteering services from 14 October 2024 to 19 October 2024. During the visit, they supported 33 complex arrhythmia ablations, 10 CRT device implantations, and a few conduction system pacing procedures. The Institute also organised the conference “Heart Rhythm Update 2024” on 19 October 2024, which was well attended.", "year": "2024"},
            {"text": "Dr. Sivaraman Yegyaraman and Dr. Ashok Garg visited again from 5 February 2025 to 7 February 2025. During the visit, 18 complex ablations and 13 heart failure device implantations were performed, benefiting more than 30 patients. Consultants and residents also benefited from exposure to the latest updates in electrophysiology.", "year": "2025"},
            {"text": "Dr. Sivaraman Yegyaraman spent one day at the Institute with the consultants on 15 March 2025 and mentored heart failure device implantations, supported by Boston Scientific USA.", "year": "2025"},
            {"text": "On 19 January 2026, SSSIHMS Whitefield inaugurated Sai Sparsh, Sri Sathya Sai Preventive Cardiology and Rehabilitation Services for Health and Healing. The activity was organised by SSSIHMS Whitefield and mentored by Dr. Reeta Varyani, Dr. Prayaag Kini, and Dr. Nayanjit Choudary.", "year": "2026"},
            {"text": "From 3 March 2026 to 7 March 2026, SSSIHMS Whitefield and Medtronic USA conducted an advanced EP, advanced device, and conduction system pacing workshop. Dr. S. Yegyaraman helped organise the support through Medtronic USA, and Dr. Ashok Garg served as mentor. The programme supported implantation of one VR ICD, one DR ICD, one CRT-D, three DR PPMs, and two CRT-P devices.", "year": "2026"},
            {"text": "On 10 May 2026, SSSIHMS Whitefield organised Crystal 2026, which brought together 139 participants from across the country.", "year": "2026"},
            {"text": "On 13 May 2026, SSSIHMS Whitefield conducted a complex coronary interventions workshop mentored by Dr. D. S. Chadda. The workshop included the first orbital atherectomy treatment supported by Abbott.", "year": "2026"},
            {"text": "On 2 January 2025, SSSIHMS Whitefield conducted a complex coronary interventions workshop mentored by Dr. D. S. Chadda. Six cases were performed, including one IVUS-guided case.", "year": "2025"},
            {"text": "On 1 September 2025, SSSIHMS Whitefield conducted a complex coronary workshop mentored by Dr. D. S. Chadda. Five cases were performed, including one IVL case and one IVUS case.", "year": "2025"},
            {"text": "From 5 February 2025 to 7 February 2025, SSSIHMS Whitefield and Medtronic USA conducted an advanced EP, advanced device, and conduction system pacing workshop mentored by Dr. S. Yegyaraman and Dr. Ashok Garg. The activities included CRT-P, CRT-D, ICD, conduction system pacing procedures, and electrophysiology diagnoses and ablations.", "year": "2025"},
            {"text": "On 25 February 2025, SSSIHMS Whitefield hosted training by the Lifetech team on creating perforations in stent grafts.", "year": "2025"},
            {"text": "From 5 March 2025 to 6 March 2025, GE Healthcare conducted Edison Group training with SSSIHMS faculty. Various anatomical and cardiology topics were taught to GE engineers.", "year": "2025"},
            {"text": "From 8 March 2025 to 9 March 2025, SSSIHMS and Hrudaya Vignan Trust organised the SPEED conference. Topics covered included Ebstein anomaly, RSOV, HOCM, valve disease, valvular lesions, aortoarteritis, unicuspid aortic valve, CCP, DORV, VSD, and PAH.", "year": "2025"},
            {"text": "On 12 March 2025, KAHPA and SSSIHMS organised the FACTS2 conference. The programme included live transmission from the cathlab to Dhanvanthri Hall and was attended by 220 candidates.", "year": "2025"},
            {"text": "On 13 March 2025, SSSIHMS Whitefield conducted a complex coronary interventions workshop mentored by Dr. D. S. Chadda.", "year": "2025"},
            {"text": "On 15 March 2025, SSSIHMS Whitefield conducted an advanced electrophysiology workshop mentored by Dr. S. Yegyaraman.", "year": "2025"},
            {"text": "From 16 April 2025 to 17 April 2025, Medtronic conducted EVAR/TEVAR demonstration training with simulation. The programme covered aneurysm planning, measurement, implantation techniques, materials, and simulated deployment.", "year": "2025"},
            {"text": "From 24 September 2025 to 27 September 2025, SSSIHMS Whitefield conducted an advanced device workshop and conduction system pacing programme mentored by Dr. Yegyaraman, Dr. Ashok Garg, and Dr. Srivathsan. The activities included ICD, BVPI, conduction system pacing, PGR, and EP procedures.", "year": "2025"},
          ],
        },
      ]
    }
  ]
};

PAGES['cardiology-academics'] = {
  title:'Academics — Cardiology', crumb:'Departments · Cardiology · Academics', subnav:'cardiology',
  subtitle:'Training the next generation of cardiologists — free of cost.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Courses Offered', cols:3, items:[
      { title:'DNB Cardiology', desc:'2 seats per year (3-year programme) for MD/DNB General Medicine or Paediatrics candidates, via NBE centralised super-specialty counselling.', link:{ label:'DNB Programmes', page:'dnb' } },
      { title:'Fellowship in Interventional Cardiology', desc:'A 12-month RGUHS fellowship for post-DM/DNB cardiologists, with a stipend of ₹1,00,000 per month.', link:{ label:'Fellowships', page:'fellowship' } },
      { title:'MSc Echocardiography & BSc Cardiac Care', desc:'Allied-health programmes in echocardiography and cardiac care technology run with the College of Nursing and Allied Health.', link:{ label:'Allied Health', page:'nursing-and-allied-health' } }
    ] }
  ]
};

// ── CARDIAC SURGERY (CTVS) ───────────────────────────────────────────────────
PAGES['ctvs-faculty'] = {
  title:'Faculty — Cardiac Surgery', crumb:'Departments · Cardiac Surgery · Faculty', subnav:'cardiac-surgery',
  subtitle:'The cardiothoracic and vascular surgery team.',
  sections:[
    { type:'faculty', eyebrow:'Core Faculty', title:'Consultants', cols:3, items:[
      { name:'Dr. Chittaranjan S J', role:'Sr. Consultant & Head of Department' },
      { name:'Dr. Giridhar Kamalapurkar', role:'Sr. Consultant' },
      { name:'Dr. Gautham Shetty', role:'Consultant' }
    ] }
  ]
};

PAGES['ctvs-infrastructure'] = {
  title:'Infrastructure — Cardiac Surgery', crumb:'Departments · Cardiac Surgery · Infrastructure', subnav:'cardiac-surgery',
  subtitle:'Theatres, intensive care and perfusion services for open and closed-heart surgery.',
  sections:[
    { type:'cards', eyebrow:'Facilities', title:'Surgical Infrastructure', cols:3, items:[
      { title:'Modular Operation Theatres', desc:'Cardiac operation theatres within the Institute\'s 12 modular OT complex, supporting over 30,800 cardiac surgeries since 2001.' },
      { title:'Cardiac ICUs', desc:'Dedicated post-operative cardiac intensive care with round-the-clock consultant cover, part of the hospital\'s 6 ICUs.' },
      { title:'Perfusion Services', desc:'In-house perfusion team and heart-lung machines for adult and paediatric cardiopulmonary bypass — roughly a third of the surgical volume is paediatric.' }
    ] },
    { type:'stats', eyebrow:'Scale', title:'CTVS in Numbers', alt:true, items:[
      { v:'30,837', l:'Cardiac Surgeries Since 2001' },
      { v:'~1/3', l:'Paediatric Share of Case-Mix' },
      { v:'12', l:'Modular Operation Theatres on Campus' }
    ] }
  ]
};

PAGES['ctvs-academics'] = {
  title:'Academics — Cardiac Surgery', crumb:'Departments · Cardiac Surgery · Academics', subnav:'cardiac-surgery',
  subtitle:'Surgical training in the spirit of seva.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Courses Offered', cols:3, items:[
      { title:'DNB Cardiothoracic Surgery', desc:'A 6-year super-specialty programme (1 seat) accredited by the National Board of Examinations — entirely free of cost.', link:{ label:'DNB Programmes', page:'dnb' } },
      { title:'Fellowship in Paediatric Cardiac Surgery', desc:'Advanced fellowship training for qualified cardiac surgeons in the high-volume paediatric programme.', link:{ label:'Fellowships', page:'fellowship' } },
      { title:'BSc Perfusion Technology', desc:'Allied-health degree in perfusion technology run with the College of Nursing and Allied Health.', link:{ label:'Allied Health', page:'nursing-and-allied-health' } },
      { title:'CTVS Blog', desc:'Department news, case highlights and announcements on the live site.', link:{ label:'Open Blog', href:'/ctvs-blog/' } }
    ] }
  ]
};

// ── NEUROSURGERY (NESU) ──────────────────────────────────────────────────────
PAGES['nesu-faculty'] = {
  title:'Faculty — Neurosurgery', crumb:'Departments · Neurosurgery · Faculty', subnav:'neurosurgery',
  subtitle:'One of the finest neurosurgical teams in the country.',
  sections:[
    { type:'faculty', eyebrow:'Core Faculty', title:'Consultants', cols:3, items:[
      { name:'Dr. Saritha Aryan', role:'MCh — Senior Consultant & I/C HOD' },
      { name:'Dr. Sumit Thakar', role:'MCh — Senior Consultant' },
      { name:'Dr. Sanjay H M', role:'MCh — Jr. Consultant' },
      { name:'Dr. Sauradeep Sarkar', role:'MCh — Jr. Consultant' }
    ] },
    { type:'faculty', eyebrow:'Visiting Faculty', title:'International Visiting Consultants', cols:3, alt:true, items:[
      { name:'Dr. Anil Nanda', role:'Visiting Consultant, USA' },
      { name:'Dr. Ravi Goyal', role:'Visiting Consultant, USA' }
    ] }
  ]
};

PAGES['nesu-infrastructure'] = {
  title:'Infrastructure — Neurosurgery', crumb:'Departments · Neurosurgery · Infrastructure', subnav:'neurosurgery',
  subtitle:'A 158-bed neurosciences facility with round-the-clock emergency services.',
  sections:[
    { type:'cards', eyebrow:'Facilities', title:'Neurosciences Infrastructure', cols:3, items:[
      { title:'Inpatient Facility', desc:'A 158-bed inpatient facility for the neurosciences, including a 38-bed intensive care unit for both critical care and post-operative patients.' },
      { title:'Operating Rooms', desc:'Four modern neurosurgery operating rooms with dedicated neuro-anaesthesia services.' },
      { title:'24-Hour Emergency', desc:'Round-the-clock emergency services for head injury, stroke and acute neurosurgical conditions.' },
      { title:'Imaging', desc:'Siemens MAGNETOM Aera 1.5T MRI, GE HD 750 128-slice CT scanner and a Siemens bi-plane neuro catheterisation lab.' },
      { title:'Neuro Cath Lab', desc:'Bi-plane digital subtraction angiography for diagnostic and interventional neuro-vascular procedures.' },
      { title:'Telemedicine', desc:'Neurology and neurosurgery tele-consultations to nodal centres in West Bengal and Odisha.' }
    ] },
    { type:'stats', eyebrow:'Scale', title:'Neurosurgery in Numbers', alt:true, items:[
      { v:'41,185', l:'Neurosurgical Procedures Since 2001' },
      { v:'158', l:'Neurosciences Beds' },
      { v:'38', l:'ICU Beds' }
    ] }
  ]
};

PAGES['nesu-achievements'] = {
  title:'Achievements — Neurosurgery', crumb:'Departments · Neurosurgery · Achievements', subnav:'neurosurgery',
  subtitle:'A national referral centre for complex neurosurgical disease.',
  sections:[
    { type:'cards', eyebrow:'Recognition', title:'Standing & Contributions', cols:3, items:[
      { title:'National Referral Centre', desc:'Considered one of the best neuroscience services in the country — patients come from all parts of India and abroad seeking second opinions and surgery for complex disease.' },
      { title:'Research & Publications', desc:'Faculty publish regularly in reputed neurosurgical journals and participate in national and international academic forums.' },
      { title:'Training Legacy', desc:'The 6-year DNB Neurosurgery programme has trained surgeons who now serve across India — with all training given free of cost.' }
    ] }
  ]
};

PAGES['nesu-events'] = {
  title:'Events — Neurosurgery', crumb:'Departments · Neurosurgery · Events', subnav:'neurosurgery',
  subtitle:'CMEs, workshops and academic meetings of the neurosciences.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Academic Events', cols:3, items:[
      { badge:'CME', title:'Continuing Medical Education', desc:'Regular CME programmes on stroke care and the neurosciences, hosted in the hospital\'s Dhanvantari Hall.' },
      { badge:'Weekly', title:'Case Conferences', desc:'Joint neurology–neurosurgery–radiology case conferences and teaching rounds for consultants and DNB trainees.' },
      { badge:'Visiting', title:'International Teaching Visits', desc:'Operative workshops and lectures during visits by international faculty.' },
      { badge:'Blog', title:'Neurosurgery Blog', desc:'Department news, case highlights and announcements on the live site.', link:{ label:'Open Blog', href:'/neurosurgery-blog/' } }
    ] },
        { type:'intro', eyebrow:"From the Record", title:"Events in Detail", body:[
        "Venue: Dhanvantari Hall, Ground floor, Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Bengaluru.",
        "Residents and Practicing clinicians in the specialties of:",
        "This CME is NOT virtual and all delegates are to attend in-person.",
        "No Registration fee for the CME.",
        "500 is being charged for meeting essential / incidental expenses and overheads.",
        "We are applying for KMC credits for this CME.",
        "Please ensure you enter the details in the form correctly since the same will be printed on the participation certificate issued at the end of the CME.",
        "This page will be updated as and when we have further information.",
        "Accommodation, if required, to be arranged by delegates.",
        "2 KMC Credits have been awarded for the CME and will be given to those who have registered by the due date (25-Apr-2022).",
        "Delegates who are still interested and would like to participate without KMC credits can register by Wednesday, 04-May-2022.",
      ] },
    ]
};

PAGES['nesu-academics'] = {
  title:'Academics — Neurosurgery', crumb:'Departments · Neurosurgery · Academics', subnav:'neurosurgery',
  subtitle:'Six years of rigorous, free neurosurgical training.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Courses Offered', cols:3, items:[
      { title:'DNB Neurosurgery', desc:'A 6-year super-specialty programme (1 seat) accredited by the National Board of Examinations, admitted via NBE centralised counselling.', link:{ label:'DNB Programmes', page:'dnb' } },
      { title:'Clinical Observerships', desc:'Short-term observerships for qualified neurosurgeons; interested candidates may write to the academic office.', link:{ label:'Contact Academics', page:'academics' } }
    ] }
  ]
};

// ── NEUROLOGY ────────────────────────────────────────────────────────────────
PAGES['neurology-services'] = {
  title:'Services — Neurology', crumb:'Departments · Neurology · Services', subnav:'neurology',
  subtitle:'Diagnosis and management of the full breadth of neurological disease.',
  sections:[
    { type:'cards', eyebrow:'Clinical Services', title:'Conditions We Treat', cols:3, items:[
      { title:'Stroke & Vascular Disease', desc:'Acute stroke evaluation and management with round-the-clock imaging and critical-care support.' },
      { title:'Epilepsy & Seizure Disorders', desc:'EEG-supported diagnosis and long-term medical management of epilepsy.' },
      { title:'Peripheral Neuropathies', desc:'ENMG, nerve-conduction studies and nerve biopsies for diagnosis, including Guillain-Barré syndrome.' },
      { title:'Neuromuscular Diseases', desc:'Investigated by ENMG and muscle biopsy, with ongoing medical management.' },
      { title:'Spinal Cord Diseases', desc:'Medical management, with surgical cases referred to the sister department of Neurosurgery.' },
      { title:'Tumours of the Nervous System', desc:'Diagnosis in Neurology; once confirmed, definitive care is undertaken by Neurosurgery.' }
    ] },
        { type:'features', eyebrow:"Services", title:"Neurology Services", items:[
        "Neurological conditions evaluated and treated routinely at SSSIHMS include the following:",
        "Face, Head and Neck pain: These patients are generally managed on OPD basis.",
        "Epilepsy and related conditions: These patients are investigated as required and treatment instituted.",
        "Some patients depending upon their condition are admitted as part of their management.",
        "Fits, black outs, jerks and faints",
        "Cerebrovascular diseases : Acute cases are admitted and managed with anti-coagulants and physiotherapy.",
        "Chronic cases are evaluated as required.",
        "Infections of the CNS.: These patients are managed following diagnosis of the infections based on Lumbar puncture and other investigations with admission and institution of appropriate anti-microbial therapy.",
        "Parkinson’s Disease and movement and ataxic disorders : These patients are seen on an OPD basis and treatment is instituted and optimized as required.",
        "ALS and Other Motor Neuron Diseases : ENMG and conduction studies are used to reach a definitive diagnosis in these patients.",
        "Trigeminal Neuralgia, Bell’s Palsy, and Other Cranial Nerve Disorders: Are investigated and treated appropriately.",
        "Spinal Cord Diseases: When surgical intervention is required then the patients are reffered to the sister dept of neurosurgery.",
        "Peripheral Neuropathies including Guillain-Barre´ Syndrome: ENMG, NCV and Nerve biopsies are conducted for diagnosis.",
        "Neuromuscular diseases: These are investigated by ENMG and Muscle biopsy.",
        "Tumors of the Nervous System: These once diagnosed are dealt by the Neurosurgery department.",
        "Psychiatric disorders and Mental health problems: Psychiatric problems when secondary to neurological disorders if diagnosed are treated in-house by a Consultant Psychiatrist.",
        "Swami blessing Neuro Patient Swami blessing a patient Swami blessing a small child Swami Blessing a child after Neurosurgery",
      ] },
    ]
};

PAGES['neurology-infrastructure'] = {
  title:'Infrastructure — Neurology', crumb:'Departments · Neurology · Infrastructure', subnav:'neurology',
  subtitle:'Well-equipped facilities for neurological diagnosis and care.',
  sections:[
    { type:'cards', eyebrow:'Facilities', title:'Diagnostic Infrastructure', cols:3, items:[
      { title:'Neurophysiology Lab', desc:'EEG, ENMG and nerve-conduction studies supporting the outpatient and inpatient services.' },
      { title:'Imaging Access', desc:'Siemens MAGNETOM Aera 1.5T MRI and GE HD 750 CT on campus, with a bi-plane neuro cath lab for vascular studies.' },
      { title:'Shared Neurosciences Facility', desc:'Part of the 158-bed neurosciences complex with a 38-bed ICU, shared with Neurosurgery.' }
    ] }
  ]
};

// ── ANESTHESIOLOGY ───────────────────────────────────────────────────────────
PAGES['anes-faculty'] = {
  title:'Faculty — Anesthesiology', crumb:'Departments · Anesthesiology · Faculty', subnav:'anesthesiology',
  subtitle:'The team behind every safe surgery and intensive-care stay.',
  sections:[
    { type:'faculty', eyebrow:'Core Faculty', title:'Consultants', cols:3, items:[
      { name:'Dr. Geetanjali Tulapurkar', role:'HOD & Sr. Consultant (MBBS, DNB)' },
      { name:'Dr. Anitha Diwakar', role:'Sr. Consultant (MD, FNB Cardiac Anesthesia)' },
      { name:'Dr. Kolli S Chalam', role:'Sr. Consultant (MD, PDCC Cardiac & Neuro)' },
      { name:'Dr. Vrushali Choudhary', role:'Additional Sr. Consultant (DNB)' },
      { name:'Dr. Anuradha Kamath', role:'Consultant (DNB DA PDFCA FTEE)' }
    ] },
    { type:'intro', eyebrow:'The Wider Team', title:'Residents, Technicians & Visiting Faculty', narrow:true, alt:true,
      body:[
        'The department is supported by 4 senior residents, 6 junior residents, 7 anaesthesia technicians and 28 BSc Anesthesia Technology students, along with 12 overseas visiting consultants from institutions including Baylor, Cornell and the University of Pennsylvania.'
      ] }
  ]
};

PAGES['anes-infrastructure'] = {
  title:'Infrastructure — Anesthesiology', crumb:'Departments · Anesthesiology · Infrastructure', subnav:'anesthesiology',
  subtitle:'Round-the-clock anaesthesia and critical-care services across the Institute.',
  sections:[
    { type:'cards', eyebrow:'Facilities', title:'Where We Work', cols:3, items:[
      { title:'12 Modular Operation Theatres', desc:'Anaesthesia services for cardiac, neuro and multi-specialty surgery across all 12 modular OTs.' },
      { title:'6 Intensive Care Units', desc:'Critical-care cover for cardiac, neuro and general ICUs — day and night, year round.' },
      { title:'3 Catheterisation Labs', desc:'Sedation and anaesthesia support for two cardiac cath labs and the bi-plane neuro cath lab.' },
      { title:'Emergency Department', desc:'Airway and resuscitation cover for the 24/7 emergency department.' },
      { title:'CT / MRI Suite', desc:'Anaesthesia for imaging in children and critically ill patients.' },
      { title:'Pain & Peri-operative Care', desc:'Pre-anaesthetic evaluation, post-operative pain management and peri-operative medicine.' }
    ] }
  ]
};

PAGES['anes-achievements'] = {
  title:'Achievements — Anesthesiology', crumb:'Departments · Anesthesiology · Achievements', subnav:'anesthesiology',
  subtitle:'Quiet excellence behind three thousand surgeries a year.',
  sections:[
    { type:'cards', eyebrow:'Recognition', title:'Contributions', cols:3, items:[
      { title:'Cardiac Anaesthesia Fellowship', desc:'An 18-month FNB-level Cardiothoracic & Vascular Anaesthesia fellowship covering ~1,500 cases a year, a third of them paediatric.' },
      { title:'Academic Roles', desc:'Faculty serve as examiners, deliver lectures at national conferences and contribute to research studies and publications.' },
      { title:'Teaching Through Telemedicine', desc:'Online CMEs and DNB teaching sessions conducted through the Sri Sathya Sai Tele-health Network.' }
    ] }
  ]
};

PAGES['anes-events'] = {
  title:'Events — Anesthesiology', crumb:'Departments · Anesthesiology · Events', subnav:'anesthesiology',
  subtitle:'Teaching, training and simulation for safe anaesthesia.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Academic Events', cols:3, items:[
      { badge:'CME', title:'Departmental CMEs', desc:'Continuing education in cardiac and neuro-anaesthesia for residents, technicians and nursing staff.' },
      { badge:'Weekly', title:'Teaching Rounds', desc:'Journal clubs, morbidity reviews and case-based teaching with core and visiting faculty.' },
      { badge:'Visiting', title:'Overseas Faculty Visits', desc:'Teaching visits by the department\'s 12 overseas visiting consultants.' }
    ] },
        { type:'intro', eyebrow:"From the Record", title:"Events in Detail", body:[
        "The Department of Anaesthesiology is privileged to host and conduct various academic and clinical events focused on continuous learning and knowledge exchange in the fields of Anaesthesia and Critical Care.",
        "We humbly invite you to participate in these initiatives.",
        "Registration: To register your participation, please click to fill the online form.",
        "The Department is grateful to have successfully hosted the following educational programs:",
        "Held in association with the Indian Association of Cardiovascular Thoracic Anaesthesiologists.",
        "An update focusing on recent advances and best practices in critical care.",
        "Regional conference that brought together experts and trainees.",
        "Registration was conducted via the form available at: http://goo.gl/forms/6b5qnv9usg",
      ] },
    ]
};

PAGES['anes-academics'] = {
  title:'Academics — Anesthesiology', crumb:'Departments · Anesthesiology · Academics', subnav:'anesthesiology',
  subtitle:'From DNB training to allied-health technology degrees.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Courses Offered', cols:3, items:[
      { title:'DNB Anaesthesiology', desc:'2 seats (3-year) plus 2 post-Diploma seats (2-year), accredited by the National Board of Examinations.', link:{ label:'DNB Programmes', page:'dnb' } },
      { title:'Fellowship in CTV Anaesthesia', desc:'18-month fellowship for MD/DNB anaesthesiologists — 4 OTs, 2 cath labs, 2 ICUs and a CCU; stipend ₹85,000 per month.', link:{ label:'Fellowships', page:'fellowship' } },
      { title:'BSc Anesthesia Technology', desc:'Allied-health degree programme run with the College of Nursing and Allied Health.', link:{ label:'Allied Health', page:'nursing-and-allied-health' } }
    ] }
  ]
};

// ── RADIOLOGY ────────────────────────────────────────────────────────────────
PAGES['radiology-faculty'] = {
  title:'Faculty — Radiology', crumb:'Departments · Radiology · Faculty', subnav:'radiology',
  subtitle:'Imaging expertise across cardiac, neuro and body radiology.',
  sections:[
    { type:'faculty', eyebrow:'Core Faculty', title:'Consultants', cols:3, items:[
      { name:'Dr. Sanjay Vishwamitra', role:'HOD (MBBS, DABR, DABNM) — cardiac, MSK & body imaging' },
      { name:'Dr. Dimpi Sinha', role:'Additional Sr. Consultant (MD) — cardiac, neuro & MSK imaging' },
      { name:'Dr. Shivangi Choraria', role:'Jr. Consultant (MD) — general radiology' }
    ] },
    { type:'intro', eyebrow:'Global Network', title:'Weekly International Teleconferences', narrow:true, alt:true,
      body:[
        'Twelve national and international faculty — from the USA, UK, Australia, Argentina and India — chair weekly teleconference case discussions with the department. Visiting radiologists interested in contributing may write to directorwfd@sssihms.org.in.'
      ] }
  ]
};

PAGES['radiology-infrastructure'] = {
  title:'Infrastructure — Radiology', crumb:'Departments · Radiology · Infrastructure', subnav:'radiology',
  subtitle:'State-of-the-art imaging, free for every patient.',
  sections:[
    { type:'cards', eyebrow:'Equipment', title:'Imaging Infrastructure', cols:3, items:[
      { title:'MRI', desc:'Siemens MAGNETOM Aera 1.5 Tesla MRI for neuro, cardiac and body imaging.' },
      { title:'CT', desc:'GE HD 750 128-slice CT scanner for high-volume diagnostic and cardiac imaging.' },
      { title:'Cath Lab', desc:'Siemens Artis Zee bi-plane catheterisation lab for interventional and neuro-vascular work.' },
      { title:'Digital Radiography & Ultrasound', desc:'High-volume DR and ultrasound services across the outpatient and inpatient departments.' },
      { title:'PACS', desc:'FUJIFILM SYNAPSE PACS (since 2009) shared between Prasanthigram and Whitefield campuses, with wavelet compression.' },
      { title:'Interventional Radiology', desc:'Image-guided diagnostic and therapeutic procedures supporting all clinical departments.' }
    ] }
  ]
};

PAGES['radiology-academics'] = {
  title:'Academics — Radiology', crumb:'Departments · Radiology · Academics', subnav:'radiology',
  subtitle:'Training in imaging science and technology.',
  sections:[
    { type:'cards', eyebrow:'Programmes', title:'Courses Offered', cols:3, items:[
      { title:'SACRED CME', desc:'The department\'s continuing-education programme in radiology, with national and international teaching faculty.' },
      { title:'BSc Medical Imaging Technology', desc:'Allied-health degree in imaging technology run with the College of Nursing and Allied Health.', link:{ label:'Allied Health', page:'nursing-and-allied-health' } }
    ] }
  ]
};

// ── SSSGH ────────────────────────────────────────────────────────────────────
PAGES['history-gh'] = {
  title:'History — General Hospital', crumb:'Departments · SSSGH · History', subnav:'sssgh',
  subtitle:'Five decades of free general medical care in Whitefield.',
  sections:[
    { type:'intro', eyebrow:'Since 1976', title:'A Half-Century of Service', narrow:true,
      body:[
        'The Sri Sathya Sai General Hospital, Whitefield began serving the local community in 1976 — twenty-five years before the super-specialty Institute opened its doors. What started as a modest general hospital has grown into a multi-specialty facility covering ophthalmology, obstetrics & gynaecology, orthopaedics, ENT, general medicine, paediatrics, general surgery and dental care.',
        'Since 1976 the general hospital has performed more than 51,000 multi-specialty surgeries — every one of them free of charge — while its outpatient clinics continue to serve the surrounding communities every day.'
      ] },
    { type:'stats', eyebrow:'Scale', title:'SSSGH in Numbers', alt:true, items:[
      { v:'1976', l:'Year of Establishment' },
      { v:'51,595', l:'Multi-Specialty Surgeries Since 1976' },
      { v:'8+', l:'Clinical Specialties' }
    ] },
    ]
};

// ── SUPPORT SERVICES ─────────────────────────────────────────────────────────
PAGES['lab-infrastructure'] = {
  title:'Lab Infrastructure', crumb:'Services · Lab & Blood Bank', subnav:'lab',
  subtitle:'The laboratory complex behind every diagnosis.',
  sections:[
    { type:'cards', eyebrow:'Laboratory Complex', title:'Sections & Equipment', cols:3, items:[
      { title:'Microbiology', desc:'Safety cabinets with automated bacterial culture (BacT/Alert) and identification & sensitivity testing (Vitek 2).' },
      { title:'Biochemistry', desc:'Fully automated floor-model biochemistry analysers with chemiluminescence (Roche Cobas e411) for hormonal profiles.' },
      { title:'Hematology & Clinical Pathology', desc:'Cell counters, cytospin and coagulation analysers for accurate results with short turnaround times.' },
      { title:'Histopathology', desc:'Microtome and cryotome with special stains and immunohistochemistry antibodies.' },
      { title:'Blood Bank', desc:'In-house blood bank serving the cardiac and neuro specialties as well as the general hospital.' },
      { title:'Laboratory Information System', desc:'Full LIS with equipment interfacing and barcoding, under continuous quality-assurance programmes.' }
    ] },
    ]
};

})();
