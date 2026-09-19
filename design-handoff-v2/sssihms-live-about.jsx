// sssihms-live-about.jsx — Full live-site content for the About cluster.
// Source: whitefield.sssihms.org (about-hospital, genesis, guiding-philosophy).
// Text reproduced in full from the live pages; images are the live site's own files.
(function(){
const PAGES = window.PAGES;

const U = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const IMG = {
  diwali: U + '2015/05/Diwali-hospital-picture-e1430890195276.jpg',
  aerial: U + '2015/04/aerial3.jpg',
  finalHospital: U + '2015/05/02_Final_Hospita-.jpg',
  fullLength: U + '2022/11/Website-full-length-image.png',
  night: U + '2022/11/sssihms-highlighted-night.png',
  beforeHospital: U + '2015/05/before-hospital.jpg',
  roadLaying: U + '2015/05/ROAD-LAYING.jpg',
  blessingMachinery: U + '2015/05/BLESSING-MACHINARY.jpg'
};

PAGES['about-hospital'] = {
  title:'About the Hospital', crumb:'About Hospital',
  subtitle:'A tertiary-care super-specialty hospital where every service — investigation, surgery, medicine and in-patient care — is given absolutely free of charge.',
  sections:[
    { type:'intro', eyebrow:'Hospital Overview', title:'World-Class Care. Always Free.',
      image:IMG.fullLength,
      body:[
        'Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), Whitefield, is a tertiary-care super-specialty hospital in Bengaluru, Karnataka, established under the divine inspiration of Bhagawan Sri Sathya Sai Baba and run by the Sri Sathya Sai Central Trust.',
        'The mission of the Institute is to provide the highest quality of medical care — completely free of charge — to all patients, irrespective of caste, creed, religion and financial status, in an atmosphere of love and care.',
        'The hospital was inaugurated on 19 January 2001 by the Honorable Prime Minister of India, Sri Atal Behari Vajpayee, in the Divine Presence. It offers super-specialty services in Cardiology, Cardiac Surgery, Neurosurgery and Anesthesiology, alongside a general hospital, diagnostic services, and accredited postgraduate and allied health training programmes.'
      ], pill:'100% Free Medical Care for All' },
    { type:'stats', eyebrow:'Our Impact', title:'Service in Numbers', items:[
      { v:'1,43,500+', l:'Cardiac & Neuro Procedures Since 2001' },
      { v:'51,500+', l:'Multi-Specialty Surgeries Since 1976' },
      { v:'12', l:'Modular Operation Theatres' },
      { v:'6', l:'Intensive Care Units' },
      { v:'25+', l:'Years of Compassionate Service' },
      { v:'100%', l:'Free Medical Care for All' }
    ], alt:true },
    { type:'quote', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/09/baba-03.jpg', eyebrow:'Guiding Philosophy',
      text:'Doctors should serve the poor with a spirit of sacrifice. There is no greater service than this. Medicine should not be commercialised. It is meant to promote a heart-to-heart and love-to-love relationship between doctor and patient.',
      attr:'Bhagawan Sri Sathya Sai Baba, 2003' },
    { type:'prose', eyebrow:'The Building', title:'A Temple of Healing, Not a Hospital',
      image:IMG.diwali, imageCaption:'The hospital on Diwali night',
      body:[
        'Bhagawan\'s guideline to the architects was that the building should not look, or smell, like a hospital — but like a temple of healing. The K-shaped structure was chosen from three designs, its two angular wings looking like open arms welcoming the sick, with a promise of cure.',
        'Ceilings were made 14 feet high, as against the conventional 9 to 12 feet, to give the building a grand look and ample light and ventilation. The front set-back from the road is at least 200 feet, and patients can see an expanse of green from their beds. The top of the dome stands 108 feet from ground level and the rotunda is 75 feet in diameter.',
        'Over half a million square feet of construction and finishing was completed in sixteen months. The project includes, besides the hospital building and associated facilities, a staff colony with quarters, a canteen, a water supply distribution system, and a sewage treatment plant.'
      ] },
    { type:'gallery', eyebrow:'The Campus', title:'A 52-Acre Campus at Whitefield', alt:true, items:[
      { src:IMG.aerial, caption:'Aerial view of the hospital campus' },
      { src:IMG.finalHospital, caption:'Baba blessing a patient' },
      { src:IMG.diwali, caption:'The hospital illuminated' }
    ] },
    { type:'split', cols:[
      { eyebrow:'Genesis', title:'The Beginning', body:[
        'The hospital has its genesis in May 1999, when the government of Karnataka requested Bhagawan Sri Sathya Sai Baba to accept a grant of a 52.24 acre plot of land in the EPIP area of Whitefield, and to bless the people of Karnataka with a temple of healing for the sake of the poor and needy. The mammoth project, involving 6 million man hours, was completed within a span of nine months.'
      ], link:{ label:'Read the Genesis', page:'genesis' } },
      { eyebrow:'About the Trust', title:'Sri Sathya Sai Central Trust', body:[
        'SSSIHMS operates under the Sri Sathya Sai Central Trust, which oversees a wide range of educational, medical and service institutions established by Bhagawan Sri Sathya Sai Baba — serving millions across India and the world.'
      ], link:{ label:'Visit the Trust', href:'https://srisathyasai.org.in' } }
    ] },
      { type:'intro', eyebrow:"From the Record", title:"More About the Hospital", body:[
        "Healthcare should be provided free to all, in an atmosphere of love with an aim to heal the patient in body, mind and soul.",
        "To provide free medical care to the sick and ailing with dedication, commitment, love and the best of skills, to facilitate healing in body, mind and spirit.",
        "Started by Bhagawan Sri Sathya Sai Baba in the year 2001, Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield is 4th such venture of Sri Sathya Sai Central Trust, to provide best of the best, high quality medical and surgical care to the poorest of the poor patient, free of cost, without any discrimination based on caste, creed or nationality.",
        "It is a 333-bedded tertiary care hospital inaugurated by the then Prime Minister of India, Sri Atal Behari Vajpayee, it is located in the picturesque suburbs of Whitefield in the garden city of Bangalore, Karnataka, India.",
        "Shaped in the form of letter K, the Hospital stands for Karuna or compassion and has been successful in healing thousands of diseased hearts and brains and returning to the society a healthy and grateful individual touched by spirit of sacrifice and transformed to make a difference to the fellow human beings.",
        "Sri Sathya Sai Institute of Higher Medical Sciences is equipped with state- of-art diagnostic and treatment facilities, highly skilled medical, nursing and paramedical professionals delivering care with love and compassion, in a clean, aesthetic and spiritual environment ensuring that healing happens in body, mind and spirit.",
        "Infrastructure wise, Hospital has state of the art 1.5 Tesla Siemens MagnetomAera MRI Scanner, 128 slice HD 750 GE CT Scanner, Siemens Artis Zee Biplane Cath Lab, Philips Monoplane Cathlab, Medtronic S7 Neuro-navigation system, 12 fully equipped operation theaters, automated biochemistry and microbiology analyzers, high end diagnostic Cardiology equipment, full blown Hospital Information System eHIS from M/s Dedalus and Fuji Synapse PACS system.",
        "Apart from patient care, Hospital is also active creating next generation of doctors, nurses and technologists.",
        "Hospital has a very active post graduate and post doctoral programs affiliated to National Board of Examinations providing DNB in Cardiac Surgery, Neurosurgery, Cardiology, Anesthesiology and Radiology.",
        "Additionally Hospital also has post doctoral fellowships in Interventional Cardiology, Cardiac Anesthesia, Critical Care Anesthesia and Cross sectional imaging.",
        "In the paramedical field, Hospital provides BSc Nursing, BSc Imaging Technology, BSc Perfusion Technology, BSc Anesthesia Technology, BSc Cardiac Technology and BSc Medical Laboratory Technology.",
        "Sri Sathya Sai Central Trust, Prasanthi Nilayam is perhaps the only charitable trust in INDIA to offer complete medical care including consultation, diagnosis, comprehensive treatment and follow - up and diet at the primary, secondary and tertiary levels to all patients free of all charges irrespective of his caste, creed, religion or economic status.",
        "The founder, Bhagawan Sri Sathya Sai Baba has established the Trust with the motto of Service to man is service to GOD and with the mission of providing free and quality health care to all patients.",
        "Board of Trustees- Sri Sathya Sai Central Trust",
        "Chancellor, Sri Sathya Sai Institute of Higher Learning",
        "Former Collector & District Magistrate of Anantapuram District,",
        "Former Commissioner of Relief, Commissioner ofCommercial Taxes, Govt.",
        "Former Registrar of Sri Sathya Sai Institute of Higher Learning",
        "Former Secretary, Economic Advisory Council to the Prime Minister of India",
        "President and Representative Director at Hotel Management International Co., Ltd.",
        "He was conferred the prestigious Pravasi Bharatiya Samman by the Government of India in 2010 and Padma Shri in 2022",
        "Overseas Chairman of Sri Sathya Sai International Organization, Zone B, which spans across Asia, the Middle-East and Africa, covering a total of 80 countries.",
        "Chairman and Chief of Diabetology at Dr.",
        "President and Director of Madras Diabetes ResearchFoundation, Chennai.",
        "Chartered Accountant and Senior Advocate of the High Courtof Karnataka and the Supreme Court of India,",
        "Former President Karnataka section of the International Commission of Jurists",
        "Full time looking after activities of the Trust as Managing Trustee.",
        "MBA from Sri Sathya Sai University",
        "Former Judge of Supreme Court of India",
        "Former Additional Chief Secretary, Department of Finance, Government of Karnataka",
        "Hospital Executive Committee- Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield",
        "Director, Sri Sathya Sai Institute of Higher Medical Sciences",
        "Consultant Anesthesia & Critical Care and Principal of Critical Care Anesthesia and Cardiac Anesthesia Fellowship and Anesthesia Care Technology",
        "Coordinator, Hospital Executive Committee, EA to Director, Sr.",
        "Ariel View of Hospital Diwali View",
      ] },
    ]
};

PAGES['guiding-philosophy'] = {
  title:'Guiding Philosophy', crumb:'Guiding Philosophy',
  subtitle:'Healthcare should be available free to all, irrespective of caste, religion, nationality, or financial status.',
  sections:[
    { type:'intro', eyebrow:'Mission', title:'Cured in Body, Mind and Spirit',
      image:IMG.night,
      body:[
        'The hospitals run by Sri Sathya Sai Central Trust provide free medical care to the sick and ailing with the dedication, commitment, love and the best of skills, so that they will be cured in body, mind and spirit.',
        'Our Mission is to provide high quality medical care <em>free of charge</em> to all irrespective of caste, creed, religion, and financial status in an atmosphere of love and care. The hospitals run by the Trust follow the guiding principles laid down by Bhagawan Sri Sathya Sai Baba.'
      ] },
    { type:'prose', eyebrow:'Principle One', title:'Universal Healthcare', alt:true,
      body:[
        '<strong>Healthcare should be available to all, irrespective of caste, religion, nationality, or financial status.</strong>',
        'Bhagawan explains it in very simple words: When disease makes no distinctions of high or low, rich or poor, should those who cure make such distinctions? Even the architecture of the hospitals underscores this principle, their wide arms as if embracing all those who come to them for succour.'
      ] },
    { type:'prose', eyebrow:'Principle Two', title:'Decommercialized Healthcare',
      body:[
        '<strong>Healthcare should be delivered free of charge.</strong>',
        'From the inception of the hospitals, Bhagawan has emphasized that medical care should be given without charging patients a single paisa. The hospitals provide the entire range of medical services — investigations, surgery, medicines and in-patient care absolutely free of cost.',
        'In fact, there is no billing counter in the hospitals at all. Apart from the stress and anxiety associated with illness, patients can be worried about being unable to meet the cost of treatment. In Bhagawan\'s hospitals patients and their families have no such worries. Also doctors can decide the best course of treatment unfettered by commercial considerations.'
      ] },
    { type:'prose', eyebrow:'Principle Three', title:'Human Values in Healthcare', alt:true,
      body:[
        '<strong>Healthcare should be administered with Love.</strong>',
        'Sri Sathya Sai Baba has advised doctors: "Doctors should care for their patients as they would for their kith and kin. Love is the basis for values-based living. A doctor can infuse courage in patients by the love he/she shows towards the patients. If doctors carry out their duties in a spirit of Love and Sacrifice, their efforts are certain to be crowned with success."',
        'The atmosphere of Love and Compassion which pervades the hospitals encourages patients\' recovery. The doctors and the caregivers and the hundreds of Sevadal (service volunteers) are inspired by the ideal "Service to Man is Service to God".'
      ] },
    { type:'prose', eyebrow:'Principle Four', title:'Spiritualisation of Healthcare',
      body:[
        '<strong>The aim should be to heal the patient in body, mind and spirit, not merely to cure disease.</strong>',
        'The Preamble to the Constitution of the World Health Organisation (WHO) defines Health as "a state of complete physical, mental and social well-being and not merely the absence of disease or infirmity". Hence, values-based living is emphasised, and prevention of disease and ill-health.'
      ] },
    { type:'quote', image:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/09/baba-05.jpg',
      text:'Hands that help are holier than lips that pray.',
      attr:'Bhagawan Sri Sathya Sai Baba' },
    { type:'gallery', eyebrow:'The Founder', title:'Bhagawan Sri Sathya Sai Baba', cols:3, items:[
      { src:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/09/baba-01.jpg' },
      { src:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/09/baba-12.jpg' },
      { src:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2026/09/baba-08.jpg' }
    ] },
    { type:'cards', eyebrow:'Archive', title:'Historical Recordings', alt:true, cols:2, items:[
      { title:'Inaugural Address by Bhagawan Sri Sathya Sai Baba', desc:'19th January 2001', link:{ label:'Watch', href:'https://www.youtube.com/watch?v=IVmP5JGPk3M' } },
      { title:'1st Anniversary of the Hospital', desc:'19th January 2002', link:{ label:'Watch', href:'https://www.youtube.com/watch?v=YX9zD1GLSpM' } },
      { title:'Bhagawan\'s Visit to Hospital', desc:'7th June 2007', link:{ label:'Watch', href:'https://www.youtube.com/watch?v=pBZFCWswEqA' } },
      { title:'Speech by Prime Minister Sri Atal Behari Vajpayee', desc:'Inaugural day, 19th January 2001', link:{ label:'Watch', href:'https://www.youtube.com/watch?v=I4nXbOjZ0VQ' } }
    ] }
  ]
};

PAGES['genesis'] = {
  title:'Genesis', crumb:'About Hospital · Genesis',
  subtitle:'Inaugurated by Sri Atal Behari Vajpayee, Prime Minister of India, SSSIHMS Whitefield has its genesis in 2001.',
  sections:[
    { type:'prose', eyebrow:'Genesis', title:'A Temple of Healing for the Poor and Needy',
      image:IMG.beforeHospital, imageCaption:'Before construction',
      body:[
        'Hospital has its genesis in May 1999, when the government of Karnataka requested Bhagawan Sathya Sai Baba to accept a grant of a 52.24 acre plot of land in the EPIP area of Whitefield and to bless people of Karnataka with a temple of healing for the sake of poor and needy. That moment started the unfolding of yet another saga of Divine love and compassion.',
        'When the Divine wills, normal human limitations and norms do not apply to its execution. The speed and mode go beyond credible limits, and the presence of the Divine is made evident at every stage. All government procedures for handing over the possession of the land to the trust, approval of the plans, etc., were completed in record time.'
      ] },
    { type:'features', eyebrow:'Construction', title:'Nine Months, Six Million Man Hours', alt:true, items:[
      'On 2 September 1999, the formal Bhumi Puja (ceremony for consecrating the land before beginning construction) and the laying of the north-east corner foundation stone were carried out.',
      'In a project of such magnitude, the various stages of concept, architectural, and functional designs and drawing, structural specifications with their designs and drawings, project estimates, tendering and contracting, mobilization, and commencement of execution are done in sequence. But here, all these activities were telescoped, and many of them were carried out in parallel.',
      'This was possible by the divinely inspired spirit of cooperation among the consultants, contractors, and suppliers, who treated the project as a joint and truly united endeavor. This was a lesson in unity in diversity to all those involved in the project.',
      'It was this sense of unity, inspired by the Divine Master, that made it possible to complete this mammoth project involving 6 million man hours within a span of 9 months.'
    ] },
    { type:'prose', eyebrow:'Inauguration', title:'19 January 2001',
      image:IMG.blessingMachinery, imageCaption:'Swami operating the tower crane', reverse:true,
      body:[
        'The Hospital was inaugurated on 19 January 2001 by the Honorable Prime Minister of India, Sri Atal Behari Vajpyee, in the Divine Presence. The Chief Ministers of Karnataka, Andhra Pradesh, and Maharashtra attended the function.'
      ] },
    { type:'prose', eyebrow:'Interview', title:'Sri Satish Nayak, Chief Engineer, Sri Sathya Sai Central Trust', alt:true,
      body:[
        'After passing out with an Engineering degree in 1953, I worked for the Indian Railways, the Ghana Railways, and the World Bank, before I retired and was extremely fortunate to get the opportunity to work for Swami from 1997. I considered my self thrice blessed when I was given the role of Project Engineer for Swami\'s Bengaluru Hospital Project in 1999. I also had the good fortune to work with Shri Rajan Sood, Shri Ravi Shankar, Architects, and Shri Srivatsan, Hospital Design Expert, as well as with a wonderful team of Accountants, Engineers and others. Some of them are still working as busily as ever in the Hospital. Dr. Hegde, who later became the Director of the Hospital, gave us invaluable advice during its construction. The cooperation and advice from L & T, headed by Shri A. Ramakrishna, was invaluable. The leadership of Shri C. Sreenivas, who spearheaded the project and followed it up, played a major part in its successful execution.',
        'When preparing the Project Report for the Hospital, I realized that it was not going to be a place where the benefit of the treatment would go to the patients only, and where the benefits could be measured with the WHO unit of DALYs (Disability Adjusted Life Years). Since the Hospital was going to provide totally free succour to all, including the poorest of the poor, who would otherwise leave their families destitute, it was going to provide major resultant benefits to society, and also be an instrument of societal transformation. The societal benefit was not confined to the patients alone; their families and progeny would not only be saved from distress, but they would also be prevented from possibly going to the streets and causing crime, with major costs to society.',
        'Three architectural designs were received: (i) a conventional rectangle-based building with corridors, (ii) a square building with a quadrangle in the middle, and (iii) the one which was selected by Swami — the present K shaped building wherein the two angular wings looked like open arms welcoming the sick, with a promise of cure. I was also told that Swami wanted that: the front elevation should bear a resemblance to Buckingham Palace; the patients should be able to see an expanse of green from their beds if they look outside; the front set-back from the road should be at least 200 ft.; the hospital should neither look, or smell, like a hospital.',
        'During the construction of the Hospital, many very unique features were observed, which could occur only with Divine Grace. Contractors and suppliers were falling over each other in trying to fulfil their obligations. Bidders wanted to provide their inputs at the least possible price, as they wanted to have the satisfaction of having participated in a Divine Mission. Members of the construction team coordinated their activities and cooperated with each other in an exemplary fashion without any ego-barriers. When there was a state-wide sand strike, the sand truckers continued sand supplies, sometimes by night. Everyone involved knew that it was a Divine work, which needed nothing less than their best efforts.',
        'There was no industrial accident at all during the whole project period. When one supplier, selected by tender, could not get the imported item in time at a critical stage of construction, the higher bidder who had offered an item of a higher standard, gave the supplies from his stock at the lower price. Our team always remembered Swami, and after lunch every day, which we had seated together, one of us, by rotation would read out a piece of valuable advice from "Sathya Sai Speaks".',
        'Among many other valuable pieces of Divine Advice, Swami specified the height of the top of the dome from the ground level to be 108 ft. He also specified the diameter of the rotunda to be 75 ft. The overhead water tank was previously located at the south-west corner of the site. Swami wished that it should be shifted to the side of the building on the southern side, as, in the earlier location, the tank structure hid the view of part of the building from the main road, when approaching from the South.',
        'Swami took a keen interest in the assembly, on site, of the elements of the large chandelier in the dome. Swami also visited some of the staff quarters in the stage of construction. Every visit of Swami to the construction site was an eagerly awaited event. We would wait for the phone call from Brindavan Ashram, saying Swami is leaving. Swami used to come once in four or five days, whenever He was in Brindavan. Every visit, every moment was treasured by all. I was blessed to drive Him round the various important areas three times in a golf cart, with Him sitting next to me. Every moment, every second was precious. And, He gave me the most treasured minutes in my life, when, during one of his rounds (May 23, 2000), He created a gold chain and put it round my neck. Swami always brought sweets and goodies in a vehicle that followed His car, and we would enjoy them after the Divine Visit.',
        'The work which involved the construction and finishing of over half a million square feet was completed in sixteen months. It was only Swami\'s Divine Grace that made it possible. The project includes, besides the Hospital Building and associated facilities, a staff colony with quarters, a Canteen, a water supply distribution system, and a Sewage Treatment Plant. The last mentioned was not very common in those days, but it helped keep the lawns and garden green even in the driest of years, because the double treated water was used for gardening, apart from reducing fresh water consumption to a significant extent. It was only Swami\'s guidance that must have led us to put up the plant. The entry against the item "Quantity of effluent from the site" in the form to be filled in for the Pollution Control Department was: "zero".',
        'When the day for the inauguration was coming nearer, Swami made it clear that He did not want an empty hospital to be formally opened — He wished that there should be some post-surgical patients in the wards on the day of inauguration. Needless to say, His wish came true!',
        'Whenever I see the Hospital now, I think of the lakhs of people it has saved from disaster. When I hear of the societal transformation taking place in the localities where the treated patients live, I am convinced that it is a Temple of God radiating Divine Blessings, and not a mere Hospital — and my feelings of gratitude to Swami for giving me a miniscule part in His Mission overwhelm me. How can I ever thank you, dear Bhagavan?'
      ] },
    { type:'prose', eyebrow:'Interview', title:'Architect Sri Rajan Sood, Sai Architecture Interiors, New Delhi',
      body:[
        'Shri Rajan Sood, an Architect by profession, was chosen by Bhagawan Sri Sathya Sai Baba in 1999 and guided him to design the Sri Sathya Sai Institute of Higher Medical Sciences. In an interview, he shares his experiences from the time.'
      ],
      qa:[
        { q:'Q: Can you please share how you came to Swami?', a:[
          'Rajan Sood: I am an architect, basically born, brought up, and educated in Delhi. I saw Swami for the first time in 1972 when he came to Delhi. He spoke to me for the first time in \'73. In the 70s, there used to be Summer Course for college students pan India and all over the world.',
          'In \'73, I enrolled in the Seva Dal. I had some very beautiful experiences then. In \'74, I applied and was allowed to attend the Summer Course in Brindavan for a month. That\'s where things really started between Swami and me. And, thereafter, for every Summer Course held in Brindavan, Swami allowed me to attend all of them, till almost the mid 90s. That is where the serious interaction started and continued.',
          'So before the hospital project came by, I had physically been with Swami for 25 years.'
        ] },
        { q:'Q: Did you do any projects for Bhagawan before the Hospital project came by?', a:[
          'RS: The first project happened way back in \'77-78 a girls\' school was to be built in Delhi. They asked me to design that. I designed it and the school drawings Swami had approved himself before construction. In \'81 or \'82 Swami laid the foundation stone for that.',
          'Thereafter, the Delhi-UP Trust wanted to build a boys\' school in Rishikesh. I was approached to do that project and of course, I had started. While I was doing the Rishikesh project, on one occasion that I was going to go to Puttaparthi, I thought I would carry all the drawings with me and show them to Swami. Swami called me in and I think this was in 1999, and he was looking at the drawings and he started talking about the Bangalore hospital.',
          '"Bangalore mein hospital banaata hai". I thought it was just a bit of information he was giving me. "Dekho idhar Puttaparthi mein banaaya … Puttaparthi village hai." Most of my conversations with Swami were either in Hindi or in English or a mix of the two. So then he said, "Abhi Bangalore mein banaata hai. City hai. So, grand hospital banaata hai." I said, "Yes, Swami." Then he put the drawings of Rishikesh project aside and started to talk about what all would happen in that hospital like cardiac surgeries and so on and so forth. He spoke about quite a bit and at that time, only my wife and I were sitting at his feet. There was nobody else was in the room.',
          'Then he suddenly patted me on the cheek and said, "Design karo."',
          'Now, I don\'t belong to this sphere because architecture is kind of very divided, everybody has a kind of a specialisation and mine was far from hospitals or very large buildings. We were concentrating on high-end homes. This was nowhere close to my understanding of the field. It must have shown on my expression and he just nudged me with his foot and he said, "Kar sakta hai. Karo."',
          'He started explaining further, "Dekho, Bangalore kitna bada city hai. Bahut bada hospital banata hai. Usko look do Buckingham Palace jaisa." These were his words.',
          'I was pretty foxed but obviously came back to Delhi, started preparing designs, and they were quite elaborate. In my next visit to Swami, which was under a month from this interaction, I carried those drawings with me.'
        ] },
        { q:'Q: Did he give any other specific instructions during that interview?', a:[
          'RS: The only instruction was \'Buckingham Palace\'! At the time Swami used to live in the Poornachandra Auditorium. When I prepared a new set of drawings and took them to Swami, he called me to his room. I showed him all the drawings and after he had seen them all, he said they are nice and he said, "Come."',
          'He took me behind his room. I think this was the backstage of the auditorium and that place was full of models of the Bangalore hospital. I don\'t even know how many there were! The very look stunned me. They were made by some of the finest internationally known architects. They were all lying there, designs made by them in three-dimensions.',
          'I felt very funny that I had come with these little drawings and here internationally, people have worked on such a large scale, so much of work has been done.',
          'Swami\'s purpose of taking me in was to show me what people had done. Not probably the quality of work but the number of people who would have given anything to do that project. And then he said something very beautiful to me. And that was, "Dekho, Kitna architect design banaake bheja. But I chose you." He had his own way of overwhelming you with his words, his love, his affection.'
        ] },
        { q:'Q: And how did the designs begin to take shape?', a:[
          'RS: Since I was based in Delhi, it was not possible for me to be in Bangalore all through. So, the basic plan, designed by an architect in Bangalore, in consultation with the doctors, medical planners etc. was sent to me in two-dimension.',
          'Keeping Swami\'s brief in mind, I came back with the hospital design as it is made today. I took those drawings to Swami; Swami called me to Poornachandra to look at those drawings. At that time, the central dome, wasn\'t as tall as it is now. So he said, "Dekho, 75th birthday pe inaugurate karta hai. So 75 feet high dome." I said, "All right." At then, of course, there were little patterns on the parapet on the wall. And then he made a comment, "Dekho, parapet ke upar isko repeat karo" (repeat this on the parapet).',
          'Soon after I came out, I took a taxi, came to Bangalore and went to one of these little shops where they print drawings, I sat with them and modified the drawing as Swami had said and took them back to Swami. He looked at them and said, "Ye barabar hai. Shuru karo."',
          'So I came back to Delhi and we started working, the whole office was at it. Barely 15 days later, I got a call from a gentleman from the Trust, and he said, "Rajan, are you ready?" I said, "No, it\'s going to take me quite some time." And the gentleman says, "I have a very strong feeling that Swami is going to ask for you in a day or two." I said, "I am definite. I can\'t be ready by that time."',
          'The elevations, they are so elaborate, and making a drawing of everything was taking a lot of time. First, to design and then, to detail everything. I think the very next day the gentleman called and said, "Swami is asking for you. Please come with the designs." And much to my surprise, within that day, it transpired — we didn\'t work overtime, we did nothing — all the drawings were ready! And I packed and the very next day I left for Bangalore.',
          'Swami was in Brindavan at that time. When I went there, the L&T team was already there. And Swami came out and came to where I was sitting and he says, "Kabhi aaya?" I said, "Swami, I just came the last evening." "Drawing laaya?" I said, "Haan, Swami." Then he told the Chairman of L & T, "Take your team and sit with Rajan in the guest block at the back of Brindavan". And to me, "Aap udhar jaake saara discuss karo. Mein baad be dekhta hai."',
          'So we had a long discussion. All the drawings were there. The Chairman and his team looked through all of that. Then we got a call after about an hour that Swami is calling us. We went into Trayee and Swami sat down in his chair in the small living room and he looked at each drawing. There was a huge number of drawings and he looked through all of them.'
        ] },
        { q:'Q: Were they basically the elevations or the interiors also?', a:[
          'R: The interiors came a little later. Of course, the interior columns around the mandir I had done. He saw all of them. And he said, "Barabar hai. Shuru karo." And then, if you see the outside windows, they have a kind of a crest on the top. He looked at that design and as a part of the design which nobody would have known except me because we were the ones who made it, there were birds in that. There were kind of three-dimensional birds in that. Swami looked at that and he said, "No parrots." They were actually parrots which nobody could have made out. I had seen an image of parrots which I found very beautiful but you see these swans and all in Prashanti Nilayam, I thought ok, let\'s make a departure, let\'s do a parrot instead. And which nobody else would have understood at all because it didn\'t look like a parrot. It was just the outline of a bird. And he says, "No parrots."',
          'Well, then the work started and went on full swing. I would spend 15 days in Whitefield, and 15 days in Delhi getting things ready and for every visit monitor the progress and review. I would click the pictures of the hospital and of course, all further drawings that were made, I would take them to Swami. That year, I must have met at least 12 or 15 times because every month I was there and the moment he would see me, he would call me in and start looking at all drawings and every photograph, ask questions of how this is going, how that is going.',
          'He monitored everything very, very minutely. Every thing. Every aspect of it. And towards the end, I think, last one or two days to the opening, and somebody walked up to me and there is the gold kalash that has to go on top of the dome, tell us how to do it. I said I haven\'t the faintest idea and I think it is too late in the day to do it. And on the day of the opening, when I was approaching the hospital, I saw the kalash was already up. So he had, he has his way of making things work. He doesn\'t need us.',
          'My understanding is that we were used just to make us feel part of his team to receive his love. Everyone has been given something that Swami could use in his missions, not because that person is special but may be that becomes the way of Swami\'s conveying love to you. There is no other reason.',
          'I know I wasn\'t capable of doing it. But the very moment when he patted my cheek and said, "You can do it," I guess that is where it came from, that energy probably transmitted. I don\'t know how but we did finally manage to do it and he was very happy, very happy.',
          'Every time he would wait and ask, "What have you brought? What is the new thing they are going to do? What are the additions we are doing? What is the development that we made?" This is including the photograph in the mandir. Up, at a higher level, there is a photograph. For this photograph, I didn\'t know what to choose. Somebody directed me to a devotee who was into printing on flex. I went to his factory, and we chose some photographs. I had four or five of them done up the same size and next morning I took them to Swami. And, "Kya hai?" I said, "Swami, mandir ke liye photographs hain." "Dikhao." The road in front of Trayee… we opened up the photographs there and he chose, "This one. This is the one I want there." To that little extent, he was involved. It was him initially, and him taking care of everything till the end.',
          'If I were to do a project like this, I think 5 to 6 years is the minimum time, for a project like this to come up with this kind of intricacies. Plain simple buildings are very easy to do. But when you are wanting to match the level of Buckingham palace, it is a very tall order. Very, very tall order.'
        ] },
        { q:'Q: How come the colours of the hospital are different from Swami\'s other buildings?', a:[
          'R: The original presentation that I had made to Swami was in these colours. During the course of the painting work, we did try out a lot of options, permutations and combinations of blues, pinks, yellows, off-whites. It wasn\'t working out right. Then one fine day the other architect said why don\'t we go back to the original? We did and it looked very beautiful. That is when it was decided that we would stick to the original colours.'
        ] },
        { q:'S: And did you actually see the Buckingham Palace in person?', a:[
          'R: (laughs) Later. These days we don\'t have to see, you just log on to the web and you got the world there. I don\'t think Swami meant that we should replicate the Buckingham Palace. What he was trying to convey was something as grand as the Palace. Because if you see the two buildings, they have nothing in common. They have absolutely nothing in common. Our hospital in terms of its detailing, the concept — it\'s very, very Indian. It\'s more like a very grand Indian palace. It could not be anywhere else. When you look at the details — the columns, the brackets, the domes, the gopurams on the parapet, all of that is very, very Indian. There is nothing of Britain in that. So as I understood it what he meant was that it had to be grand like the Buckingham Palace. Other than that there is nothing, there is nothing at all that looks like the Buckingham Palace. I think our hospital is more intricate than Buckingham Palace is.',
          'Incidentally, the stained glass was purely my idea. The flowers and the decorations had nothing to do with any kind of medical properties or medicinal things. We just wanted to make it look grand. That was just the intention to add some interesting elements to the dome.'
        ] },
        { q:'Q: Was there a plan to have a waterfall in the dome area?', a:[
          'R: There was a waterfall planned, originally on either side of Swami\'s picture. At some point of time it was felt it would be tough maintaining it and it was modified.'
        ] },
        { q:'Q: What about the chandelier?', a:[
          'R: My only contribution to the chandelier was the size. I was asked what should be the ideal size to fit into a dome of this size. So I just gave the dimensions and one fine day, when the dome was finished I found a whole lot of Italians walking in with crates and crates of components for the chandelier and they started assembling. That was my first look at the chandelier. Somebody did show me some images earlier but the sheer size of it you get to understand only when you see it.'
        ] },
        { q:'Q: Would you rate this as one of the best projects that you have done?', a:[
          'R: Yes, undoubtedly. For many reasons. But mainly because this was created with Swami.'
        ] }
      ] },
    { type:'prose', eyebrow:'Interview', title:'Sri Ravi Shankar, Ravi Associates, Bangalore', alt:true,
      qa:[
        { q:'Question: Can you please share your background and how you came to Swami?', a:[
          'Ravi Shankar: I received my B.Arch degree from Bangalore University in 1981 and after working for various firms for a few years, started out on my own in 1991. I was initially into design of residential buildings and later, till 1999, specialized in office and residential interiors. Later on, I started designing office complexes, industrial buildings and commercial buildings.',
          'I was studying in Chikballapur, and had my first darshan of Swami as a nine-year old boy. As I grew up, I found being drawn to Him and became a devotee. In 1992, I had a chance to design the present book stall building at Brindavanam.',
          'Swami inaugurated the building on 14-Apr-92, and it happened to be my birthday. For the first time, I had a chance to have blessings of Swami and from that day, His blessings started showering on me. It was an unforgettable day in my life.',
          'As a professional, I have had the great good fortune to have numerous interactions with Him and design some of Swami\'s buildings, including the Hill-View Stadium, Shanthi Bhavan and the Sri Sathya Sai Mirpuri College of Music.'
        ] },
        { q:'Question: How did your interest in hospital design come about?', a:[
          'RS: While I was primarily into designing office spaces and industrial complexes, I also got opportunities to design small nursing homes in and around Bengaluru and it was during this time that my interest in hospital design started. It was a fascinating area of expertise, and it was during this period that I got to know closely the needs of the doctors, patients and the requirements of various clinical specialities.',
          'In early 1999, Bhagawan announced His plan to build the super-speciality hospital in Bengaluru, and I was eagerly looking forward to the opportunity to design the hospital, though it seemed very ambitious.'
        ] },
        { q:'Question: And how did Swami make it happen?', a:[
          'RS: When the Chief Minister of Karnataka, JH Patel, came to Puttaparthi to offer to Swami a large piece of land to Baba for constructing a super-speciality hospital, I was fortunate to be a witness to this event.',
          'Shortly thereafter, I was present at Bengaluru, along with a cabinet minister. Swami called us both in for an interview and He presented me a navarathna ring and told me I will be very busy after August. I could not grasp the import of Bhagawan\'s words at the time. It was around June-July, that my prayers were answered and I was instructed to present a design of the hospital. My joy knew no bounds, and I set off the designing the hospital in earnest.'
        ] },
        { q:'Question: And how did the actual hospital design take shape?', a:[
          'RS: Since I had no prior experience of designing large hospitals, I visited various hospitals in Bengaluru to understand the clinical requirements. Also, there were Bhagawan\'s guidelines that the building should not look like a hospital, but like a temple of healing. His other inputs were for it to be grand, have sufficient light and ventilation. This was how the K-shaped structure came about. The ceilings were all made 14-feet high, as opposed to the conventional 9-12 feet, to give the building a grand look.',
          'As the design progressed, we wanted to prepare a model to show Bhagawan, so it will give Him a clear picture of the character and style of the building. Within three weeks\' time, the model was ready. When we took it to Parthi for Bhagwan\'s inspection, Bhagawan saw it, and said, "You have designed the building just like the Buckingham palace, which was in my mind," and presented vibuthi and blessed me.',
          'Though I made the design, I cannot take credit for the design, as it was purely Bhagawan\'s inspiration and blessings. At Swami\'s behest, I was asked to explain the key components of the design to a team of doctors, which was apparently satisfied with the design. At this moment, I felt I have achieved a significant goal in life, but I still kept my fingers crossed that I will be given the opportunity to work on this project.',
          'I must share here that during this period, I had only five members on my team, and all of us used to work 18-20 hours daily for a period of three weeks. In spite of such a hectic schedule, we never felt tired or stressed in our minds and body. This can happen only with Bhagawan\'s blessings.',
          'Finally, to my joy and efforts of my team, we were awarded the contract of designing the hospital. We were to work along with Shri Rajan Sood from Delhi, the work allocation being we were to design the basic framework and provide for the various services within the framework and Shri Rajan\'s scope was to design the facade of the hospital. We worked very closely with each other on this project.'
        ] },
        { q:'Question: Could you share how the hospital colors are muted, and different from other Swami\'s buildings?', a:[
          'RS: During the construction stage, we had numerous visits to Parthi to update Bhagawan on the progress. During one such visits, Bhagawan granted me an interview, during which I informed Him that we would be trying out different colour schemes and make samples on parts of the buildings and that we would need His approval. Bhagawan graciously consented and informed that He would see the building when He next visits Bengaluru. Within a week, Swami came to the site, saw the color and approved the present color scheme.'
        ] },
        { q:'Question: What, in your opinion, was the critical factor for such a short project execution period of 16 months?', a:[
          'RS: The critical factor is solely Swami\'s blessings and the shakthi Swami gave the project team and of course to L&T, whose micro planning was commendable and we were able to adhere to all timelines.',
          'Also, I recall how, in an interview to the project team, Swami taught us the importance of teamwork, using the example of a garland. He explained how a garland looks very fresh and beautiful on the first day, and how the next day it fades to 75% of its beauty and on the third day the flowers will dry and fade. But, He mentioned, the thread holding the flowers together, continues to be strong. He emphasized teamwork and said that all the individuals should hold their hands together and work together and be like the thread in the garland.',
          'We had a very good project team, headed by the project coordinator Shri Satish Nayak, Mr. Srivathsan, who helped us with the critical area of medical planning, the L&T Director, Shri A. Ramakrishna. They were all highly competent individuals, and more than that, very devoted to Bhagawan. Of course, there were many other individuals, both named and unnamed, who selflessly worked for the project, inspired by Bhagawan\'s ideal.',
          'Without Bhagawan\'s blessings, it would have been humanly impossible to accomplish the task of building such a huge structure within such a short time-frame.'
        ] }
      ] },
    { type:'prose', eyebrow:'Interview', title:'Sri A. Srivathsan, Medical Planner',
      body:[
        'Shri A. Srivathsan, presently CEO, Vidal Health, was involved in the SSSIHMS Project as a medical planner and provided his inputs towards the facility planning and design. He fondly remembers his participation in the project:',
        '"I vividly recall an interaction between Swami and the Managing Director of L & T, the prime contractor of the Project. Swami asked him about the project team, which comprised of the best people from various specialities. He replied, \'Swami, it is a great team\'. Swami corrected him and said, \'No, not great team! I have given you a good team.\' He went on to explain to all of us that while Ravana might have been great, Rama was good, distinguishing for us the subtle difference between good & great.',
        '"The Hospital project was a very unique opportunity for me. Having been involved in the design of many corporate hospitals, the SSSIHMS hospital project was a paradigm shift, where the patient and the patient needs came first.',
        '"Since they were no agreed-to standards in those days, we followed the US standards in many cases, and in certain cases, we evolved our own. These standards, keeping Swami\'s guideline of \'Patient First\' in mind, surpassed some of the US standards too! The sterile areas were provided with 100% fresh air, which ensure higher air quality, and faster patient recovery. Given that such a feature would mean higher capital & running costs, even reputed corporate hospitals would give such decisions a second thought. The space requirements for individual specialities too, are more than adequately fulfilled. There was no expense spared by Swami to ensure the best quality care delivery to the patients," he says.'
      ] },
    { type:'prose', eyebrow:'The Foyer', title:'The Magnificent Chandelier from Murano, Italy', alt:true,
      body:[
        'The glass chandelier, in the foyer of the Hospital, is a work of art from Murano, Italy, an island in the Venetian lagoon, where glass has been made for over 700 years. The journey of the chandelier from Murano to SSSIHMS, Whitefield is a fascinating one. The Daswani family has been devoted to Swami for many decades.',
        'When they heard about the Whitefield Hospital coming up, Mrs. Shakuntala Daswani sought Swami\'s permission to donate a chandelier for the central dome of the hospital. Swami not only blessed her with the opportunity, but also indicated the colors of the chandelier.',
        'While looking for a factory, which could make large chandeliers, they were guided to Andromeda S.r.l., which had, in 1991, supplied the chandelier, adorning the central dome in the Puttaparthi superspeciality hospital.',
        'Andromeda S.r.l. offered a special price for the chandelier, and once on the job, almost 30 people at the Andromeda factory worked continuously for 3 months to create the chandelier, made up of 11,000 individual pieces of glass, all blown entirely by mouth.',
        'The model of the chandelier is Ca Rezzonico (named after a palace located on the Grand Canal in Venice) and the colour shade is \'Clear & Ruby\'. The height of the chandelier is 12 m (36 feet) and its diameter 7.2 m (22 feet). The gross weight of the chandelier is about 2 tons, and it has a total of 486 bulbs of 60 watts each.',
        'The chandelier arrived by air in Bengaluru in a 40\' container. Five engineers from the Andromeda factory worked round the clock and installed the chandelier in five days.',
        'The chandelier embodies Swami\'s principle that at His Institutions, nothing but the best is given to all who enter its gates. And at the time of writing this article, not one of the 486 bulbs had to be replaced in the last 14 years!'
      ] },
    { type:'gallery', eyebrow:'Archive', title:'Construction Stages', items:[
      { src:IMG.beforeHospital, caption:'Before Construction' },
      { src:IMG.blessingMachinery, caption:'Swami Operating the Tower Crane' },
      { src:IMG.roadLaying, caption:'Construction Stages' }
    ] }
  ]
};
})();
