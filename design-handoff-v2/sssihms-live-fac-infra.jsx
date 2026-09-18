// sssihms-live-fac-infra.jsx — Faculty & infrastructure for CTVS, Neurosurgery, Anesthesiology.
// Sources: /cardiac-surgery/faculty|infrastructure/, /neurosurgery/nesu-faculty|infrastructure/,
//          /anesthesiology1/anes-faculty/, /anesthesiology-infrastructure/
(function(){
const PAGES = window.PAGES;
const R = window.__resources || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const CDN = 'https://cdn.sssihms.org/sssihms/wp-content/uploads/';

// ── CARDIAC SURGERY · FACULTY ───────────────────────────────────────────────
PAGES['ctvs-faculty'] = {
  title:'Faculty — Cardiac Surgery', crumb:'Departments · Cardiac Surgery · Faculty', subnav:'cardiac-surgery', icon:R.imgCTVS,
  subtitle:'The Cardiothoracic and Vascular Surgery team at SSSIHMS, Whitefield.',
  sections:[
    { type:'faculty', eyebrow:'Consultants', title:'Department Faculty', cols:3, items:[
      { name:'Dr. Chittaranjan S J', role:'Sr Consultant & HOD', photo:U + '2024/05/Dr-SJC.jpg' },
      { name:'Dr. Giridhar Kamalapurkar', role:'Sr Consultant', photo:U + '2025/09/Dr-Giridhar-Kamalapurkar.jpg' },
      { name:'Dr. Gautham Shetty', role:'Consultant', photo:U + '2024/05/Dr-GS-1.jpg' },
      { name:'Dr. ARUN K R', role:'Junior Consultant', photo:U + '2026/03/Dr-Arun-K-R-1.jpeg' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Department Through the Years', alt:true, cols:2, items:[
      { src:U + '2022/11/Swami-with-CTVS-team.png', caption:'Swami with the CTVS team' },
      { src:U + '2015/05/first-patient-in-ICU-and-Swami.jpg', caption:'The first patient in the ICU, with Swami' }
    ] }
  ]
};

// ── CARDIAC SURGERY · INFRASTRUCTURE ───────────────────────────────────────
PAGES['ctvs-infrastructure'] = {
  title:'Infrastructure — Cardiac Surgery', crumb:'Departments · Cardiac Surgery · Infrastructure', subnav:'cardiac-surgery', icon:R.imgCTVS,
  subtitle:'Advanced surgical infrastructure for exceptional patient care.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Advanced Surgical Infrastructure for Exceptional Patient Care',
      image:U + '2015/05/DSC08273.jpg', imageLabel:'Cardiac surgery in progress',
      body:[
        'At our hospital, we are committed to providing the highest level of patient safety and care. Our state-of-the-art surgical infrastructure is designed to exceed international standards and ensure the safe and successful performance of complex procedures.'
      ] },
    { type:'prose', eyebrow:'Cutting-Edge Operating Rooms', title:'Four Theatres, Equipped With the Latest Technology', alt:true,
      body:[
        'Our four operating rooms are spacious and equipped with the latest technology, including:',
        '<strong>Heart-lung machines</strong> with multi-channel modular monitoring systems.',
        '<strong>Dedicated, advanced anesthesia workstations</strong> designed and manufactured to conform with relevant regulations and standards.',
        'This advanced equipment allows our skilled surgical teams to perform complex procedures with the utmost precision and safety.'
      ] },
    { type:'prose', eyebrow:'Comprehensive Intensive Care Unit', title:'A 19-Bed, Fully Monitored ICU',
      image:U + '2015/05/DSC08263.jpg', imageCaption:'Cardiac ICU — Pediatric Patient', reverse:true,
      body:[
        'Complementing our advanced operating rooms is a 19-bed, fully monitored Intensive Care Unit (ICU). This state-of-the-art facility is staffed 24/7 by a dedicated team of cardiac surgeons and anesthesiologists, ensuring that our patients receive the highest level of post-operative care and monitoring.'
      ] },
    { type:'prose', eyebrow:'Commitment to Patient Safety', title:'Technology and Team Together', alt:true,
      body:[
        'The combination of our cutting-edge surgical infrastructure and experienced medical team demonstrates our unwavering commitment to patient safety and care. By investing in the latest technology and maintaining the highest standards of medical practice, we are able to provide our patients with the best possible outcomes and a seamless, stress-free healthcare experience.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'Theatres and Intensive Care', cols:2, items:[
      { src:U + '2015/05/DSC08273.jpg', caption:'Cardiac surgery in progress' },
      { src:U + '2015/05/DSC08263.jpg', caption:'Cardiac ICU — Pediatric Patient' }
    ] }
  ]
};

// ── NEUROSURGERY · FACULTY ─────────────────────────────────────────────────
PAGES['nesu-faculty'] = {
  title:'Faculty — Neurosurgery', crumb:'Departments · Neurosurgery · Faculty', subnav:'neurosurgery', icon:R.imgNESU,
  subtitle:'The neurosurgical team at SSSIHMS, Whitefield.',
  sections:[
    { type:'intro', eyebrow:'The Team', title:'Department of Neurosurgery',
      image:U + '2022/11/Neurosurgery-team-for-website.png', imageLabel:'The neurosurgery team',
      body:[
        'The Department of Neurosurgery is staffed by senior consultants, visiting consultants and junior consultants, all holding the MCh in Neurosurgery, supported by visiting faculty from abroad.'
      ] },
    { type:'faculty', eyebrow:'Consultants', title:'Department Faculty', cols:3, alt:true, items:[
      { name:'Dr. Saritha Aryan', role:'MCh, Senior Consultant and I/C HOD', photo:U + '2022/04/Dr.-Saritha.jpg' },
      { name:'Dr. Sumit Thakar', role:'MCh, Senior Consultant', photo:U + '2022/11/Dr.-Sumit.jpg' },
      { name:'Dr. Sanjay H.M', role:'MCh, Jr. Consultant', photo:U + '2023/08/Dr.-Sanjay-DP.jpeg' },
      { name:'Dr. Sauradeep Sarkar', role:'MCh, Jr. Consultant', photo:U + '2023/08/Dr.-Sourabh-DP.jpeg' }
    ] },
    { type:'faculty', eyebrow:'Visiting Faculty', title:'Visiting Faculty', cols:2, items:[
      { name:'Dr Anil Nanda', role:'Consultant Neurosurgeon', detail:'USA' },
      { name:'Dr Ravi Goyal', role:'Consultant Neurosurgeon', detail:'USA' }
    ] }
  ]
};

// ── NEUROSURGERY · INFRASTRUCTURE ──────────────────────────────────────────
PAGES['nesu-infrastructure'] = {
  title:'Infrastructure — Neurosurgery', crumb:'Departments · Neurosurgery · Infrastructure', subnav:'neurosurgery', icon:R.imgNESU,
  subtitle:'Geared to provide treatment for all neurosurgical ailments, from aneurysms to spinal and cranial surgeries.',
  sections:[
    { type:'features', eyebrow:'The Neurosciences Facility Includes', title:'Equipment and Monitoring', items:[
      'EEG Telemetry',
      'EEG',
      'ENMG',
      'Evoked Potential Studies',
      'Intraoperative Electrophysiological Monitoring',
      'Intraoperative Micro Doppler',
      'Transcranial Doppler',
      'Intraoperative Ultrasound',
      'Stereotaxy',
      'State of the art operating microscopes',
      'Brain & Spine Endoscopes with 3 chip HD Camera',
      'Neuro navigation System',
      'Laser',
      'Ultrasonic Aspirator',
      'Micro Electrode Recorder',
      'Image Intensifiers',
      'High speed Pneumatic Drill Systems'
    ] },
    { type:'prose', eyebrow:'Scope of Surgery', title:'From Giant Aneurysms to Skull Base Tumours', alt:true,
      image:CDN + '2015/06/SSSIHMS-0975.jpg', imageCaption:'Giant Aneurysm Surgery under Total Circulatory Arrest',
      body:[
        'All types of Neurosurgical problems are treated in the department be it a complex giant aneurysm, an AVM, neuroendoscopic procedures, stereotactic surgery or a multi-compartment large skull base tumor. The department is known for the treatment of aneurysms, AVMs especially posterior circulation & giant aneurysms under low flow state or circulatory arrest and hypothermia. Patients with these problems are referred here from other national institutions for surgery.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'In the Operating Theatre', items:[
      { src:CDN + '2015/06/SSSIHMS-0975.jpg', caption:'Giant Aneurysm Surgery under Total Circulatory Arrest' },
      { src:U + '2015/05/DSC04372.jpg', caption:'Neurosurgical theatre' },
      { src:U + '2015/05/DSC04073.jpg', caption:'Neurosurgical theatre' }
    ] }
  ]
};

// ── ANESTHESIOLOGY · FACULTY ───────────────────────────────────────────────
PAGES['anes-faculty'] = {
  title:'Faculty — Anaesthesia and Critical Care', crumb:'Departments · Anesthesiology · Faculty', subnav:'anesthesiology', icon:R.imgANES,
  subtitle:'Consultants, resident staff and overseas visiting consultants of the Department of Anaesthesia and Critical Care.',
  sections:[
    { type:'faculty', eyebrow:'Consultants', title:'Department Faculty', cols:3, items:[
      { name:'Dr Geetanjali Tulapurkar', role:'HOD and Sr. Consultant', photo:U + '2023/03/Dr.-Geetha.png',
        detail:'MBBS, DNB (Anaesthesiology), DHM (NIHFW), PGDMLE (NLSUI). Area of Expertise: All modalities of Anaesthesia. Area of Interest: Different type of regional blocks' },
      { name:'Dr. Anitha Diwakar', role:'Sr Consultant', photo:U + '2024/05/Dr-Anitha.jpg',
        detail:'MBBS, MD (Anaesthesiology), FNB (Cardiac Anesthesia), FIACTA, FTEE. Area of Expertise: All modalities of Anaesthesia. Area of Interest: TEE, Paediatric Cardiac Anaesthesia' },
      { name:'Dr. Kolli S Chalam', role:'Sr. Consultant',
        detail:'MD, PDCC in Cardiac anaesthesia & Neuroanaesthesia; ECFMG (US Edu Dept). Area of Expertise: All modalities of Anaesthesia. Area of Interest: Critical Care and Pain Management' },
      { name:'Dr Anuradha Kamath', role:'Consultant', photo:U + '2023/03/Dr.-Anuradha.png',
        detail:'DNB DA PDFCA FTEE. Area of Expertise: Cardiac Anaesthesia, Transesophageal echocardiography. Area of Interest: TEE, Paediatric Anesthesia' },
      { name:'Dr. Vrushali Choudhary', role:'Additional Sr. Consultant', photo:U + '2023/03/Dr.-Vrushali.png',
        detail:'DNB (Anaesthesiology). Area of Expertise: All modalities of Anaesthesia. Area of Interest: Regional anaesthesia' }
    ] },
    { type:'features', eyebrow:'Other Staff', title:'Residents, Technicians and Students', alt:true, items:[
      'Academic Senior residents: 4',
      'Academic Junior residents: 6',
      'Technicians: 7',
      'BSc Anesthesia & OT Technology students: 28'
    ] },
    { type:'faculty', eyebrow:'Overseas Visiting Consultants from USA', title:'Visiting Consultants', cols:2, items:[
      { name:'Dr. Kalpalatha Guntupalli', role:'M.D., FCCM, FCCP, MACP', detail:'Endowed Professor for Pulmonary Disorders, Baylor College of Medicine, Texas' },
      { name:'Dr. Y. Ganesh', role:'Professor of Nephrology', detail:'University of Cincinnati School of Medicine, Cincinnati, OH' },
      { name:'Dr. Shankar Gopinath', role:'Associate Professor', detail:'Neuro Surgery & Neuro Intensive Care, BCM, Texas' },
      { name:'Dr. Namitha Sood', role:'Professor of Pulmonology', detail:'University of Texas, Houston' },
      { name:'Dr. Jayaram Guntupalli', role:'Professor, Nephrology', detail:'BCM, Texas' },
      { name:'Dr. Deepa Gotur', role:'Asst Prof Pulmonology', detail:'BCM, Texas' },
      { name:'Dr. Dharani Narendra', role:'Assistant Professor', detail:'Baylor College of Medicine, Texas' },
      { name:'Dr. Sridevi Devaraj', role:'PhD DABCC, Professor', detail:'Baylor College of Medicine, Houston, Texas' },
      { name:'Dr. Ramya Gopinath', role:'Consultant, Infectious diseases', detail:'Maryland, USA' },
      { name:'Dr. Mayur Narayan', role:'Attending Trauma Surgeon', detail:'Weill Cornell Medical Centre, New York' },
      { name:'Dr. Sai Kaumudi Saridey', role:'Assistant Professor, Nephrology, BCM', detail:'Chief, Adult Renal Section, Women’s Pavilion, TCH; Medical Director, SNG Bellaire Dialysis, Houston, TX' },
      { name:'Dr. Marie Baldisserie', role:'Professor of Critical Care Medicine', detail:'University of Pennsylvania, USA' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Swami With the Patients', alt:true, items:[
      { src:CDN + '2015/05/Photo-17-e1430994430309.jpg', caption:'Swami blessing Neuro Patient' },
      { src:CDN + '2015/05/Photo-161.jpg', caption:'Swami blessing a patient' },
      { src:CDN + '2015/05/Photo-25.jpg', caption:'Swami blessing a small child' },
      { src:CDN + '2015/05/Photo-2.jpg', caption:'Swami Blessing a child after Neurosurgery' }
    ] }
  ]
};

// ── ANESTHESIOLOGY · INFRASTRUCTURE ────────────────────────────────────────
PAGES['anes-infrastructure'] = {
  title:'Infrastructure — Anesthesiology', crumb:'Departments · Anesthesiology · Infrastructure', subnav:'anesthesiology', icon:R.imgANES,
  subtitle:'State of the art anaesthesia workstations across all eight theatres, and a certification lab for ACLS and BLS.',
  sections:[
    { type:'intro', eyebrow:'Infrastructure', title:'Workstations, Airway Equipment and Monitoring',
      image:CDN + '2015/05/Photo-161.jpg', imageLabel:'Swami blessing a patient',
      body:[
        'Anaesthesia Department is equipped with the state of the art anaesthesia workstations (GE, AVANS, CES2) with monitors for both invasive & non invasive monitoring in all 8 theatres.',
        'Fibrotic, bronchoscopes, pediatric as well as adult one. Video laryngoscope, e.g. SEEMAC; SONOSITE for vascular access; TEE in Cardiac OT.'
      ] },
    { type:'prose', eyebrow:'ACLS and BLS Certification Lab', title:'Training With High-Fidelity Manikins', alt:true,
      body:[
        'For the certification programs, the Department has state of the art manikins from AMBU (wireless integration software to monitor high quality CPR).'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Department', items:[
      { src:CDN + '2015/05/Photo-17-e1430994430309.jpg', caption:'Swami blessing Neuro Patient' },
      { src:CDN + '2015/05/Photo-25.jpg', caption:'Swami blessing a small child' },
      { src:CDN + '2015/05/Photo-2.jpg', caption:'Swami Blessing a child after Neurosurgery' }
    ] }
  ]
};
})();
