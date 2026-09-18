// sssihms-live-radiology.jsx — Radiology: department, faculty, infrastructure. Full live content.
// Sources: /radiology1/, /radiology1/radiology-faculty/, /radiology1/infrastructure/
(function(){
const PAGES = window.PAGES;
const R = window.__resources || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const CDN = 'https://cdn.sssihms.org/sssihms/wp-content/uploads/';
const IMG = {
  swami: CDN + '2015/06/Swami-Blessing-Radiology.jpg',
  reporting: CDN + '2015/06/SSMT_913-Web.jpg',
  mri: U + '2015/05/MRI.jpg',
  ct: U + '2015/05/GE-CT-Scanner.jpg',
  cathlab: U + '2015/05/Biplane-Cathlab.jpg'
};
const GALLERY = [
  { src:IMG.swami, caption:'Swami Blessing Radiology' },
  { src:IMG.reporting, caption:'Radiology Reporting Room' },
  { src:IMG.mri, caption:'Siemens MAGNETOM Aera 1.5 T MRI' },
  { src:IMG.ct, caption:'GE HD 750 128 Slice CT Scanner' },
  { src:IMG.cathlab, caption:'Siemens Artis Zee Biplane Cath Lab' }
];

PAGES['radiology'] = {
  title:'Department of Radiodiagnosis and Imaging', crumb:'Departments · Services · Radiology', subnav:'radiology', icon:R.imgRadiology,
  subtitle:'State of the art MRI, CT Scanner and Biplane Cathlab, supporting the clinical needs of the hospital.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Diagnostic and Interventional Imaging',
      image:IMG.swami, imageLabel:'Swami Blessing Radiology',
      body:[
        'The Department of Radiodiagnosis and Imaging at SSSIHMS, Bangalore provides expert diagnostic and interventional services to support the clinical needs of our hospital as well as selected referrals from other hospitals within the Sri Sathya Sai healthcare system. Our services include X-ray, ultrasound, CT, MRI, DSA, and interventional procedures using state-of-the-art technologies. We are supported by an enterprise HIS and dedicated RIS for electronic patient medical records, computer order entry systems, PACS, high-end thin-client based workstations, teleconferencing and Dragon voice recognition system.',
        'The department consists of several full time radiologists, visiting faculty from both India and abroad, a B.Sc (Medical Imaging Technology) program, a Fellowship program in Cardiac and MR Imaging with various ongoing research activities, experienced technologists and support staff.',
        'Appointments for radiological studies are given based on orders by the hospital’s referring physicians only. External referrals for Radiological investigations are not entertained. If you need to cancel or reschedule an appointment taken at the department, please call the number below.'
      ] },
    { type:'cards', eyebrow:'Contact Information', title:'Reaching the Department', cols:2, alt:true, items:[
      { icon:'◆', title:'Department of Radiology', desc:'SSSIHMS, EPIP Area, Whitefield, Bangalore-560066. Tel no: (080) 28004777. Email: radiologyblr@sssihms.org.in' },
      { icon:'◆', title:'Radiologists Interested in Joining Us', desc:'Please fill in the online application and we will contact you.', link:{ label:'Apply for staff position', href:'https://forms.gle/tu4f25ZjAJchFEkD7' } }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Department and Its Equipment', items:GALLERY }
  ]
};

PAGES['radiology-faculty'] = {
  title:'Faculty — Radiology', crumb:'Departments · Services · Radiology · Faculty', subnav:'radiology', icon:R.imgRadiology,
  subtitle:'Full-time radiologists supported by national and international faculty who teach and report remotely.',
  sections:[
    { type:'faculty', eyebrow:'Consultants', title:'Department Faculty', cols:3, items:[
      { name:'Dr. Karthik Dattani', role:'MD Radiology', slot:'rad-fac-karthik-dattani' },
      { name:'Dr. Bhavana KG', role:'MD Radiology', slot:'rad-fac-bhavana-kg' },
      { name:'Dr. Himalini', role:'MD Radiology', slot:'rad-fac-himalini' }
    ] },
    { type:'prose', eyebrow:'National and International Faculty', title:'Weekly Discussions From Around the Globe', alt:true,
      body:[
        'Esteemed National and International radiologists chair weekly discussions and give lectures from around the globe using the latest teleconferencing systems for seamless communication.'
      ] },
    { type:'faculty', eyebrow:'Visiting Faculty', title:'National and International Radiologists', cols:2, items:[
      { name:'Dr. Vijay Chundi', role:'Certificate of Added Qualification (CAQ) in neuroradiology', detail:'Consultant with Radiology Imaging Associates, Stuart, Florida' },
      { name:'Dr. Asokan', role:'Fellow, American Board of Radiology', detail:'Clinical Assistant Professor, Department of Radiology, University of Illinois, Chicago, USA' },
      { name:'Dr. Jyoti Parikh', role:'Consultant Radiologist', detail:'Guy’s and St Thomas’ Hospitals NHS Foundation Trust, London, UK' },
      { name:'Dr. Maheswaran', role:'Consultant Radiologist', detail:'Croydon University Hospital, London' },
      { name:'Dr. Muthukumar', role:'Consultant Musculoskeletal Radiologist', detail:'Royal National Orthopaedic Hospital, Stanmore, London, UK' },
      { name:'Dr. Gustavo Poggio', role:'Medical Director', detail:'Centro de Imágenes Médicas de la Plata, Buenos Aires Province, Argentina' },
      { name:'Dr. Kedar Chintapalli', role:'Professor of Radiology', detail:'UT Health Science Center, San Antonio, Tx, USA' },
      { name:'Dr. Yogi Trivedi', role:'Consultant Radiologist', detail:'University of Maryland Medical Center, Baltimore, USA' },
      { name:'Dr. Puvaneswary Murugasu', role:'Senior Staff Specialist, Division of Radiology', detail:'John Hunter Hospital, New Lambton Heights, Australia' },
      { name:'Dr. Bagyam Raghavan', role:'Consultant Radiologist', detail:'Apollo Specialty Hospital, Chennai, India' },
      { name:'Dr. Kanchan Gupta', role:'Consultant Radiologist', detail:'Seven Hills Hospital, Mumbai, India' },
      { name:'Dr. Avneesh Chhabra', role:'Associate Professor', detail:'UT Southwestern Medical Center, Texas' }
    ] },
    { type:'prose', eyebrow:'Serving at SSSIHMS', title:'Visiting Radiologists', alt:true,
      body:[
        'Radiologists from both India and abroad who wish to serve at the hospital as a visiting radiologist may write to the Director at directorwfd@sssihms.org.in'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Department and Its Equipment', items:GALLERY }
  ]
};

PAGES['radiology-infrastructure'] = {
  title:'Infrastructure — Radiology', crumb:'Departments · Services · Radiology · Infrastructure', subnav:'radiology', icon:R.imgRadiology,
  subtitle:'A flat-panel biplane cath lab, a 128-slice high-definition CT and a 1.5T MRI — all provided free of cost.',
  sections:[
    { type:'prose', eyebrow:'Siemens Artis Zee Biplane Cath Lab', title:'Real-Time 3D Imaging for Neuro and Cardiac Intervention',
      image:IMG.cathlab, imageCaption:'Siemens Artis Zee Biplane Cath Lab',
      body:[
        'Some neurosurgical disorders are not suitable for surgery and patients with these disorders are left with no option other than intervention. The prohibitive cost of neuro interventions makes this treatment unaffordable even to the middle class family.',
        'Flat panel detector systems give a more discrete image of the anatomy. The introduction of flat panel detectors (FPD) — replacing image intensifiers — ensures the highest visibility of vessels from corner to corner, and brings down the radiation dose to the lowest possible levels.',
        'Many centers go in for a monoplane cath lab as the cost for a biplane cath lab is also prohibitive. Because bi-plane systems capture image data from detectors on two axes, they are able to show 3D images in real time. As it is especially useful in neurovascular and pediatric cardiac procedures the team of specialists in Neurosurgery, Cardiology & Radiology opted for a Biplane Cath Lab.',
        'Keeping in mind Bhagawan Sri Sathya Sai Baba’s vision of providing high tech/best medical care free of cost to one & all, the Sri Sathya Sai Central Trust procured a flat panel Biplane Cath Lab.',
        'The Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield now has a Biplane cathlab that caters to the needs of both Cardiology & Neurosurgery. The Siemens Artis Zee Biplane Cathlab with a 56" LCD display has being commissioned. This will augment the services of Cardiology, Neurosurgery & Interventional Neuroradiology.'
      ] },
    { type:'features', eyebrow:'Features', title:'The Siemens Artis Zee Biplane Cath Lab Has the Following Features', alt:true, items:[
      'syngo DynaCT offers the major advantage of immediate detection or exclusion of intracranial complication without patient transfer. For Cardiac, it is especially suited for the planning, performance and follow-up of interventions through display of 3D morphology directly in the cathlab',
      'Syngo neuro aneurysm — is used for planning of virtual stenting in management of intracranial aneurysms',
      'Syngo iguide — provides live and integrated needle guidance for interventional procedures and enables easy planning and navigation',
      'syngo Inspace 3D/3D fusion allows fusion of morphological and functional information from different modalities like CT and MRI enhancing visualization of pathology',
      'Clear Stent — enables improved display of stents for better deployment'
    ] },
    { type:'prose', eyebrow:'GE Discovery CT750 HD CT Scanner', title:'The World’s First High-Definition CT Scanner',
      image:IMG.ct, imageCaption:'GE HD 750 128 Slice CT Scanner', reverse:true,
      body:[
        'The GE Discovery CT750 HD is a high-end 128-slice CT scanner and the world’s first High definition CT scanner. It offers both high image quality and multiple dose reduction features on one platform.',
        'The clinical benefits that accrue with this scanner are:',
        '<strong>Low radiation dose for patients:</strong> This scanner dramatically reduces the amount of dose needed to acquire a high-performance image thus ensuring patient safety, one of our primary goals.',
        '<strong>Non-invasive Cardiac CT:</strong> This high-definition CT opens the door to new non-invasive diagnostic procedures and innovative techniques for challenging clinical conditions with the highest available Cardiac CT spatial resolution.',
        '<strong>First Quantitative dual-energy CT:</strong> Gemstone Spectral Imaging is unique dual energy technique that enables clinicians to identify the chemical composition of body materials and aids in the characterization of pathology.',
        'This new generation CT scanner can better detect coronary artery stenosis in people with suspected or known coronary artery disease in whom imaging is difficult with earlier generation CT scanners.',
        'With the acquisition of this latest technology, SSSIHMS further enhances its commitment to provide its clinicians with the state-of-the-art facilities and empower them to provide the best possible care to its patients.'
      ] },
    { type:'prose', eyebrow:'Siemens MRI MAGNETOM Aera', title:'One of the Most Advanced 1.5T MRI Systems Available', alt:true,
      image:IMG.mri, imageCaption:'Siemens MAGNETOM Aera 1.5 T MRI',
      body:[
        'With the procurement of MAGNETOM Aera, SSSIHMS, Whitefield has one of the most advanced 1.5T MRI systems available in the industry today.',
        'It delivers excellent patient-centered care, helping us to offer a comprehensive examination portfolio that will benefit patients across a wide spectrum of diseases, in addition to tremendously enhancing staff productivity.',
        'A few salient features that enhance our focus to provide the best care possible to the patient are:',
        'With a 70 cm Open Bore, it accommodates a large variety of patient sizes, shapes and conditions reducing fear and anxiety in patients. It offers high resolution and fast protocols even for uncooperative patients, whose imaging would have been sub-optimal otherwise.',
        'With a comprehensive suite of applications, the system is capable of advanced imaging in Neurology, orthopedics, cardiology, oncology and pediatrics. Specifically, this system overcomes many existing challenges in cardiac imaging and will be used for applications ranging from morphology and ventricular function to tissue characterization. The Neuro Suite includes advanced protocols for diffusion imaging, perfusion imaging, and fMRI which improve diagnostic accuracy and help clinicians in improved treatment planning and patient management.',
        'With the accuracy of Tim 4G technology integrated with the consistency brought by scanning by DOT (a comprehensive workflow solution), the radiologists can achieve excellent image quality and exam reproducibility. The personalized scanning of DOT allows the technologists to get the best scan for each individual patient. DOT Engines allow the radiologists uniquely tailored, optimized scans configurable to patient condition or clinical question.',
        'With this sophisticated tool, the radiologists can provide faster and accurate diagnosis with greater productivity, while allowing patients to enjoy a most comfortable scan experience.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Department and Its Equipment', items:GALLERY }
  ]
};
})();
