// sssihms-live-faculty.jsx — Full live-site content for faculty and infrastructure pages.
// Source: whitefield.sssihms.org. Text reproduced in full; images are the live site's own files.
(function(){
const M = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/09/';
const PAGES = window.PAGES;
const R = window.__resources || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';

// ── CARDIOLOGY · FACULTY ─────────────────────────────────────────────────────
PAGES['cardiology-faculty'] = {
  title:'Faculty — Cardiology', crumb:'Departments · Cardiology · Faculty', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'The Cardiology Department is blessed with committed faculty.',
  sections:[
    { type:'faculty', eyebrow:'Consultants', title:'Department Faculty', cols:3, items:[
      { name:'Dr. Reeta Varyani', role:'I/C HOD and Sr. Consultant', photo:U + '2022/11/Dr.-Reeta-with-patients.jpg' },
      { name:'Dr. Prayaag Kini', role:'Sr. Consultant', photo:U + '2022/11/Prayag-Kini-with-patient.jpg' },
      { name:'Dr. Barooah Banajith', role:'Sr. Consultant', photo:U + '2022/11/IMG_5808.jpg' }
    ] },
    { type:'faculty', eyebrow:'Honorary Faculty', title:'Honorary Faculty', cols:2, alt:true, items:[
      { name:'Dr. Pravat Kumar Dash', role:'MBBS MD(Med.) DM(Card.) FACC', detail:'Capitol Hospital, Bhubhaneshwar, India', photo:U + '2022/11/Dr.-P-K-Dash.jpg' },
      { name:'Dr. Srikanth Sola', role:'Honorary Faculty', photo:U + '2019/02/Dr.-Srikanth-Sola.jpg' }
    ] },
    { type:'faculty', eyebrow:'Visiting Faculty', title:'Visiting Faculty', cols:2, items:[
      { name:'Dr. Abhiram Prasad', role:'MD FACC MRCP', detail:'Consultant Interventional Cardiologist, Mayo Clinic, Rochester, Minnesota, USA' },
      { name:'Dr. Arvin Narula', role:'MD FACC', detail:'Sharp Memorial Hospital, Structural & Interventional Cardiologist, San Diego, CA' },
      { name:'Dr. Ashok Garg', role:'MD, DM FACC FHRS', detail:'Clinical Cardiac Electrophysiologist, Midwestern University, Arizona, USA', photo:M + 'cardio-visiting-ashok-garg.jpg' },
      { name:'Dr. Brahmajee Kartik Nallamothu', role:'MD, MPH, FACC, FAHA', detail:'University of Michigan Health System' },
      { name:'Dr. Collin G Cowley', role:'MD', detail:'Pediatric Cardiologist, Salt Lake City, UTAH' },
      { name:'Dr. David Nykanen', role:'MD', detail:'Pediatric Cardiologist, Orlando, Florida' },
      { name:'Dr. Eric J. Nordsieck', role:'MD', detail:'Cardiac Electrophysiologist, McKenzie-Willamette Medical Center, Springfield Oregon' },
      { name:'Dr. Gregory Kent Feld', role:'MD FACC FHRS', detail:'Cardiac Electrophysiologist, UCSD, USA', photo:M + 'cardio-visiting-gregory-feld.jpg' },
      { name:'Dr. Hari P. Chaliki', role:'MD, MS', detail:'Non Invasive Cardiologist, Department of Cardiovascular Diseases, Mayo Clinic, Arizona' },
      { name:'Dr. Jeanny K. Park', role:'MD', detail:'Pediatric Cardiac Electrophysiologist, University of California, Davis Health' },
      { name:'Dr. Jon P Donnelly', role:'MD', detail:'Pediatric Cardiologist, Maine Medical Center' },
      { name:'Dr. Komandoor S. Srivathsan', role:'MD', detail:'Cardiac Electrophysiologist, Mayo Clinic, Arizona', photo:M + 'cardio-visiting-komandoor-srivathsan.jpg' },
      { name:'Dr. Kelly Jane Airey', role:'MD, FHRS, FACC', detail:'Electrophysiologist and Cardiologist, Cardiovascular Medicine, P.C. Davenport, Iowa' },
      { name:'Dr. Keshav R Nayak', role:'MD', detail:'Interventional Cardiologist, Scripps Memorial Hospital La Jolla, San Diego, California', photo:M + 'cardio-visiting-keshav-nayak.jpg' },
      { name:'Dr. Krishna M. Rao', role:'MD, DM, FACC', detail:'Professor of Medicine/Cardiology, Advanced Echocardiography and CT Coronary Angiography. University of Rochester, NY, USA' },
      { name:'Dr. Madhu Reddy', role:'MD FACC, FHRS', detail:'Cardiac Electrophysiology, University of Kansas Health System' },
      { name:'Dr. Mehul P Patel', role:'MD', detail:'Structural & Adult congenital specialist, Sutherland Cardiology Clinic, Memphis' },
      { name:'Dr. Mevan Wijetunga', role:'MD MBA', detail:'Cardiac Electrophysiologist, Altru Health System, North Dakota, USA' },
      { name:'Dr. Moeen Abedin', role:'MD', detail:'Cardiac Electrophysiologist, El Paso, Texas, USA', photo:M + 'cardio-visiting-moeen-abedin.jpg' },
      { name:'Dr. Nischala Nannapaneni', role:'MD', detail:'Cardiac Electrophysiologist, Mountain Point Medical Center, Salt Lake City, UT, USA' },
      { name:'Dr. Roger Freedman', role:'Professor of Electrophysiology', detail:'University of Utah', photo:M + 'cardio-visiting-roger-freedman.jpg' },
      { name:'Dr. Sai Leela Dhanekula', role:'Cardiac Electrophysiologist', detail:'Osf Cardiovascular Institute, Rockford, IL, USA' },
      { name:'Dr. Sanjay K Shah', role:'MD FACC', detail:'Interventional Cardiologist, Good Samaritan Hospital-San Jose, California', photo:M + 'cardio-visiting-sanjay-shah.jpg' },
      { name:'Dr. Sanket S. Shah', role:'MD MHS FACC', detail:'Non Invasive Cardiologist, Children’s Mercy Hospital, Kansas City, USA' },
      { name:'Dr. Satish Goel', role:'MD', detail:'Electrophysiologist, Citrus Cardiology, Florida, USA' },
      { name:'Dr. Scott Wall', role:'MD', detail:'Cardiac Electrophysiologist, University of Utah, USA' },
      { name:'Dr. Shravan Nosib', role:'Interventional Cardiologist', detail:'Saskatoon, Saskatchewan', photo:M + 'cardio-visiting-shravan-nosib.jpg' },
      { name:'Dr. Sivaraman Yegya-Raman', role:'MD, FACC FHRS', detail:'Cardiac Electrophysiologist, South Jersey Heart Group, New Jersey, USA', photo:M + 'cardio-visiting-yegya-raman.jpg' },
      { name:'Dr. Sudhekar Mitra Nayak', role:'Interventional Cardiologist', detail:'Good Samaritan Hospital, Los Angeles, California' },
      { name:'Dr. Sunil Agarwal', role:'Interventional Cardiologist', detail:'Liverpool Heart And Chest Hospital, London' },
      { name:'Dr. Svjetlana Tisma-Dupanovic', role:'Pediatric Electrophysiologist', detail:'University of Kansas Hospital, USA' },
      { name:'Dr. Udaya Shankar Swarna', role:'MD', detail:'Electrophysiologist, Abilene, Texas, USA' },
      { name:'Dr. Ulrika Birgersdotter-Green', role:'MD', detail:'Director — Pacemaker and ICD Services, UCSD', photo:M + 'cardio-visiting-ulrika-birgersdotter-green.jpg' },
      { name:'Dr. Uma N Srivatsa', role:'MBBS, MAS, MS', detail:'Fellowship director, Cardiac Electrophysiology, University of California, Davis', photo:M + 'cardio-visiting-uma-srivatsa.jpg' },
      { name:'Dr. Vijay Krishnamoorthy', role:'MD', detail:'Interventional Cardiologist, Associate Professor, University of Rochester, USA', photo:M + 'cardio-visiting-vijay-krishnamoorthy.jpg' },
      { name:'Dr. (Air Cmde) Davinder Singh Chadha', role:'Interventional Cardiologist Consultant', detail:'Bengaluru', photo:M + 'cardio-visiting-ds-chadha.jpg' },
      { name:'Dr Ulhas M Pandurangi', role:'Chief Cardiac Electrophysiology', detail:'Arryhthmia Heart Failure Academy, The Madras Medical Mission, Chennai, India', photo:M + 'cardio-visiting-ulhas-pandurangi.jpg' },
      { name:'Dr. Mark Davies', role:'Consultant Cardiac Electrophysiologist', detail:'Oxford University Hospitals NHS Trust and Milton Keynes University Hospital NHS Trust, UK', photo:M + 'cardio-visiting-mark-davies.jpg' },
      { name:'Dr. Nageshwar Rao', role:'Pediatric Interventional Cardiologist', detail:'Rainbow Children’s Hospital — complex congenital device closures', photo:M + 'cardio-visiting-nageshwar-rao.jpg' }
    ] }
  ]
};

// ── CARDIOLOGY · INFRASTRUCTURE ──────────────────────────────────────────────
PAGES['cardiology-infrastructure'] = {
  title:'Infrastructure — Cardiology', crumb:'Departments · Cardiology · Infrastructure', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'Outpatient, inpatient, information systems and telemedicine facilities — every service free of charge.',
  sections:[
    { type:'prose', eyebrow:'Outpatient Services', title:'Cardiology OPD',
      image:U + '2022/11/E95-Echo-2.jpg', imageCaption:'GE VIVID E95 Echo Machine',
      body:[
        'The Cardiology OPD is equipped with 2 Philips 3D Colour Dopplers with Transthoracic and Transoesophageal probes, 2 GE Marquette Treadmill Stress Systems with Cardiosoft, 2 Philips Biphasic Defibrillators, a H3 + 7 day Holter Recording and Analysis system and a Montara Eli 280c digital ECG. All the equipment are DICOM complaint.'
      ] },
    { type:'gallery', eyebrow:'OPD Equipment', title:'Diagnostic Equipment in the OPD', alt:true, items:[
      { src:U + '2022/11/S70-Echo-2.jpg', caption:'GE Vivid S70 portable Echo Machine' },
      { src:U + '2022/11/IE33-machine-1.jpg', caption:'PHILIPS IE33 ECHO machine' },
      { src:U + '2022/11/GE-TMT-MACHINE.jpg', caption:'GE Marquette TMT' },
      { src:U + '2022/11/HOLTER-recorder.jpg', caption:'H3 + 7 day Holter' },
      { src:U + '2022/11/HP-100-ECG.jpg', caption:'HP 100 ECG' }
    ] },
    { type:'gallery', eyebrow:'Echocardiography', title:'The Echo Fleet', items:[
      { src:M + 'cardio-equip-ge-vivid-e95-ultra.jpg', caption:'GE Vivid E95 Ultra' },
      { src:M + 'cardio-equip-philips-epic-cvx-v11.jpg', caption:'Philips EPIC CVx v11' },
      { src:M + 'cardio-equip-siemens-acuson-origin.jpg', caption:'Siemens ACUSON Origin' },
      { src:M + 'cardio-equip-ge-vivid-s70.jpg', caption:'GE Vivid S70 portable' }
    ] },
    { type:'prose', eyebrow:'Inpatient Services', title:'Cathlabs and the Cardiac Care Unit',
      image:U + '2015/05/Biplane-Cathlab.jpg', imageCaption:'Siemens Artis ZEE BIPLANE CATHLAB', reverse:true,
      body:[
        'The Cardiology Department has 1 Siemens Biplane Cathlab with Sensis Hemolite Hemodynamic system and 1 Philips FD 10C monoplane Cathlab with Xper cardioflex hemodynamic system, with a provision to expand to 4 in due course. They are supplemented with St Jude EPMed systems for EP Studies. Cathlabs are equipped with Defibrillators, ventilators and Intra aortic Balloon Pumps. For Advanced Interventional cardiology work we have Rotablator and IVUS and for Advanced Electrophysiology work we have EnSite velocity 3D mapping system.',
        'The 36-bedded Cardiac Care Unit (CCU) is equipped with high-end patient monitors, Echo and ECG Machines, Ventilators, Intra Aortic Balloon Pumps, Defibrillators, portable X-Ray imagers, Witt haemodynamic recorders for pressure monitoring, and Infusion Pumps.'
      ] },
    { type:'gallery', eyebrow:'Interventional Equipment', title:'Cathlab and CCU', alt:true, items:[
      { src:U + '2015/05/DSC06970.jpg', caption:'Philips HD 10 Cathlab' },
      { src:U + '2023/03/IVUS.jpg', caption:'IVUS — Intravascular Ultrasound' },
      { src:U + '2022/11/ROTABLATOR.jpg', caption:'Rotablator' },
      { src:U + '2022/11/Ensite-Precision-3D-Mapping-System-2.jpg', caption:'Ensite Precision 3D Mapping System' },
      { src:U + '2022/11/CCU-BED-WITH-EQUPMENTS-GOOD.jpg', caption:'CCU BED WITH EQUPMENTS' },
      { src:M + 'cardio-equip-siemens-biplane-cathlab.jpg', caption:'Siemens Biplane Cathlab' },
      { src:M + 'cardio-equip-ep-workmate-claris.jpg', caption:'EP WorkMate Claris recording system' },
      { src:M + 'cardio-equip-ccu-patient-monitor.jpg', caption:'Patient monitor in the CCU' },
      { src:M + 'cardio-equip-hemodynamic-system.jpg', caption:'Haemodynamic recording system' },
      { src:M + 'cardio-equip-ge-mac5-ecg.jpg', caption:'GE MAC 5 digital ECG' }
    ] },
    { type:'prose', eyebrow:'Hospital Information Systems', title:'e-HIS, PACS and Echo View Sai',
      body:[
        'Cardiology Department harnesses the power of information technology to enhance the quality of care to our patients. Our hospital information system (e-HIS), is used by doctors actively to access the patient’s old electronic medical records, place test orders and view results. In addition, all medical images (Cath, ECG, TMT, Holter, CT, MRI, X-Ray) are viewed, shared and archived on Fuji PACS and Echocardiogram image management software — Echo view Sai from Matrix view developed in collaboration with SSSIHL, Puttaparthi.'
      ] },
    { type:'prose', eyebrow:'Telemedicine', title:'Consultations Across Thousands of Miles', alt:true,
      body:[
        'The Cardiology Department employs Telemedicine technologies to offer consultation services to patients staying thousands of miles away. This facility is used routinely to follow-up operated patients from these regions, saving them the hassle of travel and stay in Bangalore. Patients are called for a review or consultation to the hospital only when absolutely necessary.'
      ] },
    { type:'prose', eyebrow:'Counselling', title:'Counselling and Post-Procedural Rehabilitation',
      body:[
        'The counselling department interacts with the patients prior to and immediately after their procedure to ensure that healing occurs at not merely the physical, but also the emotional and spiritual dimensions.',
        'Even after the patients return to their villages and towns, doctors from their respective regions who are part of the hospital’s holistic rehab program are available to ensure that the patients are compliant with the instructions on diet, medication and lifestyle modifications.'
      ] }
  ]
};
})();
