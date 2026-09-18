// sssihms-live-sssgh.jsx — SSSGH department main pages, full live content.
// Sources: /obgyn/, /sssgh/pediatrics/, /ophthalmology/, /orthopedics/, /ent/, /general-medicine/, /dental/, /general-surgery/
(function(){
const PAGES = window.PAGES;
const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';

PAGES['obgyn'] = {
  title:'Department of Obstetrics and Gynaecology', crumb:'Departments · SSSGH · OBGYN', subnav:'sssgh',
  subtitle:'The oldest and largest department at the hospital, established at its inception in 1976.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Maternity and Gynaecological Care Since 1976',
      image:U + '2018/02/index-e1527230340300.jpg', imageLabel:'Sri Sathya Sai General Hospital',
      body:[
        'Obstetrics and Gynaecology is the oldest and largest department established right since the inception of the hospital in 1976. The department caters to the maternity and Gynaecological needs of women from across the country.'
      ] },
    { type:'prose', eyebrow:'Spectrum of Services', title:'What the Department Offers', alt:true, body:[
      'Services offered include normal deliveries, episiotomies, Caesarean section, assisted breech deliveries, assisted Twin deliveries, retained placenta, forceps deliveries, cervical cautery, dilatation & curettage, suturing cervical tear, examination under anaesthesia, ectopic pregnancies, tubectomy in certain cases, cervical cytology (pap smear), hysterectomies (both abdominal & vaginal), Caesarean hysterectomy, laparotomies, removal of ovarian cysts etc.'
    ] },
    { type:'cards', eyebrow:'Facilities and Quantum of Services', title:'Beds, Theatres and Volumes', cols:2, items:[
      { icon:'◆', title:'Facilities include', desc:'Antenatal ward 10 beds · Post-Op wards 10 beds · Maternity Ward 10 beds · Labour Rooms including one for Eclampsia cases — 2 · Dedicated Operation Theater slots' },
      { icon:'◆', title:'Quantum of services', desc:'1800 Outpatient consultations per month · 50–60 deliveries per month · 50 Gynecology surgeries per month' }
    ] },
    { type:'faculty', eyebrow:'Faculty', title:'The Department Team', cols:2, alt:true, items:[
      { name:'Dr. Sharmila Nagendran', role:'HOD and Consultant', photo:U + '2022/12/Sharmila-obg.jpg' },
      { name:'Dr. Nikhita Pradhan', role:'Consultant' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Swami and the General Hospital', items:[
      { src:U + '2018/05/110-001.jpg', caption:'' },
      { src:U + '2017/02/Lingodbham.jpg', caption:'Lingodbhavam' },
      { src:U + '2015/12/Swami-e1449820327847.jpg', caption:'' },
      { src:U + '2015/12/Swami-blessing-e1449808501147.jpg', caption:'Swami blessing' },
      { src:U + '2015/05/first-patient-in-ICU-and-Swami.jpg', caption:'First patient in ICU and Swami' },
      { src:U + '2015/05/Swami.jpg', caption:'' }
    ] }
  ]
};

PAGES['pediatrics'] = {
  title:'Department of Pediatrics', crumb:'Departments · SSSGH · Pediatrics', subnav:'sssgh',
  subtitle:'Care for newborns and children, absolutely free of cost.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Newborns and Children',
      image:U + '2022/12/Baba-with-baby1.jpeg', imageLabel:'Baba with a baby',
      body:[
        'The Department of Pediatrics caters to the needs of new born and children seeking treatment from the hospital absolutely free of cost.'
      ] },
    { type:'features', eyebrow:'Spectrum of Services', title:'What the Department Provides', alt:true, items:[
      'OPD services for common pediatric problems.',
      'Post delivery care of the Neonates.',
      'Pediatric ward, equipped with 3 infant warmer, 4 LED phototherapy units, infusion and syringe pumps, Multipara monitor, nebulizers, CPAP machine, central oxygen and air lines.',
      'Developmental clinic: All children are screened and intervention given to needy.',
      'Retinopathy of Prematurity (ROP) screening: for all premature babies by retinal specialist.',
      'Counseling and education at group and individual level for nutrition and hygiene, breast feeding, and general care of babies.',
      'Routine Immunization of the children.'
    ] },
    { type:'faculty', eyebrow:'Faculty', title:'Senior Consultant', cols:1, items:[
      { name:'Dr. Kamakshi Kannan', role:'Senior Consultant', photo:U + '2022/12/Dr.-Kamakshi-with-Swami.png',
        detail:'Dr Kamakshi Kannan comes from a family associated with Swami and his mission for the last five decades. Graduating in 1973 from Bangalore Medical College and subsequently specializing in Child Health. As per Swami’s Instructions to her, she has dedicated her life to serve and love all children who come to her for treatment. Exemplifying Swami’s teaching of Love All Serve All, she feels the Temple of Healing set up by Bhagawan is veritably Pandharapura to all those who serve and seek refuge there. Dr Kamakshi Kannan since 1991 has been serving as a Pediatrician and Sonologist at the Sri Sathya Sai General Hospital in Whitefield.' }
    ] },
    { type:'gallery', eyebrow:'Gallery', title:'Baba With the Children', alt:true, items:[
      { src:U + '2022/12/Baba-with-baby1.jpeg', caption:'' },
      { src:U + '2022/12/Baba-with-baby-2.jpeg', caption:'' },
      { src:U + '2022/12/Baba-with-baby-3.jpeg', caption:'' },
      { src:U + '2022/12/Baba-with-baby-4.jpeg', caption:'' },
      { src:U + '2022/12/Baba-with-baby-5.jpeg', caption:'' },
      { src:U + '2022/12/Baba-with-baby-6.jpeg', caption:'' },
      { src:U + '2022/12/Baba-with-baby-7.jpg', caption:'' },
      { src:'assets/sssgh/swami-with-newborns.jpg', caption:'Bhagawan with newborns and their mothers' }
    ] }
  ]
};

