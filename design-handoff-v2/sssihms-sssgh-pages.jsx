// sssihms-sssgh-pages.jsx — Sri Sathya Sai General Hospital sub-specialty
// pages, mirroring the live site's SSSGH tab roster (slugs match live).
// Content sourced from whitefield.sssihms.org (see research/live-site-content.md).
(function(){
const PAGES = window.PAGES;
const SUBNAV = window.DEPT_SUBNAV;

const FREE = { type:'cta', pill:'100% Free, Always', title:'Every Service Here Is Free of Charge',
  body:'No payment, no insurance, no financial barrier — care is given to all with equal love, regardless of caste, creed, religion or means.',
  action:{ label:'For Patients', page:'patients' } };

SUBNAV.sssgh = [
  ['Overview','sssgh'], ['History','history-gh'], ['Statistics','statistics-gh'],
  ['Ophthalmology','ophthalmology'], ['OBGYN','obgyn'], ['Orthopedics','orthopedics'], ['ENT','ent'],
  ['General Medicine','general-medicine'], ['Pediatrics','pediatrics'], ['General Surgery','general-surgery'], ['Dental','dental']
];

// ── HISTORY (richer rewrite of the earlier history page) ─────────────────────
PAGES['history-gh'] = {
  title:'History — General Hospital', crumb:'Departments · SSSGH · History', subnav:'sssgh',
  subtitle:'From a village clinic in 1969 to five decades of free general medical care.',
  sections:[
    { type:'quote', image:'assets/baba/baba-06.jpg',
      text:'Health is an essential requisite of man. The man afflicted with ill-health is powerless to execute event eth least burdensome assignment. The scriptures proclaim that health is the very root of all endeavours in the four fields of human achievement — Dharma, Artha, Kama, Moksha. Without health man cannot brave temptations, earn a decent living, fulfil his basic needs or succeed in spiritual path.',
      attr:'Sathya Sai Speaks, Volume 13' },
    { type:'prose', eyebrow:'Introduction', title:'A Beacon of Selfless Service Since 1976', body:[
      'In the annals of humanitarian service, some institutions stand as beacons of selfless dedication, transforming lives and offering solace to those in need. Among these, the Sri Sathya Sai General Hospital, founded by Bhagawan Sri Sathya Sai Baba in 1976, shines as a testament to his profound vision of universal love and service. Operating under the aegis of the Sri Sathya Sai Central Trust, this hospital has, for nearly five decades, provided completely free healthcare to all patients, irrespective of their socio-economic status, caste, or creed.',
      'The genesis of the Sri Sathya Sai General Hospital was rooted in Bhagawan Sri Sathya Sai Baba’s unwavering belief that access to quality healthcare is a fundamental human right, not a privilege. He often reiterated that “service to man is service to God,” and the hospital became a tangible manifestation of this divine dictum. What began as a modest facility has grown into a highly respected institution, equipped with modern medical technology and staffed by dedicated professionals who embody the spirit of compassionate care.',
      'One of the most remarkable aspects of the hospital is its unwavering commitment to providing healthcare absolutely free of cost. For countless individuals and families who live below the poverty line, or are burdened by the exorbitant costs of medical care, the hospital offers a lifeline, alleviating their suffering without adding to their financial distress. This commitment extends to all aspects of treatment, from consultations and diagnostics to surgeries and post-operative care, including medicines.',
      'The operational philosophy of the hospital is deeply intertwined with the spiritual principles espoused by Sri Sathya Sai Baba. Patients are not merely viewed as medical cases but as embodiments of the divine, deserving of utmost respect, dignity, and loving care. This holistic approach to healing goes beyond treating physical ailments; it encompasses emotional and spiritual well-being.',
      'The success and sustainability of the hospital are a tribute to the dedicated efforts of the Sri Sathya Sai Central Trust, which meticulously oversees its operations, and to a vast network of volunteers, donors and well-wishers from around the globe, all inspired by Bhagawan’s mission.'
    ] },
    { type:'intro', eyebrow:'The Early Days', title:'A Clinic Given in Love',
      image:'assets/sssgh/inauguration-sssgh-whitefield.jpg', imageLabel:'Inauguration of the Sri Sathya Sai General Hospital, Whitefield',
      body:[
        'In 1969, Sri N. G. Ganapuley started a small clinic in Whitefield — the Health and Educational Society — which distributed medicines to the villagers free of cost. The clinic was donated to Bhagawan Sri Sathya Sai Baba, and thus the Sri Sathya Sai General Hospital was born in 1976.',
        'At its inauguration, Bhagawan set out its charter: a hospital amidst the villages, where expert advice and treatment would be rendered in a loving atmosphere of reverence and devotion — with no charge ever levied for any service.'
      ] },
    { type:'quote', image:'assets/baba/baba-01.jpg', eyebrow:'At the Inauguration',
      text:'People of this village and villages that are in the surrounding area, will resort to this hospital for medical relief and advise. Unfortunately hospitals that treat patients with love and care, with dedication and devotion are a rarity. These are hospitals with costly equipment and expert doctors, huge buildings and spick-and-span interiors, but they indulge more in profiteering that affording relief. Their services are for those who can pay large sums of money. Villagers are not welcome there, who in turn do not feel at ease to approach them. Therefore this hospital is being started amidst the villages so that expert advice and treatment can be rendered, to them in a loving atmosphere of reverence and devotion. No charge will be levied here for any service.',
      attr:'Bhagawan Sri Sathya Sai Baba, at the inauguration of SSSGH' },
    { type:'prose', eyebrow:'Discourse, 10 June 2001', title:'“This Was Like a Tiny Banyan Seed”', body:[
      'He alone is a true human being who has purity of thought, word and deed. The doctors of this hospital are rendering service with such purity and broad feelings. Dr. Rajeswari used to work day and night in this hospital. I often used to tell her not to exert herself too much… She would say that serving others was her way of taking rest. Her only wish was to leave her mortal coil while serving in the hospital. That is what happened ultimately. She breathed her last in this hospital itself while doing some work sitting in a chair. Dr. Savitri has been continuing the good work initiated by Dr. Rajeswari. Dolly is also rendering great service.',
      'In addition to these doctors, there are some specialists who come from the city to serve here, e.g. an eye specialist, a dentist, a liver specialist, and an orthopaedic surgeon… They are doing service with utmost devotion. All of them are highly dedicated and have love and concern for the patients. I want everyone to develop such love.',
      'There are many doctors in the world who are highly qualified and reputed, but they are after name and fame… whereas our doctors do not care for name and fame. Service is their prime motive. It is because of such noble doctors that our hospital has earned good reputation.',
      'Then what will happen to this hospital? This hospital is also very important. This was like a tiny banyan seed grown into a gigantic tree. It will continue to grow more and more.'
    ], alt:true },
    { type:'gallery', eyebrow:'Archive', title:'The Early Years', cols:3, items:[
      { src:'assets/sssgh/inauguration-1976.jpg', caption:'Inauguration of the hospital, 1976' },
      { src:'assets/sssgh/inauguration-28-8-1976.jpg', caption:'Inauguration, 28 August 1976' },
      { src:'assets/sssgh/inauguration-02.jpg', caption:'At the inauguration' },
      { src:'assets/sssgh/inauguration-03.jpg', caption:'At the inauguration' },
      { src:'assets/sssgh/inauguration-04.jpg', caption:'Inauguration day, SSSGH Whitefield' },
      { src:'assets/sssgh/dressing-dispensing.jpg', caption:'At the dressing and dispensing room' },
      { src:'assets/sssgh/ward-visit.jpg', caption:'Bhagawan in the ward' },
      { src:'assets/sssgh/staff-aarthi.jpg', caption:'Staff offering aarthi' },
      { src:'assets/sssgh/swami-with-staff.jpg', caption:'Bhagawan with the hospital staff' },
      { src:'assets/sssgh/swami-walking-staff-1.jpg', caption:'Walking through the hospital with the staff' },
      { src:'assets/sssgh/swami-walking-staff-2.jpg', caption:'Walking through the hospital' },
      { src:'assets/sssgh/staff-group-photo.jpg', caption:'Group photograph with the hospital family' },
      { src:'assets/sssgh/archive-01.jpg', caption:'From the hospital archive' },
      { src:'assets/sssgh/padanamaskar.jpg', caption:'From the hospital archive' }
    ] },
    { type:'prose', eyebrow:'7 July 2016', title:'One Campus, One Mission', body:[
      'Fulfilling a vision Bhagawan expressed as early as 2001, the General Hospital shifted its operations onto the SSSIHMS Whitefield campus in July 2016. It continues to function as an independent entity, while patients gain easier access to high-end diagnostics and synergy with the super-specialty cardiac and neuro teams.'
    ] },
    { type:'stats', eyebrow:'Five Decades of Care', title:'The Journey in Numbers', alt:true, items:[
      { v:'1976', l:'Year of Establishment' },
      { v:'29.9 Lakh+', l:'Outpatient Visits, 1976–2016' },
      { v:'8.9 Lakh+', l:'Outpatient Visits Since Moving On-Campus (2016–2024)' },
      { v:'20,978', l:'Deliveries (Live Births) Since 1976' },
      { v:'72,000+', l:'Inpatient Admissions Since 1976' },
      { v:'100%', l:'Free — Consultations to Surgery to Medicines' }
    ] },
    { type:'table', eyebrow:'Amount of Work Done', title:'At SSSIHMS Premises, 2016 to Dec 2024',
      cols:['Measure','2016 onwards'], rows:[
        ['OP Visits','893,882'],
        ['IP Visits','25,301'],
        ['Deliveries (live birth)','3,596']
      ] },
    { type:'table', eyebrow:'Since Inception', title:'1976 to 2016 — Prior to Shifting', alt:true,
      cols:['Measure','1976–2016'], rows:[
        ['OP Visits','29,93,265'],
        ['IP Visits','47,470'],
        ['Deliveries (live birth)','17,382']
      ] },
    { type:'features', eyebrow:'Today', title:'Departments of the General Hospital', items:[
      'General Medicine — diagnosis and non-surgical treatment of internal diseases',
      'General Surgery — a broad spectrum of surgical procedures',
      'Paediatrics — health and medical care of infants, children and adolescents',
      'ENT, Ophthalmology and Dentistry',
      'Urology — urinary tract and male reproductive system',
      'Obstetrics and Gynaecology — women’s health, pregnancy and childbirth',
      'Orthopaedics — the musculoskeletal system',
      'Dermatology, Gastroenterology and Psychiatry',
      'Support services — laboratory, radiology and physiotherapy'
    ] },
    { type:'gallery', eyebrow:'Archive', title:'Milestones Along the Way', cols:3, alt:true, items:[
      { src:'assets/sssgh/opd-inauguration-1.jpg', caption:'Inauguration of the outpatient department' },
      { src:'assets/sssgh/opd-inauguration-2.jpg', caption:'Inauguration of the outpatient department' },
      { src:'assets/sssgh/opd-inauguration-3.jpg', caption:'OPD inauguration, SSSGH Whitefield' },
      { src:'assets/sssgh/opd-inauguration-4.jpg', caption:'OPD inauguration, SSSGH Whitefield' },
      { src:'assets/sssgh/quarters-inauguration.jpg', caption:'Inauguration of the staff quarters' },
      { src:'assets/sssgh/quarters-lamp-lighting.jpg', caption:'Lighting the lamp at the staff quarters' },
      { src:'assets/sssgh/inaugurating-machine.jpg', caption:'Bhagawan inaugurating new equipment' },
      { src:'assets/sssgh/swami-dr-savitri.jpg', caption:'Bhagawan with Dr. Savitri' },
      { src:'assets/sssgh/swami-dr-hm.jpg', caption:'Bhagawan with Dr. H. M.' },
      { src:'assets/sssgh/swami-dr-shankar.jpg', caption:'Bhagawan with Dr. Shankar B' },
      { src:'assets/sssgh/ganesha-1.jpg', caption:'Consecration of the Ganesha shrine' },
      { src:'assets/sssgh/ganesha-2.jpg', caption:'Consecration of the Ganesha shrine' },
      { src:'assets/sssgh/ganesha-3.jpg', caption:'Consecration of the Ganesha shrine' },
      { src:'assets/sssgh/parthi-yatra-2002.jpg', caption:'Parthi Yatra, 2002' },
      { src:'assets/sssgh/parthi-yatra-2002-group.jpg', caption:'Parthi Yatra, 2002 — group photograph' },
      { src:'assets/sssgh/parthi-yatra-group.jpg', caption:'Parthi Yatra — group photograph' }
    ] },
    FREE,
      { type:'intro', eyebrow:"History", title:"The Story in Full", body:[
        "Man can engage himself in obligatory and option functions only if he is healthy.”",
        "This radical approach challenges conventional healthcare models, where financial considerations often dictate the quality and accessibility of medical treatment.",
        "The atmosphere within the hospital is often described as serene and uplifting, fostering a sense of hope and reassurance for both patients and their families.",
        "The success and sustainability of the Sri Sathya Sai General Hospital are a tribute to the dedicated efforts of the Sri Sathya Sai Central Trust, which meticulously oversees its operations.",
        "The Trust ensures that the hospital maintains high standards of medical excellence, investing in advanced equipment and attracting skilled medical professionals who are willing to serve with a spirit of selflessness.",
        "Furthermore, the hospital is supported by a vast network of volunteers, donors, and well-wishers from around the globe, all inspired by Bhagawan Sri Sathya Sai Baba's mission.",
        "Their collective contributions, whether in terms of financial aid, time, or expertise, are vital to the continuous functioning of this unique institution.",
        "In a world grappling with disparities in healthcare access and escalating medical costs, the Sri Sathya Sai General Hospital stands as a powerful paradigm of what is possible when compassion and service are placed at the forefront.",
        "It serves as an enduring legacy of Bhagawan Sri Sathya Sai Baba, demonstrating that true healing transcends the boundaries of medicine and extends into the realm of unconditional love and selfless giving.",
        "Its continuing mission to provide free healthcare to all remains a beacon of hope, inspiring humanity to strive for a more equitable and compassionate world.",
        "In 1969 Sri NG Ganapuley started a small clinic, called Health and Educational society in Whitefield, which distributed medicines to villagers of Whitefield free of cost.",
        "Excerpts from Discourse during the inauguration of SSSGH",
        "The villages and other can come here, regain their health and return hale and hearty in order to carry out their task an fulfil their responsibilities.”",
        "An excerpt from 10 June 2001.",
        "Hence, it is said, \"The proper study of mankind is man.\" The doctors of this hospital are rendering service with such purity and broad feelings.",
        "I would tell her, \"Rajeswari, it is possible for you to serve others more and more only when you have good health.",
        "So, you should take proper rest.\" She would say that serving others was her way of taking rest.",
        "The doctor who is arranging this programme is an orthopaedic surgeon.",
        "He worked in America before coming here.",
        "Every doctor should have such love for the patients.",
        "They should talk to the patients with love and make them feel comfortable.",
        "They should develop the noble virtues of understanding and adjustment.",
        "I wish to give you a small example to illustrate this.",
        "When I gave mementos to the doctors, one doctor did not receive the memento, because he came in the end.",
        "Immediately, one of the doctors offered the memento that was given to him.",
        "What a noble act it is!",
        "All these doctors are endowed with such selfless love.",
        "Love alone sustains the entire world.",
        "Love is God, live in love.",
        "God does not exist in the form of Vishnu, Siva, etc.",
        "He exists in the form of love.",
        "One doctor has practically demonstrated such spirit of love in action just now.",
        "None of you have taken note of it, but I noticed it.",
        "Only the fortunate few are endowed with such spirit of sacrifice.",
        "They are interested in advertising their achievements, whereas our doctors do not care for name and fame.",
        "I have noticed that the space available here is very less.",
        "There are four operation theatres here.",
        "Not an inch of space is left, because all the five acres of land are occupied by this building.",
        "That general hospital is meant for treating ailments relating to disorders of lungs, bones, liver, etc.",
        "This hospital will be exclusively meant for the mother and child.",
        "On July 7th, 2016, a significant event unfolded in the history of the Sri Sathya Sai Healthcare Mission as the Sri Sathya Sai General Hospital, located in Whitefield, officially shifted its operations to the campus of the Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS) in Whitefield.",
        "This move was a fulfillment of Bhagawan Sri Sathya Sai Baba's vision, expressed as early as 2001, that the General Hospital would eventually be located within the same campus as the super specialty hospital.",
        "The integration aimed to provide more comprehensive medical care to patients under one roof, allowing them easier access to high-end diagnostic modalities and world-class facilities.",
        "While the General Hospital continues to function as an independent entity, this strategic relocation allows for synergistic operations with the super specialty hospital's cardiac and neuro specialists, enhancing the overall quality and scope of free healthcare services offered to countless patients.",
        "The Sri Sathya Sai General Hospital in Whitefield, now operating from the campus of the Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), provides a wide range of general healthcare services.",
        "While SSSIHMS focuses on super-specialties like Cardiology and Neurology, the General Hospital complements this by offering essential primary and secondary care.",
        "Departments at the Sri Sathya Sai General Hospital (Whitefield) include:",
        "ENT (Ear, Nose, and Throat): Dealing with conditions related to these areas.",
        "Ophthalmology: Focusing on eye health and vision.",
        "Urology: Specializing in the urinary tract and male reproductive system.",
        "Dentistry: Providing dental care and oral health services.",
        "Deramtology: For skin aliments and other conditions",
        "Gasteroenterology: Addressing basic gut and abdomen related issues.",
        "In addition to these clinical departments, the hospital also has crucial support services such as:",
        "Radiology: For imaging services like X-rays and ultrasound scans.",
        "Physiotherapy: For rehabilitation and physical therapy.",
        "Amount of work done at SRI SATHYA SAI GENERAL HOSPITAL at SSSIHMS PREMISES from 2016 to Dec 2024",
        "Statistics since inception in 1976 till 2016, i.e.",
      ] },
    ]
};

// ── STATISTICS-GH ────────────────────────────────────────────────────────────
PAGES['statistics-gh'] = {
  title:'Statistics — General Hospital', crumb:'Departments · SSSGH · Statistics', subnav:'sssgh',
  subtitle:'Cumulative service of the Sri Sathya Sai General Hospital since August 1976.',
  sections:[
    { type:'stats', eyebrow:'Cumulative, Aug 1976–2022', title:'Service at Scale', items:[
      { v:'35.3 Lakh+', l:'Outpatient Visits' },
      { v:'62,776', l:'Total Admissions' },
      { v:'19,611', l:'Deliveries' },
      { v:'41,308', l:'Total Surgeries Performed' }
    ] },
    { type:'stats', eyebrow:'Surgeries by Specialty', title:'Cumulative Surgical Volumes', alt:true, items:[
      { v:'7,570', l:'Obstetrics & Gynaecology (+3,033 Caesareans, 1,318 Sterilisations)' },
      { v:'7,401', l:'Ophthalmology' },
      { v:'6,342', l:'General Surgery' },
      { v:'6,271', l:'ENT Surgery' },
      { v:'5,044', l:'Orthopaedic Surgery' },
      { v:'2,285', l:'Urology' },
      { v:'2,044', l:'Plastic Surgery' }
    ] },
    { type:'cards', eyebrow:'Interactive Dashboards', title:'Explore the Data', cols:4,
      sub:'Dashboards built from complete hospital records — trends, case-mix and demographics by specialty, 2012–2026.', items:[
        { title:'Multi-Specialty', desc:'Combined general hospital surgery.', link:{ label:'Open Dashboard', page:'multi-specialty-statistics' } },
        { title:'Ophthalmology', desc:'Eye surgery case-mix.', link:{ label:'Open Dashboard', page:'ophthalmology-statistics' } },
        { title:'Obstetrics & Gynaecology', desc:'Women’s health surgery.', link:{ label:'Open Dashboard', page:'obs-gynae-statistics' } },
        { title:'Orthopaedics', desc:'Bone & joint surgery.', link:{ label:'Open Dashboard', page:'orthopaedics-statistics' } },
        { title:'ENT', desc:'Ear, nose & throat surgery.', link:{ label:'Open Dashboard', page:'ent-statistics' } },
        { title:'General Surgery', desc:'Surgical case-mix.', link:{ label:'Open Dashboard', page:'general-surgery-statistics' } },
        { title:'Paediatrics', desc:'Children’s surgery.', link:{ label:'Open Dashboard', page:'paediatrics-statistics' } },
        { title:'Urology', desc:'Urological surgery.', link:{ label:'Open Dashboard', page:'urology-statistics' } }
      ] },
    FREE,
        { type:'intro', eyebrow:"Statistics", title:"About These Statistics", body:[
        "SRI SATHYA SAI GENERAL HOSPITAL, WHITEFIELD, BANGALORE",
        "CUMULATIVE STATISTICS FROM AUG 1976 TO 2022",
        "Doctors should serve the poor with a spirit of sacrifice.",
        "There is no greater service than this.",
        "As man is the embodiment of God, it is his primary duty to help the destitute and the forlorn.",
        "It is meant to promote a heart-to-heart and love-to-love relationship between doctor and patient.",
        "A true doctor is one who realises this truth and conducts himself accordingly.",
      ] },
    ]
};

// ── OPHTHALMOLOGY ────────────────────────────────────────────────────────────
PAGES['ophthalmology'] = {
  title:'Ophthalmology', crumb:'Departments · SSSGH · Ophthalmology', subnav:'sssgh',
  subtitle:'The finest eye care — examination, laser and surgery — totally free of cost.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'Complete Eye Care, Free for All',
      body:[
        'The vision of the department is to provide the finest eye care totally free of cost — with a modern operation theatre and an advanced laser unit. Inpatients receive free medicines, nursing care and diet.',
        'Cataract surgery is performed as day care; retinal surgery patients are admitted a day prior to surgery and discharged the day after.'
      ], pill:'Free Eye Care' },
    { type:'features', eyebrow:'Diagnostics', title:'Investigation Facilities', alt:true, items:[
      'Anterior segment OCT',
      'Humphrey visual field analysis',
      'Optical coherence tomography (OCT)',
      'Fundus photography',
      'Fundus fluorescein angiography',
      'B-scan ultrasonography'
    ] },
    { type:'cards', eyebrow:'Clinical Scope', title:'Conditions We Treat', cols:4, items:[
      { title:'Refractive Errors', desc:'Comprehensive examination with glasses prescribed.' },
      { title:'Medical Retina', desc:'Screening, laser treatment and intravitreal injections for diabetic retinopathy, retinal vein occlusion and AMD.' },
      { title:'Surgical Retina', desc:'Retinal detachment surgery, diabetic vitrectomies, macular surgeries (ERM, macular hole, VMT) and IOFB removal.' },
      { title:'Glaucoma', desc:'Visual field analysis, laser peripheral iridotomy, trabeculectomy and combined cataract-glaucoma procedures.' },
      { title:'Cataract', desc:'Senile, traumatic, complicated, subluxated and pediatric cataracts, and secondary IOL implantation.' },
      { title:'Anterior Segment', desc:'Infections and trauma of the conjunctiva and cornea.' },
      { title:'Neuro-Ophthalmology', desc:'Evaluation with on-campus CT/MRI, RNFL and ganglion-cell analysis.' },
      { title:'Pediatric Ophthalmology', desc:'Congenital cataract and strabismus management.' }
    ] },
    { type:'faculty', eyebrow:'Our Team', title:'Faculty', cols:3, items:[
      { name:'Dr. Kavitha Rao', role:'Visiting Sr. Consultant — DNB Ophth (SSSIHMS, 2000), retinal fellowship, 20 years’ experience' },
      { name:'Dr. Shanthala', role:'Sr. Ophthalmologist' },
      { name:'Dr. Archana Preethi', role:'Consultant' },
      { name:'Dr. Hemath Murthi', role:'Honorary Consultant' },
      { name:'Dr. Prasad', role:'Honorary Consultant' },
      { name:'Dr. Balkiran', role:'Honorary Consultant' }
    ] },
    FREE
  ]
};

