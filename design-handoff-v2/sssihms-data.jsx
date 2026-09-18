// sssihms-data.jsx — All inner-page content for SSSIHMS Website
// Exports to window: PAGES  (keyed by page id, consumed by ContentPage in sssihms-render.jsx)

const IMG = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2022/11/';
const R = (window.__resources || {});
const BUILDING = R.building || 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/04/Website-full-length-image-1.png';
const SWAMI = R.swami || 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2015/05/Swami-with-stethoscope-e1487392181378.jpg';
const ICON = { Cardiology:R.imgCardiology, CTVS:R.imgCTVS, Neurosurgery:R.imgNeurosurgery, Neurology:R.imgNeurology, Anesthesiology:R.imgAnesthesiology, Radiology:R.imgRadiology, DNB:R.imgDNB, Nursing:R.imgNursing };

const FREE_BANNER = { type:'cta', pill:'100% Free, Always', title:'Every Service Here Is Free of Charge',
  body:'No payment, no insurance, no financial barrier — care is given to all with equal love, regardless of caste, creed, religion or means.',
  action:{ label:'For Patients', page:'patients' } };

const NURSING_CTA = { type:'cta', pill:'Admissions Open 2026–27', title:'B.Sc Nursing Programme',
  body:'Apply online by <strong>19th June 2026</strong>. No tuition fees. Fully residential, exclusively for women. 40 seats. Affiliated to RGUHS, Bengaluru.',
  action:{ label:'Apply Now', href:'https://tinyurl.com/sssihmsnc' } };