PAGES['ophthalmology'] = {
  title:'Department of Ophthalmology', crumb:'Departments · SSSGH · Ophthalmology', subnav:'sssgh',
  subtitle:'The finest in eye care, totally free of cost.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'A Modern Theatre and an Advanced Laser Unit',
      image:U + '2022/12/kavitha-opthal.jpg', imageLabel:'Dr. Kavitha Rao',
      body:[
        'The department was set up with the vision to make available the finest in eye care in the world to its patients <strong>totally free of cost</strong>. The department has a modern operation theatre, an advanced laser unit and other various other state of the art equipment for delivering quality patient care.',
        '<strong>Patient Care.</strong> For inpatients, medicines, nursing care and diet is given free of cost during their stay. Cataract surgeries are done on day care basis and for Retinal surgeries, patients are admitted one day prior to and discharged on the day after surgery after being explained post-operative care and medications.'
      ] },
    { type:'features', eyebrow:'Investigational Facilities', title:'Diagnostic Equipment', alt:true, items:[
      'Anterior segment OCT',
      'Humphrey visual field analyzer',
      'Optical coherence tomography',
      'Fundus photography',
      'Fundus fluorescence angiography',
      'B Scan ultrasonography'
    ] },
    { type:'prose', eyebrow:'Scope of Work', title:'From Refractive Errors to Vitreoretinal Surgery', body:[
      '<strong>Routine refractive errors.</strong> Screening and examination of refractive errors is performed and suitable glasses are prescribed.',
      '<strong>Retina — medical retina:</strong> screening, laser treatment, intravitreal injections for diabetic retinopathy / retinal vein occlusions / age related macular degeneration. <strong>Surgical retina:</strong> retinal detachment surgery, diabetic vitrectomies, macular surgeries (ERM, macular hole, VMT), intraocular foreign body removal.',
      '<strong>Glaucoma.</strong> Diagnosis, medical/surgical management of primary and secondary glaucomas. Facilities offered are Humphrey visual field testing, laser peripheral iridotomy, trabeculectomy, and combined cataract and trabeculectomy surgery.',
      '<strong>Cataracts.</strong> Senile cataract, traumatic cataract, complicated cataract, subluxated and dislocated lens, pediatric cataract, secondary intraocular lens implantation.',
      '<strong>Anterior segment.</strong> Diagnosis and management of infections and inflammatory conditions of conjunctiva and cornea, and conjunctival/corneal trauma.',
      '<strong>Neuro-ophthalmology.</strong> Complete neuroimaging facilities like CT and MRI scanning are available. Retinal nerve fiber layer analysis and ganglion cell layer analysis are done.',
      '<strong>Paediatric ophthalmology and strabismus.</strong> Congenital cataract surgery, strabismus evaluation and management (surgical and non-surgical).'
    ] },
    { type:'faculty', eyebrow:'Faculty — Full Time', title:'Full-Time Consultants', cols:3, alt:true, items:[
      { name:'Dr. Kavitha Rao', role:'Visiting Sr. Consultant', photo:U + '2022/12/kavitha-opthal.jpg',
        detail:'Completed DNB Ophthalmology in 2000 at SSSIHMS, PG and subsequently did Retinal fellowship at Retina Institute of Karnataka. Consultant at RIK for 20 years before shifting to SSSIHMS, Whitefield on full time basis.' },
      { name:'Dr. Shanthala', role:'Sr. Ophthalmologist', photo:U + '2022/12/Shakuntala-opth.jpg' },
      { name:'Dr. Archana Preethi', role:'Consultant' }
    ] },
    { type:'faculty', eyebrow:'Part Time — Honorary', title:'Honorary Faculty', cols:3, items:[
      { name:'Dr. Hemath Murthi', role:'Sr. Ophthalmologist' },
      { name:'Dr. Prasad', role:'Sr. Ophthalmologist' },
      { name:'Dr. Balkiran', role:'Honorary Faculty' }
    ] },
    { type:'gallery', eyebrow:'Archive', title:'The Operation Theatre', cols:2, alt:true, items:[
      { src:'assets/sssgh/oph-ot.jpg', caption:'Bhagawan at the ophthalmology operation theatre' },
      { src:'assets/sssgh/ot-entrance.jpg', caption:'At the operation theatre entrance' }
    ] }
  ]
};

