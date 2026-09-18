// sssihms-live-fellowship.jsx — Fellowship pages, full live content.
// Sources: /academics/fellowship/, /cardiology/fellowship-cardiology/, /anes-fellowship/
(function(){
const PAGES = window.PAGES;
const R = window.__resources || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const CDN = 'https://cdn.sssihms.org/sssihms/wp-content/uploads/';

PAGES['fellowship'] = {
  title:'Fellowship Courses at SSSIHMS, Whitefield', crumb:'Education & Training · Fellowship', subnav:'academics',
  subtitle:'Fellowships in Interventional Cardiology and in Cardio Thoracic & Vascular Anaesthesia, affiliated to RGUHS, Karnataka.',
  sections:[
    { type:'prose', eyebrow:'Fellowship in Interventional Cardiology', title:'A Super-Specialisation Within Cardiology',
      image:CDN + '2015/05/DSC06970.jpg', imageCaption:'Cardiac Cath in progress',
      body:[
        'SSSIHMS offers a Fellowship in Interventional cardiology which is a super specialization within the super specialty area of Cardiology. Professionals who have achieved specialization in Cardiology like DM/DNB (Cardiology) are eligible for this course. This course is conducted under the aegis of the Rajiv Gandhi University of Health Sciences. There are no costs incurred from the trainee to the Institution towards the course. However, fees payable to the University will be applicable and will be borne by the trainee.',
        '<strong>Goals and objectives.</strong> The overall purpose of the Fellowship program is to prepare Fellows to function at high levels of clinical performance in Interventional Cardiology. It includes appropriate clinical judgment in patient selection as well as high level of skills in performing interventional procedures.'
      ] },
    { type:'features', eyebrow:'Four Components', title:'The Goals of the Interventional Cardiology Fellowship', alt:true, items:[
      'To enable the Fellows to understand the effectiveness and limitations of coronary interventional procedures and accordingly select patients and the appropriate procedure.',
      'To help Fellows in achieving cognitive knowledge and technical skills to perform interventional cardiac procedures at the highest standards.',
      'To foster critical thinking skills, inculcate quest for knowledge and willingness to learn new techniques and advancements in the field.',
      'To encourage commitment towards maintaining and improving quality of the procedures thereby improving patient care.'
    ] },
    { type:'prose', eyebrow:'Fellowship in Cardio Thoracic & Vascular Anaesthesia', title:'Anaesthesia and ICU Care for Adult and Paediatric Cardiac Surgery',
      image:CDN + '2015/05/DSC08273.jpg', imageCaption:'Cardiac ICU — Pediatric Patient', reverse:true,
      body:[
        'SSSIHMS offers a Fellowship program in Cardiac Thoracic and Vascular Anaesthesia. Professionals who are qualified in MD/DNB Anesthesia are eligible for this course. This course will be conducted under the aegis of the Rajiv Gandhi University of Health Sciences. There are no costs incurred from the trainee to the Institution towards the course. However, fees payable to the University will be applicable and will be borne by the trainee. Selected candidates will be paid Stipend at par with senior residents in this institute.',
        '<strong>Goals and objectives.</strong> The goal of the Fellowship program in Cardiac Thoracic and Vascular Anaesthesia is to provide the fellows with adequate knowledge and practical exposure so that they develop proficiency in the management of all aspects of anesthesia and ICU care of both adult and pediatric cardiac surgical patients.',
        'The Cardiac Thoracic and Vascular Anaesthesia service covers 4 Operation theaters, 2 Catheterization labs and 2 Intensive care units & one Coronary care unit. Our average annual Cardiac Thoracic and Vascular Anaesthesia provision statistics are 1500, out of which one third is pediatric cardiac population.'
      ] },
    { type:'features', eyebrow:'Three Components', title:'The Goals of the CTV Anaesthesia Fellowship', alt:true, items:[
      'To inculcate quest for knowledge and willingness to learn new techniques and advancements in the field of Cardiac Thoracic and Vascular Anaesthesia and also participate in research/dissertation work.',
      'Help the fellows to develop the learning skills necessary for a lifelong career in the Cardiac Thoracic and Vascular Anaesthesia and surgical intensive care of Cardiac Thoracic and Vascular Anaesthesia specialty through application of the basic sciences.',
      'To encourage commitment towards maintaining and improving quality of patient care and safety following the principles of ideal health care system by delivery of care at Body, mind and Soul levels.'
    ] },
    { type:'cards', eyebrow:'Fellowship in Pediatric Cardiac Surgery', title:'Applications and Stipends', cols:2, items:[
      { icon:'◆', title:'Cardiac Thoracic & Vascular Anaesthesia', desc:'18 Months · Stipend Rs 85,000/- pm. Eligibility: MD/DNB Anesthesia.' },
      { icon:'◆', title:'Fellowship in Interventional Cardiology', desc:'12 Months · Stipend Rs 1,00,000/- pm. Eligibility: post DM/DNB Cardiology.' }
    ] },
    { type:'prose', eyebrow:'Applications', title:'Application Status and Contact', alt:true, body:[
      'Applications are invited from the eligible candidates from 1st Aug 2025 to 5th Aug 2025 for the fellowship program under the aegis of Rajiv Gandhi University of Health Sciences. <strong>Application is closed.</strong>',
      'For further details contact PH: 080-28004640/41; email: academicblr@sssihms.org.in'
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Where Fellows Train', items:[
      { src:CDN + '2015/05/DSC06970.jpg', caption:'Cardiac Cath in progress' },
      { src:CDN + '2015/05/DSC08273.jpg', caption:'Cardiac ICU — Pediatric Patient' },
      { src:CDN + '2015/05/SSSIHMS-1059.jpg', caption:'Cardiac ICU' }
    ] }
  ]
};

PAGES['fellowship-cardiology'] = {
  title:'Fellowship in Interventional Cardiology', crumb:'Departments · Cardiology · Fellowship', subnav:'cardiology', icon:R.imgCardiology,
  subtitle:'Affiliated to Rajiv Gandhi University of Health Sciences.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'A Super-Specialty Training Programme',
      image:U + '2015/05/Biplane-Cathlab.jpg', imageLabel:'Siemens Artis Zee Biplane Cathlab',
      body:[
        'The Fellowship in Interventional Cardiology is a super-specialty training program designed for cardiologists who have completed DM or DNB in Cardiology. This advanced fellowship focuses on developing high-level clinical expertise and procedural proficiency in interventional cardiology.',
        'This program is conducted under the aegis of the <strong>Rajiv Gandhi University of Health Sciences</strong>. While there are <strong>no institutional fees</strong>, candidates are responsible for paying applicable <strong>university fees</strong>.'
      ] },
    { type:'prose', eyebrow:'Goals and Objectives', title:'Knowledge, Skills and Judgement', alt:true, body:[
      'The primary aim of the fellowship is to equip cardiologists with the knowledge, skills, and judgment required to perform interventional procedures safely and effectively. The objectives are:',
      '<strong>1. Clinical Decision-Making.</strong> Develop the ability to assess the appropriateness and limitations of coronary interventions. Make informed decisions regarding patient selection and procedural strategies.',
      '<strong>2. Technical Proficiency.</strong> Acquire advanced cognitive and technical skills to perform interventional procedures with precision and safety. Gain hands-on experience in a wide range of coronary and structural interventions.',
      '<strong>3. Academic and Professional Growth.</strong> Foster critical thinking and a continuous quest for learning. Stay updated with emerging techniques, technologies, and evidence-based practices.',
      '<strong>4. Quality and Patient-Centered Care.</strong> Promote a culture of excellence in procedural outcomes. Commit to ongoing quality improvement and patient safety.'
    ] },
    { type:'gallery', eyebrow:'Equipment', title:'What Fellows Train On', items:[
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

PAGES['anes-fellowship'] = {
  title:'Fellowship Programme — Anaesthesiology', crumb:'Departments · Anesthesiology · Fellowship', subnav:'anesthesiology', icon:R.imgAnesthesiology,
  subtitle:'Fellowship in Cardio Thoracic and Vascular Anaesthesia, under the aegis of RGUHS.',
  sections:[
    { type:'intro', eyebrow:'Fellowship Programme', title:'Fellowship in Cardio Thoracic and Vascular Anaesthesia',
      image:CDN + '2015/05/Photo-161.jpg', imageLabel:'Swami blessing a patient',
      body:[
        'SSSIHMS offers a Fellowship program in Cardio-thoracic and Vascular Anaesthesia. Professionals who are qualified in MD/DNB Anaesthesia are eligible for this course. This course will be conducted under the aegis of the Rajiv Gandhi University of Health Sciences. There are no costs incurred from the trainee to the Institution towards the course. However, fees payable to the University will be applicable and will be borne by the trainee. Selected candidates will be paid Stipend as per RGUHS guidelines.'
      ] },
    { type:'prose', eyebrow:'Goals and Objectives', title:'Proficiency in Adult and Paediatric Cardiac Anaesthesia', alt:true, body:[
      'The goal of the Fellowship program in Cardiac Thoracic and Vascular Anaesthesia is to provide the fellows with adequate knowledge and practical exposure so that they develop proficiency in the management of all aspects of anaesthesia and ICU care of both adult and paediatric cardiac surgical patients.',
      'The Cardiac Thoracic and Vascular Anaesthesia service covers 4 Operation theatres, 2 Catheterization labs and 2 Intensive care units & one Coronary care unit. Our average annual Cardiac Thoracic and Vascular Anaesthesia provision statistics are 1300, out of which one third is paediatric cardiac population.'
    ] },
    { type:'features', eyebrow:'Three Components', title:'The Goals of the Programme', items:[
      'To inculcate quest for knowledge and willingness to learn new techniques and advancements in the field of Cardiac Thoracic and Vascular Anaesthesia and also participate in research/dissertation work.',
      'Help the fellows to develop the learning skills necessary for a lifelong career in the Cardiac Thoracic and Vascular Anaesthesia and surgical intensive care of Cardiac Thoracic and Vascular Anaesthesia specialty through application of the basic sciences.',
      'To encourage commitment towards maintaining and improving quality of patient care and safety following the principles of ideal health care system by delivery of care at Body, mind and Soul levels.'
    ] },
    { type:'cards', eyebrow:'Fellowship Programme in Cardio-thoracic and Vascular Anaesthesia', title:'Eligibility, Duration and Stipend', cols:2, alt:true, items:[
      { icon:'◆', title:'Eligibility and Duration', desc:'MD/DNB Anaesthesia · 18 Months · Admission session: July/August.' },
      { icon:'◆', title:'Stipend', desc:'As per RGUHS guidelines.' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Swami With Patients', items:[
      { src:CDN + '2015/05/Photo-17-e1430994430309.jpg', caption:'Swami blessing Neuro Patient' },
      { src:CDN + '2015/05/Photo-161.jpg', caption:'Swami blessing a patient' },
      { src:CDN + '2015/05/Photo-25.jpg', caption:'Swami blessing a small child' },
      { src:CDN + '2015/05/Photo-2.jpg', caption:'Swami Blessing a child after Neurosurgery' }
    ] }
  ]
};
})();
