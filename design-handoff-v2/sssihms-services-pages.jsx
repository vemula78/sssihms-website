// sssihms-services-pages.jsx — Clinical support service pages, full live content.
// Sources: /lab-blood-bank/, /telemedicine/, /counseling/, /hmis/ on whitefield.sssihms.org
(function(){
const PAGES = window.PAGES;
const SUBNAV = window.DEPT_SUBNAV || {};
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const CDN = 'https://cdn.sssihms.org/sssihms/wp-content/uploads/';

SUBNAV.services = [
  ['Overview','services'], ['Radiology','radiology'], ['Lab & Blood Bank','lab-blood-bank'],
  ['Physiotherapy','physiotherapy'], ['Telemedicine','telemedicine'], ['Counselling','counseling'], ['HMIS','hmis']
];
SUBNAV.lab = [
  ['Lab & Blood Bank','lab-blood-bank'], ['Lab Infrastructure','lab-infrastructure'], ['Blood Donation','blood-donation'], ['BSc MLT','bsc-mlt']
];
window.DEPT_SUBNAV = SUBNAV;

// ── LABORATORY MEDICINE & BLOOD BANK ────────────────────────────────────────
PAGES['lab-blood-bank'] = {
  title:'Department of Laboratory Medicine', crumb:'Departments · Services · Lab & Blood Bank', subnav:'lab',
  subtitle:'Pathology, Microbiology and Biochemistry laboratories with an in-house Blood Bank, serving the Institute and the General Hospital.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'One Laboratory Complex, Two Hospitals',
      image:CDN + '2015/05/swami-with-patients-.jpg', imageLabel:'Swami speaking to a patient in ICU',
      body:[
        'The Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Bangalore, Laboratory complex has the Pathology, Microbiology, Biochemistry labs, and an in-house Blood Bank, all of which are equipped to handle all the necessary investigations required for the Cardiac and Neuro specialties. The Department also caters to the requirements of Sri Sathya Sai General Hospital, Whitefield.',
        'The objective of the department is to support the hospital in treating its patients through providing the required laboratory investigations in a timely fashion, while maintaining high standards of accuracy and precision.'
      ], pill:'All Investigations Free of Cost' },
    { type:'cards', eyebrow:'Sections', title:'What the Laboratory Covers', cols:3, alt:true, items:[
      { icon:'◆', title:'Biochemistry', desc:'Routine and specialised biochemistry on fully automated floor-model analysers, with a chemiluminescence analyser for hormonal profiles.' },
      { icon:'◆', title:'Microbiology', desc:'Automated bacterial culture with identification and antibiotic sensitivity testing, carried out in dedicated biosafety cabinets.' },
      { icon:'◆', title:'Haematology & Clinical Pathology', desc:'Cell counters, cytospin and coagulation analysers for haematology, coagulation and routine clinical pathology work.' },
      { icon:'◆', title:'Histopathology', desc:'Tissue diagnosis with microtome and cryotome, special stains and immunohistochemistry.' },
      { icon:'◆', title:'Blood Bank', desc:'In-house collection, testing, component preparation and storage — supporting cardiac surgery, neurosurgery and the General Hospital.', link:{ label:'Blood donation', page:'blood-donation' } },
      { icon:'◆', title:'Outsourced Investigations', desc:'Rarely requested tests are sent to accredited laboratories under a tie-up — and, like everything else, are paid for by the hospital.' }
    ] },
    { type:'prose', eyebrow:'Accuracy and Turnaround', title:'How the Standard Is Held',
      body:[
        'High standards of accuracy and precision are maintained through several practices working together: participation in external Quality Assurance programmes, a fully functional Laboratory Information System (LIS) for ordering investigations and releasing results, and the reduction of transcription errors by interfacing analysers directly with the LIS and by bar coding samples.',
        'Because the laboratory serves both the Institute and the General Hospital, samples arrive from cardiac and neuro intensive care, operation theatres, wards and the general outpatient departments through the same workflow — which makes short, predictable turnaround times as important as the result itself.'
      ] },
    { type:'features', eyebrow:'Practices', title:'Quality Assurance in Everyday Work', alt:true, items:[
      'Participation in external Quality Assurance programmes',
      'Fully functional LIS for ordering investigations and releasing results',
      'Analyser interfaces to the LIS, removing manual transcription',
      'Bar coding of samples from collection to report',
      'Tie-ups with accredited laboratories for rarely requested investigations',
      'Every investigation — in-house or outsourced — provided free to the patient'
    ] },
    { type:'cards', eyebrow:'More From the Department', title:'Blood Donation, Training and Infrastructure', cols:3, items:[
      { icon:'◆', title:'Blood Donation', desc:'What happens to the blood you donate, who can donate, and how to reach the Blood Bank.', link:{ label:'Blood Donation', page:'blood-donation' } },
      { icon:'◆', title:'BSc Medical Laboratory Technology', desc:'A degree programme preparing medical laboratory technologists for settings from primary health centres to tertiary hospitals.', link:{ label:'BSc MLT', page:'bsc-mlt' } },
      { icon:'◆', title:'Laboratory Infrastructure', desc:'The analysers, safety cabinets, interfaces and systems behind the diagnostic workload of both hospitals.', link:{ label:'Infrastructure', page:'lab-infrastructure' } }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'In the Wards and the Laboratory', alt:true, cols:2, items:[
      { src:CDN + '2015/05/Photo-25.jpg', caption:'Swami blessing a small child' },
      { src:CDN + '2015/05/swami-with-patients-.jpg', caption:'Swami speaking to a patient in ICU' }
    ] }
  ]
};

// ── LAB INFRASTRUCTURE ──────────────────────────────────────────────────────
PAGES['lab-infrastructure'] = {
  title:'Laboratory Infrastructure', crumb:'Departments · Services · Lab & Blood Bank', subnav:'lab',
  subtitle:'All the regular diagnostic tests required for cardiac and neuro-sciences are performed at the SSSIHMS-Whitefield laboratory.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Equipped for the Specialties It Serves', narrow:true,
      body:[
        'All the regular diagnostic tests required for Cardiac & Neuro-sciences are performed at the SSSIHMS-Whitefield laboratory. The laboratory has different sections, each well equipped for that purpose, and together they also carry the investigation load of Sri Sathya Sai General Hospital.'
      ] },
    { type:'prose', eyebrow:'Microbiology', title:'Culture, Identification and Sensitivity', alt:true,
      body:[
        'The Microbiology laboratory has the required biosafety cabinets, together with automated bacterial culture (BacT/ALERT) and identification and sensitivity testing equipment (VITEK 2). Rapid, reliable organism identification and antibiotic sensitivity reporting matter particularly in a hospital doing open-heart surgery and neurosurgery, where post-operative infection control depends on them.'
      ] },
    { type:'prose', eyebrow:'Biochemistry', title:'Automated Chemistry and Hormonal Profiles',
      body:[
        'The Biochemistry laboratory is equipped with fully automated biochemistry equipment (floor models), along with a chemiluminescence analyser (Roche Cobas e411) for hormonal profiles. The analysers are interfaced to the Laboratory Information System, so results move to the patient record without manual transcription.'
      ] },
    { type:'prose', eyebrow:'Haematology, Clinical Pathology and Histopathology', title:'Counts, Coagulation and Tissue Diagnosis', alt:true,
      body:[
        'Cell counters, cytospin and coagulation analysers help the Haematology and Clinical Pathology laboratory to perform its investigations accurately and with a short turn-around time — coagulation work in particular being central to cardiac surgery and to patients on anticoagulation.',
        'The Histopathology laboratory is equipped with microtome and cryotome as well as with the required special stains and immunohistochemistry antibodies, allowing tissue diagnosis, including frozen sections, to be reported in-house.'
      ] },
    { type:'prose', eyebrow:'Blood Bank', title:'Collection, Testing, Componenting and Storage',
      body:[
        'The Blood Bank is situated in a spacious area with all facilities for collection from the donors, testing, componenting and storage. Fully automated ELISA processors are used for HIV and hepatitis testing, and the Column Agglutination Technique is used for compatibility testing between donor and patient blood. Components are separated in a closed system using a temperature-regulated centrifuge and a plasma expressor under laminar flow.'
      ], link:{ label:'Blood Donation', page:'blood-donation' } },
    { type:'prose', eyebrow:'Outsourced Investigations', title:'When a Test Is Not Done In-House', alt:true,
      body:[
        'For a few investigations that are rarely requested for, the department has a tie-up with accredited laboratories from where these investigations are out-sourced. Not only are the in-house facilities provided free of cost to the patient — the hospital provides for the outsourced investigations too.'
      ] }
  ]
};