PAGES['orthopedics'] = {
  title:'Department of Orthopedics', crumb:'Departments · SSSGH · Orthopedics', subnav:'sssgh',
  subtitle:'Advanced medical and surgical treatment, totally free of charge.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Care Without Distinction',
      image:U + '2022/12/Dr.-Sundaresh-with-Swami.jpg', imageLabel:'Dr. D.C. Sundaresh with Swami',
      body:[
        'The department provides state-of-the-art advanced medical and surgical treatment totally free of charge, irrespective of race, religion, caste, creed, gender, nationality or financial status.',
        'The facility is equipped with most modern high technology equipment and is staffed by well qualified, experienced consultants.'
      ] },
    { type:'cards', eyebrow:'Facilities and Services', title:'Outpatient, Physiotherapy and Inpatient', cols:3, alt:true, items:[
      { icon:'◆', title:'Outpatient facility', desc:'About 30–40 patients are provided OPD consultations on daily basis.' },
      { icon:'◆', title:'Physiotherapy unit', desc:'A well-equipped physiotherapy section staffed by three full-time well-trained physiotherapists provides physiotherapy services at the department.' },
      { icon:'◆', title:'Inpatient facility', desc:'The department shares a 48 bedded ward with other multispecialty departments.' }
    ] },
    { type:'features', eyebrow:'Operating Facility', title:'Surgeries Done on a Regular Basis', items:[
      'Total joint replacements',
      'Arthroscopic surgeries of knee, shoulder, ankle, elbow, hip and wrist',
      'Spine',
      'Complex deformity corrections',
      'Trauma including pelvic and acetabular',
      'Neglected trauma',
      'Benign bone tumors and cysts'
    ] },
    { type:'faculty', eyebrow:'Faculty', title:'Consultants', cols:2, alt:true, items:[
      { name:'Dr. D.C. Sundaresh', role:'HOD, Senior Consultant', photo:U + '2022/12/Dr.-Sundaresh-with-Swami.jpg' },
      { name:'Dr. Mahesh', role:'Consultant', photo:U + '2022/12/Mahesh-ortho.jpg' }
    ] },
    { type:'faculty', eyebrow:'Visiting Faculty', title:'Visiting Consultants', cols:3, items:[
      { name:'Dr. Manjunath', role:'Professor and Sr. Consultant' },
      { name:'Dr. Mahesh', role:'Sr. Consultant' },
      { name:'Dr. Ranganath', role:'Sr. Consultant' },
      { name:'Dr. Gowrishankar', role:'Sr. Consultant' },
      { name:'Dr. Lingaraj', role:'Sr. Consultant' },
      { name:'Dr. Darshan Jain', role:'Sr. Consultant' }
    ] }
  ]
};

