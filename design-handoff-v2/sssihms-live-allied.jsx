// sssihms-live-allied.jsx — Allied health / CCT degree courses, full live content.
// Sources: /bsc-cardiac-care-technology/, /bsc-anesthesia-technology/, /bsc-perfusion/, /radiology1/bsc-mit/
(function(){
const PAGES = window.PAGES;
const R = window.__resources || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';

PAGES['bsc-cardiac-care-technology'] = {
  title:'BSc Cardiac Care Technology', crumb:'Departments · Cardiology · BSc CCT', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'Preparing competent entry-level cardiovascular technologists for invasive and non-invasive cardiology.',
  sections:[
    { type:'intro', eyebrow:'BSc Cardiac Care Technology', title:'The Objective of the Programme',
      image:U + '2015/05/Biplane-Cathlab.jpg', imageLabel:'Siemens Artis Zee Biplane Cathlab',
      body:[
        'The primary objective of this program is to prepare competent entry-level cardiovascular technologists in the cognitive (knowledge), psychomotor (skills), and affective (behavior) learning domains for invasive and non-invasive cardiology.',
        'The candidate qualifies as a Cardiac Technologist, and is equipped with the necessary skills to assist the Cardiologist in non-invasive (Electrocardiography, Stress testing, Patient cardiac monitoring and Echocardiography) and invasive (catheterization lab) domains of the department of Cardiology.'
      ] },
    { type:'gallery', eyebrow:'Training Equipment', title:'Where Students Train', alt:true, items:[
      { src:U + '2015/05/Biplane-Cathlab.jpg', caption:'Siemens Artis Zee Biplane Cathlab' },
      { src:U + '2015/05/DSC06970.jpg', caption:'Philips FD10 Cathlab' },
      { src:U + '2022/11/E95-Echo-2.jpg', caption:'GE Vivid E95 Echo Machine' },
      { src:U + '2022/11/S70-Echo-2.jpg', caption:'GE Vivid S70 portable Echo Machine' },
      { src:U + '2022/11/ROTABLATOR.jpg', caption:'Rotablator' },
      { src:U + '2022/11/Ensite-Precision-3D-Mapping-System-2.jpg', caption:'Ensite Precision 3D Mapping System' },
      { src:U + '2022/11/IVUS-MACHINe-1.jpg', caption:'IVUS — Intravascular Ultrasound' },
      { src:U + '2022/11/CCU-BED-WITH-EQUPMENTS-GOOD.jpg', caption:'CCU bed with equipment' }
    ] }
  ]
};

PAGES['bsc-anesthesia-technology'] = {
  title:'B.Sc. Anaesthesia and Operation Theatre Technology', crumb:'Departments · Anesthesiology · BSc Anaesthesia Tech', subnav:'anesthesiology', icon:R.imgANES,
  subtitle:'A four-year RGUHS degree supporting the work of anaesthesia and surgical teams.',
  sections:[
    { type:'intro', eyebrow:'B.Sc. Anaesthesia and OT Technology', title:'The Role of the Technologist', body:[
      'The role of the Anaesthesia and OT Technologist is to support the work done by the professional anaesthesia and surgical personnel.'
    ] },
    { type:'prose', eyebrow:'Anaesthesia Technology', title:'Duties of the Anaesthesia Technologist', alt:true, body:[
      'The duties of Anaesthesia Technologist include equipment maintenance and servicing such as cleaning, sterilizing, assembling, calibrating and testing, troubleshooting, requisitioning and recording of inspections and maintenance. They may operate a variety of mechanical, pneumatic and electronic equipment used to monitor, evaluate and manage the patient undergoing anaesthesia.'
    ] },
    { type:'features', eyebrow:'Operation Theatre Technology', title:'Duties in the Operating Theatre', items:[
      'To receive the patients to OT, preparation and positioning of patients',
      'To assist the surgeons, arranging of OT table, receiving of sterilised surgical instruments and items from CSSD',
      'Replenishment of crash cart receiving, hand hygiene, OT movement pattern',
      'Shifting of patient from OT to ICU after surgery, gowning and gloving',
      'Rotational postings in the specialities’ theatres of OBG, ENT, Orthopaedics, Eye, Dental, General Surgery, Neurosurgery, CTVS and Urology'
    ] },
    { type:'prose', eyebrow:'Course and Admission', title:'Ten Seats a Year, Four Years, Under RGUHS', alt:true, body:[
      'Every year the sanctioned capacity is of 10 students in B.Sc. Anaesthesia & OT Technology under the aegis of RGUHS. The duration of the course is 4 years.',
      'Details about admission can be found on the RGUHS Allied Health Sciences ordinances page.'
    ] },
    { type:'cards', eyebrow:'Faculty', title:'Who Teaches the Course', cols:2, items:[
      { icon:'◆', title:'Principal', desc:'Dr. Kolli S. Chalam, Head of the Department, Department of Anaesthesiology' },
      { icon:'◆', title:'Faculty', desc:'Dr. Pankaj Punetha, Dr. Anitha Diwakar, Dr. Geetanjali, Dr. Anuradha, Dr. Vrushali and attending staff of surgical departments. Senior Manager: Mr. Shravan Kumar' }
    ] }
  ]
};

PAGES['bsc-perfusion'] = {
  title:'BSc Cardiac Perfusion Technology', crumb:'Departments · Cardiac Surgery · BSc Perfusion', subnav:'cardiac-surgery', icon:R.imgCTVS,
  subtitle:'The only programme of its kind in the nation offered free of cost.',
  sections:[
    { type:'intro', eyebrow:'About Perfusion Technology', title:'Cardiac Perfusion Technology at Sri Sathya Sai Institute of Higher Medical Sciences',
      image:U + '2015/05/DSC08273.jpg', imageLabel:'Cardiac surgery in progress',
      body:[
        'The Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield (SSSIHMS-WFD) offers the unique BSc. Cardiac Perfusion Technology (CPT) program — the only one of its kind in the nation that provides college graduates the opportunity to become perfusion technologists <strong>free of cost</strong>.',
        'Perfusion technology involves the provision of extracorporeal circulation to support and temporarily replace a patient’s respiratory and circulatory systems. Perfusionists are skilled allied health professionals who play a crucial role in open-heart surgical teams. Their responsibilities include selecting, setting up, and operating a Heart-Lung Machine, as well as other life support systems such as IABP, LVAD, RVAD, and ECMO.',
        'Perfusionists must possess the ability to handle stressful situations, pay attention to detail, communicate effectively, and stay updated with new developments in the field. While most perfusionists work in medical centers, the role often requires on-call responsibilities during nights, weekends, and holidays.',
        'Beyond clinical practice, perfusionists also have the opportunity to work as teachers and/or researchers in educational institutions, or be hired by industries manufacturing perfusion-related supplies and equipment.',
        'The BSc. CPT program at SSSIHMS-WFD is offered in alignment with the teachings and blessings of Sri Sathya Sai Baba, emphasizing the principle of "<strong>Service to Man is Service to God</strong>." The program is provided free of cost, reflecting the institution’s commitment to making quality healthcare education accessible to all.'
      ] },
    { type:'features', eyebrow:'Academic Curriculum · I Year', title:'B.Sc. Perfusion Technology Course Curriculum (3 years + 1 year internship)', alt:true, items:[
      'Human Anatomy',
      'Physiology',
      'Biochemistry',
      'Pathology — Clinical Pathology, Hematology & Blood Banking',
      'Microbiology'
    ] },
    { type:'features', eyebrow:'II Year', title:'Second Year Subjects', items:[
      'Medicine relevant to perfusion technology',
      'Section A: Applied Pathology · Section B: Applied Microbiology',
      'Applied Pharmacology',
      'Introduction to Perfusion Technology'
    ] },
    { type:'features', eyebrow:'III Year and Internship', title:'Third Year Subjects', alt:true, items:[
      'Perfusion Technology — Clinical',
      'Perfusion Technology — Applied',
      'Perfusion Technology — Advanced',
      '1 Year Internship'
    ] }
  ]
};

PAGES['bsc-mit'] = {
  title:'B.Sc. in Medical Imaging Technology (MIT)', crumb:'Departments · Services · Radiology · BSc MIT', subnav:'radiology', icon:R.imgRadiology,
  subtitle:'Offered at SSSIHMS Whitefield, affiliated to Rajiv Gandhi University of Health Sciences (RGUHS), Karnataka.',
  sections:[
    { type:'features', eyebrow:'Course Overview', title:'Academic Learning With Hands-On Clinical Training', items:[
      'Analyze and evaluate imaging techniques',
      'Deliver safe and compassionate patient care',
      'Operate advanced imaging equipment (X-ray, CT, MRI, etc.)',
      'Communicate effectively and work collaboratively in healthcare teams'
    ] },
    { type:'features', eyebrow:'Eligibility Criteria', title:'Who Can Apply', alt:true, items:[
      'Completion of PUC / 12th Grade with Physics, Chemistry and Biology',
      'Must have studied English as a subject',
      'Lateral Entry available for diploma holders in the same field (as per RGUHS norms)',
      'Age limit: below 25 years',
      'Only female candidates are currently eligible for admission'
    ] },
    { type:'cards', eyebrow:'Duration and Fees', title:'Four Years, No Tuition Fee', cols:2, items:[
      { icon:'◆', title:'Course Duration', desc:'4 years including a 1-year internship, with clinical rotations and real-world hospital exposure. Reduced vacation periods due to extended clinical training.' },
      { icon:'◆', title:'Fees and Expenses', desc:'Tuition Fee: ₹0 — fully funded by Sri Sathya Sai Central Trust. Students bear hostel charges, food and exam fees.' }
    ] },
    { type:'features', eyebrow:'Career Opportunities', title:'Where Graduates Work', alt:true, items:[
      'Radiographer in hospitals and diagnostic centers',
      'Specializations: CT, MRI, Cathlab',
      'Application specialists in companies like GE, Philips, Siemens',
      'Roles in education, research and software companies (RIS, PACS)',
      'High demand for trained technologists in India and abroad',
      'B.Sc. (MIT) is internationally recognized — eligibility to apply abroad, subject to the respective country’s registration/licensure norms'
    ] },
    { type:'prose', eyebrow:'Clinical Training', title:'Training in Real Hospital Settings',
      image:U + '2015/05/MRI.jpg', imageCaption:'Siemens MAGNETOM Aera 1.5 T MRI',
      body:[
        'Clinical training is conducted at hospitals under the Sri Sathya Sai Central Trust, with rotational postings across departments — General X-ray, CT, MRI, Ultrasound, DSA and others. Shift duties (day and night) are included as per the training schedule.'
      ] },
    { type:'features', eyebrow:'Subjects You’ll Study', title:'The Curriculum', alt:true, items:[
      'Anatomy & Physiology',
      'Radiation Physics',
      'Imaging Techniques',
      'Radiographic Equipment & Quality Control',
      'Pathology',
      'Radiographic Procedures & Positioning',
      'Radiation Protection & Patient Care',
      'RIS/PACS Software Training'
    ] },
    { type:'features', eyebrow:'Facilities and Learning Resources', title:'How Students Learn', items:[
      'Modern classrooms with multimedia support',
      'Digital library with textbooks and journals',
      'Online resources',
      'Hands-on training in real hospital settings using cutting-edge imaging systems',
      'Faculty includes Radiographers, Radiologists and Medical Physicists'
    ] },
    { type:'features', eyebrow:'What We Look For in a Student', title:'The Qualities That Matter', alt:true, items:[
      'Passion for healthcare and helping people',
      'Interest in science and medical technology',
      'Strong communication and teamwork skills',
      'Good with computers and open to learning new technologies',
      'Maturity, empathy and a caring attitude',
      'Tip: try to observe a working radiographer in a hospital if possible — it helps you make an informed decision'
    ] },
    { type:'faq', eyebrow:'Frequently Asked Questions', title:'Questions Applicants Ask', items:[
      { q:'What is the full name of the course?', a:'Bachelor of Science in Medical Imaging Technology — B.Sc. (MIT).' },
      { q:'Is the course part-time?', a:'No. It is a full-time program.' },
      { q:'Are X-rays harmful to health?', a:'When used with proper safety measures and equipment, X-rays are safe. Staff are trained in radiation protection and monitored regularly.' },
      { q:'Is it easy to get a job after graduation?', a:'Yes. Radiographers are in high demand across hospitals and diagnostic centers.' },
      { q:'Can I work abroad?', a:'Yes. The degree is widely recognized. You may need to clear local licensure exams depending on the country.' }
    ] },
    { type:'cards', eyebrow:'How to Apply', title:'Contact the Academic Section', cols:2, alt:true, items:[
      { icon:'◆', title:'The Academic Coordinator', desc:'Sri Sathya Sai Institute of Higher Medical Sciences, EPIP Area, Whitefield, Bangalore – 560066' },
      { icon:'◆', title:'Email and Telephone', desc:'registrarblr@sssihms.org.in · 080-28411500 (Ext: 415)' }
    ] },
    { type:'features', eyebrow:'Special Highlights @ SSSIHMS', title:'What Sets the Programme Apart', items:[
      'Free education as Seva (selfless service) to society',
      'Training on cutting-edge equipment',
      'Emphasis on values, ethics and holistic development',
      'Integrated learning with other paramedical disciplines',
      'Advanced Radiology Information Systems and PACS exposure',
      'A blend of technology and compassion in patient care',
      'Student intake of only 3–5 students per year, ensuring personalized training and mentorship'
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Equipment Students Train On', alt:true, items:[
      { src:U + '2015/05/MRI.jpg', caption:'Siemens MAGNETOM Aera 1.5 T MRI' },
      { src:U + '2015/05/GE-CT-Scanner.jpg', caption:'GE HD 750 128 Slice CT Scanner' },
      { src:U + '2015/05/Biplane-Cathlab.jpg', caption:'Siemens Artis Zee Biplane Cath Lab' }
    ] }
  ]
};
})();