// ── BLOOD DONATION ──────────────────────────────────────────────────────────
PAGES['blood-donation'] = {
  title:'Blood Bank & Blood Donation', crumb:'Departments · Services · Lab & Blood Bank', subnav:'lab',
  subtitle:'The Institute’s in-house Blood Bank collects, tests, separates and stores blood for both hospitals — and depends on voluntary donors.',
  sections:[
    { type:'intro', eyebrow:'The Blood Bank', title:'Where Your Donation Goes', narrow:true,
      body:[
        'The Blood Bank is situated in a spacious area with all facilities for collection from the donors, testing, componenting and storage facilities. It supports cardiac surgery, neurosurgery and the intensive care units of the Institute, as well as Sri Sathya Sai General Hospital.',
        'If you are willing to donate on short notice in emergencies, do inform the Blood Bank, so that they can contact you when the need arises. The same applies if you have a rare blood group — let the Blood Bank know of your interest to donate.'
      ] },
    { type:'prose', eyebrow:'What Happens to the Blood You Donate', title:'Tested, Grouped, Separated, Matched', alt:true,
      body:[
        'At SSSIHMS, fully automated ELISA processors are used for conducting the HIV and hepatitis tests. The blood is grouped and stored either as whole blood or as components like packed red blood cells, plasma, platelets or cryoprecipitate. This is then issued to the patient after checking for compatibility with the patient’s blood. The Column Agglutination Technique is used at the SSSIHMS blood bank to test the compatibility of the donor’s blood with the patient’s.',
        'Separating blood into components helps the patient, as only that component which is therapeutically indicated is transfused. In short, it is a method to optimise blood utilisation — and the donor gets the satisfaction of being able to help more than one patient. The separation is done in a closed system using a temperature-regulated centrifuge and a plasma expressor under a laminar flow.'
      ] },
    { type:'stats', eyebrow:'Quick Facts', title:'What Donation Actually Involves', items:[
      { v:'5–6 L', l:'Blood in an average adult body' },
      { v:'~7%', l:'Proportion taken at one donation' },
      { v:'6–8 min', l:'Actual bleeding time' },
      { v:'~30 min', l:'The whole process, start to finish' },
      { v:'24–48 hrs', l:'Volume replaced by the body' },
      { v:'3 months', l:'Minimum advised gap between donations' }
    ], alt:true },
    { type:'prose', eyebrow:'What Is Blood', title:'Plasma, Cells and Platelets',
      body:[
        'Blood supplies to every cell of the body oxygen and nutrients, and carries away the waste products. It also plays a central role in the body’s defence mechanism and is an indicator of a person’s health condition. Blood is pumped by the heart through a network of miles of blood vessels to every part of the body. It moves at a speed of about a foot per second, completing a circulation in about twenty seconds.',
        'Blood is composed of a clear yellow fluid, the plasma, and other elements: red blood cells (erythrocytes), which carry oxygen; white blood cells (leukocytes), which fight infection; and platelets (thrombocytes), which stop bleeding — along with proteins, electrolytes, hormones and glucose. The erythrocytes, leukocytes and platelets are described as the formed elements of the blood; together they compose about 50% of its total volume.',
        'Blood is produced in the bone marrow. In adults, the spine, ribs and pelvis are the primary bones that make blood. Red blood cells last about 120 days in the bloodstream, platelets about ten days, and the various kinds of white blood cells from days to years — so when we donate, we are in fact donating cells that would die in any case, and which can be life-saving for someone else.'
      ] },
    { type:'prose', eyebrow:'Blood Grouping', title:'ABO and the Rh Factor', alt:true,
      body:[
        'The most common type of grouping is the ABO grouping. Red blood cells have a protein coat (called antigens) on their surface, which distinguishes them. According to this, blood is divided into four groups: <strong>A</strong> (A antigen present), <strong>B</strong> (B antigen present), <strong>AB</strong> (both A and B antigens present) and <strong>O</strong> (no antigens present). There are subtypes under this grouping — listed as A1, A2, A1B, A2B and so on — some of which are quite rare.',
        'Apart from this, another protein plays an important part in the grouping of blood: the Rh factor. If it is present, the blood type is called positive; if absent, negative. This gives the eight broad categories — A positive and negative, B positive and negative, AB positive and negative, and O positive and negative.'
      ] },
    { type:'features', eyebrow:'Why Donate', title:'What Donated Blood Is Used For', items:[
      'Replace blood loss during major surgeries',
      'Help patients with blood disorders like haemophilia and Von Willebrand’s disease survive',
      'Raise haemoglobin levels through transfusion in chronic ailments — severe anaemia, thalassemias and cancer',
      'Replace blood lost during injury, as in accidents',
      'Provide plasma to burn patients, which may be critical for their survival',
      'One donation may help save up to three lives'
    ] },
    { type:'features', eyebrow:'Eligibility', title:'Who Should Not Donate Blood', alt:true, items:[
      'Pregnant or lactating women, or those who have recently had an abortion',
      'Persons with multiple sexual partners, or those addicted to drugs',
      'Persons who have had an infection such as rubella, typhoid or malaria in the past few years',
      'People who have had jaundice after their eleventh year',
      'Persons who have undergone surgery in the previous six months',
      'Persons who have consumed alcohol in the 24 hours prior to donation',
      'Women during their menstrual period',
      'Those who have taken vaccinations in the recent past',
      'Persons with systemic disease — heart, kidney or liver disease, blood disorders or asthma',
      'Persons suffering from transfusion-transmitted infections such as HIV, hepatitis or syphilis',
      'Persons on steroids, hormonal supplements or certain specified medication such as antibiotics'
    ] },
    { type:'faq', eyebrow:'Common Concerns', title:'Reasons People Give for Not Donating', items:[
      { q:'I am scared of needles / afraid to give blood', a:'Nearly everyone feels that way in the beginning. However, most donors will tell you that you feel only a slight initial pinch, and seven to ten minutes later you are heading towards the refreshment room.' },
      { q:'I am too busy', a:'The entire process takes about half an hour, and the actual bleeding time is about six to eight minutes.' },
      { q:'No one ever asked me — I am not sure my blood is needed', a:'Consider yourself asked. There is no other way to supply the blood needs of hospital patients but through the generous donations of people like you.' },
      { q:'I already gave this year', a:'A normal adult can safely donate every ninety days. Many donors give four times a year.' },
      { q:'I will get infected; I can get AIDS', a:'A new sterile needle and bag are used for each donation, and the needle is discarded immediately afterwards. There is no way you could get infected during donation.' },
      { q:'My blood isn’t the right type', a:'Every type of blood is needed. If your group is common, there are many patients who need it; if it is rare, there are fewer donors available, so it is in short supply.' },
      { q:'I don’t have blood to spare and I’ll feel weak later', a:'Only about 7% of the body’s five to six litres is collected at each donation. In volume, it is replaced within a few hours, and normal daily activities can be continued.' },
      { q:'I am too old or not fit to donate', a:'If you have any doubts, check with your physician or the staff of the Blood Bank. A great many medical conditions do not prevent you from donating blood, or do so only temporarily.' }
    ] },
    { type:'features', eyebrow:'Before and After', title:'Practical Points for Donors', alt:true, items:[
      'Have a meal or a snack within four hours prior to donation',
      'A pre-donation check-up precedes the donation itself',
      'Rest for ten to fifteen minutes afterwards, with refreshments provided',
      'Be sure that disposable needles are used',
      'Volume is corrected by the body in 24–48 hours; the red cell count in about six to seven weeks',
      'Your health will not suffer — donation may in fact stimulate the bone marrow to produce new cells'
    ] },
    { type:'cta', eyebrow:'Get in Touch', title:'To Donate, or to Be Called in an Emergency',
      body:'Contact the Blood Bank at the Department of Laboratory Medicine, SSSIHMS Whitefield, particularly if you have a rare blood group or are willing to donate on short notice.',
      action:{ label:'Department of Laboratory Medicine', page:'lab-blood-bank' } }
  ]
};