// ── OBGYN ────────────────────────────────────────────────────────────────────
PAGES['obgyn'] = {
  title:'Obstetrics & Gynaecology', crumb:'Departments · SSSGH · OBGYN', subnav:'sssgh',
  subtitle:'The oldest and largest department of the General Hospital — serving mothers since 1976.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'Caring for Mother & Child',
      body:[
        'The Department of Obstetrics & Gynaecology is the oldest and largest department of the General Hospital, functioning since its inception in 1976. It caters to the maternity and gynaecological needs of patients who come from across the country.',
        'All services — antenatal care, deliveries, surgery and post-operative care — are entirely free of charge.'
      ], pill:'Free Maternity Care' },
    { type:'stats', eyebrow:'Volume', title:'A Busy Department', alt:true, items:[
      { v:'1,800', l:'Outpatient Visits per Month' },
      { v:'50–60', l:'Deliveries per Month' },
      { v:'~50', l:'Gynaecological Surgeries per Month' },
      { v:'30', l:'Beds — Antenatal, Maternity & Post-Operative' }
    ] },
    { type:'features', eyebrow:'Services', title:'What We Provide', items:[
      'Normal and assisted deliveries — including breech and twin deliveries',
      'Caesarean sections and Caesarean hysterectomy',
      'Forceps deliveries and management of retained placenta',
      'Hysterectomies — abdominal and vaginal',
      'Laparotomies, ovarian cyst removal and ectopic pregnancy surgery',
      'D&C, cervical cautery, cervical tear suturing and EUA',
      'Tubectomy in selected cases',
      'Pap smear screening'
    ] },
    { type:'cards', eyebrow:'Facilities', title:'Wards & Theatres', cols:4, alt:true, items:[
      { title:'Antenatal Ward', desc:'10 beds for expectant mothers.' },
      { title:'Maternity Ward', desc:'10 beds for mothers and newborns.' },
      { title:'Post-Operative Ward', desc:'10 beds for surgical recovery.' },
      { title:'2 Labour Rooms', desc:'Including a dedicated room for eclampsia patients, with dedicated OT slots.' }
    ] },
    { type:'faculty', eyebrow:'Our Team', title:'Faculty', cols:3, items:[
      { name:'Dr. Sharmila Nagendran', role:'HOD & Consultant' },
      { name:'Dr. Nikhita Pradhan', role:'Consultant' }
    ] },
    FREE
  ]
};

