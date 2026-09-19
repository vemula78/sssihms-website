// sssihms-live-depts.jsx — Full live-site content for department main pages.
// Source: whitefield.sssihms.org. Text reproduced in full; images are the live site's own files.
(function(){
const PAGES = window.PAGES;
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';

const CARD = {
  biplane: U + '2015/05/Biplane-Cathlab.jpg',
  fd10: U + '2015/05/DSC06970.jpg',
  e95: U + '2022/11/E95-Echo-2.jpg',
  s70: U + '2022/11/S70-Echo-2.jpg',
  rota: U + '2022/11/ROTABLATOR.jpg',
  ensite: U + '2022/11/Ensite-Precision-3D-Mapping-System-2.jpg',
  ivus: U + '2023/03/IVUS.jpg',
  ccu: U + '2022/11/CCU-BED-WITH-EQUPMENTS-GOOD.jpg'
};

PAGES['cardiology'] = {
  title:'Cardiology', crumb:'Departments · Cardiology', icon:(window.__resources||{}).imgCardiology, subnav:'cardiology',
  subtitle:'Outpatient, inpatient and critical care — a comprehensive range of adult and pediatric cardiac interventions, all offered completely free of charge.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'One of the Leading National Institutions in Cardiac Care',
      image:CARD.biplane, imageLabel:'Siemens Artis Zee Biplane Cathlab',
      body:[
        'The Department of Cardiology at SSSIHMS, Bangalore provides a comprehensive range of services including outpatient, inpatient, and critical care, all offered completely free of charge. Renowned as one of the leading national institutions, it performs an extensive variety of adult and pediatric cardiac interventions.'
      ], pill:'All Services Free of Charge' },
    { type:'prose', eyebrow:'Clinical Excellence', title:'Individual Attention, Customized Evaluation', alt:true,
      image:CARD.fd10, imageCaption:'Philips FD10 Cathlab', reverse:true,
      body:[
        'The department distinguishes itself through state-of-the-art diagnostic and interventional procedures, ensuring a high degree of clinical excellence. A broad spectrum of clinical conditions presents valuable academic exposure to practitioners and trainees. Advanced tests and procedures facilitate accurate diagnosis and inform strategic treatment planning, with particular emphasis on individual attention and customized evaluation for every patient.'
      ] },
    { type:'prose', eyebrow:'Outpatient Services and Interventions', title:'29,158 Consultations, 2,738 Cathlab Procedures',
      body:[
        'The Outpatient Department offers consultations and diagnostics across adult and paediatric cardiology. In 2025&ndash;26 the department recorded <strong>29,158 cardiac outpatient consultations</strong> and <strong>2,738 cathlab procedures</strong>, the latter including 1,101 diagnostic coronary angiograms, 638 coronary interventions, 313 congenital device closures and 199 electrophysiology studies or ablations.'
      ] },
    { type:'features', eyebrow:'Cathlab based Procedures', title:'Procedures Performed', alt:true, items:[
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
    { type:'features', eyebrow:'Unique Features', title:'What Sets the Department Apart', items:[
      'Physicians can determine diagnostic and treatment plans without concern for the patient’s financial situation, thanks to cross-departmental collaboration with Radiology for Cardiac CT and MRI.',
      'Advanced noninvasive work in areas such as 3D and 4D echocardiography, including studies on ventricular and atrial strain.',
      'High numbers of Valvuloplasty procedures, notably mitral valvuloplasty requiring septal puncture.',
      'Expertise in less common procedures, such as Alcohol septal ablations, VSD and RSoV closures, APW transcatheter closures, TVAR/EVAR and CRT implantations.',
      'Recognition as a center of excellence for postgraduate and doctoral training in cardiology.',
      'Patient-care plans grounded in thorough clinical evaluations and supported by advanced investigations, offering exceptional opportunities for professional learning and growth.'
    ] },
    { type:'prose', eyebrow:'Infrastructure', title:'Cardiology OPD', alt:true,
      image:CARD.e95, imageCaption:'GE Vivid E95 Echo Machine',
      body:[
        'The Cardiology OPD is equipped with two GE Vivid Ultra E95 machines, a Philips EPIC CVx v11 and a Siemens ACUSON Origin, all with advanced AI capabilities. It also has two GE Marquette Treadmill Stress Systems with Cardiosoft, two Philips Biphasic Defibrillators, a H3 + 7-day Holter Recording and Analysis system, and a Montara Eli 280c digital ECG. All the equipment complies with DICOM standards.'
      ] },
    { type:'prose', eyebrow:'Infrastructure', title:'Cathlab Facilities',
      image:CARD.rota, imageCaption:'Rotablator', reverse:true,
      body:[
        'The Cardiology Department features advanced facilities, including one Siemens Biplane Cathlab equipped with the Sensis Hemolite Hemodynamic system and one Philips FD 10C Monoplane Cathlab, supported by the Xper Cardioflex Hemodynamic system. There is also capacity for future expansion to a total of four Cathlabs. To support electrophysiological procedures, St Jude EPMed systems are available for EP studies. Both Cathlabs are fully equipped with defibrillators, ventilators, and intra-aortic balloon pumps, providing essential support for emergency interventions.',
        'For advanced interventional cardiology, the department utilizes Rotablator technology and intravascular ultrasound (IVUS) systems. Additionally, for complex electrophysiology work, the EnSite Velocity 3D mapping system is implemented to enhance procedural accuracy and outcomes.'
      ] },
    { type:'prose', eyebrow:'Infrastructure', title:'Cardiac Care Unit', alt:true,
      image:CARD.ccu, imageCaption:'CCU bed with equipment',
      body:[
        'The Cardiac Care Unit (CCU) comprises 36 beds and is outfitted with state-of-the-art patient monitors, echocardiography and ECG machines, ventilators, intra-aortic balloon pumps, and defibrillators. Its monitors were replaced in 2025&ndash;26 with GE B155 units on central monitoring, linked to the GE Centricity patient-monitoring system, and three Mediana D100-H defibrillators were added. Portable X-ray imagers and Witt haemodynamic recorders are available for comprehensive pressure monitoring. The CCU is further supported by infusion pumps, ensuring precise management of patient medications and therapies.'
      ] },
    { type:'gallery', eyebrow:'Equipment', title:'Diagnostic and Interventional Equipment', items:[
      { src:CARD.s70, caption:'GE Vivid S70 portable Echo Machine' },
      { src:CARD.ensite, caption:'Ensite Precision 3D Mapping System' },
      { src:CARD.ivus, caption:'IVUS — Intravascular Ultrasound' }
    ] },
    { type:'prose', eyebrow:'Academics & Research', title:'Excellence in Academic Achievements and Research', alt:true,
      body:[
        'The Cardiology Department at Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), Whitefield, has consistently demonstrated excellence in clinical care, academic contributions, and research. Over the years, the department has earned national and international recognition through numerous awards and impactful publications.'
      ] },
    { type:'prose', eyebrow:'Awards and Recognitions', title:'National and International Recognition',
      body:[
        '<strong>DrNB Gold Medals:</strong> The department has produced <strong>five Gold Medalists</strong> in the DrNB (Diplomate of National Board) Cardiology program, including Dr. Keshav Murthy (2005), Dr. Deepak Krishnamurthy (2006), Dr. Rohit Dixit (2012), Dr. Booma S (2017), and Dr. Ravi Kachhela (2018).',
        '<strong>National Awards:</strong> Multiple <strong>Best Oral Abstracts</strong>, <strong>Best Posters</strong>, and <strong>Original Research Awards</strong> at CSI (Cardiological Society of India) conferences from 2013 to 2025. <strong>Modi Mundi Award</strong> for Best Original Study (2018). <strong>Professor D.P. Basu Memorial Award</strong> for India’s first AI/ML-based risk score for HOCM (2021–2022). Recognition for pioneering scoring systems like <strong>PRISM</strong> and <strong>BASE</strong> for PCI and BMV outcomes.',
        '<strong>International Recognition:</strong> Presentations at <strong>ACC (American College of Cardiology)</strong>, <strong>C3 Summit USA</strong>, <strong>SCAI USA</strong>, and <strong>Asian Society of Clinical Cardiology</strong>. Fellowship and invited lectures at institutions like <strong>Mount Sinai School of Medicine</strong>, <strong>Asan Medical Centre (Seoul)</strong>, and <strong>Lund Institute (Sweden)</strong>.'
      ] },
    { type:'prose', eyebrow:'Publications and Research Contributions', title:'Peer-Reviewed Journals and Innovative Research', alt:true,
      body:[
        '<strong>Peer-Reviewed Journals:</strong> <em>Heart Rhythm O2</em> (2022): Collaborative publication with global experts. <em>BMC Health Services Research</em> (2024): Study on travel costs and point-of-care ultrasound. <em>American Heart Journal</em> (2025): Design of the multicenter Dig-RHD trial. <em>Current Opinion in Cardiology</em> (2025): Imaging in cardiac amyloidosis.',
        '<strong>Innovative Research:</strong> Development of <strong>ML-guided predictive models</strong> for congenital heart disease and mitral stenosis. First-in-literature studies on <strong>RV-to-PA coupling</strong> and <strong>C3PW ML method</strong> for PTMC outcomes.'
      ] },
    { type:'intro', eyebrow:'Research Activities', title:'National Trials and Institutional Studies', narrow:true,
      body:[
        'The Cardiology Research division participates in national clinical trials alongside principal investigators from public-funded institutions, and leads studies from within the Institute. Current work includes the ICMR-supported Dig-RHD trial of digoxin in rheumatic heart disease, for which the Institute is a randomising site and whose results were published in <em>JAMA</em> in June 2026; COLHEF, the ICMR multicentre trial of colchicine in heart failure; STRong Heart, a George Institute study of remote monitoring for patients on oral anticoagulation; and three studies of the PulzCAD wearable ECG in coronary disease and heart failure. Device and stent studies with Meril Life Sciences and GE Healthcare are also under way.'
      ], link:{ label:'Full Research & Publications Record', page:'cardiology-achievements' } }
  ]
};
})();