PAGES['ent'] = {
  title:'Department of ENT', crumb:'Departments · SSSGH · ENT', subnav:'sssgh',
  subtitle:'Consultation, diagnostic and therapeutic services in Ear, Nose, Throat and Head and Neck.',
  sections:[
    { type:'intro', eyebrow:'Goal / Purpose', title:'Services in ENT and Head and Neck',
      image:U + '2022/12/Reema-ENT.jpg', imageLabel:'Dr. Reema Shetty',
      body:[
        'To provide consultation, diagnostic and therapeutic services including medical management to all patients seeking services in the Ear, Nose, Throat and Head and Neck specialty.'
      ] },
    { type:'cards', eyebrow:'Objectives', title:'What Is and Is Not Offered', cols:2, alt:true, items:[
      { icon:'◆', title:'Services available', desc:'Ear conditions · Nose conditions · Throat conditions · Neck swellings · Chronic dacryocystitis · Foreign body in Ear, Nose and Throat' },
      { icon:'◆', title:'Services not available', desc:'Audiological tests · Hearing aid trials · Cochlear implants · Bronchoscopies · Oncosurgeries · Extensive skull base tumours' }
    ] },
    { type:'faculty', eyebrow:'Faculty — Full Time', title:'Consultant', cols:1, items:[
      { name:'Dr. Reema Shetty', role:'Consultant — MS ENT', photo:U + '2022/12/Reema-ENT.jpg',
        detail:'Area of Expertise: Ear, Nose, Throat and Head and Neck. Area of Interest: Head and Neck.' }
    ] },
    { type:'faculty', eyebrow:'Part Time — Honorary', title:'Honorary Faculty', cols:3, alt:true, items:[
      { name:'Dr. Narayan', role:'HOD' },
      { name:'Dr. Ravi Manohar', role:'Sr. Consultant' },
      { name:'Dr. Shankar', role:'Honorary Faculty' }
    ] }
  ]
};

PAGES['general-medicine'] = {
  title:'Department of General Medicine', crumb:'Departments · SSSGH · General Medicine', subnav:'sssgh',
  subtitle:'Outpatient, inpatient and critical care — totally free of cost.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'The Entire Gamut of Services',
      image:U + '2022/12/Dr.-Ramkumar-GM.jpg', imageLabel:'Dr. Ramkumar G, HOD',
      body:[
        'The department of General Medicine at SSSGH, Bangalore offers the entire gamut of services — outpatient, inpatient and critical care — totally <strong>free of cost</strong>.'
      ] },
    { type:'faculty', eyebrow:'Faculty', title:'The Department Team', cols:2, alt:true, items:[
      { name:'Dr. Ramkumar G', role:'HOD', photo:U + '2022/12/Dr.-Ramkumar-GM.jpg' },
      { name:'Dr. Sapna', role:'Consultant', photo:U + '2022/12/Dr.-Swapna-GM.jpg' },
      { name:'Dr. Murugan', role:'Sr. Medical Officer', photo:U + '2022/12/Murugan-GM.jpg' },
      { name:'Dr. Nirmala', role:'Medical Officer', photo:U + '2022/12/GM-2.jpg' }
    ] },
    { type:'gallery', eyebrow:'Archive', title:'From the Department Archive', cols:1, items:[
      { src:'assets/sssgh/with-dr-ramkumar.jpg', caption:'Bhagawan with Dr. Ramkumar' }
    ] }
  ]
};

