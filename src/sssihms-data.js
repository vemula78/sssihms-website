// sssihms-data.jsx — All inner-page content for SSSIHMS Website
// Exports to window: PAGES  (keyed by page id, consumed by ContentPage in sssihms-render.jsx)

const IMG = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/';
const R = (window.__resources || {});
const BUILDING = R.building || 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/04/Website-full-length-image-1.png';
const SWAMI = R.swami || 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2015/05/Swami-with-stethoscope-e1487392181378.jpg';
const ICON = { Cardiology:R.imgCardiology, CTVS:R.imgCTVS, Neurosurgery:R.imgNeurosurgery, Neurology:R.imgNeurology, Anesthesiology:R.imgAnesthesiology, Radiology:R.imgRadiology, DNB:R.imgDNB, Nursing:R.imgNursing };

const FREE_BANNER = { type:'cta', pill:'100% Free, Always', title:'Every Service Here Is Free of Charge',
  body:'No payment, no insurance, no financial barrier — care is given to all with equal love, regardless of caste, creed, religion or means.',
  action:{ label:'For Patients', page:'patients' } };

const NURSING_CTA = { type:'cta', pill:'Admissions Open 2026–27', title:'B.Sc Nursing Programme',
  body:'Apply online by <strong>19th June 2026</strong>. No tuition fees. Fully residential, exclusively for women. 40 seats. Affiliated to RGUHS, Bengaluru.',
  action:{ label:'Apply Now', href:'https://tinyurl.com/sssihmsnc' } };

