// sssihms-live-dnb.jsx — DNB / DrNB residency pages, full live content.
// Sources: /drnb-cardiology/, /dnb-cardiac-surgery/, /neurosurgery/nesu-dnb/, /anesthesiology1/anes-dnb/
(function(){
const PAGES = window.PAGES;
const R = window.__resources || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';

PAGES['drnb-cardiology'] = {
  title:'DrNB — Cardiology', crumb:'Departments · Cardiology · DrNB', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'Where commitment meets excellence in cardiology training.',
  sections:[
    { type:'intro', eyebrow:'DrNB (Cardiology)', title:'DrNB (Cardiology) at Sri Sathya Sai Institute of Higher Medical Sciences, Bengaluru',
      image:U + '2015/05/DSC06970.jpg', imageLabel:'Cardiac Cath in progress',
      body:[
        'If you’re aspiring to become a confident and skilled cardiologist, the <strong>DrNB (Cardiology)</strong> program at <strong>Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), Whitefield, Bengaluru</strong>, should be your first choice.',
        'Since <strong>2002</strong>, our Department of Cardiology has been recognized by the <strong>National Board of Examinations, Ministry of Health, Government of India</strong>, as a premier centre for Cardiology Super Specialty training. Each year, we accept <strong>two highly motivated candidates</strong> into our <strong>three-year full-time program</strong>, offering a rigorous, hands-on, and patient-centred learning experience.'
      ] },
    { type:'prose', eyebrow:'Why Choose Us?', title:'Top Choice of NEET-SS Rankers', alt:true,
      body:[
        'Over the years, our program has consistently attracted top-ranking candidates from the NEET-SS exam. Our trainees have earned <strong>multiple gold medals</strong> in the national-level final exams — a testament to the strength of our academic foundation and clinical mentorship.',
        '<strong>Unmatched Clinical Exposure:</strong> Our busy OPDs cater to patients of <strong>all age groups</strong> and <strong>a wide spectrum of cardiac disorders.</strong> We also have referrals by various specialties including Neurology, Neurosurgery, Ophthalmology, Paediatrics, General Medicine, Gynaecology, Gastroenterology, Diabetology, Urology, General Surgery, Dermatology and Dentistry.'
      ] },
    { type:'features', eyebrow:'Clinical Exposure', title:'You’ll Gain Comprehensive Exposure To', items:[
      'Congenital, rheumatic, and atherosclerotic heart diseases',
      'Heart failure, electrophysiological disorders, and structural heart pathologies',
      'Cardiac emergencies and elective cardiac care',
      'Pre- and post-operative care in both interventional and surgical settings',
      'Vascular disorders through our integrated non-cardiac vascular program'
    ] },
    { type:'prose', eyebrow:'Hands-On, Real-World Experience', title:'You Won’t Just Observe', alt:true,
      body:[
        'You won’t just observe — you’ll <strong>actively participate</strong> in managing critically ill patients in our <strong>CCU</strong>, handle pre- and post-procedural cases, and make clinical decisions that shape lives.',
        '<strong>Our state-of-the-art Cathlabs</strong> (Philips & Siemens) support a full range of procedures.'
      ] },
    { type:'features', eyebrow:'Cathlab Procedures', title:'A Full Range of Procedures', items:[
      'Coronary and peripheral interventions',
      'Rheumatic and congenital valvuloplasties',
      'Device closures (ASD, VSD, PDA, RSoV, AP Window, VSR)',
      'EP studies, 3D mapping, RF ablations',
      'Implantation of single/dual chamber pacemakers, ICDs, CRT-P/D, and conduction system pacing',
      'TEVAR and EVAR procedures'
    ] },
    { type:'prose', eyebrow:'World-Class Technology & Infrastructure', title:'Trained With the Tools That Define Modern Cardiology', alt:true,
      body:[
        'We provide continuous exposure to paediatric and congenital cardiology throughout the tenure, not just short-term postings.',
        'Our department is fully equipped with the latest echocardiography systems (GE, Philips, Siemens), digital ECG, Holter, and TMT machines, IABP, Rotablator, IVUS, syringe infusion pumps, defibrillators, transport monitors, Patient Monitors, Ventillators, and Infant Warmers — ensuring you’re trained with the tools that define modern cardiology.'
      ] },
    { type:'prose', eyebrow:'Curriculum', title:'The Procedures Required for Competency in the DNB Cardiology Program as per NBEMS',
      body:[
        'The training curriculum is designed to meet the NBEMS requirements for the minimum number of procedures needed to achieve competency. In addition, this program goes beyond these basic requirements by incorporating advanced simulation sessions, hands-on workshops, and specialized skill-building exercises. Trainees will have access to state-of-the-art equipment and expert mentorship from seasoned professionals in the field. The curriculum also includes interdisciplinary collaborations and real-world case studies to enhance critical thinking and problem-solving abilities. By providing these additional resources and experiences, the training ensures that participants not only meet but exceed the minimum competency standards set by NBEMS.',
        'During the three year program, the candidate will get exposure to all diagnostic modalities and interventions and will become proficient in transthoracic and transoesophageal echoes, Stress ECGs, exercise and Dobutamine stress echoes, interpreting Holter monitoring at the outpatient level. These skills get carried forward in the cathlab and translate into exposure and confidence in performing and assisting procedures such as coronary angiograms, cardiac catheterizations, temporary and permanent pacemakers, device closures for congenital heart disease, assisting implantable devices, coronary interventions and 2D and 3D electrophysiology procedures.'
      ] },
    { type:'features', eyebrow:'A Thriving Academic Culture', title:'We Cultivate Cardiology Leaders', alt:true, items:[
      'Daily academic presentations in collaboration with our sister institution at SSSIHMS, Prashanthigram',
      'Mentorship from visiting cardiologists from India and abroad who bring global perspectives',
      'Encouragement and support to present at national and international conferences',
      'Active participation in organizing in-house conferences and CME programs',
      'Exposure to Interventional Cardiology Fellowship programs and Allied Health Sciences courses in Cardiac Care Technology'
    ] },
    { type:'prose', eyebrow:'Your Future Begins Here', title:'Choose the Institute That’s Committed to You',
      body:[
        'At SSSIHMS, you won’t just be a trainee — you’ll become part of a mission-driven institution rooted in <strong>excellence, service, and compassion</strong>. With unparalleled clinical exposure, cutting-edge infrastructure, and a legacy of academic distinction, our DrNB (Cardiology) program prepares you to emerge as a confident, capable, and compassionate cardiologist.',
        '<strong>If you’re committed to cardiology, choose the institute that’s committed to you. Choose SSSIHMS.</strong>'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'Training in the Cathlab', cols:2, alt:true, items:[
      { src:U + '2015/05/DSC06970.jpg', caption:'Cardiac Cath in progress' },
      { src:U + '2015/05/DNB-Gold-Medal-Dr.-Rohit.jpg', caption:'DNB Gold Medal — Dr. Rohit' }
    ] }
  ]
};

PAGES['dnb-cardiac-surgery'] = {
  title:'DNB Cardiothoracic Vascular Surgery', crumb:'Departments · Cardiac Surgery · DNB', subnav:'cardiac-surgery', icon:R.imgCTVS,
  subtitle:'A six-year residency, offered free of cost, in the spirit that service to man is service to God.',
  sections:[
    { type:'intro', eyebrow:'DNB CTVS', title:'DNB Cardiothoracic Vascular Surgery',
      image:U + '2015/05/DSC08263.jpg', imageLabel:'Cardiac Surgery in progress',
      body:[
        'Welcome to the Department of Cardiothoracic and Vascular Surgery at the Sri Sathya Sai Institute of Higher Medical Sciences, where excellence in medical education is harmonized with the teachings and blessings of Sri Sathya Sai Baba, emphasizing the principle that service to man is service to God.'
      ] },
    { type:'prose', eyebrow:'Accredited Residency Program', title:'Accredited by the National Board of Examinations', alt:true,
      body:[
        'Our Department of Cardiothoracic and Vascular Surgery is accredited by the National Board of Examinations to offer a comprehensive Residency program in CTVS, first in the year 2002. This program spans a direct course of 6 years post-MBBS, aligning with the ethos of selfless service and compassion advocated by Sri Sathya Sai Baba.'
      ] },
    { type:'prose', eyebrow:'Structured Curriculum', title:'Two Years, Then Three, Then a Centre of Excellence',
      body:[
        'The 6-year course is meticulously structured as 2 years of General Surgery and Allied specialties, followed by examination conducted by NBE. The subsequent 3 years focus on Cardiovascular and Thoracic specialties, providing comprehensive training in operative skills and clinical techniques.',
        'In the final year of the program, residents will be placed in a centre of excellence, where they will have the opportunity to work alongside experienced professionals and further refine their skills. This phase is designed to provide residents with the highest level of training, equipping them to excel in their chosen field and make meaningful contributions to the medical community.',
        'Throughout the program, residents will be assessed regularly, ensuring that they meet the high standards set by the National Board of Examinations and the Sri Sathya Sai Institute of Higher Medical Sciences.',
        'Residents undergo rigorous training in operative skills and clinical techniques, guided by the belief that hands-on experience is paramount in healing and learning.'
      ] },
    { type:'prose', eyebrow:'Spiritual Foundation', title:'Offered Free of Cost', alt:true,
      body:[
        'In adherence to the guiding principles of Sri Sathya Sai Baba, the Department offers this program <strong>free of cost</strong>, reflecting the core value that true service is rendered without expectation of reward. Candidates are supported with stipends as per National Board Guidelines, ensuring their focus remains on learning and growth.'
      ] },
    { type:'prose', eyebrow:'Excellence and Evaluation', title:'Examination and Certification',
      body:[
        'Residents have the option to undertake the exit examination at the end of 5 or 6 years, with certification granted upon completion of the full 6-year training. Continuous assessment by the Institution ensures a nurturing environment for holistic development.',
        '<strong>Visit Us:</strong> To experience our Department firsthand, visits can be arranged by appointment through the Public Relations office or the Head of the Department. We welcome all who seek to learn, grow, and serve in the spirit of compassion and excellence.'
      ] },
    { type:'cards', eyebrow:'Contact Information', title:'For Further Inquiries or to Schedule a Visit', cols:2, alt:true, items:[
      { icon:'◆', title:'Address', desc:'HR Department, Academic Section, Sri Sathya Sai Institute of Higher Medical Sciences, EPIP Area, Whitefield, Bangalore-560 066' },
      { icon:'◆', title:'Telephone & Email', desc:'080-28411500 ext 415 · academicsblr@sssihms.org.in' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Theatres and Intensive Care', cols:2, items:[
      { src:U + '2015/05/DSC08263.jpg', caption:'Cardiac Surgery in progress' },
      { src:U + '2015/05/DSC08273.jpg', caption:'Cardiac ICU — Pediatric Patient' }
    ] }
  ]
};

PAGES['nesu-dnb'] = {
  title:'DNB Neurosurgery', crumb:'Departments · Neurosurgery · DNB', subnav:'neurosurgery', icon:R.imgNeurosurgery,
  subtitle:'Designed to train and equip future neurosurgeons with the best skills and practices.',
  sections:[
    { type:'intro', eyebrow:'DNB Neurosurgery', title:'Two Streams of Residency Training',
      image:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/06/SSSIHMS-0975.jpg',
      imageLabel:'Brain Aneurysm Surgery under Total Circulatory Arrest',
      body:[
        'SSSIHMS Neurosurgery DNB program is designed to train and equip future neuro surgeons with best skills and practices. SSSIHMS is accredited by NBE to offer Residency program in Neurosurgery under two streams: a 3-year Post graduate training leading to DNB in Neuro surgery and a Direct course of 6 years (post MBBS). The department was first accredited in the year 2003 to train 1 candidate every year.'
      ] },
    { type:'prose', eyebrow:'6 Year Program', title:'Structured as 2 Years + 3 Years + 1 Year', alt:true,
      body:[
        'The 6 year residential program starts in January-February every year. Candidates desirous of applying for the course should have passed MBBS + Internship and should have cleared CET conducted by the National Board of Examinations. Subsequently, they should register themselves for the Centralized Counseling, NBE in order to be eligible for admissions.',
        'The 6 years course is structured as 2 years + 3 years + 1 year. In the first 2 years, residents will go through General Surgery and Allied specialties posting. This will be followed by examination conducted by NBE. In the next 3 years, residents will be exposed to cases pertaining to Neurosurgery. They will be trained in all aspects of Operative skills and Clinical techniques, thereby gaining valuable hands on experience. In the last year the residents will be placed in a centre of excellence. Candidates can opt for the exit examination at the end of 5 years or 6 years. However, the certification will be issued only after they complete the 6 years of training. Candidates will be assessed every year by the Institution and the results will be sent to NBE.',
        'During their training, candidates are paid stipend as per National Board Guidelines. In keeping with the philosophy of Sathya Sai Institutions, the course is offered Free of Cost.',
        'Visits to the department can be arranged by prior appointment through the Public Relation office or the Head of the Department.'
      ] },
    { type:'cards', eyebrow:'For Further Enquiries', title:'Contact', cols:2, items:[
      { icon:'◆', title:'Address', desc:'HR Department, Academic Section, Sri Sathya Sai Institute of Higher Medical Sciences, EPIP Area, Whitefield, Bangalore-560 066' },
      { icon:'◆', title:'Telephone', desc:'080-28411500 ext 415' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'In the Operating Theatre', alt:true, items:[
      { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/06/SSSIHMS-0975.jpg', caption:'Brain Aneurysm Surgery under Total Circulatory Arrest' },
      { src:U + '2015/05/DSC04372.jpg', caption:'Neurosurgery in progress' },
      { src:U + '2015/05/DSC04350.jpg', caption:'Neurosurgery in progress' },
      { src:U + '2015/05/DSC04073.jpg', caption:'Spine Surgery in progress' }
    ] }
  ]
};

PAGES['anes-dnb'] = {
  title:'Anaesthesia DNB Residency Programme', crumb:'Departments · Anesthesiology · DNB', subnav:'anesthesiology', icon:R.imgAnesthesiology,
  subtitle:'NBE Residency Courses in Anaesthesiology and Critical Care.',
  sections:[
    { type:'intro', eyebrow:'NBE Residency Courses', title:'Anaesthesia DNB Residency Programme',
      image:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-2.jpg',
      imageLabel:'Swami Blessing a child after Neurosurgery',
      body:[
        'The Department of Anaesthesiology and Critical Care at the Sri Sathya Sai Institute of Higher Medical Sciences is accredited by National Board of Examinations to offer 3-year training for primary candidates and 2 year training for secondary candidates leading to DNB Anaesthesiology equivalent of MD Anaesthesia Degree. The department was first accredited in the year 2003 to train one candidate every year. Currently, it is accredited to train 3+3 candidates annually. Anaesthesiology DNB program provides integrated training in all areas of Anaesthesia and critical care with clinical, didactic lecture/seminar and regular video conferencing with overseas faculty from USA. This program is dedicated to produce individuals who will become skilled anaesthesiologists imbibed with human values to render ideal holistic health care.',
        'Since the patients are drawn from different corners of the country the vast plethora of clinical pathologies provide the resident with opportunities to learn to overcome the various challenges one can come across in one’s career as successful anaesthesiologist.'
      ] },
    { type:'prose', eyebrow:'Admissions', title:'Central Counselling and Eligibility', alt:true,
      body:[
        'The residency program starts in January-February every year as per the Central Counselling scheduling by National Board of Examinations.',
        'Both the primary and the secondary candidates should have passed the CET exam conducted by the National Board of Examinations, New Delhi and should register for the centralized counselling to be eligible for the admissions.',
        'During their training, candidates are paid stipend as per the National Board guidelines. Sharing accommodation for unmarried residents and single bed room family accommodation for married residents will be provided on campus. In keeping with the philosophy of Sri Sathya Sai Institutions, the course is offered Free of Cost.',
        'Visits to the department can be arranged by prior appointment through the Senior Manager or the Head of the Department.'
      ] },
    { type:'prose', eyebrow:'Rotational Postings for DNB Residents', title:'Training Across Specialties',
      body:[
        'Residents are posted to Sri Sathya Sai General Hospital, Whitefield, located in the same campus which is a multi-specialty hospital offering services in specialties like General Surgery, Obstetrics & Gynaecology, Orthopaedics, ENT, Ophthalmology, Plastic Surgery, Urology etc. They are also posted to other multi-Specialty hospitals so that they are trained in other specialties.'
      ] },
    { type:'cards', eyebrow:'For Further Enquiries', title:'Contact', cols:2, alt:true, items:[
      { icon:'◆', title:'Asst DNB Coordinator, Academic Section', desc:'Sri Sathya Sai Institute of Higher Medical Sciences, EPIP Area, Whitefield, Bangalore-560 066' },
      { icon:'◆', title:'Telephone & Email', desc:'080-28004640/41, Mobile 9620207698 · registrarblr@sssihms.org.in · anaesthesiablr@sssihms.org.in' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Swami With the Patients', items:[
      { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-17-e1430994430309.jpg', caption:'Swami blessing Neuro Patient' },
      { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-161.jpg', caption:'Swami blessing a patient' },
      { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-25.jpg', caption:'Swami blessing a small child' },
      { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-2.jpg', caption:'Swami Blessing a child after Neurosurgery' }
    ] }
  ]
};
})();