PAGES['dental'] = {
  title:'Department of Dentistry', crumb:'Departments · SSSGH · Dental', subnav:'sssgh',
  subtitle:'Consultation, diagnostic and therapeutic services in dentistry.',
  sections:[
    { type:'intro', eyebrow:'Goal / Purpose', title:'Dental Care for Every Patient',
      image:U + '2022/12/vijaendra-denta1l.jpg', imageLabel:'Dr. Vijendra, HOD Dental department',
      body:[
        'To provide consultation, diagnostic and therapeutic services to all patients seeking services in Dentistry.',
        '<strong>The infrastructure</strong> consists of three state-of-the-art dental chairs, X-ray machine with RVG for both IOPA and OPG. The department follows stringent sterile techniques using Ultrasonic Bath and Autoclave.'
      ] },
    { type:'features', eyebrow:'Objectives', title:'Services in the Dental Specialty', alt:true, items:[
      'Root canal treatment',
      'Tooth extraction',
      'Fillings',
      'Scaling',
      'Orthodontic treatments',
      'Aesthetic fillings',
      'Detailed dental clearance for surgery cases'
    ] },
    { type:'faculty', eyebrow:'Faculty', title:'The Dental Team', cols:2, items:[
      { name:'Dr. Vijendra', role:'HOD, Dental department', photo:U + '2022/12/vijaendra-denta1l.jpg' },
      { name:'Dr. Mythili', role:'Dental Surgeon', photo:U + '2022/12/Mythili-dental.jpg' }
    ] },
    { type:'gallery', eyebrow:'Archive', title:'Inauguration of the Dental Clinic', cols:2, alt:true, items:[
      { src:'assets/sssgh/dental-inauguration-1.jpg', caption:'Bhagawan inaugurating the dental clinic' },
      { src:'assets/sssgh/dental-inauguration-2.jpg', caption:'At the dental clinic inauguration' }
    ] }
  ]
};

PAGES['general-surgery'] = {
  title:'Department of General Surgery', crumb:'Departments · SSSGH · General Surgery', subnav:'sssgh',
  subtitle:'Laparoscopic and open surgeries, free of cost.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Laparoscopic and Open Surgery', body:[
      'The department provides state-of-the-art advanced surgical treatment totally free of charge, irrespective of race, religion, caste, creed, gender, nationality or financial status.',
      'The facility is equipped with most modern high technology equipment and is staffed by well qualified, experienced consultants.'
    ] },
    { type:'cards', eyebrow:'Facilities and Services', title:'Outpatient and Inpatient', cols:2, alt:true, items:[
      { icon:'◆', title:'Outpatient facility', desc:'About 30–40 patients are provided OPD consultations on daily basis.' },
      { icon:'◆', title:'Inpatient facility', desc:'The department shares a 48 bedded ward with other multispecialty departments.' }
    ] },
    { type:'features', eyebrow:'Operating Facility', title:'Surgeries Done on a Regular Basis', items:[
      'Hernia',
      'Hydrocele',
      'Appendix',
      'Intestinal perforation',
      'Wound debridement'
    ] },
    { type:'faculty', eyebrow:'Faculty', title:'The Department Team', cols:1, alt:true, items:[
      { name:'Dr. Javed', role:'Sr. Resident' }
    ] }
  ]
};
})();