const PAGES = {

  // ─── ABOUT CLUSTER ──────────────────────────────────────────────────────────
  about: {
    title:'About the Hospital', crumb:'About Hospital',
    subtitle:'A mission of free, compassionate, world-class healthcare — founded in love and sustained by selfless service to all.',
    sections:[
      { type:'intro', eyebrow:'Hospital Overview', title:'World-Class Care. Always Free.',
        image:BUILDING,
        body:[
          'Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), Whitefield, is a tertiary-care super-specialty hospital in Bengaluru, Karnataka, established under the divine inspiration of Bhagawan Sri Sathya Sai Baba.',
          'The mission of the Institute is to provide the highest quality of medical care — completely free of charge — to all patients, irrespective of caste, creed, religion and financial status, in an atmosphere of love and care.',
          'SSSIHMS is accredited by the National Board of Examinations (NBE) and runs a College of Nursing and Allied Health Sciences — with no tuition fees charged.'
        ], pill:'100% Free Medical Care for All' },
      { type:'stats', eyebrow:'Our Impact', title:'Service in Numbers', items:[
        { v:'3,000+', l:'Cardiac & Neuro Surgeries / Year' },
        { v:'1,700+', l:'Multi-Specialty Surgeries / Year' },
        { v:'12', l:'Modular Operation Theatres' },
        { v:'6', l:'Intensive Care Units' },
        { v:'25+', l:'Years of Compassionate Service' },
        { v:'100%', l:'Free Medical Care for All' }
      ], alt:true },
      { type:'quote', eyebrow:'Guiding Philosophy',
        text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. Medicine should not be commercialised. It is meant to promote a heart-to-heart and love-to-love relationship between doctor and patient.',
        attr:'Bhagawan Sri Sathya Sai Baba, 2003' },
      { type:'split', cols:[
        { eyebrow:'Genesis', title:'The Beginning', body:[
          'The hospital was conceived and founded by Bhagawan Sri Sathya Sai Baba as a living embodiment of His teachings on selfless service. It has grown into one of India\'s leading super-specialty hospitals — while remaining completely free for every patient who walks through its doors.'
        ], link:{ label:'Read the Genesis', page:'genesis' } },
        { eyebrow:'About the Trust', title:'Sri Sathya Sai Central Trust', body:[
          'SSSIHMS operates under the Sri Sathya Sai Central Trust, which oversees a wide range of educational, medical and service institutions established by Bhagawan Sri Sathya Sai Baba — serving millions across India and the world.'
        ], link:{ label:'Visit the Trust', href:'https://srisathyasai.org.in' } }
      ], alt:true }
    ]
  },

  philosophy: {
    title:'Guiding Philosophy', crumb:'Guiding Philosophy',
    subtitle:'The spirit that shapes every decision, every treatment, and every interaction at SSSIHMS.',
    sections:[
      { type:'quote', eyebrow:'The Foundation',
        text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. As man is the embodiment of God, it is his primary duty to help the destitute and the forlorn. Medicine should not be commercialised. It is meant to promote a heart-to-heart and love-to-love relationship between doctor and patient. A true doctor is one who realises this truth and conducts himself accordingly.',
        attr:'Bhagawan Sri Sathya Sai Baba, 2003' },
      { type:'intro', eyebrow:'Healthcare as Worship', title:'Medicine in the Spirit of Love',
        body:[
          'At SSSIHMS, healthcare is not a transaction — it is an act of love. The conviction that service to man is service to God informs everything: the warmth at the registration desk, the unhurried attention of the consulting physician, the dignity afforded to every patient regardless of their station in life.',
          'No bill is ever raised. No patient is ever turned away for want of means. The poorest villager and the most privileged citizen receive identical care, given with identical love.'
        ], narrow:true },
      { type:'features', eyebrow:'Our Principles', title:'What We Hold Sacred', items:[
        'Care given completely free of charge — to every patient, without exception',
        'Equal dignity and attention regardless of caste, creed, religion or means',
        'The highest standards of clinical excellence and ethical practice',
        'Compassion as the first instrument of healing',
        'Service rendered as worship, not as commerce',
        'A culture of love that extends from doctor to patient to family'
      ], alt:true }
    ]
  },

  genesis: {
    title:'Genesis', crumb:'Genesis',
    subtitle:'How a vision of love became one of India\'s foremost free super-specialty hospitals.',
    sections:[
      { type:'intro', eyebrow:'The Origin', title:'Born of a Vision', image:BUILDING,
        body:[
          'SSSIHMS Whitefield was founded as a direct expression of Bhagawan Sri Sathya Sai Baba\'s conviction that the most advanced medical care should be available to all — and that ability to pay should never decide who lives and who suffers.',
          'From its inauguration, the hospital was conceived as a place where super-specialty tertiary care — cardiac surgery, neurosurgery, cardiology, neurology and more — would be delivered entirely free of charge.',
          'What began as an audacious act of faith has matured into an institution that performs thousands of complex surgeries every year, trains the next generation of doctors and nurses, and continues to turn no one away.'
        ] },
      { type:'quote',
        text:'Let different faiths exist, let them flourish, let the glory of God be sung in all languages and a variety of tunes. Respect the differences between the faiths and recognise them as valid as long as they do not extinguish the flame of unity.',
        attr:'Bhagawan Sri Sathya Sai Baba' },
      { type:'split', alt:true, cols:[
        { eyebrow:'Then', title:'A Promise Made', body:[
          'The Institute opened its doors with a singular promise: world-class medicine, free of cost, given in an atmosphere of love. That promise has never been broken.'
        ] },
        { eyebrow:'Now', title:'A Promise Kept', body:[
          'Today SSSIHMS stands among the leading centres in the country for cardiac and neuro sciences, with 12 modular operation theatres, 6 ICUs and three catheterisation labs — all serving patients at no charge.'
        ] }
      ] }
    ]
  },

  statistics: {
    title:'Statistics', crumb:'Statistics',
    subtitle:'Decades of compassionate, free healthcare — measured in lives touched.',
    sections:[
      { type:'stats', eyebrow:'By the Numbers', title:'Service at Scale', items:[
        { v:'3,000+', l:'Cardiac & Neuro Surgeries / Year' },
        { v:'1,700+', l:'Multi-Specialty Surgeries / Year' },
        { v:'12', l:'Modular Operation Theatres (8 + 4)' },
        { v:'6', l:'Intensive Care Units' },
        { v:'3', l:'Catheterisation Labs' },
        { v:'24×7', l:'Emergency & Critical Care' }
      ] },
      { type:'intro', eyebrow:'Context', title:'Every Number Is a Life',
        body:[
          'Behind every figure is a patient who received life-saving care without being asked to pay. The catheterisation labs include two cardiac cath labs and one bi-plane neuro cath lab. The operation theatres, intensive care units, emergency department and CT/MRI suite operate around the clock.',
          'These services are sustained entirely through the Sri Sathya Sai Central Trust and the dedication of doctors, nurses, technicians and volunteers who serve in the spirit of love.'
        ], narrow:true, alt:true }
    ]
  },

  'patient-speak': {
    title:'Patient Speak', crumb:'Patient Speak',
    subtitle:'In the words of those who came as patients — and left as family.',
    sections:[
      { type:'testimonials', eyebrow:'Voices of Healing', title:'Stories of Care', items:[
        { quote:'My child underwent heart surgery here and we were never asked for a single rupee. The doctors treated us like their own family.', name:'Parent of a young patient', place:'Karnataka' },
        { quote:'I travelled from far away with little hope and no money. Here I found not just treatment, but love and respect I had never known in a hospital.', name:'A cardiac patient', place:'Andhra Pradesh' },
        { quote:'The nurses cared for my father day and night. The atmosphere is unlike any hospital — it feels like a temple of healing.', name:'Family of a patient', place:'Tamil Nadu' }
      ] },
      FREE_BANNER
    ]
  },

  'visitor-speak': {
    title:'Visitor Speak', crumb:'Visitor Speak',
    subtitle:'Reflections from those who have walked through our doors as guests and observers.',
    sections:[
      { type:'testimonials', eyebrow:'Impressions', title:'What Visitors See', items:[
        { quote:'I expected a hospital. I found a sanctuary — spotless, serene, and filled with a quiet spirit of service.', name:'A visiting physician' },
        { quote:'That such advanced care is given entirely free, with such dignity, is something every healthcare system in the world should witness.', name:'An international guest' },
        { quote:'The calm and cleanliness of the wards, and the kindness of the staff, left a lasting impression on me.', name:'A community volunteer' }
      ] },
      { type:'intro', eyebrow:'Come and See', title:'Visiting SSSIHMS',
        body:[
          'Guests, well-wishers and medical professionals are welcome to learn about the work of the Institute. For visits, group tours or media enquiries, please reach our help desk.'
        ], narrow:true, alt:true, link:{ label:'Contact the Help Desk', page:'helpdesk' } }
    ]
  },

  // ─── DEPARTMENTS CLUSTER ────────────────────────────────────────────────────
  departments: {
    title:'Clinical Departments', crumb:'Departments',
    subtitle:'Every service — from outpatient consultation to the most complex surgery — provided entirely free of charge.',
    sections:[
      { type:'cards', eyebrow:'Super Specialties', title:'Tertiary & Super-Specialty Care',
        sub:'World-class care in the most demanding disciplines, completely free of cost.', items:[
          { icon:'❤', title:'Cardiology', desc:'The full gamut of cardiac services — outpatient, inpatient and critical care — among the leading national centres for adult and paediatric interventions.', link:{ label:'Cardiology', page:'cardiology' } },
          { icon:'✚', title:'Cardiac Surgery', desc:'The complete range of invasive and minimally invasive cardiothoracic and vascular surgery for adults and children.', link:{ label:'Cardiac Surgery', page:'cardiac-surgery' } },
          { icon:'◆', title:'Neurosurgery', desc:'Among the finest neuroscience services in the country — complex cases referred from across India and abroad.', link:{ label:'Neurosurgery', page:'neurosurgery' } },
          { icon:'◇', title:'Neurology', desc:'A well-equipped centre with the latest facilities for the full breadth of neurological conditions.', link:{ label:'Neurology', page:'neurology' } },
          { icon:'✦', title:'Anesthesiology', desc:'Serving 12 modular OTs, 6 ICUs, 3 cath labs, emergency department and CT/MRI suite — round the clock.', link:{ label:'Anesthesiology', page:'anesthesiology' } },
          { icon:'⬡', title:'Radiology', desc:'Expert diagnostic and interventional imaging — X-ray, ultrasound, CT, MRI, DSA — using state-of-the-art technology.', link:{ label:'Radiology', page:'radiology' } }
        ] },
      { type:'intro', eyebrow:'Sri Sathya Sai General Hospital', title:'Multi-Specialty General Hospital', alt:true,
        body:[
          'Alongside the super-specialty Institute, the Sri Sathya Sai General Hospital provides comprehensive multi-specialty care — ophthalmology, obstetrics & gynaecology, orthopaedics, ENT, general medicine, paediatrics, general surgery and dental — all entirely free of charge.'
        ], link:{ label:'General Hospital (SSSGH)', page:'sssgh' } }
    ]
  },

  cardiology: {
    title:'Cardiology', crumb:'Departments · Cardiology', icon:ICON.Cardiology,
    subtitle:'A comprehensive range of services — outpatient, inpatient and critical care — all offered completely free of charge.',
    sections:[
      { type:'intro', eyebrow:'Overview', title:'A Leading National Cardiac Centre',
        body:[
          'The Department of Cardiology at SSSIHMS, Bangalore provides a comprehensive range of services including outpatient, inpatient and critical care, all offered completely free of charge. Renowned as one of the leading national institutions, it performs an extensive variety of adult and paediatric cardiac interventions.',
          'The department distinguishes itself through state-of-the-art diagnostic and interventional procedures, ensuring a high degree of clinical excellence. A broad spectrum of clinical conditions provides valuable academic exposure to practitioners and trainees, with particular emphasis on individual attention and a customised evaluation for every patient.'
        ], pill:'Free Cardiac Care' },
      { type:'stats', eyebrow:'Outpatient Services & Interventions', title:'Care at Scale', alt:true, items:[
        { v:'50,000+', l:'OPD Patients Served / Year' },
        { v:'2,800', l:'Cathlab Interventional Procedures / Year' },
        { v:'36', l:'Beds in the Cardiac Care Unit' },
        { v:'2', l:'Cathlabs (expandable to 4)' }
      ] },
      { type:'features', eyebrow:'Cathlab-Based Procedures', title:'Interventional Capabilities', items:[
        'Mitral Valvuloplasty',
        'Coronary Angioplasty',
        'Congenital Interventions',
        'Electrophysiology Studies',
        'Radiofrequency Ablation',
        'Pacemaker Implantation',
        'ICD (Implantable Cardioverter Defibrillator) Implantation',
        'Device Closure Procedures',
        'Balloon Valvuloplasty',
        'Congenital Device Closures',
        'Arrhythmia Device Implantations'
      ] },
      { type:'features', eyebrow:'Unique Features', title:'What Sets Us Apart', alt:true, items:[
        'Treatment plans decided purely on clinical need — never on the patient\u2019s financial situation',
        'Cross-departmental collaboration with Radiology for Cardiac CT and MRI',
        'Advanced non-invasive work in 3D and 4D echocardiography, including ventricular and atrial strain studies',
        'High volumes of valvuloplasty, notably mitral valvuloplasty requiring septal puncture',
        'Expertise in less common procedures — alcohol septal ablation, VSD & RSoV closure, APW transcatheter closure, TAVR/EVAR and CRT implantation',
        'A recognised centre of excellence for postgraduate and doctoral training in cardiology'
      ] },
      { type:'cards', eyebrow:'Infrastructure', title:'World-Class Equipment', cols:3, items:[
        { title:'Cardiology OPD', desc:'Two GE Vivid E95 and one Philips EPIQ CVx ultrasound machines with AI capabilities, two GE treadmill stress systems, biphasic defibrillators, 7-day Holter recording and digital ECG — all DICOM-compliant.' },
        { title:'Cathlab Facilities', desc:'A Siemens Biplane Cathlab and a Philips FD10C Monoplane Cathlab with hemodynamic systems, Rotablator, IVUS and EnSite 3D mapping — fully equipped with defibrillators, ventilators and intra-aortic balloon pumps.' },
        { title:'Cardiac Care Unit', desc:'A 36-bed CCU with advanced patient monitors, echocardiography, ventilators, intra-aortic balloon pumps, defibrillators, portable X-ray and infusion pumps.' }
      ] },
      { type:'cards', eyebrow:'Academics & Research', title:'A Legacy of Distinction', cols:3, items:[
        { title:'Five DrNB Gold Medalists', desc:'The department has produced five Gold Medalists in the DrNB Cardiology programme between 2005 and 2018.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'National & International Awards', desc:'Best Oral Abstract, Poster and Original Research Awards at CSI conferences (2013\u20132025); the Modi Mundi and Prof. D.P. Basu Memorial Awards; presentations at ACC, SCAI and the Asian Society of Clinical Cardiology.' },
        { title:'Active Research', desc:'National clinical trials with AIIMS and others, plus institution-led studies including COLSAI, SAIMITRA and PROMESA, and ML-guided predictive models in cardiology.' }
      ] },
      FREE_BANNER
    ]
  },

  'cardiac-surgery': {
    title:'Cardiac Surgery', crumb:'Departments · Cardiac Surgery', icon:ICON.CTVS,
    subtitle:'The complete range of cardiothoracic and vascular surgical procedures for adults and children — guided by compassion, given free of charge.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Cardiothoracic & Vascular Surgery',
        body:[
          'The Department of Cardiothoracic and Vascular Surgery offers a comprehensive range of cardiac surgical procedures, guided by the principles of compassion and excellence and performed in the spirit of selfless service to humanity — entirely free of cost.',
          'Cardiac surgery here includes both open-heart procedures, which use a heart-lung machine, and closed-heart procedures performed without one. The department\u2019s expertise across both ensures that every patient receives the best possible care.'
        ], pill:'Free Cardiac Surgery' },
      { type:'features', eyebrow:'Open-Heart Surgery', title:'Common Open-Heart Procedures', alt:true, items:[
        'Coronary artery bypass — mostly off-pump (OPCAB), without a heart-lung machine',
        'Valve replacement, with repair accomplished whenever feasible',
        'Aortic aneurysm repair using valve conduits or grafts as indicated',
        'Correction of congenital heart defects'
      ] },
      { type:'features', eyebrow:'Closed-Heart Surgery', title:'Common Closed-Heart Procedures', items:[
        'PDA ligation',
        'Bi-Directional Glenn',
        'Blalock-Taussig (BT) shunt',
        'Coarctation of aorta repair'
      ] },
      { type:'cards', eyebrow:'Specific Procedures', title:'A Comprehensive Surgical Repertoire',
        sub:'The department performs a wide range of specific cardiac and thoracic procedures, including:', alt:true, cols:3, items:[
          { title:'ALCAPA Repair', desc:'A rare anomaly where the left coronary artery arises from the pulmonary artery; it is re-implanted into the ascending aorta.' },
          { title:'Aortic Root Replacement', desc:'Aortic valve and ascending aorta replaced with an artificial valve and graft, with the coronary buttons re-implanted.' },
          { title:'AP Window Closure', desc:'A communication between the ascending aorta and pulmonary artery closed with a prosthetic or pericardial patch.' },
          { title:'ASD Closure', desc:'A defect in the septum between the left and right atria closed surgically with a pericardial patch.' },
          { title:'AV Canal Repair', desc:'A complex defect: the two incompletely formed valves are repaired and the deficient atrial/ventricular septa reconstituted.' },
          { title:'AVR', desc:'Aortic Valve Replacement with a mechanical or bio-prosthetic (tissue) valve.' },
          { title:'BD Glenn', desc:'Improves blood flow to the lungs by connecting the superior vena cava to the right pulmonary artery.' },
          { title:'Modified BT Shunt', desc:'A palliative procedure for cyanotic defects (commonly Tetralogy of Fallot), connecting the subclavian to the pulmonary artery with a graft.' },
          { title:'CABG', desc:'Coronary Artery Bypass Graft — blocked coronary arteries bypassed using conduits from elsewhere in the body, often off-pump.' },
          { title:'CoA Repair', desc:'A narrowed segment of the aorta is removed and the ends rejoined directly or bridged with a prosthetic graft.' },
          { title:'Cor Triatriatum Repair', desc:'An abnormal membrane dividing the left atrium into two chambers is surgically removed.' },
          { title:'DCRV Repair', desc:'Abnormal obstructing muscle bundles inside the right ventricle are surgically removed.' },
          { title:'DORV Repair', desc:'In double-outlet right ventricle, the VSD is closed so the left ventricle pumps to the aorta and the right to the pulmonary artery.' },
          { title:'Fontan', desc:'For single-ventricle hearts, systemic venous return is routed directly to the pulmonary circulation.' },
          { title:'Lung Resection', desc:'Removal of tumours and cysts in the lungs.' },
          { title:'MV Repair', desc:'Surgical repair of the mitral valve.' },
          { title:'MVR', desc:'Mitral Valve Replacement with a mechanical or bio-prosthetic (tissue) valve.' },
          { title:'Myxoma Excision', desc:'Excision of a myxoma — a connective-tissue tumour usually found in the heart chambers.' },
          { title:'PAPVC Repair', desc:'Misrouted pulmonary veins re-routed to the left atrium, with closure of the associated ASD.' },
          { title:'PDA Ligation / Division', desc:'The patent ductus arteriosus, a connection between the pulmonary artery and aorta, is tied off or divided.' },
          { title:'Pericardiectomy', desc:'For constrictive pericarditis, the adhered pericardium is surgically removed.' },
          { title:'RSOV Repair', desc:'Closure of a ruptured sinus of Valsalva into a right-sided heart chamber.' },
          { title:'SAM Excision', desc:'Excision of an obstructing sub-aortic membrane below the aortic valve.' },
          { title:'Supravalvular Aortic Stenosis', desc:'Surgical repair of severe narrowing above the aortic valve in the ascending aorta.' },
          { title:'TAPVC Repair', desc:'All pulmonary veins, draining abnormally into the right atrium, are re-routed to the left atrium.' },
          { title:'TGA', desc:'Transposition correction via atrial-level (Senning, Mustard) or arterial-switch (Jatene) operations with coronary transfer.' },
          { title:'Thymectomy', desc:'Excision of the thymus gland for myasthenia gravis or thymic tumours.' },
          { title:'TOF Repair', desc:'For Tetralogy of Fallot, the VSD is closed and the right ventricular outflow tract reconstructed.' },
          { title:'VSD Closure', desc:'Surgical closure of an abnormal opening in the septum between the left and right ventricles.' }
        ] },
      { type:'cards', eyebrow:'Academics', title:'Training in Cardiac Surgery', cols:3, items:[
        { title:'DNB Cardiac Surgery', desc:'A 6-year residency accredited by the NBE since 2002 — two years of general surgery and allied specialties, then three years of cardiovascular and thoracic specialties.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'Fellowship', desc:'Fellowship in Paediatric Cardiac Surgery.', link:{ label:'Fellowships', page:'fellowship' } },
        { title:'BSc Perfusion Technology', desc:'Allied health programme training perfusionists for cardiac surgery.', link:{ label:'Nursing & Allied Health', page:'nursing' } }
      ] },
      FREE_BANNER
    ]
  },

  neurosurgery: {
    title:'Neurosurgery', crumb:'Departments · Neurosurgery', icon:ICON.Neurosurgery,
    subtitle:'Considered one of the finest neuroscience services in the country — all care given free of charge.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Advanced Neurosciences',
        body:[
          'The Department of Neurosurgery is considered one of the best neuroscience services in the country. Patients come here from all parts of India and abroad seeking a second opinion for their neurological problem or surgery for a complex disease.',
          'Equipped with a bi-plane neuro catheterisation lab, dedicated neuro ICU and advanced imaging, the department manages the most demanding cranial and spinal cases — at no cost to the patient.'
        ], pill:'Free Neurosurgical Care' },
      { type:'features', eyebrow:'Services', title:'Clinical Scope', alt:true, items:[
        'Neuro-oncology & complex tumour surgery',
        'Cerebrovascular & endovascular neurosurgery',
        'Skull base & micro-neurosurgery',
        'Spinal surgery — degenerative & traumatic',
        'Paediatric neurosurgery',
        'Neuro intensive care'
      ] },
      { type:'cards', eyebrow:'Academics & Research', title:'Education in Neurosurgery', cols:2, items:[
        { title:'DNB Neurosurgery', desc:'Super-specialty training accredited by the National Board of Examinations.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'Research & Achievements', desc:'Faculty publish in reputed national and international journals across the neurosciences.', link:{ label:'Academics', page:'academics' } }
      ] },
      FREE_BANNER
    ]
  },

  neurology: {
    title:'Neurology', crumb:'Departments · Neurology', icon:ICON.Neurology,
    subtitle:'A well-equipped centre providing the latest facilities for a broad range of neurological ailments.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Comprehensive Neurology',
        body:[
          'SSSIHMS has a well-equipped Centre for Neurology which provides the latest facilities for the treatment of a broad range of neurological ailments.',
          'The department is manned by a consultant neurologist and a team of resident doctors, besides the technical and ancillary staff — working closely with neurosurgery, radiology and critical care to deliver complete neurological care, free of charge.'
        ], pill:'Free Neurology Care' },
      { type:'features', eyebrow:'Services', title:'Conditions We Treat', alt:true, items:[
        'Stroke & cerebrovascular disease',
        'Epilepsy & seizure disorders',
        'Movement disorders',
        'Neuromuscular disorders',
        'Headache & demyelinating disease',
        'Neuro-diagnostics — EEG, EMG, evoked potentials'
      ] },
      FREE_BANNER
    ]
  },

  anesthesiology: {
    title:'Anesthesiology', crumb:'Departments · Anesthesiology', icon:ICON.Anesthesiology,
    subtitle:'The backbone of surgical and critical care — serving theatres, ICUs and cath labs round the clock.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Anesthesia & Critical Care',
        body:[
          'The anaesthesia services cater to 8 + 4 modular operation theatres, 6 intensive care units, 3 catheterisation labs (two cardiac cath labs and one bi-plane neuro cath lab), the emergency (casualty) department and the CT/MRI suite.',
          'The total number of surgeries carried out per annum is approximately 3,000 cardiac and neuro surgeries and 1,700 multi-specialty surgeries — supported by a dedicated cardiac anesthesia team.'
        ], pill:'24×7 Anesthesia & Critical Care' },
      { type:'stats', eyebrow:'Coverage', title:'Round-the-Clock Support', alt:true, items:[
        { v:'12', l:'Modular Operation Theatres (8 + 4)' },
        { v:'6', l:'Intensive Care Units' },
        { v:'3', l:'Catheterisation Labs' },
        { v:'4,700+', l:'Surgeries Supported / Year' }
      ] },
      { type:'cards', eyebrow:'Academics', title:'Training in Anesthesiology', cols:3, items:[
        { title:'DNB Anesthesiology', desc:'Broad-specialty post-graduate training accredited by the NBE.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'Cardiac Anesthesia Fellowship', desc:'Advanced fellowship in cardiac anesthesia.', link:{ label:'Fellowships', page:'fellowship' } },
        { title:'BSc Anesthesia Technology', desc:'Allied health programme for anesthesia technologists.', link:{ label:'Nursing & Allied Health', page:'nursing' } }
      ] },
      FREE_BANNER
    ]
  },

  radiology: {
    title:'Radiology', crumb:'Departments · Radiology', icon:ICON.Radiology,
    subtitle:'Expert diagnostic and interventional imaging using state-of-the-art technology — free for all.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Radiodiagnosis & Imaging',
        body:[
          'The Department of Radiodiagnosis and Imaging at SSSIHMS, Bangalore, provides expert diagnostic and interventional services to support the clinical needs of the hospital, performing a high volume of cases with state-of-the-art imaging equipment.',
          'Services include digital radiography (DR), ultrasound, cathlab imaging, CT, MRI, DSA and image-guided interventional procedures using state-of-the-art technologies — all delivered free of charge.'
        ], pill:'Free Diagnostic Imaging' },
      { type:'features', eyebrow:'Modalities', title:'Imaging Services', alt:true, items:[
        'Digital X-ray & fluoroscopy',
        'Ultrasound & Doppler',
        'CT scan (multi-slice)',
        'MRI',
        'Digital subtraction angiography (DSA)',
        'Image-guided interventional procedures'
      ] },
      { type:'cards', eyebrow:'Academics', title:'Training & Events', cols:3, items:[
        { title:'DNB Radio-Diagnosis', desc:'Broad-specialty post-graduate training accredited by the NBE.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'Fellowship in Radiology', desc:'Advanced fellowship for experienced radiologists.', link:{ label:'Fellowships', page:'fellowship' } },
        { title:'BSc Medical Imaging Technology', desc:'Allied health programme for imaging technologists.', link:{ label:'Nursing & Allied Health', page:'nursing' } }
      ] },
      FREE_BANNER
    ]
  },

  sssgh: {
    title:'Sri Sathya Sai General Hospital', crumb:'Departments · General Hospital',
    subtitle:'Comprehensive multi-specialty general hospital services — all entirely free of charge.',
    sections:[
      { type:'cards', eyebrow:'Multi-Specialty Care', title:'General Hospital Departments',
        sub:'A full range of general and specialty services to complement the super-specialty Institute.', cols:4, items:[
          { title:'Ophthalmology', desc:'Comprehensive eye care, examination and surgery.' },
          { title:'Obstetrics & Gynaecology', desc:'Women\'s health, maternity and gynaecological care.' },
          { title:'Orthopaedics', desc:'Bone, joint and trauma care.' },
          { title:'ENT', desc:'Ear, nose and throat services.' },
          { title:'General Medicine', desc:'Diagnosis and management of general medical conditions.' },
          { title:'Paediatrics', desc:'Care for infants, children and adolescents.' },
          { title:'General Surgery', desc:'A broad range of surgical procedures.' },
          { title:'Dental', desc:'Oral health and dental treatment.' }
        ] },
      { type:'features', eyebrow:'Diagnostic & Support Services', title:'Enabling Care', alt:true, items:[
        'Radiology & imaging', 'Laboratory & blood bank', 'Physiotherapy',
        'Telemedicine', 'Counselling', 'Pharmacy'
      ] },
      FREE_BANNER
    ]
  },

  // ─── FOR PATIENTS CLUSTER ───────────────────────────────────────────────────
  patients: {
    title:'For Patients', crumb:'For Patients',
    subtitle:'All care at SSSIHMS is provided completely free of charge — no payment, no insurance, no financial barriers.',
    sections:[
      { type:'cards', eyebrow:'Getting Care', title:'We Are Here for You', center:true,
        sub:'From your first consultation to the most complex surgery, every step is free.', items:[
          { icon:'◆', title:'Conditions & Treatments', desc:'Learn about the conditions we treat across cardiac, neuro and multi-specialty care.', link:{ label:'Treatments', page:'treatments' } },
          { icon:'◆', title:'Appointments & Admission', desc:'Walk-in OPD, advance appointments and the admission process — explained.', link:{ label:'Appointments', page:'appointments' } },
          { icon:'◆', title:'Help Desk / Telemedicine', desc:'Remote guidance and support for patients who cannot easily travel.', link:{ label:'Help Desk', page:'helpdesk' } },
          { icon:'◆', title:'Facilities', desc:'Wards, ICUs, theatres, diagnostics and patient amenities.', link:{ label:'Facilities', page:'facilities' } }
        ], cols:2 },
      FREE_BANNER
    ]
  },

  treatments: {
    title:'Conditions & Treatments', crumb:'For Patients · Treatments',
    subtitle:'Advanced tertiary and super-specialty treatment across all major disciplines — entirely free.',
    sections:[
      { type:'cards', eyebrow:'What We Treat', title:'Across Every Specialty', items:[
        { icon:'❤', title:'Cardiac Conditions', desc:'Coronary disease, valvular disease, congenital heart defects, arrhythmias and heart failure.', link:{ label:'Cardiology', page:'cardiology' } },
        { icon:'◆', title:'Neurological Conditions', desc:'Stroke, epilepsy, brain & spinal tumours, cerebrovascular disease and movement disorders.', link:{ label:'Neurology', page:'neurology' } },
        { icon:'✚', title:'Surgical Care', desc:'Cardiac, neuro and multi-specialty surgery — from routine to the most complex.', link:{ label:'Cardiac Surgery', page:'cardiac-surgery' } }
      ] },
      { type:'features', eyebrow:'How Care Works', title:'Your Pathway of Care', alt:true, items:[
        'Registration & consultation at the outpatient department',
        'Diagnostic evaluation — labs, imaging, cardiac & neuro tests',
        'Treatment plan discussed with you and your family',
        'Procedure or surgery, if needed, by specialist teams',
        'Post-operative & intensive care as required',
        'Follow-up and continued support — all free of charge'
      ] },
      FREE_BANNER
    ]
  },

  appointments: {
    title:'Appointments & Admission', crumb:'For Patients · Appointments',
    subtitle:'Simple, free, and supported at every step — no advance deposit is ever required.',
    sections:[
      { type:'cards', eyebrow:'How to Reach Care', title:'Appointments & Admission', items:[
        { title:'Walk-in OPD', desc:'Patients may walk in to our Outpatient Department during working hours without a prior appointment. Our team will register and guide you at no cost.' },
        { title:'Advance Appointment', desc:'For planned consultations and follow-ups, appointments can be arranged through our registration and help desk. All consultations are free.' },
        { title:'Admission Process', desc:'Patients needing hospitalisation are admitted after assessment by the treating physician. No advance deposit or payment is required at any stage.' },
        { title:'Emergency Care — 24×7', desc:'Our Emergency Department is open 24 hours a day, every day. All emergency and critical-care services are provided free of charge.' },
        { title:'Telemedicine', desc:'Patients who cannot travel can access medical guidance remotely. Contact our help desk for support.' },
        { title:'Getting Here', desc:'SSSIHMS is located in Whitefield, Bengaluru. Public transport, auto-rickshaws and taxis are readily available across the city.' }
      ] },
      { type:'intro', eyebrow:'Need Help?', title:'Our Help Desk Is Here for You', alt:true, narrow:true,
        body:['Our help desk team will answer your questions and guide you through the care process — at no cost.'],
        link:{ label:'Contact the Help Desk', page:'helpdesk' } },
      FREE_BANNER
    ]
  },

  helpdesk: {
    title:'Help Desk & Telemedicine', crumb:'For Patients · Help Desk',
    subtitle:'Guidance and medical support — including for patients who cannot easily travel to Bengaluru.',
    sections:[
      { type:'intro', eyebrow:'Remote Care', title:'Telemedicine & Tele-Consultations',
        body:[
          'For patients who are unable to travel, SSSIHMS offers telemedicine and tele-consultation services so that medical guidance and second opinions can be obtained remotely.',
          'Our help desk team supports patients and families in navigating consultations, follow-ups and the admission process — all free of charge.'
        ], link:{ label:'Book an Appointment', page:'appointments' } },
      { type:'features', eyebrow:'How We Help', title:'Help Desk Services', alt:true, items:[
        'Tele-consultation & remote second opinions',
        'Guidance on appointments & admission',
        'Pre-visit information for outstation patients',
        'Coordination with treating departments',
        'Support for families during hospitalisation'
      ] },
      FREE_BANNER
    ]
  },

  facilities: {
    title:'Facilities', crumb:'For Patients · Facilities',
    subtitle:'A complete super-specialty infrastructure, maintained to the highest standards — for every patient, free.',
    sections:[
      { type:'cards', eyebrow:'Infrastructure', title:'Our Facilities', items:[
        { icon:'✦', title:'12 Modular Operation Theatres', desc:'8 + 4 modular theatres equipped for cardiac, neuro and multi-specialty surgery.' },
        { icon:'✦', title:'6 Intensive Care Units', desc:'Dedicated cardiac, neuro and general intensive care, staffed round the clock.' },
        { icon:'✦', title:'3 Catheterisation Labs', desc:'Two cardiac cath labs and one bi-plane neuro cath lab.' },
        { icon:'✦', title:'Advanced Imaging', desc:'CT, MRI, DSA, ultrasound and digital X-ray in a dedicated radiology suite.' },
        { icon:'✦', title:'Emergency Department', desc:'24×7 casualty and emergency services for all patients.' },
        { icon:'✦', title:'Laboratory & Blood Bank', desc:'Full diagnostic laboratory and blood bank support.' }
      ] },
      FREE_BANNER
    ]
  },

  // ─── ACADEMICS CLUSTER ──────────────────────────────────────────────────────
  academics: {
    title:'Education & Training', crumb:'Academics',
    subtitle:'Building compassionate healers rooted in the spirit of selfless service — with no tuition fees.',
    sections:[
      { type:'cards', eyebrow:'Programmes', title:'Learn & Train at SSSIHMS', items:[
        { icon:'◆', title:'DNB Postgraduate Programmes', desc:'Accredited by the National Board of Examinations, New Delhi, in cardiac surgery, cardiology, neurosurgery, anesthesiology and radio-diagnosis.', link:{ label:'DNB Programmes', page:'dnb' } },
        { icon:'◆', title:'Fellowship Courses', desc:'Fellowships in interventional cardiology, paediatric cardiac surgery, cardiac anesthesia and radiology.', link:{ label:'Fellowships', page:'fellowship' } },
        { icon:'◆', title:'Nursing & Allied Health', desc:'B.Sc Nursing (admissions open) and allied health programmes in cardiac, perfusion, anesthesia, imaging and lab technology.', link:{ label:'Nursing & Allied Health', page:'nursing' } },
        { icon:'◆', title:'Research & Publications', desc:'Faculty actively participate in research and clinical studies, publishing in reputed national and international journals.' },
        { icon:'◆', title:'Conferences & CME', desc:'Regular CMEs, workshops and conferences — including SACRED CME in Radiology and events across departments.' },
        { icon:'◆', title:'A Spirit of Service', desc:'Education here is rooted in the conviction that the highest learning is in the service of others.' }
      ] },
      NURSING_CTA
    ]
  },

  dnb: {
    title:'DNB Postgraduate Programmes', crumb:'Academics · DNB', icon:ICON.DNB,
    subtitle:'Post-graduate medical training accredited by the National Board of Examinations, New Delhi.',
    sections:[
      { type:'intro', eyebrow:'DNB at SSSIHMS', title:'Super & Broad Specialty Training',
        body:[
          'Sri Sathya Sai Institute of Higher Medical Sciences, Bangalore, is accredited by the National Board of Examinations, New Delhi, to conduct post-graduate training in super specialties such as Cardiothoracic & Vascular Surgery, Cardiology and Neurosurgery, and broad specialties such as Anesthesiology and Radio-Diagnosis — culminating in a DNB degree.',
          'The Institute has been a recognised NBE training centre since 2002, with departments such as Cardiology serving as DNB examination centres and recording a 100% pass percentage.',
          'Trainees learn within a high-volume, completely free super-specialty hospital — gaining exceptional clinical exposure alongside daily academic presentations, mentorship from visiting faculty in India and abroad, and a culture of compassionate care.'
        ] },
      { type:'cards', eyebrow:'Disciplines', title:'DNB Programmes Offered', items:[
        { title:'DNB Cardiothoracic & Vascular Surgery', desc:'Super-specialty training in cardiac and vascular surgery.' },
        { title:'DNB Cardiology', desc:'Super-specialty training in cardiology and cardiac interventions.' },
        { title:'DNB Neurosurgery', desc:'Super-specialty training in the neurosciences.' },
        { title:'DNB Anesthesiology', desc:'Broad-specialty training in anesthesia and critical care.' },
        { title:'DNB Radio-Diagnosis', desc:'Broad-specialty training in diagnostic and interventional imaging.' }
      ], alt:true, cols:3 }
    ]
  },

  fellowship: {
    title:'Fellowship Courses', crumb:'Academics · Fellowship', icon:ICON.DNB,
    subtitle:'Advanced sub-specialty training for experienced medical professionals.',
    sections:[
      { type:'cards', eyebrow:'Fellowships', title:'Advanced Specialisation', items:[
        { title:'Interventional Cardiology', desc:'Advanced training in coronary and structural cardiac interventions.' },
        { title:'Paediatric Cardiac Surgery', desc:'Sub-specialty training in surgery for congenital heart disease.' },
        { title:'Cardiac Anesthesia', desc:'Fellowship in anesthesia for cardiac and high-risk surgery.' },
        { title:'Radiology', desc:'Advanced fellowship in diagnostic and interventional radiology.' }
      ] },
      { type:'intro', eyebrow:'Who Should Apply', title:'For Experienced Professionals', alt:true, narrow:true,
        body:['SSSIHMS fellowships are designed for qualified doctors seeking advanced sub-specialty experience within a high-volume, free super-specialty hospital.'] }
    ]
  },

  nursing: {
    title:'College of Nursing & Allied Health', crumb:'Academics · Nursing', icon:ICON.Nursing,
    subtitle:'B.Sc Nursing and allied health sciences programmes — affiliated to RGUHS, with no tuition fees.',
    sections:[
      { type:'intro', eyebrow:'College of Nursing', title:'B.Sc Nursing — Admissions Open 2026–27',
        body:[
          'The Sri Sathya Sai Institute of Higher Medical Sciences College of Nursing and Allied Health is affiliated to the Rajiv Gandhi University of Health Sciences, Bangalore, for its B.Sc Nursing programme, with a permitted intake of 40 seats.',
          'The four-year degree programme is exclusively for women and fully residential. No tuition fees are charged — candidates bear only boarding & lodging charges and RGUHS-mandated fees. Applications close on 19th June 2026; call letters will be issued after 25th June 2026.'
        ], pill:'No Tuition Fees' },
      { type:'cards', eyebrow:'Allied Health Sciences', title:'BSc Allied Health Programmes',
        sub:'Note: AHS admissions are temporarily paused for the 2026–27 academic year.', alt:true, items:[
          { title:'Cardiac Care Technology', badge:'Paused 26–27', desc:'Training cardiac care technologists for cath labs and cardiac units.' },
          { title:'Perfusion Technology', badge:'Paused 26–27', desc:'Training perfusionists for cardiac surgery.' },
          { title:'Anesthesia Technology', badge:'Paused 26–27', desc:'Training anesthesia technologists for theatres and ICUs.' },
          { title:'Medical Imaging Technology', badge:'Paused 26–27', desc:'Training imaging technologists for radiology.' },
          { title:'Medical Lab Technology', badge:'Paused 26–27', desc:'Training laboratory technologists for diagnostics.' },
          { title:'MSc Echocardiography', desc:'Advanced training in echocardiography.' }
        ], cols:3 },
      NURSING_CTA
    ]
  },

  // ─── GET INVOLVED CLUSTER ───────────────────────────────────────────────────
  involved: {
    title:'Get Involved', crumb:'Get Involved',
    subtitle:'Join the mission of love and service — and help transform lives through compassionate care.',
    sections:[
      { type:'cards', eyebrow:'Ways to Serve', title:'Be Part of the Mission', items:[
        { icon:'◈', title:'Sevadal — Volunteer', desc:'Serve patients, families and staff with dedication and love across the hospital, embodying the spirit of selfless service.', link:{ label:'About Sevadal', page:'sevadal' } },
        { icon:'◈', title:'Support the Mission', desc:'All care here is free. Your contribution helps sustain world-class healthcare for all, regardless of means.', link:{ label:'Donate', href:'https://www.srisathyasai.org/pages/sai-get-involved.html' } },
        { icon:'◈', title:'Volunteer Your Expertise', desc:'Medical professionals and specialists can contribute their expertise on a short-term or long-term basis.', link:{ label:'Volunteer Expertise', page:'volunteer' } }
      ] },
      { type:'intro', eyebrow:'Together in Service', title:'Every Act of Service Matters', alt:true, narrow:true,
        body:['SSSIHMS has touched millions of lives because countless hearts chose to serve. Join them in this sacred mission.'],
        link:{ label:'Donate to the Mission', href:'https://www.srisathyasai.org/pages/sai-get-involved.html' } }
    ]
  },

  sevadal: {
    title:'Sevadal — Volunteer Service', crumb:'Get Involved · Sevadal',
    subtitle:'The volunteers who form the beating heart of SSSIHMS.',
    sections:[
      { type:'intro', eyebrow:'The Heart of the Hospital', title:'Service With Love',
        body:[
          'Sevadal volunteers form the heart of SSSIHMS. They serve patients, families and staff with dedication and love — across the wards, the outpatient department, administration and more — embodying the spirit of selfless service that defines the Institute.',
          'For many who come here, the warmth of a Sevadal volunteer is the first experience of the love that the hospital was built upon.'
        ] },
      { type:'features', eyebrow:'Where Sevadal Serve', title:'Acts of Service', alt:true, items:[
        'Welcoming & guiding patients and families',
        'Assisting at the outpatient department & registration',
        'Supporting ward and waiting areas',
        'Helping outstation patients find their way',
        'Maintaining a calm, caring atmosphere',
        'Quiet, dedicated service in every corner'
      ] }
    ]
  },

  volunteer: {
    title:'Volunteer Your Expertise', crumb:'Get Involved · Volunteer Expertise',
    subtitle:'For medical professionals and specialists who wish to serve.',
    sections:[
      { type:'intro', eyebrow:'Professional Volunteering', title:'Offer Your Skills in Service',
        body:[
          'Medical professionals, technicians and specialists can contribute their expertise to support the hospital\'s mission, on a short-term or long-term basis.',
          'If you wish to serve, please reach the Institute through the Volunteer Expertise channel so your skills can be matched to where they are most needed.'
        ], link:{ label:'Express Your Interest', page:'helpdesk' } },
      { type:'intro', eyebrow:'Together in Service', title:'A Place for Every Skill', alt:true, narrow:true,
        body:['Doctors, nurses, technologists and administrators have all found a way to serve here. Whatever your expertise, there is a way to give it in love.'] }
    ]
  },

  // ─── BHAGAWAN ───────────────────────────────────────────────────────────────
  bhagawan: {
    title:'Bhagawan Sri Sathya Sai Baba', crumb:'Bhagawan',
    subtitle:'The divine inspiration behind SSSIHMS and its mission of selfless, free service to all of humanity.',
    sections:[
      { type:'intro', eyebrow:'Life & Mission', title:'A Life of Love & Service', image:SWAMI,
        body:[
          'Bhagawan Sri Sathya Sai Baba (23 November 1926 – 24 April 2011) was a spiritual teacher, educator and philanthropist whose mission was the spiritual and moral regeneration of humanity.',
          'He founded numerous educational and medical institutions across India — all free of charge — reflecting His core teaching that service to humanity is service to God.',
          'Among His greatest gifts is the network of Sri Sathya Sai Hospitals — including SSSIHMS Whitefield — where the finest medical care is given freely to all who come, embodying His vision that the poor and the privileged deserve equal care, given with equal love.'
        ], link:{ label:'Read Life History', href:'https://www.srisathyasai.org/pages/sai-life-history-history.html' } },
      { type:'quote', eyebrow:'His Words',
        text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. As man is the embodiment of God, it is his primary duty to help the destitute and the forlorn. Medicine should not be commercialised.',
        attr:'Bhagawan Sri Sathya Sai Baba, 2003' },
      { type:'cards', eyebrow:'Explore', title:'Life, Teachings & Projects', alt:true, items:[
        { title:'Life History', desc:'The full biography and milestones of Bhagawan Sri Sathya Sai Baba.', link:{ label:'Read', href:'https://www.srisathyasai.org/pages/sai-life-history-history.html' } },
        { title:'Discourses & Writings', desc:'His teachings, messages and discourses.', link:{ label:'Explore', href:'https://www.srisathyasai.org/pages/sai-his-messages-speaks.html' } },
        { title:'Sai Projects', desc:'The institutions and service projects established in His name.', link:{ label:'Visit', href:'https://www.srisathyasai.org/pages/sai-projects.html' } }
      ] }
    ]
  },

  // ─── ADDITIONAL SITE PAGES ──────────────────────────────────────────────────
  gogreen: {
    title:'Go Green', crumb:'Go Green',
    subtitle:'Caring for the body and for the earth — sustainability initiatives across the SSSIHMS campus.',
    sections:[
      { type:'intro', eyebrow:'Sustainability', title:'Healing in Harmony with Nature',
        body:[
          'In keeping with Bhagawan Sri Sathya Sai Baba\'s teaching of reverence for nature, SSSIHMS pursues a range of green initiatives across its campus — conserving water and energy, expanding green cover and managing waste responsibly.',
          'These efforts ensure that the work of healing people goes hand in hand with care for the environment.'
        ], narrow:true },
      { type:'cards', eyebrow:'Initiatives', title:'Our Green Programmes', alt:true, items:[
        { icon:'◆', title:'Rain Water Harvesting', desc:'Capturing and recharging rainwater to conserve groundwater across the campus.' },
        { icon:'◆', title:'Solar Power Plant', desc:'On-site solar generation reducing the hospital\'s carbon footprint.' },
        { icon:'◆', title:'Trees on Campus', desc:'Tree planting and transplantation to expand and protect green cover.' },
        { icon:'◆', title:'Power Conservation', desc:'Energy-efficient systems and practices that reduce power consumption.' },
        { icon:'◆', title:'Water Use Maximization', desc:'Recycling and efficient use of water throughout the facility.' },
        { icon:'◆', title:'Waste Management', desc:'Responsible handling, segregation and disposal of all waste.' },
        { icon:'◆', title:'Biomedical Waste', desc:'Safe, compliant management and reporting of biomedical waste.' }
      ] }
    ]
  },

  careers: {
    title:'Career Opportunities', crumb:'Opportunities · Careers',
    subtitle:'Serve with purpose — join a team dedicated to free, compassionate, world-class care.',
    sections:[
      { type:'intro', eyebrow:'Join Us', title:'Work That Is Worship',
        body:[
          'A career at SSSIHMS is an opportunity to practise medicine and service at the highest level, within an institution where care is given freely and with love.',
          'We welcome doctors, nurses, technologists, administrators and support staff who wish to contribute their skills to a mission larger than themselves.'
        ], link:{ label:'Contact the Help Desk to Apply', page:'helpdesk' } },
      { type:'features', eyebrow:'Who We Seek', title:'A Calling, Not Just a Job', alt:true, items:[
        'Clinical excellence and a commitment to ethical practice',
        'Compassion and respect for every patient',
        'A spirit of selfless service',
        'Teamwork across departments',
        'Dedication to continuous learning',
        'Integrity in all things'
      ] }
    ]
  },

  manohriday: {
    title:'Manohriday Newsletter', crumb:'About Hospital · Newsletter',
    subtitle:'Stories, updates and highlights from the heart of SSSIHMS.',
    sections:[
      { type:'intro', eyebrow:'Newsletter', title:'News From the Hospital',
        body:[
          'Manohriday is the newsletter of SSSIHMS, sharing hospital updates, patient stories, departmental highlights and milestones from across the Institute.',
          'Each edition captures the spirit of service that animates the hospital, told through the voices of patients, doctors, nurses and volunteers.'
        ], link:{ label:'Read the Latest Edition', page:'blog' } }
    ]
  },

  trust: {
    title:'Sri Sathya Sai Central Trust', crumb:'About · Trust',
    subtitle:'The Trust under which SSSIHMS and its sister institutions serve humanity.',
    sections:[
      { type:'intro', eyebrow:'About the Trust', title:'A Legacy of Service',
        body:[
          'SSSIHMS operates under the Sri Sathya Sai Central Trust, established by Bhagawan Sri Sathya Sai Baba to oversee a wide range of educational, medical, water and service projects.',
          'The Trust\'s institutions — including hospitals, universities and large-scale drinking-water projects — have served millions of people across India and the world, always free of charge.'
        ], link:{ label:'Visit the Trust', href:'https://srisathyasai.org.in' } }
    ]
  },

  songs: {
    title:'Songs & Poems', crumb:'Bhagawan · Songs & Poems',
    subtitle:'Devotional songs, bhajans and poems in the Sai tradition.',
    sections:[
      { type:'cards', eyebrow:'Listen & Read', title:'Devotional Resources', items:[
        { title:'Songs on Baba', desc:'A collection of devotional songs dedicated to Bhagawan.', link:{ label:'Open', href:'https://whitefield.sssihms.org/songs-baba/' } },
        { title:'Poems', desc:'Poems written in devotion and remembrance.', link:{ label:'Open', href:'https://whitefield.sssihms.org/poems/' } },
        { title:'Swami Poems (Telugu)', desc:'Devotional poems in Telugu.', link:{ label:'Open', href:'https://whitefield.sssihms.org/sai_padhyam/' } },
        { title:'Bhajans', desc:'Bhajans from the Sai tradition.', link:{ label:'Open', href:'https://archive.sssmediacentre.org/www/ssspeaks/index/bhajanas' } }
      ] }
    ]
  },

  blog: {
    title:'News & Blog', crumb:'News & Updates',
    subtitle:'Stories, announcements and highlights from across the Institute.',
    sections:[
      { type:'cards', eyebrow:'Latest', title:'From SSSIHMS', items:[
        { badge:'Admissions', title:'B.Sc Nursing Applications Now Open \u2014 2026\u201327', desc:'Online applications for the 4-year B.Sc Nursing programme are open. Deadline: 19th June 2026. No tuition fees. Fully residential, exclusively for women.', link:{ label:'Apply Now', href:'https://tinyurl.com/sssihmsnc' } },
        { badge:'Notice', title:'Allied Health Science Admissions Paused for 2026\u201327', desc:'AHS programme admissions are temporarily paused for this academic year. Candidates are advised to visit the website regularly for updates.', link:{ label:'Academics', page:'academics' } },
        { badge:'Newsletter', title:'Manohriday Newsletter \u2014 Latest Edition', desc:'The new Manohriday newsletter features hospital updates, patient stories and highlights from our departments.', link:{ label:'About the Newsletter', page:'manohriday' } }
      ] },
      NURSING_CTA
    ]
  }

};

window.PAGES = PAGES;