// ── ORTHOPEDICS ──────────────────────────────────────────────────────────────
PAGES['orthopedics'] = {
  title:'Orthopedics', crumb:'Departments · SSSGH · Orthopedics', subnav:'sssgh',
  subtitle:'Advanced bone, joint and trauma care — free of charge.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'Advanced Orthopaedic Care',
      body:[
        'The department provides free advanced medical and surgical treatment with modern equipment and experienced consultants, seeing 30–40 outpatients a day and sharing the General Hospital’s 48-bed multi-specialty inpatient ward.',
        'A dedicated physiotherapy unit with three full-time physiotherapists supports rehabilitation.'
      ], pill:'Free Orthopaedic Care' },
    { type:'features', eyebrow:'Surgical Scope', title:'Surgeries We Perform', alt:true, items:[
      'Total joint replacements',
      'Arthroscopy of knee, shoulder, ankle, elbow, hip and wrist',
      'Spine surgery',
      'Complex deformity corrections',
      'Trauma — including pelvic and acetabular fractures',
      'Neglected trauma',
      'Benign bone tumours and cysts'
    ] },
    { type:'faculty', eyebrow:'Our Team', title:'Faculty',
      sub:'Visiting consultants: Dr. Manjunath, Dr. Mahesh, Dr. Ranganath, Dr. Gowrishankar, Dr. Lingaraj and Dr. Darshan Jain.', cols:3, items:[
      { name:'Dr. D. C. Sundaresh', role:'HOD & Sr. Consultant (MS Ortho) — arthroscopy & arthroplasty' },
      { name:'Dr. N. Mahesh Kumar', role:'Consultant (DNB Ortho) — fellowship in arthroscopy & sports medicine' },
      { name:'Dr. Ajay', role:'Jr. Consultant (DNB Ortho)' }
    ] },
    FREE
  ]
};