// ── TELEMEDICINE ────────────────────────────────────────────────────────────
PAGES['telemedicine'] = {
  title:'Telemedicine Center', crumb:'Departments · Services · Telemedicine', subnav:'services',
  subtitle:'Part of the Sri Sathya Sai Tele-health Network that includes both the sister institutions at Prasanthigram and Whitefield.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Extending the Reach of Care',
      image:CDN + '2019/11/DSC02589.jpg', imageLabel:'Telemedicine consultation in progress',
      body:[
        'The department of Telemedicine, SSSIHMS, Whitefield is part of the Sri Sathya Sai Tele-health Network that includes both the sister institutions at Prasanthigram and Whitefield.',
        'The Telemedicine department part of the Tele-health network leverages the potential of Information and Communication Technology (ICT) tools and extend the reach of quality medical care provided free of cost by Sri Sathya Sai Health System for patients requiring neurosurgical and cardiology care.',
        'The Telemedicine center was established in 2007 as an extension of the outpatient facilities at SSSIHMS. The center at SSSIHMS acts as a specialist center, providing services to patients at these two nodal centers.'
      ] },
    { type:'features', eyebrow:'Outcomes', title:'The Facility Has Helped SSSIHMS Achieve', alt:true, items:[
      'Streamline flow of Revisit/Outpatients from pre-identified locations (States)',
      'Schedule appointments for face-to-face consultation and surgery',
      'Minimize unnecessary investigation, and travel for patients who can be advised remotely',
      'Provide follow up for post-operative patients',
      'Counselling of the patients',
      'Guide patients requiring support from other medical specialties presently not provided by SSSIHMS-WFD',
      'Conduct and participate in online CME’s, training of DNB’s and exchange of best practices and expertise in Neurosurgery and Cardiology',
      'Financial and Social advantages to patients'
    ] },
    { type:'cards', eyebrow:'Nodal Point Location', title:'Where to Approach for an Appointment', cols:2, items:[
      { icon:'◆', title:'In West Bengal — Barrackpore', desc:'Sri Sathya Sai Seva Kendra, 1, Riverside Road (Beside Mangal Pandey Park), Barrackpore Cantonment, Barrackpore, North 24 Paraganas, Pin 700120, West Bengal. Telephone: 033-25450329. Email: telemedbkp@gmail.com', link:{ label:'View on map', href:'https://goo.gl/maps/Ho4vgrAMb3gaxviV9' } },
      { icon:'◆', title:'In Orissa — Bhubaneswar', desc:'Sri Sathya Sai Seva Samiti, Unit III, Kharavel Nagar (Opp. Nalini Devi Womens’ College of Teacher Education), Bhubaneswar, Odisha, Pin 769 010. Phone: 0674-2391090, 8895268090. Email: telemedbbsr@gmail.com', link:{ label:'View on map', href:'https://goo.gl/maps/muQkkktUJbVBNqR49' } }
    ] },
    { type:'prose', eyebrow:'Schedule', title:'Consultation Days at the Nodal Centres', alt:true,
      body:[
        'Patients who are diagnosed with such ailments, who have already consulted a doctor and have previous medical records (reports/ scans) readily available, may approach the nodal center for appointments for consultation.',
        '<strong>Barrackpore</strong> — Neuro Surgery: Thursday & Saturday. Cardiology: Saturday.',
        '<strong>Bhubaneshwar</strong> — Neuro Surgery: Saturday. Cardiology: Friday.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'At the Telemedicine Centre', cols:2, items:[
      { src:CDN + '2019/11/DSC02589.jpg', caption:'Telemedicine consultation' },
      { src:CDN + '2019/11/DSC02586.jpg', caption:'Telemedicine consultation' }
    ] }
  ]
};

