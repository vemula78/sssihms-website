// sssihms-programme-pages.jsx — Standalone academic programme pages (slugs
// match live site). Content sourced from whitefield.sssihms.org.
(function(){
const PAGES = window.PAGES;
const R = window.__resources || {};

const PAUSED = { type:'cta', pill:'Notice', title:'AHS Admissions Paused for 2026–27',
  body:'Admissions for all Allied Health Science programmes are temporarily paused for the 2026–2027 academic year. Please visit the website regularly for updates.',
  action:{ label:'Nursing & Allied Health', page:'nursing-and-allied-health' } };

// ── MSc ECHOCARDIOGRAPHY ─────────────────────────────────────────────────────
PAGES['msecho'] = {
  title:'MSc Echocardiography', crumb:'Departments · Cardiology · MSc Echocardiography', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'A postgraduate programme of the Department of Cardiology — developing skilled, compassionate, research-oriented cardiac sonographers.',
  sections:[
    { type:'intro', eyebrow:'Programme Overview', title:'At the Forefront of Cardiac Imaging',
      body:[
        'Echocardiography stands at the forefront of non-invasive cardiac imaging, vital in the diagnosis, evaluation and management of cardiovascular disease across all age groups — from neonates to the elderly. With the rising global burden of heart disease, the demand for advanced, ethically driven cardiac imaging professionals is at an all-time high.',
        'The Department of Cardiology offers a Master of Science in Echocardiography that blends academic rigour with immersive clinical training: advanced imaging including 2D, 3D and 4D echocardiography, applications in fetal, paediatric, adult and perioperative imaging, a strong foundation in cardiovascular physiology and pathology, and real-time case work in critical care, surgical and interventional settings.'
      ], pill:'Rooted in Service & Compassion' },
    { type:'features', eyebrow:'Key Highlights', title:'What the Programme Covers', alt:true, items:[
      'Transthoracic, transoesophageal, stress and contrast echocardiography',
      '3D and 4D imaging techniques across adult and paediatric populations',
      'Fetal echocardiography — detecting congenital heart defects in utero',
      'Specialised paediatric and neonatal modules',
      'Pre- and post-operative echocardiography',
      'Rotational postings in cardiac theatres, ICUs and cath labs',
      'Vascular ultrasound training',
      'Exposure to AI-driven echocardiographic reporting and analysis',
      'Structured mentorship under renowned cardiologists and sonographers',
      'Guided research projects, scientific writing and conference participation'
    ] },
    { type:'split', cols:[
      { eyebrow:'What We Expect', title:'From the Student', body:[
        'A solid foundation in cardiovascular anatomy and physiology; dedication to mastering theory and technique; empathy and professionalism with patients; a proactive approach to learning and research; and commitment to the institutional values of integrity, selflessness and service.'
      ] },
      { eyebrow:'What You Can Expect', title:'From the Programme', body:[
        'A curriculum aligned with current clinical practice; real-world exposure in a high-volume tertiary cardiac hospital; hands-on experience with 3D/4D echo, strain imaging and PACS; supervised postings in surgical and interventional settings; and opportunities to conduct and publish original research.'
      ] }
    ] },
    { type:'cards', eyebrow:'After Graduation', title:'Career Opportunities', cols:3, alt:true, items:[
      { title:'Clinical Practice', desc:'Advanced cardiac imaging centres and tertiary care hospitals, in India and abroad.' },
      { title:'Academia & Research', desc:'Teaching and research roles in academic institutions.' },
      { title:'Health Technology', desc:'Emerging AI-driven diagnostic platforms and health-tech companies.' }
    ] },
    { type:'cta', pill:'Applications', title:'Join the MSc Echocardiography Programme',
      body:'Applications are received through the SSSIHMS online admission portal. For the current cycle and eligibility details, see the College of Nursing & Allied Health.',
      action:{ label:'Nursing & Allied Health', page:'nursing-and-allied-health' } },
        { type:'intro', eyebrow:"M.Sc Echocardiography", title:"Programme Details", body:[
        "Echocardiography stands at the forefront of non-invasive cardiac imaging and has become vital in the diagnosis, evaluation, and management of cardiovascular diseases across all age groups — from neonates to the elderly.",
        "The Department of Cardiology at Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), Bengaluru, offers a distinguished Master of Science (M.Sc.) in Echocardiography.",
        "This postgraduate programme is designed to develop skilled, compassionate, and research-oriented sonographers equipped to thrive in dynamic clinical environments.",
        "Blending academic rigour with immersive clinical training, the curriculum integrates advanced imaging modalities, including 2D, 3D, and 4D echocardiography, alongside cutting-edge applications in fetal, paediatric, adult, and perioperative cardiac imaging.",
        "The course also includes a strong foundation in cardiovascular physiology, pathology, and hands-on exposure to high-end equipment and real-time case work in critical care, intensive care, surgical and interventional settings.",
        "Comprehensive echocardiography training: Transthoracic, transoesophageal, stress, and contrast echocardiography.",
        "Advanced 3D and 4D imaging techniques: Applied across adult and paediatric populations, enhancing anatomical clarity and diagnostic accuracy.",
        "Fetal echocardiography exposure: Early detection and evaluation of congenital heart defects in utero.",
        "Specialised pediatric and neonatal modules: Early identification of congenital cardiac anomalies through targeted imaging.",
        "Pre- and post-operative echocardiography: Invaluable in planning, intra-procedural assessment, and post-surgical monitoring.",
        "Rotational clinical postings: In cardiac operating theatres, intensive care units (ICUs), and cardiac catheterisation laboratories.",
        "Vascular ultrasound training: Broader perspective on cardiovascular diagnostics beyond the heart.",
        "Integration of Artificial Intelligence (AI): Exposure to next-gen workflow solutions in echocardiographic reporting and image analysis.",
        "Structured academic mentorship: Learning under renowned cardiologists and experienced sonographers.",
        "Emphasis on research and innovation: With guided projects, scientific writing, and conference participation.",
        "Ethical and values-based learning environment: Rooted in SSSIHMS’s ethos of service and compassion.",
        "CLICK HERE TO APPLY M.Sc ECHOCARDIOGRAPHY ACADEMIC YEAR 2025-26",
        "Dedication to mastering both theoretical concepts and practical techniques.",
        "A proactive approach to learning, research, and clinical problem-solving.",
        "Willingness to collaborate with peers and contribute to a team-based healthcare model.",
        "Upholding the institutional values of integrity, selflessness, and service.",
        "A curriculum aligned with current clinical practice and technological advancements.",
        "Real-world clinical exposure in a high-volume, tertiary care cardiac hospital.",
        "Hands-on experience with state-of-the-art imaging tools: 3D/4D echo, strain imaging, PACS systems.",
        "Development of communication and presentation skills for academic and professional success.",
        "Access to a multidisciplinary learning environment including surgeons, anaesthetists, and intensivists.",
        "Mentorship that fosters leadership, ethical decision-making, and lifelong learning.",
        "Echocardiography programme are well-positioned for roles in:",
        "Public and private healthcare systems in India and abroad",
        "Empathy and professionalism in patient interactions are crucial, alongside a proactive approach to learning and research.",
        "Collaboration with peers and adherence to the institution's values of integrity and service are essential for success.",
        "Participants gain hands-on experience with cutting-edge imaging tools and are involved in supervised postings in surgical and interventional cardiology settings.",
        "Opportunities for conducting and publishing research, along with developing communication and presentation skills, are integral to the programme.",
        "The mentorship provided fosters leadership, ethical decision-making, and a commitment to lifelong learning, equipping graduates with the skills necessary for academic and professional success.",
        "in Echocardiography at SSSIHMS is more than just a degree — it’s a transformative journey.",
        "It empowers healthcare professionals with the skills, values, and vision to make a meaningful impact in cardiovascular medicine.",
        "Graduates will emerge as future-ready echocardiographers, contributing to better outcomes, improved diagnostics, and compassionate patient care in an ever-evolving clinical landscape.",
      ] },
    ]
};

// ── BSc CARDIAC CARE TECHNOLOGY ──────────────────────────────────────────────
PAGES['bsc-cardiac-care-technology'] = {
  title:'BSc Cardiac Care Technology', crumb:'Departments · Cardiology · BSc CCT', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'Preparing competent cardiovascular technologists for invasive and non-invasive cardiology.',
  sections:[
    { type:'intro', eyebrow:'Programme Overview', title:'The Technologists Behind Cardiac Care',
      body:[
        'The primary objective of this programme is to prepare competent entry-level cardiovascular technologists in the cognitive (knowledge), psychomotor (skills) and affective (behaviour) learning domains for invasive and non-invasive cardiology.',
        'Graduates qualify as Cardiac Technologists, equipped to assist the cardiologist in non-invasive domains — electrocardiography, stress testing, patient cardiac monitoring and echocardiography — and in the invasive domain of the catheterisation laboratory.'
      ], pill:'No Tuition Fees' },
    { type:'features', eyebrow:'Training Environment', title:'Equipment You Will Train On', alt:true, items:[
      'Siemens Artis Zee Biplane Cathlab',
      'Philips FD10 Cathlab',
      'GE Vivid E95 echo machines and GE Vivid S70 portable echo',
      'Rotablator — rotational atherectomy',
      'EnSite Precision 3D mapping system',
      'IVUS — intravascular ultrasound',
      'Fully equipped Cardiac Care Unit'
    ] },
    PAUSED
  ]
};

// ── BSc PERFUSION TECHNOLOGY ─────────────────────────────────────────────────
PAGES['bsc-perfusion'] = {
  title:'BSc Cardiac Perfusion Technology', crumb:'Departments · Cardiac Surgery · BSc Perfusion', subnav:'cardiac-surgery', icon:R.imgCTVS,
  subtitle:'The only programme of its kind in the nation offered free of cost — training the perfusionists at the heart of open-heart surgery.',
  sections:[
    { type:'intro', eyebrow:'Programme Overview', title:'Life Support, Mastered',
      body:[
        'SSSIHMS Whitefield offers the unique BSc Cardiac Perfusion Technology (CPT) programme — the only one of its kind in the nation that gives graduates the opportunity to become perfusion technologists free of cost.',
        'Perfusion technology involves providing extracorporeal circulation to support and temporarily replace a patient’s respiratory and circulatory systems. Perfusionists are skilled allied health professionals who play a crucial role in open-heart surgical teams — selecting, setting up and operating the heart-lung machine and other life-support systems such as IABP, LVAD, RVAD and ECMO.',
        'The programme is structured as three years of study plus a one-year internship, offered in the spirit of "Service to Man is Service to God."'
      ], pill:'Free of Cost — Unique in India' },
    { type:'features', eyebrow:'The Profession', title:'What Perfusionists Bring', alt:true, items:[
      'Composure and precision in high-stakes surgical situations',
      'Meticulous attention to detail',
      'Clear communication within the surgical team',
      'Commitment to staying current with the field',
      'Readiness for on-call duty — nights, weekends and holidays'
    ] },
    { type:'cards', eyebrow:'After Graduation', title:'Career Pathways', cols:3, items:[
      { title:'Clinical Perfusion', desc:'Operating heart-lung machines and life-support systems in cardiac surgical centres.' },
      { title:'Teaching & Research', desc:'Faculty and research roles in educational institutions.' },
      { title:'Industry', desc:'Manufacturers of perfusion-related supplies and equipment.' }
    ] },
    PAUSED
  ]
};

// ── BSc ANAESTHESIA & OT TECHNOLOGY ──────────────────────────────────────────
PAGES['bsc-anesthesia-technology'] = {
  title:'BSc Anaesthesia & OT Technology', crumb:'Departments · Anesthesiology · BSc Anesthesia Tech', subnav:'anesthesiology', icon:R.imgAnesthesiology,
  subtitle:'A 4-year RGUHS degree training the technologists who support anaesthesia and surgery.',
  sections:[
    { type:'intro', eyebrow:'Programme Overview', title:'Supporting Every Safe Surgery',
      body:[
        'The role of the Anaesthesia and Operation Theatre Technologist is to support the work done by professional anaesthesia and surgical personnel. Every year, 10 students are admitted to the B.Sc Anaesthesia & OT Technology programme under the aegis of RGUHS; the course duration is 4 years.',
        'Rotational postings are carried out in the specialty theatres of OBG, ENT, orthopaedics, eye, dental, general surgery, neurosurgery, CTVS and urology.'
      ], pill:'10 Seats · RGUHS · 4 Years' },
    { type:'split', alt:true, cols:[
      { eyebrow:'Anaesthesia Technology', title:'In the Theatre & ICU', body:[
        'Equipment maintenance and servicing — cleaning, sterilising, assembling, calibrating, testing and troubleshooting — plus requisitioning and record-keeping, and operating the mechanical, pneumatic and electronic equipment used to monitor and manage patients under anaesthesia.'
      ] },
      { eyebrow:'OT Technology', title:'Running the Operating Room', body:[
        'Receiving and positioning patients, preparing the OT table, handling sterilised instruments from CSSD, replenishing the crash cart, maintaining hand hygiene and OT movement patterns, gowning and gloving, and shifting patients from OT to ICU after surgery.'
      ] }
    ] },
    { type:'faculty', eyebrow:'Programme Leadership', title:'Principal & Faculty',
      sub:'Supported by the attending staff of the surgical departments. Senior Manager: Mr. Shravan Kumar.', cols:3, items:[
      { name:'Dr. Kolli S. Chalam', role:'Principal — Head, Department of Anaesthesiology' },
      { name:'Dr. Pankaj Punetha', role:'Faculty' },
      { name:'Dr. Anitha Diwakar', role:'Faculty' },
      { name:'Dr. Geetanjali', role:'Faculty' },
      { name:'Dr. Anuradha', role:'Faculty' },
      { name:'Dr. Vrushali', role:'Faculty' }
    ] },
    PAUSED
  ]
};

// ── BSc MEDICAL IMAGING TECHNOLOGY ───────────────────────────────────────────
PAGES['bsc-mit'] = {
  title:'BSc Medical Imaging Technology', crumb:'Departments · Radiology · BSc MIT', subnav:'radiology', icon:R.imgRadiology,
  subtitle:'A 4-year RGUHS degree — free education as seva, on cutting-edge imaging equipment.',
  sections:[
    { type:'intro', eyebrow:'Programme Overview', title:'Technology With Compassion',
      body:[
        'The B.Sc in Medical Imaging Technology, affiliated to the Rajiv Gandhi University of Health Sciences, integrates academic learning with hands-on clinical training — preparing students to operate advanced imaging equipment, deliver safe and compassionate patient care, and work collaboratively in healthcare teams.',
        'The course runs 4 years including a one-year internship, with clinical rotations across general X-ray, CT, MRI, ultrasound and DSA at hospitals under the Sri Sathya Sai Central Trust. Intake is deliberately small — 3 to 5 students a year — ensuring personalised training and mentorship.',
        'Tuition is fully funded by the Sri Sathya Sai Central Trust (₹0); students bear only hostel, food and exam fees. Eligibility: PUC/12th with Physics, Chemistry and Biology plus English, age below 25; currently only female candidates are eligible. Lateral entry is available per RGUHS norms.'
      ], pill:'₹0 Tuition · 3–5 Seats' },
    { type:'features', eyebrow:'Curriculum', title:'Subjects You Will Study', alt:true, items:[
      'Anatomy & physiology',
      'Radiation physics, protection and patient care',
      'Imaging techniques, procedures and positioning',
      'Radiographic equipment & quality control',
      'Pathology',
      'RIS / PACS software training'
    ] },
    { type:'cards', eyebrow:'After Graduation', title:'Career Opportunities', cols:3, items:[
      { title:'Radiographer', desc:'Hospitals and diagnostic centres, with specialisations in CT, MRI and cath lab. High demand in India and abroad.' },
      { title:'Application Specialist', desc:'Roles with imaging companies such as GE, Philips and Siemens.' },
      { title:'Education & Software', desc:'Teaching, research and RIS/PACS software roles.' }
    ] },
    { type:'intro', eyebrow:'How to Apply', title:'Contact the Academic Section', narrow:true, alt:true,
      body:['The Academic Coordinator, Sri Sathya Sai Institute of Higher Medical Sciences, EPIP Area, Whitefield, Bangalore-560 066 · registrarblr@sssihms.org.in · 080-28411500 (Ext 415)'] },
    PAUSED
  ]
};

// ── BSc MEDICAL LAB TECHNOLOGY ───────────────────────────────────────────────
PAGES['bsc-mlt'] = {
  title:'BSc Medical Lab Technology', crumb:'Services · Lab & Blood Bank · BSc MLT', subnav:'lab',
  subtitle:'Training laboratory technologists with depth of understanding — and a heart for service.',
  sections:[
    { type:'intro', eyebrow:'Programme Overview', title:'Behind Every Diagnosis',
      body:[
        'The B.Sc Medical Laboratory Technology programme prepares medical laboratory technologists with a clear, in-depth understanding of the concepts and principles behind laboratory investigations, along with the practical skills to work in any setup — from a primary health centre to a tertiary care hospital.',
        'Beyond technical competence, the programme develops communication skills, ethics, fidelity and compassion, and the decision-making competence needed for supervisory and managerial roles.'
      ], pill:'No Tuition Fees' },
    { type:'intro', eyebrow:'Where You Train', title:'A Full Laboratory Complex', alt:true, narrow:true,
      body:['Students train across the hospital’s microbiology, biochemistry, hematology, clinical pathology and histopathology sections, and the in-house blood bank — all running full LIS integration, barcoding and quality-assurance programmes.'],
      link:{ label:'Lab Infrastructure', page:'lab-infrastructure' } },
    PAUSED,
        { type:'intro', eyebrow:"BSc MLT", title:"Programme Details", body:[
        "To prepare medical laboratory technologists with a clear, in-depth understanding of those concepts and principles which are the basis of the laboratory investigations and to equip them with the skills required to apply these concepts in practical work such that they are suitable for work in any type of setup - from a primary health center to a tertiary care hospital.",
        "In addition to technical proficiency, cultivate a personality comprising of good communication skills, ethical behavior and fidelity; and have a compassionate attitude.",
        "In addition, equip them with information and make them competent to perform in decision-making roles like those of a supervisor or a manager.",
      ] },
    ]
};

// ── Cross-links: point existing pages at the new programme pages ─────────────
const linkMap = {
  'Cardiac Care Technology':'bsc-cardiac-care-technology',
  'Perfusion Technology':'bsc-perfusion',
  'Anesthesia Technology':'bsc-anesthesia-technology',
  'Medical Imaging Technology':'bsc-mit',
  'Medical Lab Technology':'bsc-mlt',
  'MSc Echocardiography':'msecho'
};
const N = PAGES['nursing-and-allied-health'];
if (N) N.sections.forEach(s => {
  if (s.type === 'cards' && s.items) s.items.forEach(it => {
    if (linkMap[it.title]) it.link = { label:'Programme Details', page:linkMap[it.title] };
  });
});

})();