// ── ENT ──────────────────────────────────────────────────────────────────────
PAGES['ent'] = {
  title:'ENT', crumb:'Departments · SSSGH · ENT', subnav:'sssgh',
  subtitle:'Consultation, diagnostic and therapeutic care for ear, nose, throat, head and neck.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'Ear, Nose & Throat Care',
      body:[
        'The department provides consultation, diagnostic and therapeutic services — including medical management — for conditions of the ear, nose, throat, head and neck, entirely free of charge.'
      ], pill:'Free ENT Care' },
    { type:'features', eyebrow:'Services', title:'What We Treat', alt:true, items:[
      'Conditions of the ear, nose and throat',
      'Neck swellings',
      'Chronic dacryocystitis',
      'Removal of foreign bodies in the ear, nose and throat'
    ] },
    { type:'features', eyebrow:'Please Note', title:'Services Not Available',
      sub:'To help patients plan, the following are currently not offered at SSSGH:', items:[
      'Audiological tests and hearing-aid trials',
      'Cochlear implants',
      'Bronchoscopies',
      'Oncosurgeries and extensive skull-base tumours'
    ] },
    { type:'faculty', eyebrow:'Our Team', title:'Faculty', cols:4, alt:true, items:[
      { name:'Dr. Reema Shetty', role:'Consultant (MS ENT) — head & neck' },
      { name:'Dr. Narayan', role:'Honorary HOD' },
      { name:'Dr. Ravi Manohar', role:'Honorary Sr. Consultant' },
      { name:'Dr. Shankar', role:'Honorary Consultant' }
    ] },
    FREE
  ]
};