const PAGES = {

  // ─── ABOUT CLUSTER ──────────────────────────────────────────────────────────
  'about-hospital': {
    title:'About the Hospital', crumb:'About Hospital',
    subtitle:'A mission of free, compassionate, world-class healthcare — founded in love and sustained by selfless service to all.',
    sections:[
      { type:'intro', eyebrow:'Hospital Overview', title:'World-Class Care. Always Free.',
        image:BUILDING,
        body:[
          'Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), Whitefield, is a tertiary-care super-specialty hospital in Bengaluru, Karnataka, established under the divine inspiration of Bhagawan Sri Sathya Sai Baba.',
          'The mission of the Institute is to provide the highest quality of medical care — completely free of charge — to all patients, irrespective of caste, creed, religion and financial status, in an atmosphere of love and care.',
          'SSSIHMS is accredited by the National Board of Examinations (NBE) and runs a College of Nursing and Allied Health Sciences — with no tuition fees charged.'
        ], pill:'100% Free Medical Care for All' },
      { type:'stats', eyebrow:'Our Impact', title:'Service in Numbers', items:[
        { v:'1,43,500+', l:'Cardiac & Neuro Procedures Since 2001' },
        { v:'51,500+', l:'Multi-Specialty Surgeries Since 1976' },
        { v:'12', l:'Modular Operation Theatres' },
        { v:'6', l:'Intensive Care Units' },
        { v:'25+', l:'Years of Compassionate Service' },
        { v:'100%', l:'Free Medical Care for All' }
      ], alt:true },
      { type:'quote', image:'assets/baba/baba-06.jpg', eyebrow:'Guiding Philosophy',
        text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. Medicine should not be commercialised. It is meant to promote a heart-to-heart and love-to-love relationship between doctor and patient.',
        attr:'Bhagawan Sri Sathya Sai Baba, 2003' },
      { type:'split', cols:[
        { eyebrow:'Genesis', title:'The Beginning', body:[
          'The hospital was conceived and founded by Bhagawan Sri Sathya Sai Baba as a living embodiment of His teachings on selfless service. It has grown into one of India\'s leading super-specialty hospitals — while remaining completely free for every patient who walks through its doors.'
        ], link:{ label:'Read the Genesis', page:'genesis' } },
        { eyebrow:'About the Trust', title:'Sri Sathya Sai Central Trust', body:[
          'SSSIHMS operates under the Sri Sathya Sai Central Trust, which oversees a wide range of educational, medical and service institutions established by Bhagawan Sri Sathya Sai Baba — serving millions across India and the world.'
        ], link:{ label:'Visit the Trust', href:'https://srisathyasai.org.in' } }
      ], alt:true }
    ]
  },

  'guiding-philosophy': {
    title:'Guiding Philosophy', crumb:'Guiding Philosophy',
    subtitle:'The spirit that shapes every decision, every treatment, and every interaction at SSSIHMS.',
    sections:[
      { type:'quote', image:'assets/baba/baba-07.jpg', eyebrow:'The Foundation',
        text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. As man is the embodiment of God, it is his primary duty to help the destitute and the forlorn. Medicine should not be commercialised. It is meant to promote a heart-to-heart and love-to-love relationship between doctor and patient. A true doctor is one who realises this truth and conducts himself accordingly.',
        attr:'Bhagawan Sri Sathya Sai Baba, 2003' },
      { type:'intro', eyebrow:'Healthcare as Worship', title:'Medicine in the Spirit of Love',
        body:[
          'At SSSIHMS, healthcare is not a transaction — it is an act of love. The conviction that service to man is service to God informs everything: the warmth at the registration desk, the unhurried attention of the consulting physician, the dignity afforded to every patient regardless of their station in life.',
          'No bill is ever raised. No patient is ever turned away for want of means. The poorest villager and the most privileged citizen receive identical care, given with identical love.'
        ], narrow:true },
      { type:'features', eyebrow:'Our Principles', title:'What We Hold Sacred', items:[
        'Care given completely free of charge — to every patient, without exception',
        'Equal dignity and attention regardless of caste, creed, religion or means',
        'The highest standards of clinical excellence and ethical practice',
        'Compassion as the first instrument of healing',
        'Service rendered as worship, not as commerce',
        'A culture of love that extends from doctor to patient to family'
      ], alt:true }
    ]
  },

  genesis: {
    title:'Genesis', crumb:'Genesis',
    subtitle:'How a vision of love became one of India\'s foremost free super-specialty hospitals.',
    sections:[
      { type:'intro', eyebrow:'The Origin', title:'Born of a Vision', image:BUILDING,
        body:[
          'SSSIHMS Whitefield was founded as a direct expression of Bhagawan Sri Sathya Sai Baba\'s conviction that the most advanced medical care should be available to all — and that ability to pay should never decide who lives and who suffers.',
          'From its inauguration, the hospital was conceived as a place where super-specialty tertiary care — cardiac surgery, neurosurgery, cardiology, neurology and more — would be delivered entirely free of charge.',
          'What began as an audacious act of faith has matured into an institution that performs thousands of complex surgeries every year, trains the next generation of doctors and nurses, and continues to turn no one away.'
        ] },
      { type:'quote', image:'assets/baba/baba-08.jpg',
        text:'Let different faiths exist, let them flourish, let the glory of God be sung in all languages and a variety of tunes. Respect the differences between the faiths and recognise them as valid as long as they do not extinguish the flame of unity.',
        attr:'Bhagawan Sri Sathya Sai Baba' },
      { type:'split', alt:true, cols:[
        { eyebrow:'Then', title:'A Promise Made', body:[
          'The Institute opened its doors with a singular promise: world-class medicine, free of cost, given in an atmosphere of love. That promise has never been broken.'
        ] },
        { eyebrow:'Now', title:'A Promise Kept', body:[
          'Today SSSIHMS stands among the leading centres in the country for cardiac and neuro sciences, with 12 modular operation theatres, 6 ICUs and three catheterisation labs — all serving patients at no charge.'
        ] }
      ] }
    ]
  },

  statistics: {
    title:'Statistics', crumb:'Statistics',
    subtitle:'Decades of compassionate, free healthcare — measured in lives touched.',
    sections:[
      { type:'stats', eyebrow:'By the Numbers', title:'Service at Scale', items:[
        { v:'1,95,100', l:'Procedures & Cath-Lab Sessions Since 2001' },
        { v:'71,483', l:'Cardiology Cath-Lab Procedures' },
        { v:'30,837', l:'Cardiac Surgeries (CTVS)' },
        { v:'41,185', l:'Neurosurgical Procedures' },
        { v:'51,595', l:'Multi-Specialty Surgeries Since 1976' },
        { v:'11.2 Lakh+', l:'Cardiology Outpatient Visits' }
      ] },
      { type:'cards', eyebrow:'Interactive Dashboards', title:'Explore the Data', cols:4,
        sub:'Live dashboards built from complete hospital records — trends, case-mix and demographics by department.', items:[
          { title:'Combined Hospital', desc:'All departments, 2001–2026.', link:{ label:'Open Dashboard', page:'statistics-combined' } },
          { title:'Cardiology', desc:'Cath-lab sessions & interventions.', link:{ label:'Open Dashboard', page:'cardiology-statistics' } },
          { title:'Cardiac Surgery', desc:'Open & closed-heart procedures.', link:{ label:'Open Dashboard', page:'cardiac-surgery-statistics' } },
          { title:'Neurosurgery', desc:'Cranial & spinal procedures.', link:{ label:'Open Dashboard', page:'neurosurgery-statistics' } },
          { title:'Multi-Specialty', desc:'General hospital surgery.', link:{ label:'Open Dashboard', page:'multi-specialty-statistics' } },
          { title:'Ophthalmology', desc:'Eye surgery case-mix.', link:{ label:'Open Dashboard', page:'ophthalmology-statistics' } },
          { title:'Obstetrics & Gynaecology', desc:'Women\'s health surgery.', link:{ label:'Open Dashboard', page:'obs-gynae-statistics' } },
          { title:'Orthopaedics', desc:'Bone & joint surgery.', link:{ label:'Open Dashboard', page:'orthopaedics-statistics' } },
          { title:'ENT', desc:'Ear, nose & throat surgery.', link:{ label:'Open Dashboard', page:'ent-statistics' } },
          { title:'General Surgery', desc:'Surgical case-mix.', link:{ label:'Open Dashboard', page:'general-surgery-statistics' } },
          { title:'Paediatrics', desc:'Children\'s surgery.', link:{ label:'Open Dashboard', page:'paediatrics-statistics' } },
          { title:'Urology', desc:'Urological surgery.', link:{ label:'Open Dashboard', page:'urology-statistics' } }
        ] },
      { type:'intro', eyebrow:'Context', title:'Every Number Is a Life',
        body:[
          'Behind every figure is a patient who received life-saving care without being asked to pay. The catheterisation labs include two cardiac cath labs and one bi-plane neuro cath lab. The operation theatres, intensive care units, emergency department and CT/MRI suite operate around the clock.',
          'These services are sustained entirely through the Sri Sathya Sai Central Trust and the dedication of doctors, nurses, technicians and volunteers who serve in the spirit of love.'
        ], narrow:true, alt:true }
    ]
  },

  'patient-speak': {
    title:'Patient Speak', crumb:'Patient Speak',
    subtitle:'In the words of those who came as patients — and left as family.',
    sections:[
      { type:'cards', eyebrow:'From the Hospital', title:'Patient Stories', cols:2, gridStart:true, items:[
        { title:'Expression of Gratitude for the Care and Treatment Received', meta:'Jun 5, 2026', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/04/Website-full-length-image-1-400x250.png', desc:'My name is Masud Anwar from West Bengal, India. I am writing with a humble request regarding my heart surgery that was performed at your esteemed hospital on 26 September 2016. At that time, I was only a young child…', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/expression-of-gratitude-for-the-care-and-treatment-received/' } },
        { title:'Story of Divine protection', meta:'Aug 27, 2018', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2015/12/Swami-e1449820327847-400x250.jpg', desc:'This story is a journey of Jashoda Rani, her husband an auto rickshaw driver Paramanondo and their 7 year old daughter Pollobhi, from Laharpur Ranihatti, Bangladesh to SSSIHMS Whitefield, Bangalore. It is a story of Divine protection and the caring human support…', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/story-of-divine-protection/' } },
        { title:'Sheetal Sojourn', meta:'May 4, 2017', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2015/06/Swami-inspecting-CTVS-OT-400x250.jpg', desc:'It was 6.30 am. Deepika was looking at her 3-month-old daughter, Sheetal, lying in the hospital bed and peacefully sleeping. Who can even imagine that the child is a heart patient and will require an open heart surgery?', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/sheetal-sojourn/' } },
        { title:'“This is heaven on earth…”', meta:'May 4, 2017', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2017/04/philips-cath-lab-photo-1-400x250.jpg', desc:'The story of a 16 year old boy’s suffering from birth due to a complex heart ailment and the redemption at SSSIHMS. The grateful father says he can only thank everyone from the bottom of his heart.', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/this-is-heaven-on-earth/' } },
        { title:'“SSSHIMS is my life saver”', meta:'May 4, 2017', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2017/04/philips-cath-lab-photo-1-400x250.jpg', desc:'A 49 year old male person came knocking on the doors of Sri Sathya Sai Institute of Higher Medical Sciences, Bengaluru with hope. He is a Mason by profession and family is dependent on him. He hails from a village in Midnapore, West Bengal.', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/ssshims-life-saver/' } },
        { title:'Prasadam, not just a Treatment', meta:'May 4, 2017', desc:'For Palanisamy, a carpenter from a small town in Tamil Nadu, the word balloon surgery was like Greek and Latin. The doctor at the local clinic explained to them why this surgery is needed for his wife.', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/prasadam-not-just-treatment/' } },
        { title:'Becoming a better wife, a better mother', meta:'May 4, 2017', desc:'Paromita was sitting in front of the doctor at the Super Specialty hospital in Whitefield, Bangalore, tightly clutching the hands of her 14-year-old son. It is the first time she has come so far from home, and that too alone.', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/becoming-better-wife-better-mother/' } },
        { title:'Bhutan Directs Fayaz to Bangalore', meta:'May 4, 2017', desc:'Ways of life are quite strange and cannot be understood most of the time. For Fayaz, the 21-year-old young man, the future was very promising as he left his hometown in West Bengal and went to Bhutan for a good paying job.', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/bhutan-directs-fayaz-bangalore/' } },
        { title:'A Stranger Pointing The Patient to SSSIHMS', meta:'Apr 19, 2017', desc:'Sharmila was diagnosed of her heart condition when she was pregnant. She had a hole in the lower part of the heart and additionally there was a bulge in the area just above the aortic valve obstructing the flow of blood.', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/stranger-pointing-patient-sssihms/' } },
        { title:'I will never visit any other hospital ever…', meta:'Apr 19, 2017', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2015/06/Beautiful-photo-of-Swami-400x250.jpg', desc:'The story of a patient from Salem, in Tamil Nadu, who is in love with SSSIHMS, after two surgeries and annual review visits. From the age of 8, Devi has been having problem walking.', link:{ label:'Read the story', href:'https://whitefield.sssihms.org/will-never-visit-hospital-ever/' } }
      ] },
      { type:'cards', eyebrow:'Healing Touch Archive', title:'Stories from Heart2Heart', sub:'A long-running series of patient stories from SSSIHMS, published in the Radio Sai Heart2Heart journal.', alt:true, cols:2, items:[
        { title:'Completing the Circle', desc:'It is not often that one gets a chance to express heartfelt gratitude but, I think I am lucky to have been given this chance.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01DEC08/09-healingtouch.htm' } },
        { title:'Highway to Hope', desc:'A doctor was speaking to a patient. “You are being discharged today… Your heart valve has been replaced. It is a metal valve and has to be maintained.”', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01OCT08/09-healingtouch.htm' } },
        { title:'Destiny’s Child!', desc:'Bangalore with the sobriquet of ‘the software capital of India’ has become the proverbial melting pot with people from various parts of the country coming over to find their destiny.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01AUG08/09-healingtouch.htm' } },
        { title:'Dancing to Life’s New Tune!', desc:'Coming back to the grin, it was something similar to that of the Cheshire cat, except the grin had a young boy’s face attached to it.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01JUL08/09-healingtouch.htm' } },
        { title:'A Starfish and the Ocean', desc:'A little boy playing on the beach saw this solitary grey haired veteran walking on the sands, throwing starfish back into the sea.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01JUN08/09-healingtouch.htm' } },
        { title:'Farook’s Trials… and the Touch of Allah', desc:'The short spry man in grease stained grey overalls looked up from his efforts on the machine, nodded and stepped back.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01MAY08/09-healingtouch.htm' } },
        { title:'Seven Tense Hours… and the Triumph of Life', desc:'One look told the clinicians that he was all but gone; all vital signs were at their lowest ebb and there was no response to stimulus.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01APR08/09-healingtouch.htm' } },
        { title:'When The Door Opens…', desc:'The paper plane glided silently over the beds and made a belly-flop landing on the nurse’s head.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01MAR08/09-healingtouch.htm' } },
        { title:'“When Love Beckons…”', desc:'I shall call myself Shweta; but this is not my real name. I want the world to know what I have received — the greatest gift of all…the gift of Life.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01FEB08/09-healingtouch.htm' } },
        { title:'How God Built the Life of a ‘Little Builder’', desc:'“What brought you only to this hospital, why not another?” “We wanted our son back…and we could not afford it elsewhere…”', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_06/01JAN08/09-healingtouch.htm' } },
        { title:'When The Divine Sought Out the Dutiful Civil Servant…', desc:'Fifty six year old Salil Kumar Sarangi hails from Dhenkanal, Orissa. Born into a farming family, he rose to Deputy Collector of the district.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01DEC07/09-healingtouch.htm' } },
        { title:'Swapan Sees Anew and Celebrates Life', desc:'Swapan Garai’s world, in a matter of few days, has changed from absolute dejection to complete joy.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01OCT07/09-healingtouch.htm' } },
        { title:'From Cardiac Blues to the Family’s Blue-Eyed Boy', desc:'Samir Parida feels totally at ease in the ward and mingles with the nurses as he would with his elder sisters at home.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01SEP07/09-healingtouch.htm' } },
        { title:'Overcoming Fate with Faith', desc:'Those eyes. They shone with innocence and purity. Her father answers for her, “Vishwaas hi sab kuch hein” — faith is everything.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01AUG07/09-healingtouch.htm' } },
        { title:'New Vision, New Life', desc:'“Eight months ago, one evening I was returning home from work, and suddenly I was gripped with a never-before-felt pain in my head,” says Varanasi Sarwesvar Sharma.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01JUL07/09-healingtouch.htm' } },
        { title:'He Steals Hearts While His Heart Heals…', desc:'Heart disease can be very cruel. Ask Little Rishi. Barely into pre-school, his little heart struggled to keep up with the little bundle of energy he was.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01MAY07/09-healingtouch.htm' } },
        { title:'“Gift of Life to the Gift of God”', desc:'‘Health is wealth’ is an aphorism that we are taught right from kindergarten but how many of us honestly take it seriously?', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01MAR07/09-healingtouch.htm' } },
        { title:'Dawn… After a Long Dark Night!', desc:'The fear of failure is the biggest stumbling block in human initiative. But that was not the case with Malini.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01FEB07/09-healingtouch.htm' } },
        { title:'The Grateful Granny from Bijapur', desc:'Though she lives in a land with such a hoary past, history seems to have little to do with her day to day living.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_05/01JAN07/09-healingtouch.htm' } },
        { title:'The Gift of Life to a Good Heart', desc:'Poonam’s young life had many blessings. At age seven, she came into Swami’s fold, attending Bal Vikas classes in Darjeeling.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01NOV06/poonam.htm' } },
        { title:'Where Love is the Therapy…', desc:'It was impressive to watch two professionals in their individual fields in conference. It was a lesson in clinical detachment.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01OCT06/Where_Love_Is_the_Therapy.htm' } },
        { title:'Faith, Fortitude… and the Divine Touch!!!', desc:'“Oh! This child has been admitted and discharged four times.” Three pairs of eyes swiveled to the little baby boy.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01SEP06/pinkudas.htm' } },
        { title:'From Heartbreak to Happiness', desc:'“I can see, Aunty,” he said as he came running and held my hand. “Take me to the doctor. I want to tell him also that I can see.”', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01SEP06/omkar.htm' } },
        { title:'Amita’s Amazing Journey — From Doubt and Despair to Light and Delight', desc:'To be born healthy is the greatest of miracles. Here is a small story about the not so fortunate Amita Sahoo.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01AUG06/amita.htm' } },
        { title:'An Unprecedented Miracle of Life… and Divine Love', desc:'“It is a healthy baby,” said the gynaecologist to Mrs. Kiran Kumari four months into her pregnancy. Everything seemed moving in the right direction…', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01JUL06/sai-sathya.htm' } },
        { title:'Jagadish Discovers Heaven and Finds Fulfillment in SSSIHMS', desc:'“If you cannot find a cure for your illness at this hospital there is no other place in the world where you can be cured.”', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01JUN06/jagadish.htm' } },
        { title:'Godfrey and Agnes Find God and Angels in Swami’s Hospital', desc:'Their intense struggle of six long years, culminating in their visit to SSSIHMS Bangalore, has finally paid off.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01May06/uganda.htm' } },
        { title:'The Spirited Little Teacher in the Hospital', desc:'Today I met a Teacher who taught me unquestioning faith in God — in the hospital ward, through the little index finger of a 5-year old child.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01APR06/spirited_little_teacher.htm' } },
        { title:'“The Hospital Has Given Me… Time”', desc:'“Newand?” I heard myself say, “What does that mean?” He explained that it meant ‘prayer’ where he came from, a remote village a thousand miles north of Bangalore.', link:{ label:'Read more', href:'http://media.radiosai.org/Journals/Vol_04/01MAR06/newand.htm' } }
      ] },
      { type:'gallery', eyebrow:'Archive', title:'Bhagawan with Patients', cols:3, items:[
        { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/swami-with-patients--300x192.jpg', caption:'Swami speaking to a patient in ICU' },
        { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-25-300x203.jpg', caption:'Swami blessing a small child' },
        { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/patient-and-swami-new-300x192.jpg', caption:'Swami blessing a patient going to surgery' },
        { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Swami-and-Radhaswami-sir-e1458295815646-300x101.jpg', caption:'Swami blessing a cardiac patient' },
        { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-2-300x200.jpg', caption:'Swami blessing a child after neurosurgery' },
        { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Photo-16-e1430981143883-300x143.jpg', caption:'Swami blessing another patient' }
      ] },
      FREE_BANNER
    ]
  },

  'visitor-speak': {
    title:'Visitor Speak', crumb:'Visitor Speak',
    subtitle:'Reflections from those who have walked through our doors as guests and observers.',
    sections:[
      { type:'testimonials', eyebrow:'Impressions', title:'What Visitors See', cols:2, items:[
        { quote:'Health care is not just medical care. Medical care is one of the components of what you all are doing. Actually healthcare is medical care, education and nutrition. Health care happens only when all these three are combined…you are doing all the three… An antiballistic missile has been launched by Bhagawan against poverty: Through education, water and health care.', name:'Dr. A.P.J. Abdul Kalam', place:'Former President of India' },
        { quote:'I have never seen anything like this on Earth…it is a wonderful feeling far removed from the national healthcare in the west which does not seem to work very well…the impressive thing about the Hospital created by Bhagavan Sai Baba is the combination of the three aspects: state-of-art technology; free medical treatment and the healing powers of His presence instilling in the patient the firm belief that he/she will get well; this is something I believe western healthcare would do very well to consider.', name:'Dr. Michael Nobel', place:'Chairman of the family society\u2019s board of directors and chairman of the Appeal of the Peace Prize Laureates Foundation', photo:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/visitor-01-nobel.jpg' },
        { quote:'The Sri Satya Sai Institute of Higher Medical Sciences is a wonderful contribution of Bhagawan Sri Satya Sai Baba. To have a free and modern hospital for the poor people of India was a dream and pledge of our leaders in the freedom struggle. This is a realization of the dream of Gandhiji and Jawaharlal Nehru. It represents our spiritual heritage. One feels proud after going round it. This can be a model for all the developing countries as well as the developed world. The developed world has these facilities but not for the poor. May this example be followed by others. It is not only a medical but a spiritual contribution of India. With respectful Pranams to revered Swami.', name:'Sri Krishan Kant', place:'Former Vice President of India, in the visitor\u2019s book at SSSIHMS', photo:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/visitor-krishnakant.jpg' },
        { quote:'We literally bathed in the healing space created through Baba\u2019s loving vision…What we say was the highest level of technology, with some equipment even newer than the equipment we use at Duke Medical Centre. But the technology was dwarfed by the context into which everything in the Hospital dwelled — health care in God\u2019s service.', name:'Dr. Mitchell W. Krucoff', place:'Professor of Medicine/Cardiology, Interventional Cardiology, Duke University Medical Centre and Director, Cardiovascular Laboratories, Durham VA Medical Center', photo:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/visitor-krucoff.jpg' },
        { quote:'It is breath-taking to see the Power of Love transform nothing, into the creations that are manifest in this Place. Truly remarkable, truly awe-inspiring, and truly marvelous. I pray that the Spirit that made all this possible will make me contribute to the growth of this Spirit and Place.', name:'Mr. Noah Samara', place:'CEO, World Space Digital Radio', photo:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/visitor-Noah-Samara.jpg' },
        { quote:'The vision, compassion and professionalism of yourself and the members of the Sri Sathya Sai Institute of Higher Medical Sciences is, and remains, an inspiration for all of us. It makes us all feel good to be human and be a small part of such a wonderful dedication to our fellow man.', name:'Mr. David F. Moxam', place:'President and CEO, Authentix, Inc., Dallas, Texas, USA', photo:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/visitor-D-Moxam.jpg' },
        { quote:'I just saw the hospital and asked the person who was taking me around, "Is it a hospital or a temple?" The impression I get is, yes, it is a hospital. There are patients though the structure is like a temple. Everywhere we see Baba\u2019s photographs. Can every hospital, every institution in this country be a cohesive model of both a hospital and a temple? That should be our goal.', name:'Prof. Gowri Devi', place:'Former Director, National Institute of Mental Health and Neuro Sciences (NIMHANS)', photo:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/visitor-Dr-Gowri-Devi.jpg' }
      ] },
      { type:'gallery', eyebrow:'Archive', title:'Guests of the Hospital', cols:2, items:[
        { src:'https://cdn.sssihms.org/sssihms/wp-content/uploads/2015/05/Swami-with-Abdul-Kalam-copy-300x192.jpg', caption:'Dr. Abdul Kalam with Baba during the Health Meet 2002' }
      ] },
      { type:'cards', eyebrow:'Recent Visits', title:'From the Visitors\u2019 Log', alt:true, cols:1, items:[
        { title:'Visit of Nobel Peace Prize Laureate 2015 to SSSIHMS', desc:'Madam Ouided Bouchamaoui, Nobel Peace Prize co-laureate 2015 from Tunisia, visited SSSIHMS Whitefield on 17 November 2018 enroute to Puttaparthi to participate in the Ladies Day celebrations. She was amazed at the work being done so silently at such a magnitude.', link:{ label:'Read more', href:'https://whitefield.sssihms.org/visit-of-noble-peace-prize-laureate-2015-to-sssihms/' } }
      ] },
      { type:'intro', eyebrow:'Come and See', title:'Visiting SSSIHMS',
        body:[
          'Guests, well-wishers and medical professionals are welcome to learn about the work of the Institute. For visits, group tours or media enquiries, please reach our help desk.'
        ], narrow:true, link:{ label:'Contact the Help Desk', page:'help-desk' } }
    ]
  },

  // ─── DEPARTMENTS CLUSTER ────────────────────────────────────────────────────
  specialties: {
    title:'Clinical Departments', crumb:'Departments',
    subtitle:'Every service — from outpatient consultation to the most complex surgery — provided entirely free of charge.',
    sections:[
      { type:'cards', eyebrow:'Super Specialties', title:'Tertiary & Super-Specialty Care',
        sub:'World-class care in the most demanding disciplines, completely free of cost.', items:[
          { icon:'❤', title:'Cardiology', desc:'The full gamut of cardiac services — outpatient, inpatient and critical care — among the leading national centres for adult and paediatric interventions.', link:{ label:'Cardiology', page:'cardiology' } },
          { icon:'✚', title:'Cardiac Surgery', desc:'The complete range of invasive and minimally invasive cardiothoracic and vascular surgery for adults and children.', link:{ label:'Cardiac Surgery', page:'cardiac-surgery' } },
          { icon:'◆', title:'Neurosurgery', desc:'Among the finest neuroscience services in the country — complex cases referred from across India and abroad.', link:{ label:'Neurosurgery', page:'neurosurgery' } },
          { icon:'◇', title:'Neurology', desc:'A well-equipped centre with the latest facilities for the full breadth of neurological conditions.', link:{ label:'Neurology', page:'neurology' } },
          { icon:'✦', title:'Anesthesiology', desc:'Serving 12 modular OTs, 6 ICUs, 3 cath labs, emergency department and CT/MRI suite — round the clock.', link:{ label:'Anesthesiology', page:'anesthesiology' } },
          { icon:'⬡', title:'Radiology', desc:'Expert diagnostic and interventional imaging — X-ray, ultrasound, CT, MRI, DSA — using state-of-the-art technology.', link:{ label:'Radiology', page:'radiology' } }
        ] },
      { type:'intro', eyebrow:'Sri Sathya Sai General Hospital', title:'Multi-Specialty General Hospital', alt:true,
        body:[
          'Alongside the super-specialty Institute, the Sri Sathya Sai General Hospital provides comprehensive multi-specialty care — ophthalmology, obstetrics & gynaecology, orthopaedics, ENT, general medicine, paediatrics, general surgery and dental — all entirely free of charge.'
        ], link:{ label:'General Hospital (SSSGH)', page:'sssgh' } }
    ]
  },

  cardiology: {
    title:'Cardiology', crumb:'Departments · Cardiology', icon:ICON.Cardiology,
    subtitle:'A comprehensive range of services — outpatient, inpatient and critical care — all offered completely free of charge.',
    sections:[
      { type:'intro', eyebrow:'Overview', title:'A Leading National Cardiac Centre',
        body:[
          'The Department of Cardiology at SSSIHMS, Bangalore provides a comprehensive range of services including outpatient, inpatient and critical care, all offered completely free of charge. Renowned as one of the leading national institutions, it performs an extensive variety of adult and paediatric cardiac interventions.',
          'The department distinguishes itself through state-of-the-art diagnostic and interventional procedures, ensuring a high degree of clinical excellence. A broad spectrum of clinical conditions provides valuable academic exposure to practitioners and trainees, with particular emphasis on individual attention and a customised evaluation for every patient.'
        ], pill:'Free Cardiac Care' },
      { type:'stats', eyebrow:'Outpatient Services & Interventions', title:'Care at Scale', alt:true, items:[
        { v:'11.2 Lakh+', l:'Outpatient Visits Since 2001' },
        { v:'71,483', l:'Cath-Lab Procedures Since 2001' },
        { v:'36', l:'Beds in the Cardiac Care Unit' },
        { v:'2', l:'Cathlabs (expandable to 4)' }
      ] },
      { type:'faculty', eyebrow:'Our Team', title:'Faculty',
        sub:'The core team is supported by honorary faculty and a visiting faculty network of over 35 cardiologists and electrophysiologists from leading centres in the USA, Canada, UK and India.', cols:3, items:[
        { name:'Dr. Reeta Varyani', role:'I/C HOD & Sr. Consultant' },
        { name:'Dr. Prayaag Kini', role:'Sr. Consultant' },
        { name:'Dr. Barooah Banajith', role:'Sr. Consultant' },
        { name:'Dr. Pravat Kumar Dash', role:'Honorary Faculty' },
        { name:'Dr. Srikanth Sola', role:'Honorary Faculty' }
      ] },
      { type:'features', eyebrow:'Cathlab-Based Procedures', title:'Interventional Capabilities', items:[
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
      { type:'features', eyebrow:'Unique Features', title:'What Sets Us Apart', alt:true, items:[
        'Treatment plans decided purely on clinical need — never on the patient\u2019s financial situation',
        'Cross-departmental collaboration with Radiology for Cardiac CT and MRI',
        'Advanced non-invasive work in 3D and 4D echocardiography, including ventricular and atrial strain studies',
        'High volumes of valvuloplasty, notably mitral valvuloplasty requiring septal puncture',
        'Expertise in less common procedures — alcohol septal ablation, VSD & RSoV closure, APW transcatheter closure, TAVR/EVAR and CRT implantation',
        'A recognised centre of excellence for postgraduate and doctoral training in cardiology'
      ] },
      { type:'cards', eyebrow:'Infrastructure', title:'World-Class Equipment', cols:3, items:[
        { title:'Cardiology OPD', desc:'Two GE Vivid E95 and one Philips EPIQ CVx ultrasound machines with AI capabilities, two GE treadmill stress systems, biphasic defibrillators, 7-day Holter recording and digital ECG — all DICOM-compliant.' },
        { title:'Cathlab Facilities', desc:'A Siemens Biplane Cathlab and a Philips FD10C Monoplane Cathlab with hemodynamic systems, Rotablator, IVUS and EnSite 3D mapping — fully equipped with defibrillators, ventilators and intra-aortic balloon pumps.' },
        { title:'Cardiac Care Unit', desc:'A 36-bed CCU with advanced patient monitors, echocardiography, ventilators, intra-aortic balloon pumps, defibrillators, portable X-ray and infusion pumps.' }
      ] },
      { type:'cards', eyebrow:'Academics & Research', title:'A Legacy of Distinction', cols:3, items:[
        { title:'Five DrNB Gold Medalists', desc:'The department has produced five Gold Medalists in the DrNB Cardiology programme between 2005 and 2018.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'National & International Awards', desc:'Best Oral Abstract, Poster and Original Research Awards at CSI conferences (2013\u20132025); the Modi Mundi and Prof. D.P. Basu Memorial Awards; presentations at ACC, SCAI and the Asian Society of Clinical Cardiology.' },
        { title:'Active Research', desc:'National clinical trials with AIIMS and others, plus institution-led studies including COLSAI, SAIMITRA and PROMESA, and ML-guided predictive models in cardiology.' }
      ] },
      FREE_BANNER
    ]
  },

  'cardiac-surgery': {
    title:'Cardiac Surgery', crumb:'Departments · Cardiac Surgery', icon:ICON.CTVS,
    subtitle:'The complete range of cardiothoracic and vascular surgical procedures for adults and children — guided by compassion, given free of charge.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Cardiothoracic & Vascular Surgery',
        body:[
          'The Department of Cardiothoracic and Vascular Surgery offers a comprehensive range of cardiac surgical procedures, guided by the principles of compassion and excellence and performed in the spirit of selfless service to humanity — entirely free of cost.',
          'Cardiac surgery here includes both open-heart procedures, which use a heart-lung machine, and closed-heart procedures performed without one. The department\u2019s expertise across both ensures that every patient receives the best possible care.'
        ], pill:'Free Cardiac Surgery' },
      { type:'stats', eyebrow:'By the Numbers', title:'Cardiac Surgery at Scale', alt:true, items:[
        { v:'30,837', l:'Procedures Since 2001' },
        { v:'24,978', l:'Unique Patients' },
        { v:'10,977', l:'Congenital Open-Heart Repairs' },
        { v:'7,829', l:'Coronary Bypass Surgeries (CABG)' }
      ] },
      { type:'faculty', eyebrow:'Our Team', title:'Faculty', cols:3, items:[
        { name:'Dr. Chittaranjan S J', role:'Sr. Consultant & HOD' },
        { name:'Dr. Giridhar Kamalapurkar', role:'Sr. Consultant' },
        { name:'Dr. Gautham Shetty', role:'Consultant' }
      ] },
      { type:'features', eyebrow:'Open-Heart Surgery', title:'Common Open-Heart Procedures', items:[
        'Coronary artery bypass — mostly off-pump (OPCAB), without a heart-lung machine',
        'Valve replacement, with repair accomplished whenever feasible',
        'Aortic aneurysm repair using valve conduits or grafts as indicated',
        'Correction of congenital heart defects'
      ] },
      { type:'features', eyebrow:'Closed-Heart Surgery', title:'Common Closed-Heart Procedures', items:[
        'PDA ligation',
        'Bi-Directional Glenn',
        'Blalock-Taussig (BT) shunt',
        'Coarctation of aorta repair'
      ] },
      { type:'cards', eyebrow:'Specific Procedures', title:'A Comprehensive Surgical Repertoire',
        sub:'The department performs a wide range of specific cardiac and thoracic procedures, including:', alt:true, cols:3, items:[
          { title:'ALCAPA Repair', desc:'A rare anomaly where the left coronary artery arises from the pulmonary artery; it is re-implanted into the ascending aorta.' },
          { title:'Aortic Root Replacement', desc:'Aortic valve and ascending aorta replaced with an artificial valve and graft, with the coronary buttons re-implanted.' },
          { title:'AP Window Closure', desc:'A communication between the ascending aorta and pulmonary artery closed with a prosthetic or pericardial patch.' },
          { title:'ASD Closure', desc:'A defect in the septum between the left and right atria closed surgically with a pericardial patch.' },
          { title:'AV Canal Repair', desc:'A complex defect: the two incompletely formed valves are repaired and the deficient atrial/ventricular septa reconstituted.' },
          { title:'AVR', desc:'Aortic Valve Replacement with a mechanical or bio-prosthetic (tissue) valve.' },
          { title:'BD Glenn', desc:'Improves blood flow to the lungs by connecting the superior vena cava to the right pulmonary artery.' },
          { title:'Modified BT Shunt', desc:'A palliative procedure for cyanotic defects (commonly Tetralogy of Fallot), connecting the subclavian to the pulmonary artery with a graft.' },
          { title:'CABG', desc:'Coronary Artery Bypass Graft — blocked coronary arteries bypassed using conduits from elsewhere in the body, often off-pump.' },
          { title:'CoA Repair', desc:'A narrowed segment of the aorta is removed and the ends rejoined directly or bridged with a prosthetic graft.' },
          { title:'Cor Triatriatum Repair', desc:'An abnormal membrane dividing the left atrium into two chambers is surgically removed.' },
          { title:'DCRV Repair', desc:'Abnormal obstructing muscle bundles inside the right ventricle are surgically removed.' },
          { title:'DORV Repair', desc:'In double-outlet right ventricle, the VSD is closed so the left ventricle pumps to the aorta and the right to the pulmonary artery.' },
          { title:'Fontan', desc:'For single-ventricle hearts, systemic venous return is routed directly to the pulmonary circulation.' },
          { title:'Lung Resection', desc:'Removal of tumours and cysts in the lungs.' },
          { title:'MV Repair', desc:'Surgical repair of the mitral valve.' },
          { title:'MVR', desc:'Mitral Valve Replacement with a mechanical or bio-prosthetic (tissue) valve.' },
          { title:'Myxoma Excision', desc:'Excision of a myxoma — a connective-tissue tumour usually found in the heart chambers.' },
          { title:'PAPVC Repair', desc:'Misrouted pulmonary veins re-routed to the left atrium, with closure of the associated ASD.' },
          { title:'PDA Ligation / Division', desc:'The patent ductus arteriosus, a connection between the pulmonary artery and aorta, is tied off or divided.' },
          { title:'Pericardiectomy', desc:'For constrictive pericarditis, the adhered pericardium is surgically removed.' },
          { title:'RSOV Repair', desc:'Closure of a ruptured sinus of Valsalva into a right-sided heart chamber.' },
          { title:'SAM Excision', desc:'Excision of an obstructing sub-aortic membrane below the aortic valve.' },
          { title:'Supravalvular Aortic Stenosis', desc:'Surgical repair of severe narrowing above the aortic valve in the ascending aorta.' },
          { title:'TAPVC Repair', desc:'All pulmonary veins, draining abnormally into the right atrium, are re-routed to the left atrium.' },
          { title:'TGA', desc:'Transposition correction via atrial-level (Senning, Mustard) or arterial-switch (Jatene) operations with coronary transfer.' },
          { title:'Thymectomy', desc:'Excision of the thymus gland for myasthenia gravis or thymic tumours.' },
          { title:'TOF Repair', desc:'For Tetralogy of Fallot, the VSD is closed and the right ventricular outflow tract reconstructed.' },
          { title:'VSD Closure', desc:'Surgical closure of an abnormal opening in the septum between the left and right ventricles.' }
        ] },
      { type:'cards', eyebrow:'Academics', title:'Training in Cardiac Surgery', cols:3, items:[
        { title:'DNB Cardiac Surgery', desc:'A 6-year residency accredited by the NBE since 2002 — two years of general surgery and allied specialties, then three years of cardiovascular and thoracic specialties.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'Fellowship', desc:'Fellowship in Paediatric Cardiac Surgery.', link:{ label:'Fellowships', page:'fellowship' } },
        { title:'BSc Perfusion Technology', desc:'Allied health programme training perfusionists for cardiac surgery.', link:{ label:'Nursing & Allied Health', page:'nursing-and-allied-health' } }
      ] },
      FREE_BANNER
    ]
  },

  neurosurgery: {
    title:'Neurosurgery', crumb:'Departments · Neurosurgery', icon:ICON.Neurosurgery,
    subtitle:'Considered one of the finest neuroscience services in the country — all care given free of charge.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Advanced Neurosciences',
        body:[
          'The Department of Neurosurgery is considered one of the best neuroscience services in the country. Patients come here from all parts of India and abroad seeking a second opinion for their neurological problem or surgery for a complex disease.',
          'Equipped with a bi-plane neuro catheterisation lab, dedicated neuro ICU and advanced imaging, the department manages the most demanding cranial and spinal cases — at no cost to the patient.'
        ], pill:'Free Neurosurgical Care' },
      { type:'stats', eyebrow:'By the Numbers', title:'Neurosurgery at Scale', alt:true, items:[
        { v:'41,185', l:'Procedures Since 2001' },
        { v:'31,489', l:'Unique Patients' },
        { v:'40.8%', l:'Complex Cases' }
      ] },
      { type:'faculty', eyebrow:'Our Team', title:'Faculty',
        sub:'Visiting faculty include Dr. Anil Nanda (USA) and Dr. Ravi Goyal (USA).', cols:4, items:[
        { name:'Dr. Saritha Aryan', role:'Sr. Consultant & I/C HOD' },
        { name:'Dr. Sumit Thakar', role:'Sr. Consultant' },
        { name:'Dr. Sanjay H. M.', role:'Jr. Consultant' },
        { name:'Dr. Sauradeep Sarkar', role:'Jr. Consultant' }
      ] },
      { type:'features', eyebrow:'Services', title:'Clinical Scope', items:[
        'Neuro-oncology & complex tumour surgery',
        'Cerebrovascular & endovascular neurosurgery',
        'Skull base & micro-neurosurgery',
        'Spinal surgery — degenerative & traumatic',
        'Paediatric neurosurgery',
        'Neuro intensive care'
      ] },
      { type:'cards', eyebrow:'Academics & Research', title:'Education in Neurosurgery', cols:2, items:[
        { title:'DNB Neurosurgery', desc:'Super-specialty training accredited by the National Board of Examinations.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'Research & Achievements', desc:'Faculty publish in reputed national and international journals across the neurosciences.', link:{ label:'Academics', page:'academics' } }
      ] },
      FREE_BANNER
    ]
  },

  neurology: {
    title:'Neurology', crumb:'Departments · Neurology', icon:ICON.Neurology,
    subtitle:'A well-equipped centre providing the latest facilities for a broad range of neurological ailments.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Comprehensive Neurology',
        body:[
          'SSSIHMS has a well-equipped Centre for Neurology which provides the latest facilities for the treatment of a broad range of neurological ailments.',
          'The department is manned by a consultant neurologist and a team of resident doctors, besides the technical and ancillary staff — working closely with neurosurgery, radiology and critical care to deliver complete neurological care, free of charge.'
        ], pill:'Free Neurology Care' },
      { type:'features', eyebrow:'Services', title:'Conditions We Treat', alt:true, items:[
        'Stroke & cerebrovascular disease',
        'Epilepsy & seizure disorders',
        'Movement disorders',
        'Neuromuscular disorders',
        'Headache & demyelinating disease',
        'Neuro-diagnostics — EEG, EMG, evoked potentials'
      ] },
      FREE_BANNER
    ]
  },

  anesthesiology: {
    title:'Anesthesiology', crumb:'Departments · Anesthesiology', icon:ICON.Anesthesiology,
    subtitle:'The backbone of surgical and critical care — serving theatres, ICUs and cath labs round the clock.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Anesthesia & Critical Care',
        body:[
          'The anaesthesia services cater to 8 + 4 modular operation theatres, 6 intensive care units, 3 catheterisation labs (two cardiac cath labs and one bi-plane neuro cath lab), the emergency (casualty) department and the CT/MRI suite.',
          'The total number of surgeries carried out per annum is approximately 2,900 cardiac and neuro surgeries and 3,300 multi-specialty surgeries — supported by a dedicated cardiac anesthesia team.'
        ], pill:'24×7 Anesthesia & Critical Care' },
      { type:'stats', eyebrow:'Coverage', title:'Round-the-Clock Support', alt:true, items:[
        { v:'12', l:'Modular Operation Theatres (8 + 4)' },
        { v:'6', l:'Intensive Care Units' },
        { v:'3', l:'Catheterisation Labs' },
        { v:'6,200+', l:'Surgeries Supported / Year' }
      ] },
      { type:'faculty', eyebrow:'Our Team', title:'Faculty',
        sub:'Supported by 4 senior residents, 6 junior residents, 7 technicians and 12 overseas visiting consultants from Baylor College of Medicine, Weill Cornell, the University of Pennsylvania and other leading centres.', cols:3, items:[
        { name:'Dr. Geetanjali Tulapurkar', role:'HOD & Sr. Consultant' },
        { name:'Dr. Anitha Diwakar', role:'Sr. Consultant · Cardiac Anesthesia' },
        { name:'Dr. Kolli S Chalam', role:'Sr. Consultant · Critical Care & Pain' },
        { name:'Dr. Vrushali Choudhary', role:'Additional Sr. Consultant' },
        { name:'Dr. Anuradha Kamath', role:'Consultant · TEE & Paediatric' }
      ] },
      { type:'cards', eyebrow:'Academics', title:'Training in Anesthesiology', cols:3, items:[
        { title:'DNB Anesthesiology', desc:'Broad-specialty post-graduate training accredited by the NBE.', link:{ label:'DNB Programmes', page:'dnb' } },
        { title:'Cardiac Anesthesia Fellowship', desc:'Advanced fellowship in cardiac anesthesia.', link:{ label:'Fellowships', page:'fellowship' } },
        { title:'BSc Anesthesia Technology', desc:'Allied health programme for anesthesia technologists.', link:{ label:'Nursing & Allied Health', page:'nursing-and-allied-health' } }
      ] },
      FREE_BANNER
    ]
  },

  radiology: {
    title:'Radiology', crumb:'Departments · Radiology', icon:ICON.Radiology,
    subtitle:'Expert diagnostic and interventional imaging using state-of-the-art technology — free for all.',
    sections:[
      { type:'intro', eyebrow:'Department', title:'Radiodiagnosis & Imaging',
        body:[
          'The Department of Radiodiagnosis and Imaging at SSSIHMS, Bangalore, provides expert diagnostic and interventional services to support the clinical needs of the hospital, performing a high volume of cases with state-of-the-art imaging equipment.',
          'Services include digital radiography (DR), ultrasound, cathlab imaging, CT, MRI, DSA and image-guided interventional procedures using state-of-the-art technologies — all delivered free of charge.'
        ], pill:'Free Diagnostic Imaging' },
      { type:'features', eyebrow:'Modalities', title:'Imaging Services', alt:true, items:[
        'Digital X-ray & fluoroscopy',
        'Ultrasound & Doppler',
        'CT scan (multi-slice)',
        'MRI',
        'Digital subtraction angiography (DSA)',
        'Image-guided interventional procedures'
      ] },
      { type:'faculty', eyebrow:'Our Team', title:'Faculty',
        sub:'Twelve national and international radiologists — from the USA, UK, Australia, Argentina and India — chair weekly case discussions and lectures via teleconference.', cols:3, items:[
        { name:'Dr. Sanjay Vishwamitra', role:'HOD · Cardiac, MSK & Body Imaging' },
        { name:'Dr. Dimpi Sinha', role:'Additional Sr. Consultant · Cardiac & Neuro Imaging' },
        { name:'Dr. Shivangi Choraria', role:'Jr. Consultant · General Radiology' }
      ] },
      { type:'cards', eyebrow:'Academics', title:'Training & Events', cols:3, items:[
        { title:'Fellowship in Radiology', desc:'Advanced fellowship for experienced radiologists.', link:{ label:'Fellowships', page:'fellowship' } },
        { title:'BSc Medical Imaging Technology', desc:'Allied health programme for imaging technologists.', link:{ label:'Nursing & Allied Health', page:'nursing-and-allied-health' } }
      ] },
      FREE_BANNER
    ]
  },

  sssgh: {
    title:'Sri Sathya Sai General Hospital', crumb:'Departments · General Hospital',
    subtitle:'Comprehensive multi-specialty general hospital services — all entirely free of charge.',
    sections:[
      { type:'cards', eyebrow:'Multi-Specialty Care', title:'General Hospital Departments',
        sub:'A full range of general and specialty services to complement the super-specialty Institute.', cols:4, items:[
          { title:'Ophthalmology', desc:'Comprehensive eye care, examination and surgery.' },
          { title:'Obstetrics & Gynaecology', desc:'Women\'s health, maternity and gynaecological care.' },
          { title:'Orthopaedics', desc:'Bone, joint and trauma care.' },
          { title:'ENT', desc:'Ear, nose and throat services.' },
          { title:'General Medicine', desc:'Diagnosis and management of general medical conditions.' },
          { title:'Paediatrics', desc:'Care for infants, children and adolescents.' },
          { title:'General Surgery', desc:'A broad range of surgical procedures.' },
          { title:'Dental', desc:'Oral health and dental treatment.' }
        ] },
      { type:'stats', eyebrow:'By the Numbers', title:'General Hospital at Scale', items:[
        { v:'51,595', l:'Surgeries Since 1976' },
        { v:'13,859', l:'Obstetrics & Gynaecology' },
        { v:'10,402', l:'Ophthalmology' },
        { v:'8,709', l:'General Surgery' },
        { v:'8,155', l:'ENT' },
        { v:'5,952', l:'Orthopaedics' }
      ] },
      { type:'features', eyebrow:'Diagnostic & Support Services', title:'Enabling Care', alt:true, items:[
        'Radiology & imaging', 'Laboratory & blood bank', 'Physiotherapy',
        'Telemedicine', 'Counselling', 'Pharmacy'
      ] },
      FREE_BANNER
    ]
  },

  services: {
    title:'Clinical Support Services', crumb:'Departments · Services',
    subtitle:'The diagnostic and support departments that enable every free surgery and consultation.',
    sections:[
      { type:'cards', eyebrow:'Support Services', title:'Services That Enable Care', cols:3, items:[
        { icon:'◆', title:'Radiology', desc:'X-ray, ultrasound, CT, MRI, DSA and interventional imaging using state-of-the-art technology.', link:{ label:'Radiology', page:'radiology' } },
        { icon:'◆', title:'Laboratory & Blood Bank', desc:'Pathology, microbiology and biochemistry labs with an in-house blood bank — serving the Institute and the General Hospital with a full LIS, barcoding and quality-assurance programmes.' },
        { icon:'◆', title:'Physiotherapy', desc:'Inpatient electrotherapy, exercise therapy and ICU chest & limb physiotherapy across musculoskeletal, cardiopulmonary and neurological care.' },
        { icon:'◆', title:'Telemedicine', desc:'Established in 2007 as part of the Sri Sathya Sai Tele-health Network — remote consultations, post-operative follow-up and online CMEs.' },
        { icon:'◆', title:'Counselling', desc:'The first hospital in India with a full-fledged spirituality-based patient counselling department — over 40,000 patients counselled since 2001, before surgery, after surgery and at discharge, for patients and care-givers alike.' },
        { icon:'◆', title:'HMIS', desc:'One of the best hospital IT implementations in India — an integrated web-based HIS (Dedalus Enterprise Management), FUJIFILM SYNAPSE PACS shared with Prasanthigram, and an in-house inventory management system supporting a paperless, real-time clinical workflow.' }
      ] },
      { type:'features', eyebrow:'Telemedicine Network', title:'Nodal Centres', alt:true, items:[
        'Barrackpore, West Bengal — Neurosurgery: Thu & Sat · Cardiology: Sat',
        'Bhubaneswar, Odisha — Neurosurgery: Sat · Cardiology: Fri',
        'Appointments for patients with a prior diagnosis and medical records',
        'Post-operative follow-up without travelling to Bangalore',
        'Online CMEs, DNB training and exchange of expertise',
        'Contact: telemedbkp@gmail.com · telemedbbsr@gmail.com'
      ] },
      FREE_BANNER
    ]
  },

  // ─── FOR PATIENTS CLUSTER ───────────────────────────────────────────────────
  patients: {
    title:'For Patients', crumb:'For Patients',
    subtitle:'All care at SSSIHMS is provided completely free of charge — no payment, no insurance, no financial barriers.',
    sections:[
      { type:'cards', eyebrow:'Getting Care', title:'We Are Here for You', center:true,
        sub:'From your first consultation to the most complex surgery, every step is free.', items:[
          { icon:'◆', title:'Conditions & Treatments', desc:'Learn about the conditions we treat across cardiac, neuro and multi-specialty care.', link:{ label:'Treatments', page:'treatment' } },
          { icon:'◆', title:'Appointments & Admission', desc:'Walk-in OPD, advance appointments and the admission process — explained.', link:{ label:'Appointments', page:'appointments-admission' } },
          { icon:'◆', title:'Help Desk / Telemedicine', desc:'Remote guidance and support for patients who cannot easily travel.', link:{ label:'Help Desk', page:'help-desk' } },
          { icon:'◆', title:'Facilities', desc:'Wards, ICUs, theatres, diagnostics and patient amenities.', link:{ label:'Facilities', page:'facilities' } }
        ], cols:2 },
      FREE_BANNER
    ]
  },

  treatment: {
    title:'Conditions & Treatments', crumb:'For Patients · Treatments',
    subtitle:'Advanced tertiary and super-specialty treatment across all major disciplines — entirely free.',
    sections:[
      { type:'cards', eyebrow:'What We Treat', title:'Across Every Specialty', items:[
        { icon:'❤', title:'Cardiac Conditions', desc:'Coronary disease, valvular disease, congenital heart defects, arrhythmias and heart failure.', link:{ label:'Cardiology', page:'cardiology' } },
        { icon:'◆', title:'Neurological Conditions', desc:'Stroke, epilepsy, brain & spinal tumours, cerebrovascular disease and movement disorders.', link:{ label:'Neurology', page:'neurology' } },
        { icon:'✚', title:'Surgical Care', desc:'Cardiac, neuro and multi-specialty surgery — from routine to the most complex.', link:{ label:'Cardiac Surgery', page:'cardiac-surgery' } }
      ] },
      { type:'features', eyebrow:'How Care Works', title:'Your Pathway of Care', alt:true, items:[
        'Registration & consultation at the outpatient department',
        'Diagnostic evaluation — labs, imaging, cardiac & neuro tests',
        'Treatment plan discussed with you and your family',
        'Procedure or surgery, if needed, by specialist teams',
        'Post-operative & intensive care as required',
        'Follow-up and continued support — all free of charge'
      ] },
      FREE_BANNER
    ]
  },

  'appointments-admission': {
    title:'Appointments & Admission', crumb:'For Patients · Appointments',
    subtitle:'Simple, free, and supported at every step — no advance deposit is ever required.',
    sections:[
      { type:'cards', eyebrow:'How to Reach Care', title:'Appointments & Admission', items:[
        { title:'Walk-in OPD', desc:'Patients may walk in to our Outpatient Department during working hours without a prior appointment. Our team will register and guide you at no cost.' },
        { title:'Advance Appointment', desc:'For planned consultations and follow-ups, appointments can be arranged through our registration and help desk. All consultations are free.' },
        { title:'Admission Process', desc:'Patients needing hospitalisation are admitted after assessment by the treating physician. No advance deposit or payment is required at any stage.' },
        { title:'Emergency Care — 24×7', desc:'Our Emergency Department is open 24 hours a day, every day. All emergency and critical-care services are provided free of charge.' },
        { title:'Telemedicine', desc:'Patients who cannot travel can access medical guidance remotely. Contact our help desk for support.' },
        { title:'Getting Here', desc:'SSSIHMS is located in Whitefield, Bengaluru. Public transport, auto-rickshaws and taxis are readily available across the city.' }
      ] },
      { type:'intro', eyebrow:'Need Help?', title:'Our Help Desk Is Here for You', alt:true, narrow:true,
        body:['Our help desk team will answer your questions and guide you through the care process — at no cost.'],
        link:{ label:'Contact the Help Desk', page:'help-desk' } },
      FREE_BANNER
    ]
  },

  'help-desk': {
    title:'Help Desk & Telemedicine', crumb:'For Patients · Help Desk',
    subtitle:'Guidance and medical support — including for patients who cannot easily travel to Bengaluru.',
    sections:[
      { type:'intro', eyebrow:'Remote Care', title:'Telemedicine & Tele-Consultations',
        body:[
          'For patients who are unable to travel, SSSIHMS offers telemedicine and tele-consultation services so that medical guidance and second opinions can be obtained remotely.',
          'Our help desk team supports patients and families in navigating consultations, follow-ups and the admission process — all free of charge.'
        ], link:{ label:'Book an Appointment', page:'appointments-admission' } },
      { type:'intro', eyebrow:'Alumni-Run Remote Seva', title:'The Help Desk Story', alt:true,
        body:[
          'The Help Desk was initiated in May 2020, in response to the Covid pandemic, to make communication easier for patients — using cloud telephony to expand the base of volunteers who could respond to patient queries. In June 2021, an advance gate-entry appointment system was added, staggering patient arrivals between 7 am and 10 am to reduce waiting and crowding.',
          'Today the desk handles around 800 calls a day and creates about 300 gate-entry appointments daily. Some 150 trained volunteers — largely alumni of SSSIHL — participate every week in dedicated time slots, answering in multiple languages. The service runs on Exotel cloud telephony integrated with Health4All, free and open-source software.'
        ] },
      { type:'features', eyebrow:'How We Help', title:'Help Desk Services', items:[
        'Tele-consultation & remote second opinions',
        'Guidance on appointments & admission',
        'Pre-visit information for outstation patients',
        'Coordination with treating departments',
        'Support for families during hospitalisation'
      ] },
      FREE_BANNER
    ]
  },

  facilities: {
    title:'Facilities', crumb:'For Patients · Facilities',
    subtitle:'A complete super-specialty infrastructure, maintained to the highest standards — for every patient, free.',
    sections:[
      { type:'cards', eyebrow:'Infrastructure', title:'Our Facilities', items:[
        { icon:'✦', title:'12 Modular Operation Theatres', desc:'8 + 4 modular theatres equipped for cardiac, neuro and multi-specialty surgery.' },
        { icon:'✦', title:'6 Intensive Care Units', desc:'Dedicated cardiac, neuro and general intensive care, staffed round the clock.' },
        { icon:'✦', title:'3 Catheterisation Labs', desc:'Two cardiac cath labs and one bi-plane neuro cath lab.' },
        { icon:'✦', title:'Advanced Imaging', desc:'CT, MRI, DSA, ultrasound and digital X-ray in a dedicated radiology suite.' },
        { icon:'✦', title:'Emergency Department', desc:'24×7 casualty and emergency services for all patients.' },
        { icon:'✦', title:'Laboratory & Blood Bank', desc:'Full diagnostic laboratory and blood bank support.' }
      ] },
      FREE_BANNER
    ]
  },

  // ─── ACADEMICS CLUSTER ──────────────────────────────────────────────────────
  academics: {
    title:'Education & Training', crumb:'Academics',
    subtitle:'Building compassionate healers rooted in the spirit of selfless service — with no tuition fees.',
    sections:[
      { type:'cards', eyebrow:'Programmes', title:'Learn & Train at SSSIHMS', items:[
        { icon:'◆', title:'DNB Postgraduate Programmes', desc:'Accredited by the National Board of Examinations, New Delhi, in cardiac surgery, cardiology, neurosurgery and anesthesiology.', link:{ label:'DNB Programmes', page:'dnb' } },
        { icon:'◆', title:'Fellowship Courses', desc:'Fellowships in interventional cardiology, paediatric cardiac surgery, cardiac anesthesia and radiology.', link:{ label:'Fellowships', page:'fellowship' } },
        { icon:'◆', title:'Nursing & Allied Health', desc:'B.Sc Nursing (admissions open) and allied health programmes in cardiac, perfusion, anesthesia, imaging and lab technology.', link:{ label:'Nursing & Allied Health', page:'nursing-and-allied-health' } },
        { icon:'◆', title:'Research & Publications', desc:'Faculty actively participate in research and clinical studies, publishing in reputed national and international journals.' },
        { icon:'◆', title:'Conferences & CME', desc:'Regular CMEs, workshops and conferences — including SACRED CME in Radiology and events across departments.' },
        { icon:'◆', title:'A Spirit of Service', desc:'Education here is rooted in the conviction that the highest learning is in the service of others.' }
      ] },
      NURSING_CTA
    ]
  },

  dnb: {
    title:'DNB Postgraduate Programmes', crumb:'Academics · DNB', icon:ICON.DNB,
    subtitle:'Post-graduate medical training accredited by the National Board of Examinations, New Delhi.',
    sections:[
      { type:'intro', eyebrow:'DNB at SSSIHMS', title:'Super & Broad Specialty Training',
        body:[
          'Sri Sathya Sai Institute of Higher Medical Sciences, Bangalore, is accredited by the National Board of Examinations, New Delhi, to conduct post-graduate training in super specialties such as Cardiothoracic & Vascular Surgery, Cardiology and Neurosurgery, and the broad specialty of Anesthesiology — culminating in a DNB degree.',
          'The Institute has been a recognised NBE training centre since 2002, with departments such as Cardiology serving as DNB examination centres and recording a 100% pass percentage.',
          'Trainees learn within a high-volume, completely free super-specialty hospital — gaining exceptional clinical exposure alongside daily academic presentations, mentorship from visiting faculty in India and abroad, and a culture of compassionate care.'
        ] },
      { type:'cards', eyebrow:'Disciplines', title:'DNB Programmes Offered', items:[
        { title:'DNB Cardiothoracic & Vascular Surgery', desc:'Super-specialty surgical training. Eligibility: MBBS + DNB CET · 1 seat · 6 years.' },
        { title:'DNB Cardiology', desc:'Super-specialty training in cardiology and interventions. Eligibility: MD/DNB (General Medicine or Paediatrics) + Super Specialty CET · 2 seats · 3 years.' },
        { title:'DNB Neurosurgery', desc:'Super-specialty training in the neurosciences. Eligibility: MBBS + DNB CET · 1 seat · 6 years.' },
        { title:'DNB Anesthesiology', desc:'Broad-specialty training in anesthesia and critical care. MBBS + DNB CET · 2 seats · 3 years (post-Diploma route: 2 seats · 2 years).' }
      ], alt:true, cols:3 },
      { type:'intro', eyebrow:'Admission', title:'How to Apply', narrow:true,
        body:[
          'Admission to all specialties is only through the centralised counselling of the National Board of Examinations (NBE) — candidates should follow the NBE website for updates. The DNB degree is equivalent to MCh/DM for super specialties and MD for broad specialties.',
          'In keeping with the Founder\u2019s philosophy that education should be given free of cost, all programmes are offered to eligible doctors entirely free. Three SSSIHMS trainees have secured Gold Medals in the DNB Cardiology and CTVS programmes.'
        ] }
    ]
  },

  fellowship: {
    title:'Fellowship Courses', crumb:'Academics · Fellowship', icon:ICON.DNB,
    subtitle:'Advanced sub-specialty training for experienced medical professionals.',
    sections:[
      { type:'cards', eyebrow:'Fellowships', title:'Advanced Specialisation', items:[
        { title:'Interventional Cardiology', desc:'For post-DM/DNB cardiologists · 12 months under the aegis of RGUHS · stipend ₹1,00,000/month. High-level training in patient selection and interventional procedures.' },
        { title:'Cardio-Thoracic & Vascular Anaesthesia', desc:'For MD/DNB anesthesiologists · 18 months under RGUHS · stipend ₹85,000/month. Covers 4 theatres, 2 cath labs, 2 ICUs and a CCU — about 1,500 cases a year, a third of them paediatric.' },
        { title:'Paediatric Cardiac Surgery', desc:'Sub-specialty training in surgery for congenital heart disease.' },
        { title:'Radiology', desc:'Advanced fellowship in diagnostic and interventional radiology.' }
      ] },
      { type:'intro', eyebrow:'Who Should Apply', title:'For Experienced Professionals', alt:true, narrow:true,
        body:[
          'SSSIHMS fellowships are designed for qualified doctors seeking advanced sub-specialty experience within a high-volume, free super-specialty hospital. No fees are charged by the Institute — only the applicable RGUHS university fees are borne by the trainee.',
          'For details and application windows: 080-28004640/41 · academicblr@sssihms.org.in'
        ] }
    ]
  },

  'nursing-and-allied-health': {
    title:'College of Nursing & Allied Health', crumb:'Academics · Nursing', icon:ICON.Nursing,
    subtitle:'B.Sc Nursing and allied health sciences programmes — affiliated to RGUHS, with no tuition fees.',
    sections:[
      { type:'quote', eyebrow:'Divine Message',
        text:'Swami willed that there should be a sufficient number of trained nursing personnel and therefore training facilities for nursing personnel will be established. It is easy for doctors to perform operations. The real difficulty is in taking care of the patients after the operations. It is easy to slice vegetables. But, to prepare a tasty dish out of that is very difficult. This task of \u201ccooking\u201d is done by the nurses. If there is no good nursing, even the operation may be a failure. Therefore in order to train a good group of nursing personnel, training facilities are being provided. All those who are pure-hearted and filled with a spirit of service, may approach the Director for undergoing training to serve in the hospital. They need not incur any expense. The entire training is free. Elsewhere, if people want to undergo such training, they have to pay all kinds of fees. Here nothing will be charged. Everything will be provided free. Only, we want persons with pure hearts to join the course. Today we have quite a large number of people working in our hospital. But, there is more work to be done because of the ever-growing number of patients seeking relief. Hence, we need many more nursing personnel. We are asking for nurses not for Swami\u2019s sake but for the sake of the nation.',
        attr:'Bhagawan Sri Sathya Sai Baba, Poornachandra Auditorium, Guru Pournima message, 14 July 1992' },
      { type:'quote', image:'assets/baba/baba-09.jpg', eyebrow:'The Founding Vision',
        text:'We are asking for nurses not for Swami\u2019s sake but for the sake of the nation. Hands that help are holier than lips that pray.',
        attr:'Bhagawan Sri Sathya Sai Baba, Guru Pournima Discourse' },
      { type:'intro', eyebrow:'College of Nursing', title:'Born of Bhagawan\u2019s Call',
        body:[
          '\u201cHands that Help are Holier than Lips that pray.\u201d If you have compassion, a caring and loving nature, patience, the ability to listen to others and empathy for those who suffer, then welcome to the world of Nursing. The outcome of a successful procedure or operation depends upon the quality of care given by the nurses, and there is a huge requirement of skilled manpower in this field.',
          'An acute shortage of skilled nurses and a high rate of attrition in this cadre affects the quality of care in healthcare institutions. The commercialisation of nursing education and a lack of adequate training facilities have only led to inept manpower seeking commercial gain over professional competence. As a model for ideal nursing education, Bhagawan Sri Sathya Sai Baba instituted the SSSIHMS College of Nursing on 1st September 2008 \u2014 the one and only College providing graduate nursing education of this standard to deserving and eligible candidates completely free of cost.',
          'The College of Nursing traces its origin to Bhagawan Sri Sathya Sai Baba\u2019s Guru Pournima call for pure-hearted young women filled with the spirit of service to train as nurses — not as a career alone, but as a sacred offering to the nation. The College was established on 1st September 2008 in that spirit, and a new College Block was inaugurated on 19th January 2024.',
          'Education here is Value-Based Integrated Education: alongside the RGUHS academic curriculum, students imbibe Education in Human Values (EHV), growing into humane healthcare professionals who see nursing as worship. The entire training is free — no tuition fees are charged.'
        ], pill:'No Tuition Fees' },
      { type:'intro', eyebrow:'Admissions', title:'B.Sc Nursing — 2026–27', alt:true,
        body:[
          'The College is affiliated to the Rajiv Gandhi University of Health Sciences, Bangalore, for its 4-year B.Sc Nursing programme with a permitted intake of 40 seats. The programme is exclusively for women and fully residential — candidates bear only boarding & lodging charges and RGUHS-mandated fees.',
          'Applications for 2026–27 closed on 20th June 2026; call letters will be issued after 25th June 2026. KCET is mandatory for all candidates, including those from other states. Eligibility: minimum 17 years of age by 31st December of the application year, and 10+2/PUC with Physics, Chemistry, Biology and English at a minimum aggregate of 45%. Academic enquiries: 080-28004763 / 080-28004641.'
        ], link:{ label:'Apply Online', href:'https://tinyurl.com/sssihmsnc' } },
      { type:'features', eyebrow:'Campus Life', title:'Hostel & Facilities', items:[
        'Fully residential hostel exclusively for women',
        'Nursing laboratories built to INC standards',
        'Computer labs & digital learning resources',
        'Sai Veda Venkatarama Health & Fitness Center',
        'Wholesome vegetarian dining (mess) on campus',
        'Clinical training within SSSIHMS & SSSGH'
      ] },
      { type:'cards', eyebrow:'Allied Health Sciences', title:'BSc Allied Health Programmes',
        sub:'Note: AHS admissions are temporarily paused for the 2026–27 academic year.', alt:true, items:[
          { title:'Cardiac Care Technology', badge:'Paused 26–27', desc:'Training cardiac care technologists for cath labs and cardiac units.' },
          { title:'Perfusion Technology', badge:'Paused 26–27', desc:'Training perfusionists for cardiac surgery.' },
          { title:'Anesthesia Technology', badge:'Paused 26–27', desc:'Training anesthesia technologists for theatres and ICUs.' },
          { title:'Medical Imaging Technology', badge:'Paused 26–27', desc:'Training imaging technologists for radiology.' },
          { title:'Medical Lab Technology', badge:'Paused 26–27', desc:'Training laboratory technologists for diagnostics.' },
          { title:'MSc Echocardiography', desc:'Advanced training in echocardiography.' }
        ], cols:3 },
      NURSING_CTA
    ]
  },

  // ─── GET INVOLVED CLUSTER ───────────────────────────────────────────────────
  getinvolved: {
    title:'Get Involved', crumb:'Get Involved',
    subtitle:'Join the mission of love and service — and help transform lives through compassionate care.',
    sections:[
      { type:'cards', eyebrow:'Ways to Serve', title:'Be Part of the Mission', cols:4, items:[
        { icon:'◈', title:'Sevadal — Volunteer', desc:'Every week, 108 Sevadal volunteers from across Karnataka serve patients with love — serving food, guiding, translating and comforting.', link:{ label:'About Sevadal', page:'sevadal' } },
        { icon:'◈', title:'Donations', desc:'Interested people may donate to the Sri Sathya Sai Central Trust towards its Medical Care activities, which sustain free healthcare for all.', link:{ label:'Donate', href:'https://www.srisathyasai.org/pages/sai-get-involved.html' } },
        { icon:'◈', title:'Help Desk — Remote Seva', desc:'A group of more than 100 volunteers, largely SSSIHL alumni, answer patient calls in multiple languages — around 800 calls a day.', link:{ label:'About the Help Desk', page:'help-desk' } },
        { icon:'◈', title:'Volunteer Your Expertise', desc:'Doctors with expertise in specialties available at SSSIHMS and SSSGH may offer their skills, short or long term.', link:{ label:'Volunteer Expertise', page:'volunteer' } }
      ] },
      { type:'intro', eyebrow:'Together in Service', title:'Every Act of Service Matters', alt:true, narrow:true,
        body:['SSSIHMS has touched millions of lives because countless hearts chose to serve. Join them in this sacred mission.'],
        link:{ label:'Donate to the Mission', href:'https://www.srisathyasai.org/pages/sai-get-involved.html' } }
    ]
  },

  sevadal: {
    title:'Sevadal — Volunteer Service', crumb:'Get Involved · Sevadal',
    subtitle:'The volunteers who form the beating heart of SSSIHMS.',
    sections:[
      { type:'quote', image:'assets/baba/baba-10.jpg', eyebrow:'What Is Seva?',
        text:'Every seva done with sympathy and skill to anyone in distress anywhere in this world is Sathya Sai seva.',
        attr:'Bhagawan Sri Sathya Sai Baba, 29th March 1968' },
      { type:'intro', eyebrow:'The Heart of the Hospital', title:'108 Volunteers, Every Week',
        body:[
          'Every week, a set of 108 Sevadal volunteers — women and men from various districts of Karnataka and Bengaluru — come to the hospital on a roster to serve patients without any expectation of return. Around 15 Sevadal serve on a permanent basis and stay on campus.',
          'They find fulfilment in the time they spend at the hospital, seeing Bhagawan in every patient. Over the years, people from all walks of life — IAS officers, retired military personnel, bankers and homemakers alike — have served here and found happiness in it.'
        ] },
      { type:'features', eyebrow:'Where Sevadal Serve', title:'Acts of Service', alt:true, items:[
        'Serving food to patients and families',
        'Guiding patients through their treatment process',
        'Escorting patients to investigations',
        'Translation for patients from across India',
        'Comforting patients through anxiety',
        'Welcoming & wayfinding at the gates and OPD'
      ] }
    ]
  },

  volunteer: {
    title:'Volunteer Your Expertise', crumb:'Get Involved · Volunteer Expertise',
    subtitle:'For medical professionals and specialists who wish to serve.',
    sections:[
      { type:'intro', eyebrow:'Professional Volunteering', title:'Offer Your Skills in Service',
        body:[
          'Doctors with expertise in the specialties available at Sri Sathya Sai Institute of Higher Medical Sciences and Sri Sathya Sai General Hospital, Whitefield, are welcome to volunteer their services on a short-term or long-term basis.',
          'To express interest, please contact the Human Resources Department by email at hrblr@sssihms.org.in, or reach us through the help desk so your skills can be matched to where they are most needed.'
        ], link:{ label:'Express Your Interest', page:'help-desk' } },
      { type:'intro', eyebrow:'Together in Service', title:'A Place for Every Skill', alt:true, narrow:true,
        body:['Doctors, nurses, technologists and administrators have all found a way to serve here. Whatever your expertise, there is a way to give it in love.'] }
    ]
  },

  // ─── BHAGAWAN ───────────────────────────────────────────────────────────────
  bhagawan: {
    title:'Bhagawan Sri Sathya Sai Baba', crumb:'Bhagawan',
    subtitle:'The divine inspiration behind SSSIHMS and its mission of selfless, free service to all of humanity.',
    sections:[
      { type:'intro', eyebrow:'Life & Mission', title:'A Life of Divinity and Service', image:SWAMI,
        body:[
          'Bhagawan Sri Sathya Sai Baba (23 November 1926 – 24 April 2011) was Avatar, spiritual teacher, educator who put love and service to man above any other spiritual endeavour.',
          'He founded numerous educational and medical institutions across India — all free of charge — reflecting His core teaching that service to humanity is service to God.',
          'Among His greatest gifts is the network of Sri Sathya Sai Hospitals — including SSSIHMS Whitefield — where the finest medical care is given freely to all who come, embodying His vision that the poor and the privileged deserve equal care, given with equal love.'
        ], link:{ label:'Read Life History', href:'https://www.srisathyasai.org/pages/sai-life-history-history.html' } },
      { type:'quote', image:'assets/baba/baba-11.jpg', eyebrow:'His Words',
        text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. As man is the embodiment of God, it is his primary duty to help the destitute and the forlorn. Medicine should not be commercialised.',
        attr:'Bhagawan Sri Sathya Sai Baba, 2003' },
      { type:'cards', eyebrow:'Explore', title:'Life, Teachings & Projects', alt:true, items:[
        { title:'Life History', desc:'The full biography and milestones of Bhagawan Sri Sathya Sai Baba.', link:{ label:'Read', href:'https://www.srisathyasai.org/pages/sai-life-history-history.html' } },
        { title:'Discourses & Writings', desc:'His teachings, messages and discourses.', link:{ label:'Explore', href:'https://www.srisathyasai.org/pages/sai-his-messages-speaks.html' } },
        { title:'Sai Projects', desc:'The institutions and service projects established in His name.', link:{ label:'Visit', href:'https://www.srisathyasai.org/pages/sai-projects.html' } }
      ] }
    ]
  },

  // ─── ADDITIONAL SITE PAGES ──────────────────────────────────────────────────
  gogreen: {
    title:'Go Green', crumb:'Go Green',
    subtitle:'Caring for the body and for the earth — sustainability initiatives across the SSSIHMS campus.',
    sections:[
      { type:'intro', eyebrow:'Sustainability', title:'Healing in Harmony with Nature',
        body:[
          'In keeping with Bhagawan Sri Sathya Sai Baba\'s teaching of reverence for nature, SSSIHMS pursues a range of green initiatives across its campus — conserving water and energy, expanding green cover and managing waste responsibly.',
          'These efforts ensure that the work of healing people goes hand in hand with care for the environment.'
        ], narrow:true },
      { type:'cards', eyebrow:'Initiatives', title:'Our Green Programmes', alt:true, items:[
        { icon:'◆', title:'Rain Water Harvesting', desc:'Several rainwater harvesting initiatives capture and recharge groundwater across the campus.' },
        { icon:'◆', title:'Solar Power Plant', desc:'The first hospital in the country to install its own 100 KVA solar power plant — with a further 180 KVA planned.' },
        { icon:'◆', title:'Trees on Campus', desc:'108 trees transplanted into the campus during the Bangalore Metro works in front of the hospital.' },
        { icon:'◆', title:'Power Conservation', desc:'Air-conditioning optimisation and LED lighting across the hospital reduce power consumption.' },
        { icon:'◆', title:'Water Use Maximization', desc:'One of the first hospitals in Bangalore with its own water treatment plant — water is recycled through sullage and sewage treatment for flushing, then again for the gardens.' },
        { icon:'◆', title:'Waste Management', desc:'All hospital waste is segregated and responsibly recycled or disposed — turning waste into wealth.' },
        { icon:'◆', title:'Biomedical Waste', desc:'Safe, compliant management and reporting of biomedical waste.' }
      ] }
    ]
  },

  careers: {
    title:'Career Opportunities', crumb:'Opportunities · Careers',
    subtitle:'Serve with purpose — join a team dedicated to free, compassionate, world-class care.',
    sections:[
      { type:'intro', eyebrow:'Join Us', title:'Work That Is Worship',
        body:[
          'A career at SSSIHMS is an opportunity to practise medicine and service at the highest level, within an institution where care is given freely and with love.',
          'We welcome doctors, nurses, technologists, administrators and support staff who wish to contribute their skills to a mission larger than themselves.'
        ], link:{ label:'Contact the Help Desk to Apply', page:'help-desk' } },
      { type:'features', eyebrow:'Who We Seek', title:'A Calling, Not Just a Job', alt:true, items:[
        'Clinical excellence and a commitment to ethical practice',
        'Compassion and respect for every patient',
        'A spirit of selfless service',
        'Teamwork across departments',
        'Dedication to continuous learning',
        'Integrity in all things'
      ] }
    ]
  },

  manohriday: {
    title:'Manohriday Newsletter', crumb:'About Hospital · Newsletter',
    subtitle:'The journal of SSSIHMS — stories, updates and highlights from the heart of the Institute.',
    sections:[
      { type:'intro', eyebrow:'Newsletter', title:'News From the Hospital',
        body:[
          'Manohriday is the journal of SSSIHMS, sharing hospital updates, patient stories, departmental highlights and milestones from across the Institute.',
          'Each edition captures the spirit of service that animates the hospital, told through the voices of patients, doctors, nurses and volunteers.'
        ] },
      { type:'cards', eyebrow:'Editions', title:'Read Manohriday', cols:3, alt:true, items:[
        { badge:'Latest', title:'Silver Jubilee Commemorative Edition', desc:'The special commemorative issue marking 25 years of the Institute, January 2026.', link:{ label:'Read (PDF)', href:'/wp-content/uploads/sites/4/2026/01/2026-01-19-Manohriday-Commemorative-Edition.pdf' } },
        { title:'Manohriday — January 2024', desc:'Hospital updates, patient stories and departmental highlights.', link:{ label:'Read (PDF)', href:'/wp-content/uploads/sites/4/2024/01/manohriday_Jan24_lowres_240121_202602.pdf' } },
        { title:'Manohriday — 2023', desc:'The 2023 edition of the journal.', link:{ label:'Open', href:'/manohriday-2023/' } },
        { title:'Manohriday — January 2020', desc:'An earlier edition of the journal.', link:{ label:'Read (PDF)', href:'/wp-content/uploads/sites/4/2020/01/manohriday_Jan2020-1.pdf' } },
        { title:'Archive on Issuu', desc:'Older quarterly editions of Manohriday, 2012–2016.', link:{ label:'Browse Archive', href:'https://issuu.com/sssihms' } }
      ] }
    ]
  },

  trust: {
    "title": "Sri Sathya Sai Central Trust",
    "crumb": "About · Trust",
    "subtitle": "Humanitarian Activities — Overview & Legal Standing",
    "sections": [
      {
        "type": "intro",
        "eyebrow": "About the Trust",
        "title": "Humanitarian Activities — Overview &amp; Legal Standing",
        "body": [
          "The Sri Sathya Sai Central Trust (\"SSSCT\" or \"the Trust\") is an irrevocable public charitable trust established on 2 September 1972 by Bhagawan Sri Sathya Sai Baba, registered at Prasanthi Nilayam, Sri Sathya Sai District, Andhra Pradesh, India, with a second seat of operations at Whitefield, Bengaluru, Karnataka.",
          "Guided by the motto \"Love All, Serve All,\" the Trust administers hospitals, schools, a university, water and social-relief programmes across India, all provided entirely free of charge and without distinction of caste, creed, religion, nationality, or economic status.",
          "This document consolidates the Trust's legal basis, activities, and financial scale from its founding Trust Deed and its three most recent published Annual Reports (FY2021-22, FY2023-24, FY2024-25)."
        ],
        "link": {
          "label": "Visit the Trust",
          "href": "https://srisathyasai.org.in"
        }
      },
      {
        "type": "prose",
        "alt": true,
        "eyebrow": "1. Legal Basis and Governance",
        "title": "1.1 Constitution",
        "narrow": false,
        "body": [
          "<ul><li>Constituted by Trust Deed dated 2 September 1972, amended by Deed of Amendment dated 11 March 1994; the Trust is declared irrevocable (Trust Deed, cl. 2).</li><li>Registered offices at Prasanthi Nilayam, Andhra Pradesh, and at Brindavan, Whitefield, Bengaluru, Karnataka (Trust Deed, cl. 2A).</li><li>Objects of the Trust (Trust Deed, cl. 4), stated to align with \"Relief to the Poor, Medical Relief, Education and any other objects of general public utility as defined in section 2(15) of the Indian Income Tax Act, 1961\":<ul><li><strong>Education</strong> — establishing and running schools, colleges, polytechnics, research centres and hostels; scholarships and studentships; free of tuition.</li><li><strong>Medical Relief</strong> — establishing and running hospitals, clinics, dispensaries, medical research centres, blood/drug banks, and free rural medical camps.</li><li><strong>Relief to the Poor</strong> — food, clothing, shelter, cash grants, disaster relief (earthquakes, floods, famines, epidemics), and support for orphanages and rehabilitation centres.</li><li><strong>Other Objects of General Public Utility</strong> — public halls, libraries, cultural and vocational upliftment programmes, and promotion of national integrity and secular solidarity.</li></ul></li><li>The Trust Deed explicitly provides that \"all the activities... will be carried on in India without a profit motive and the benefits thereof will be available to the public at large without any distinction of community, caste or creed\" (cl. 4, N.B.), and that trust property may never be distributed among the trustees, even on dissolution (cl. 15–16).</li><li>Governance: a Board of Trustees (not exceeding 9, per cl. 5) manages the Trust; Books of account are closed each 31 March and audited annually by a Chartered Accountant (cl. 8).</li></ul>"
        ]
      },
      {
        "type": "prose",
        "title": "1.2 Current Board of Trustees",
        "sub": "per FY2024-25 Annual Report",
        "narrow": false,
        "body": [
          "<ul><li><strong>Sri R.J. Rathnakar</strong> — Managing Trustee (MBA, Sri Sathya Sai Institute of Higher Learning)</li><li><strong>Sri K. Chakravarthi, IAS (Retd.)</strong> — Chancellor, SSSIHL; former Registrar; former Finance Secretary (Projects), Govt. of Andhra Pradesh</li><li><strong>Dr. V. Mohan</strong> — Chairman &amp; Chief of Diabetology, Dr. Mohan's Diabetes Specialities Centre; Padma Shri (2012)</li><li><strong>Sri Ryuko Hira</strong> — President, HMI Group of Hotels and Resorts; Chairman, Indian Commerce &amp; Industry Association, Japan</li><li><strong>Sri S.S. Naganand</strong> — Chartered Accountant; Senior Advocate, High Court of Karnataka &amp; Supreme Court of India</li><li><strong>Sri Manohar Shetty</strong> — Hospitality/infrastructure businessman</li><li><strong>Dr. Vijay L. Kelkar</strong> — Chairman, India Development Foundation; former Chairman/Secretary, Finance Commission of India; Padma Vibhushan</li><li><strong>Sri I.S.N. Prasad, IAS (Retd.)</strong> — former Additional Chief Secretary (Finance) &amp; Principal Secretary (IT &amp; BT), Govt. of Karnataka</li><li><strong>Justice V. Ramasubramanian (Retd.)</strong> — former Judge, Supreme Court of India; Chairperson, National Human Rights Commission; former Chief Justice, Himachal Pradesh High Court</li></ul>"
        ]
      },
      {
        "type": "prose",
        "alt": true,
        "title": "1.3 Statutory Compliance",
        "narrow": false,
        "body": [
          "<ul><li>Books of account audited annually; auditor of record: Sivanandam &amp; Co., Chartered Accountants, Chennai (Firm Registration No. 007657S) — unqualified \"true and fair view\" opinion for FY2021-22, FY2023-24 and FY2024-25.</li><li>Annual income-tax returns filed every year; the Trust responds to Income Tax Department queries as raised.</li><li>Foreign Contribution (Regulation) Act reports submitted regularly to the Ministry of Home Affairs, Government of India.</li><li>Annual financial statements, together with details of asset additions/deletions, filed with the Assistant Commissioner of Endowments, Anantapur, under section 43(10) of the Andhra Pradesh Charitable &amp; Hindu Religious Institutions and Endowments Act, 1987.</li><li>All contributions to the Trust are voluntary donations from individuals; the Trust does not report institutional or government grant funding as a income source (Annual Reports FY2021-22 – FY2024-25).</li></ul>"
        ]
      },
      {
        "type": "prose",
        "eyebrow": "2. Healthcare",
        "title": "Free Medical Care for All",
        "narrow": false,
        "body": [
          "The Sri Sathya Sai Healthcare System comprises two General Hospitals, two Institutes of Higher Medical Sciences (super-speciality), one Mobile Hospital, two Telehealth Centres, and one Nursing College — all services free of charge to every patient, regardless of ability to pay.",
          "<ul><li>Approximately 66% of patients treated at the two super-speciality hospitals belong to families with annual income below ₹30,000.</li></ul>"
        ]
      },
      {
        "type": "quote",
        "image": "assets/baba/baba-12.jpg",
        "text": "Disease has no distinction; it may afflict anybody, be it a pauper or a millionaire... the treatment will be rendered totally free of cost to the rich and poor alike... This Institution will serve the poor forever.",
        "author": "Bhagawan Sri Sathya Sai Baba"
      },
      {
        "type": "table",
        "alt": true,
        "eyebrow": "2.1",
        "title": "Institutes of Higher Medical Sciences",
        "sub": "Prasanthigram & Whitefield, combined",
        "cols": [
          "Metric",
          "FY2021-22",
          "FY2023-24",
          "FY2024-25",
          "Since Inception"
        ],
        "rows": [
          [
            "OPD visits",
            "2,13,725",
            "2,15,154",
            "2,29,641",
            "78,63,167"
          ],
          [
            "Surgeries / procedures",
            "9,647",
            "16,573",
            "16,383",
            "5,42,344"
          ],
          [
            "Diagnostic tests",
            "9,02,264",
            "23,62,844",
            "23,85,356",
            "5,46,92,747"
          ],
          [
            "Patient savings at CGHS rates",
            "₹188.5 Cr",
            "₹168.5 Cr",
            "₹152.8 Cr",
            "₹3,753 Cr"
          ]
        ]
      },
      {
        "type": "prose",
        "narrow": false,
        "body": [
          "<ul><li><strong>SSSIHMS Whitefield</strong> (333-bed, Cardiac Sciences &amp; Neurosciences): since-inception cumulative of ~18.7 lakh outpatients and 1,44,488 surgeries/procedures (FY2024-25 report); electrophysiology and cath-lab capability upgraded with ICE-guided 3D mapping ablation, among the few centres in India offering it.</li><li>SSSIHMS-hosted ATHMA Hospital Information System rolled out across both super-speciality campuses (Prasanthigram, Sep 2024; Whitefield, Jan 2025), unifying the Medical Record Number and running on Microsoft Azure Cloud (see Section 6).</li></ul>"
        ]
      },
      {
        "type": "prose",
        "alt": true,
        "title": "2.2 General Hospitals and Mobile Hospital",
        "narrow": false,
        "body": [
          "<ul><li><strong>Sri Sathya Sai General Hospital, Prasanthi Nilayam</strong> (est. 1956, the Trust's first medical institution) — daily OPD of 800–1,000 patients across a five-mandal catchment; NBE-recognised DNB Family Medicine training programme.</li><li><strong>Sri Sathya Sai General Hospital, Whitefield</strong> (est. 1976; 80-bed) — FY2024-25: 1,37,058 OP consultations and 3,562 surgeries/procedures.</li><li><strong>Sri Sathya Sai Mobile Hospital, Prasanthi Nilayam</strong> (est. 2006) — rural outreach to 350 villages (~6 lakh population) around Puttaparthi via ~300 rotating volunteer doctors across 15 specialties; FY2024-25: 59,788 patients, 520 surgeries, 35,810 investigations across 53 mandals.</li><li>Support extended to <strong>Mahabodhi Karuna Charitable Hospital, Leh, Ladakh</strong> — ₹75.82 lakh committed in FY2023-24 to re-equip a 40-bed facility, with a further ₹2 crore Phase-2 commitment approved February 2024; hospital re-launched 26 May 2024.</li><li><strong>COVID-19 response (FY2021-22)</strong> — a dedicated 125-bed COVID facility at Puttaparthi and COVID wards at SSSIHMS Whitefield (80 oxygen beds + 10 ICU beds, treating ~250 patients in the second wave); two on-site oxygen generation plants (500 L/min at Prasanthigram, cost ₹90 lakh; 200 L/min at Whitefield) covering ~90% of surgical/ICU oxygen needs.</li></ul>"
        ]
      },
      {
        "type": "prose",
        "eyebrow": "3. Education",
        "title": "Value-Based, Fee-Free Learning",
        "narrow": false,
        "body": [
          "All education across the Trust's institutions is provided entirely free of tuition and fees, on merit-based, open admission irrespective of income, caste, or religion."
        ]
      },
      {
        "type": "table",
        "cols": [
          "Metric",
          "FY2021-22",
          "FY2023-24",
          "FY2024-25"
        ],
        "rows": [
          [
            "Total students (schools + university)",
            "3,964",
            "4,678",
            "4,914"
          ],
          [
            "Academic staff",
            "346",
            "328",
            "322"
          ],
          [
            "Academic staff : student ratio",
            "1:11",
            "1:14",
            "1:15"
          ],
          [
            "Avg. cost per school student / year",
            "₹19,000–35,000",
            "₹23,600",
            "₹30,300"
          ],
          [
            "Avg. cost per university student / year",
            "—",
            "₹2,53,000",
            "₹2,51,000"
          ]
        ]
      },
      {
        "type": "prose",
        "alt": true,
        "narrow": false,
        "body": [
          "<ul><li><strong>Sri Sathya Sai Institute of Higher Learning (SSSIHL)</strong> — deemed-to-be university with four campuses (Prasanthi Nilayam, Anantapur, Muddenahalli, Brindavan/Whitefield), offering undergraduate through post-doctoral research, entirely free. FY2024-25's 43rd Convocation conferred 463 degrees, 22 Gold Medals and 14 PhDs; the university holds Casualty Actuarial Society (CAS) Gold-Level recognition — the only Asian institution so recognised.</li><li><strong>Sri Sathya Sai Higher Secondary School, Smt. Eswaramma High School (Puttaparthi), Sri Sathya Sai Gurukulam English Medium School (Rajahmundry) and Sri Sathya Sai Primary School (New Delhi)</strong> — consistently near-100% Board pass rates with high distinction rates each year.</li><li><strong>Sri Sathya Sai Vidya Vahini</strong> — a 14-year-old national EdTech programme delivering the Trust's values-based \"Educare\" curriculum; by FY2023-24 its content reached 64 Sai schools, 529 government schools under NITI Aayog, and 100 Adi Dravidar Welfare schools in Tamil Nadu, supported by teacher-training programmes (e.g., SOPAAN, aligned to NEP 2020/NIPUN Bharat, active in 11 states and 500+ schools).</li><li><strong>Mid-Day Meal (Ragi Malt) programme</strong>, in partnership with the Government of Andhra Pradesh — free finger-millet nutrition supplement distributed three days a week; FY2024-25 reached approximately 32.5 lakh students across ~44,000 schools statewide.</li></ul>"
        ]
      },
      {
        "type": "prose",
        "eyebrow": "4. Water Supply",
        "title": "Safe Drinking Water to Millions",
        "narrow": false,
        "body": [
          "<ul><li>Major pipeline projects delivered in Anantapur; Medak &amp; Mahabubnagar; Chennai; and East &amp; West Godavari districts.</li><li>Combined coverage: 1,621 villages plus the city of Chennai, serving about 31.9 lakh (3.19 million) people besides Chennai city.</li><li>Infrastructure: ~4,296 km of pipeline laid at a total project cost of ~₹683 crore, handed over to state governments/communities on completion.</li><li>Smaller current-generation water initiatives continue under the Trust's Sociocare programme — e.g., 16 drinking-water plants approved in FY2021-22 for Nuapada and Jagatsinghpur districts, Odisha.</li></ul>"
        ]
      },
      {
        "type": "prose",
        "alt": true,
        "eyebrow": "5. Social Service, Relief & Sustainability",
        "title": "5.1 Disaster and Community Relief",
        "narrow": false,
        "body": [
          "<ul><li><strong>Kerala floods (2018)</strong> — renovation of eight flood-affected nursery schools (Cherthala, Chettikulangara, Thamarakulam, Chengannur, Mannar, Punnapra, Kandalloor, Mararikulam), ~₹1.5 crore; nine rural childcare centres (Anganwadis) subsequently inaugurated in flood-hit Alappuzha district, February 2024.</li><li><strong>Puttaparthi flash floods (November 2021)</strong> — River Chitravati/Bukkapatnam overflow; the Trust distributed prepared food (with Sri Sathya Sai Seva Organisation India) and blankets to affected residents and schoolchildren.</li><li>COVID-19 relief camps and welfare kits distributed to marginalised communities in rural Anantapur district during FY2021-22 lockdowns.</li><li>Support for a Physiotherapy Centre for children with special needs, Villupuram, Tamil Nadu, and a Skill Development Centre for women at a college in Bhubaneswar, Odisha.</li><li>Overseas humanitarian relief historically extended to Sri Lanka, Indonesia, Venezuela and Kenya (per Trust's published cumulative activity).</li><li>Housing rehabilitation: ~1,000 houses built for the needy, including an Odisha housing initiative.</li><li><strong>Nithya Anna Seva</strong> — daily free meal/canteen programme; <strong>Sai Mitra Grama Seva</strong> — sustained village-adoption and welfare service; an estimated 52 lakh (5.2 million) volunteer service-hours contributed annually, with cultural and spiritual outreach active in over 120 countries.</li></ul>"
        ]
      },
      {
        "type": "table",
        "title": "5.2 Sustainability",
        "cols": [
          "Metric",
          "FY2021-22",
          "FY2023-24",
          "FY2024-25"
        ],
        "rows": [
          [
            "Cumulative solar capacity installed",
            "6.24 MWp",
            "6.24 MWp",
            "6.3 MWp"
          ],
          [
            "Cumulative clean energy generated",
            "270 lakh units",
            "362 lakh units",
            "442 lakh units"
          ],
          [
            "Cumulative electricity-bill savings",
            "₹15.28 Cr",
            "₹27.28 Cr",
            "₹33.44 Cr"
          ],
          [
            "Treated sewage water reused (per year)",
            "—",
            "~1,800 lakh litres",
            "~3,000 lakh litres"
          ]
        ],
        "note": "Sources: Sri Sathya Sai Central Trust Deed (2 Sept 1972, as amended 11 Mar 1994); SSSCT Annual Report FY2021-22; SSSCT Annual Report FY2023-24; SSSCT Annual Report FY2024-25 (\"SSSCT-AR-2025-WEB\")."
      }
    ]
  },

  songs: {
    title:'Songs & Poems', crumb:'Bhagawan · Songs & Poems',
    subtitle:'Devotional songs, bhajans and poems in the Sai tradition.',
    sections:[
      { type:'cards', eyebrow:'Listen & Read', title:'Devotional Resources', items:[
        { title:'Divine Poetry', desc:'Poems written in devotion and remembrance of Bhagawan — a designed collection.', link:{ label:'Open', page:'divine-poetry' } },
        { title:'Sri Sathya Sai Compositions', desc:'Devotional songs and compositions dedicated to Bhagawan.', link:{ label:'Open', page:'songs-baba' } },
        { title:'Sri Sathya Sai Padya Sudha', desc:'Devotional poems (padyams) in Telugu.', link:{ label:'Open', page:'sai_padhyam' } },
        { title:'Bhajans', desc:'Bhajans from the Sai tradition.', link:{ label:'Open', href:'https://archive.sssmediacentre.org/www/ssspeaks/index/bhajanas' } }
      ] }
    ]
  },

  blog: {
    title:'News & Blog', crumb:'News & Updates',
    subtitle:'Stories, announcements and highlights from across the Institute.',
    sections:[
      { type:'cards', eyebrow:'Latest', title:'From SSSIHMS', items:[
        { badge:'Admissions', title:'B.Sc Nursing Applications Now Open \u2014 2026\u201327', desc:'Online applications for the 4-year B.Sc Nursing programme are open. Deadline: 19th June 2026. No tuition fees. Fully residential, exclusively for women.', link:{ label:'Apply Now', href:'https://tinyurl.com/sssihmsnc' } },
        { badge:'Notice', title:'Allied Health Science Admissions Paused for 2026\u201327', desc:'AHS programme admissions are temporarily paused for this academic year. Candidates are advised to visit the website regularly for updates.', link:{ label:'Academics', page:'academics' } },
        { badge:'Newsletter', title:'Manohriday Newsletter \u2014 Latest Edition', desc:'The new Manohriday newsletter features hospital updates, patient stories and highlights from our departments.', link:{ label:'About the Newsletter', page:'manohriday' } }
      ] },
      NURSING_CTA
    ]
  }

};


// ── DEPARTMENT STATISTICS DASHBOARDS ────────────────────────────────────────
const DASHBOARDS = [
  ['statistics-combined','Combined Hospital','Combined clinical activity across all departments — 1,95,100+ procedures since 2001.'],
  ['cardiology-statistics','Cardiology','Catheterisation laboratory sessions and interventions — 25 years of free cardiac care.'],
  ['cardiac-surgery-statistics','Cardiac Surgery','Cardiothoracic & vascular surgery (CTVS) — open and closed-heart procedures over 25 years.'],
  ['neurosurgery-statistics','Neurosurgery','Cranial and spinal neurosurgical procedures — 25 years of neuroscience service.'],
  ['multi-specialty-statistics','Multi-Specialty','Combined multi-specialty surgical services, 2012–2026.'],
  ['ophthalmology-statistics','Ophthalmology','Ophthalmology & visual sciences surgical case-mix, 2012–2026.'],
  ['obs-gynae-statistics','Obstetrics & Gynaecology','Obstetrics, gynaecology & neonatology, 2012–2026.'],
  ['orthopaedics-statistics','Orthopaedics','Orthopaedics & joint replacement surgery, 2012–2026.'],
  ['paediatrics-statistics','Paediatrics','Paediatric surgery across departments (age under 18), 2012–2026.'],
  ['urology-statistics','Urology','Urological surgery case-mix and trends, 2012–2026.'],
  ['ent-statistics','ENT','Ear, nose & throat and head-neck surgery, 2012–2026.'],
  ['general-surgery-statistics','General Surgery','General surgery & urology case-mix, 2012–2026.']
];
window.STATS_DASHBOARDS = DASHBOARDS.map(([slug, label]) => ({ slug, label }));
DASHBOARDS.forEach(([slug, label, subtitle]) => {
  PAGES[slug] = {
    title: label + ' — Statistics',
    crumb: 'Statistics · ' + label,
    subtitle: subtitle,
    sections: [
      { type:'statsdash', slug: slug },
      { type:'intro', eyebrow:'Behind the Numbers', title:'Every Number Is a Life', narrow:true, alt:true, body:[
        'Each figure in this dashboard represents a patient who received world-class care entirely free of charge. These records are drawn from complete hospital data maintained since the Institute opened its doors.'
      ], link:{ label:'All Statistics', page:'statistics' } }
    ]
  };
});

window.PAGES = PAGES;