// ── COUNSELLING ─────────────────────────────────────────────────────────────
PAGES['counseling'] = {
  title:'Counselling the Sai Way', crumb:'Departments · Services · Counselling', subnav:'counseling',
  subtitle:'Counselling the Sai Way is built on the corner stone of Sai Philosophy which teaches us to see Sai in all patients.',
  sections:[
    { type:'intro', eyebrow:'Counselling the Sai Way', title:'The First Spirituality-Based Counselling Department in India',
      image:CDN + '2015/06/Swami-blessing-counseling.jpg', imageLabel:'Swami blessing counselling Department',
      body:[
        'The SSSIHMS, Whitefield, is the first medical institution to have a full-fledged spirituality based patient counselling department, which is an integral part of the hospital treatment process. The body-mind-spirit connection in medical care is well recognised by modern medicine and also endorsed by WHO. SAI Counselling addresses the emotional needs of patients through body relaxation and mind-conditioning, and fosters the inherent spirituality in them through praying to the "God of their Choice" thereby complementing the primary medical role of the doctors, nurses, physiotherapists, dietitians and other medical staff in treating the patients’ illness. Aspiring counsellors after passing through a careful screening and selection process undergo a rigorous training program based on the teachings of Bhagawan Sri Sathya Sai Baba and the person centred approach methodology of Carl Rogers.'
      ] },
    { type:'prose', eyebrow:'The Programme', title:'"Counselling the Sai Way" — Spirituality Awareness Integration in Counselling', alt:true,
      body:[
        '"Counselling the SAI Way" — Spirituality Awareness Integration in Counselling" — addresses the spiritual dimension of patients using as a therapeutic framework the well-established Person Centred Approach of Carl Rogers and the emerging Spirituality in Human Existential Well Being counselling methodology of Mia Leijssen.',
        'Interwoven closely into this framework is Sri Sathya Sai Baba’s humane secular philosophy based on the primacy of the five cardinal and innate human values — <em>Sathya, Dharma, Shanti, Prema, Ahimsa</em> — and advocating prayer to the God of your Choice, which constitute the bedrock of SAI Counselling founded on the supremacy of Love and the omnipresence of God.'
      ] },
    { type:'quote', image:'assets/baba/baba-04.jpg', eyebrow:'The Foundation',
      text:'There is only one caste, the caste of humanity. There is only one religion, the religion of love. There is only one language, the language of the heart. There is only one God, He is omnipresent.',
      attr:'Sathya Sai Baba, 1985' },
    { type:'prose', eyebrow:'SAI Counselling in Practice', title:'Inner Transformation as the Path to Healing',
      image:CDN + '2015/05/DSC01861.jpg', imageCaption:'Counseling in Progress', reverse:true,
      body:[
        'SAI Counselling is complementary to normal hospital medical care and focussed on <em>inner transformation,</em> common to both Sai and Rogerian philosophies, in the patients to help achieve healing. SAI Counselling provides emotional support and spiritual care not only to inpatients suffering from serious cardiac and neurological illnesses necessitating major surgical interventions, but also to a considerable number of outpatients referred by the neurologists for stress management in stress related illnesses.',
        'Patients admitted are counselled before surgery, post-surgery and before discharge, whereas for outpatients it is of a much shorter duration. A psycho-spiritual patient profile is maintained for every patient. A noteworthy feature is that counselling is provided for the patient as well as for the care-giver.',
        'Extensive clinical experience — over forty thousand patients counselled since inception in 2001 — indicates significant benefits for patients.'
      ] },
    { type:'cards', eyebrow:'Presentations and Reports', title:'The Department’s Published Work', cols:2, alt:true, items:[
      { icon:'◆', title:'Presentation at Mayo Clinic, 2010', desc:'Presentation on SAI Counselling at Mayo Clinic by Mr. Umesh Rao, Advisor Counseling Department, and Mrs. Gita Umesh.', link:{ label:'Open PDF', href:'http://cdn.sssihms.org/sssihms/wp-content/uploads/2015/04/Mayo-Evaluation-piechar1.pdf' } },
      { icon:'◆', title:'Duke University Research Conference', desc:'A video clip on SAI Counselling from a presentation that Dr. Krucoff, cardiologist from Duke University, had made at a research conference in Duke University in 2010.', link:{ label:'Watch', href:'https://youtu.be/OkytHQgqytA' } },
      { icon:'◆', title:'Annual Report 2017', desc:'Annual Report of the Counseling Department for 2017.', link:{ label:'Open PDF', href:'http://cdn.sssihms.org/sssihms/wp-content/uploads/2015/04/Annual-Report-2017-of-Counselling-Dept..pdf' } },
      { icon:'◆', title:'Statistics for the year 2017', desc:'Department of Counselling graphs and statistics.', link:{ label:'Open PDF', href:'http://cdn.sssihms.org/sssihms/wp-content/uploads/2015/04/Department-of-Counselling-Graphs-2017-9.1.18.pdf' } },
      { icon:'◆', title:'AntharDhwani', desc:'The newsletter of the Counselling Department — fifteen volumes since January 2019.', link:{ label:'All issues', page:'anthardhwani' } }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Counselling at the Bedside and in the Wards', items:[
      { src:CDN + '2015/06/Swami-blessing-counseling.jpg', caption:'Swami blessing counselling Department' },
      { src:CDN + '2015/05/DSC01861.jpg', caption:'Counseling in Progress' },
      { src:CDN + '2015/06/SSMT_1009-Web.jpg', caption:'Patients waiting for counselling' },
      { src:CDN + '2015/05/DSC01860.jpg', caption:'Counseling in progress' },
      { src:CDN + '2015/05/DSC01855.jpg', caption:'Counseling in progress' },
      { src:CDN + '2015/05/DSC01865.jpg', caption:'Counseling in progress' },
      { src:CDN + '2015/06/SSMT_1050-Web.jpg', caption:'Bedside Counselling' }
    ] }
  ]
};