// ── GENERAL MEDICINE ─────────────────────────────────────────────────────────
PAGES['general-medicine'] = {
  title:'General Medicine', crumb:'Departments · SSSGH · General Medicine', subnav:'sssgh',
  subtitle:'Diagnosis and management of general medical conditions — outpatient, inpatient and critical care.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'The Front Door of the Hospital',
      body:[
        'The Department of General Medicine offers the entire gamut of services — outpatient, inpatient and critical care — totally free of cost, and anchors the day-to-day medical care of the General Hospital’s community of patients.'
      ], pill:'Free Medical Care' },
    { type:'faculty', eyebrow:'Our Team', title:'Faculty', cols:4, alt:true, items:[
      { name:'Dr. Ramkumar G', role:'Head of Department' },
      { name:'Dr. Sapna', role:'Consultant' },
      { name:'Dr. Murugan', role:'Sr. Medical Officer' },
      { name:'Dr. Nirmala', role:'Medical Officer' }
    ] },
    FREE
  ]
};

// ── PEDIATRICS ───────────────────────────────────────────────────────────────
PAGES['pediatrics'] = {
  title:'Pediatrics', crumb:'Departments · SSSGH · Pediatrics', subnav:'sssgh',
  subtitle:'Care for newborns and children — absolutely free of cost.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'For Every Child Who Comes to Us',
      body:[
        'The Department of Pediatrics caters to the needs of newborns and children seeking treatment at the hospital, absolutely free of cost — from routine outpatient care and immunisation to specialised neonatal support.'
      ], pill:'Free Children’s Care' },
    { type:'features', eyebrow:'Spectrum of Services', title:'What We Provide', alt:true, items:[
      'OPD services for common pediatric problems',
      'Post-delivery care of neonates',
      'Pediatric ward — 3 infant warmers, 4 LED phototherapy units, infusion & syringe pumps, multipara monitors, nebulizers, CPAP and central oxygen & air lines',
      'Developmental clinic — all children screened, with intervention for those in need',
      'Retinopathy of Prematurity (ROP) screening for all premature babies by a retinal specialist',
      'Counselling and education on nutrition, hygiene, breastfeeding and baby care',
      'Routine immunisation of children'
    ] },
    { type:'intro', eyebrow:'Our Team', title:'Dr. Kamakshi Kannan, Senior Consultant', narrow:true,
      body:[
        'A graduate of Bangalore Medical College (1973) who subsequently specialised in child health, Dr. Kamakshi Kannan has served as paediatrician and sonologist at the Sri Sathya Sai General Hospital, Whitefield since 1991 — dedicating her life, in Bhagawan’s words, to love and serve every child who comes for treatment.'
      ] },
    FREE
  ]
};