// ── HMIS ────────────────────────────────────────────────────────────────────
PAGES['hmis'] = {
  title:'Hospital Management Information System', crumb:'Departments · Services · HMIS', subnav:'services',
  subtitle:'The HMIS Department at SSSIHMS has one of the best IT implementations in India among hospitals.',
  sections:[
    { type:'intro', eyebrow:'Introduction', title:'Technology in the Service of Patients',
      image:'assets/sssgh/hmis-blessing.jpg', imageLabel:'Swami blessing HMIS Department staff',
      body:[
        'IT in a hospital involves collation, segregation, storage and retrieval of data pertaining to all aspects of the hospital. SSSIHMS has one of the best IT implementations in India among hospitals. In addition to the latest in Medical Technology to provide the best medical treatment, SSSIHMS is also technologically advanced to enhance its capabilities to serve patients better. Technology is effectively used to facilitate the operations of the hospital, to improve the utilization of infrastructure in a cost effective manner.'
      ] },
    { type:'prose', eyebrow:'Hospital Information System (HIS)', title:'ATHMA — Hospital Operating System', alt:true,
      body:[
        'The Institute’s hospital information system is ATHMA, the hospital operating system developed by Narayana Health, which replaced the earlier Dedalus Enterprise Management platform. ATHMA offers a single platform for storing and processing patient records, allowing medical staff and patients to access a comprehensive medical history swiftly and efficiently.',
        'Its scope extends well beyond record-keeping: the suite covers the clinical electronic health record, laboratory information system, ambulatory care, billing, inventory management and pharmacy, together with role-specific applications — Aadi for doctors, Namah for nurses, Aham for administrators and a patient-facing care app. The modules are designed around the everyday work of clinical teams, so they need very little training before use.',
        'ATHMA has been built over two decades of development within Narayana Health and is now deployed across hospital networks in India and abroad. In practice it automates critical hospital functions, reduces paperwork and shortens documentation and reporting times — clinicians spend less time on the record and more with the patient.'
      ] },
    { type:'prose', eyebrow:'Picture Archival and Communication System', title:'MedDream PACS',
      image:CDN + '2015/06/SSMT_913-Web.jpg', imageCaption:'RIS & PACS usage in Radiology Viewing Room', reverse:true,
      body:[
        'Radiology imaging is now managed on MedDream, which replaced the earlier FUJIFILM SYNAPSE installation. MedDream is a DICOM 3.0 compliant picture archiving and communication system with a web-based, zero-footprint HTML5 viewer — nothing is installed on the reporting workstation, and studies open in an ordinary browser.',
        'The PACS server connects to all DICOM modalities on campus — CR, DX, CT, MR, ultrasound and angiography — and archives, forwards and distributes their images from a single system. Studies can be auto-routed to secondary archives, and an HL7 interface links the archive to the hospital information system so that images and reports travel with the patient record.',
        'The viewer carries a full radiology tool set: zoom, pan, windowing and magnification alongside advanced features such as hanging protocols, cine mode, reference lines, PET-CT fusion, 3D/MPR reconstruction and a wide range of measurements. Because it is responsive, radiologists and clinicians can review studies on desktops, tablets or phones — within the hospital or over a secured connection from outside — and more than one clinician can open the same study at once, which makes remote discussion straightforward. MedDream is FDA cleared and CE Class IIb certified for diagnostic use.'
      ] },
    { type:'prose', eyebrow:'Enterprise Resource Planning', title:'Microsoft Dynamics NAV', alt:true,
      body:[
        'The in-house Inventory Management System has been replaced by Microsoft Dynamics NAV, a full-fledged enterprise resource planning platform. NAV brings core functions — finance, purchasing, inventory, warehousing and reporting — onto a single system, so hospital data is centralised rather than spread across separate applications.',
        'On the materials side, the supply chain and inventory modules track every item from the purchase order to the point of consumption: stock levels and unit costs at each store, reorder points, transfers between locations and goods in transit. Quantity and cost records post to the inventory ledger, which supports costing, valuation and cost-effective procurement of medical consumables.',
        'On the finance side, NAV provides the general ledger, accounts payable and receivable, fixed assets and budgeting, with financial reporting drawn from the same records that the stores and purchase departments work in. Sales, purchasing and inventory sit together, so stock availability and commitments are visible in real time, and automated workflows reduce manual entry and reconciliation.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'The Department and the Campus', items:[
      { src:'assets/sssgh/hmis-blessing.jpg', caption:'Swami blessing HMIS Department staff' },
      { src:CDN + '2015/06/SSMT_913-Web.jpg', caption:'RIS & PACS usage in Radiology Viewing Room' },
      { src:CDN + '2015/04/rad-tn-041.jpg', caption:'Advanced Barco Monitors for Radiology reporting' },
      { src:CDN + '2015/04/aerial3.jpg', caption:'Ariel View of Hospital' },
      { src:CDN + '2015/04/dome-tp1.jpg', caption:'Dome Area' }
    ] }
  ]
};
})();