// ── GENERAL SURGERY ──────────────────────────────────────────────────────────
PAGES['general-surgery'] = {
  title:'General Surgery', crumb:'Departments · SSSGH · General Surgery', subnav:'sssgh',
  subtitle:'A broad range of laparoscopic and open surgical procedures — free of charge.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'Surgical Care for the Community',
      body:[
        'The department provides state-of-the-art advanced surgical treatment totally free of cost, with modern equipment and qualified consultants — seeing 30–40 outpatients a day and sharing the General Hospital’s 48-bed multi-specialty ward.'
      ], pill:'Free Surgical Care' },
    { type:'features', eyebrow:'Surgical Scope', title:'Regular Procedures', alt:true, items:[
      'Laparoscopic and open hernia repair',
      'Hydrocele surgery',
      'Appendicectomy',
      'Intestinal perforation surgery',
      'Wound debridement'
    ] },
    { type:'faculty', eyebrow:'Our Team', title:'Faculty', cols:4, items:[
      { name:'Dr. Javed', role:'Sr. Resident' }
    ] },
    FREE
  ]
};

// ── DENTAL ───────────────────────────────────────────────────────────────────
PAGES['dental'] = {
  title:'Dental', crumb:'Departments · SSSGH · Dental', subnav:'sssgh',
  subtitle:'Consultation, diagnosis and treatment for oral health — free for all.',
  sections:[
    { type:'intro', eyebrow:'The Department', title:'Dentistry at the General Hospital',
      body:[
        'The Department of Dentistry provides consultation, diagnostic and therapeutic services to all patients — following stringent sterile techniques using ultrasonic bath and autoclave.'
      ], pill:'Free Dental Care' },
    { type:'features', eyebrow:'Services', title:'Treatments Offered', alt:true, items:[
      'Root canal treatment',
      'Tooth extraction',
      'Fillings and aesthetic fillings',
      'Scaling',
      'Orthodontic treatments',
      'Detailed dental clearance for surgery cases'
    ] },
    { type:'cards', eyebrow:'Infrastructure', title:'The Clinic', cols:3, items:[
      { title:'3 Dental Chairs', desc:'State-of-the-art dental chairs.' },
      { title:'Dental X-ray with RVG', desc:'For both IOPA and OPG imaging.' },
      { title:'Sterilisation', desc:'Ultrasonic bath and autoclave, with stringent sterile technique.' }
    ] },
    { type:'faculty', eyebrow:'Our Team', title:'Faculty', cols:4, alt:true, items:[
      { name:'Dr. Vijendra', role:'HOD, Dental Department' },
      { name:'Dr. Mythili', role:'Dental Surgeon' }
    ] },
    FREE
  ]
};

})();
