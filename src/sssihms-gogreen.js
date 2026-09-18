// sssihms-gogreen.jsx — Go Green cluster, full live content and images.
// Sources: /gogreen/, /rain-water-harvesting/, /solar-power-plant/, /tree-transplantation/,
//          /power-conservation/, /water-usage/, /wastemgmt/
(function(){
const PAGES = window.PAGES;
const SUBNAV = window.DEPT_SUBNAV || {};
const W = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const CDN = 'https://cdn.sssihms.org/sssihms/wp-content/uploads/';

SUBNAV.gogreen = [
  ['Go Green','gogreen'], ['Solar Power Plant','gg-solar'], ['Waste Management','gg-waste'],
  ['Biomedical Waste Report','gg-biomedical'], ['Trees on Campus','gg-trees'],
  ['Rain Water Harvesting','gg-rainwater'], ['Power Conservation','gg-power'], ['Water Use Maximization','gg-water']
];
window.DEPT_SUBNAV = SUBNAV;

PAGES['gogreen'] = {
  title:'Going Green', crumb:'Go Green', subnav:'gogreen',
  subtitle:'Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield aims to responsible hospital which balances patient care with care for nature.',
  sections:[
    { type:'cards', eyebrow:'Initiatives', title:'Care for Patients, Care for Nature', cols:3, items:[
      { icon:'◆', title:'Waste management', desc:'All waste generated in the Hospital is segregated and recycled to generate wealth and is responsibly recycled or disposed.', link:{ label:'Waste Management', page:'gg-waste' } },
      { icon:'◆', title:'Tree transplantation', desc:'Due to ongoing Bangalore Metro work in front of hospital 108 trees were transplanted into our campus.', link:{ label:'Trees on Campus', page:'gg-trees' } },
      { icon:'◆', title:'Power conservation', desc:'Air conditioning optimization to conserve electricity. Fixing of LED lights across hospital.', link:{ label:'Power Conservation', page:'gg-power' } },
      { icon:'◆', title:'Solar power generation', desc:'We are first hospital in country to install it own 100 KVA solar power generation plant. Hospital plans to add another 180 KVA capacity shortly.', link:{ label:'Solar Power Plant', page:'gg-solar' } },
      { icon:'◆', title:'RainWater harvesting', desc:'Hospital has undertaken several Rain water harvesting initiatives.', link:{ label:'Rain Water Harvesting', page:'gg-rainwater' } },
      { icon:'◆', title:'Water treatment to maximize water usage', desc:'Hospital is one of the first in Bangalore city to have its own water treatment plant several years before it became mandatory. Fresh water is used for drinking, bathing and in wash basins. Then this water goes to sullage treatment plant and is recycled in sewage treatment plant for use in flushing tanks. Then this water is again recycled for use in the gardens.', link:{ label:'Water Use Maximization', page:'gg-water' } }
    ] }
  ]
};

PAGES['gg-solar'] = {
  title:'Sri Sathya Sai Aarunya — 100 KVA Solar Power Plant', crumb:'Go Green · Solar Power Plant', subnav:'gogreen',
  subtitle:'19-Jan-2017 stands out as a red-letter day in the annals of Sri Sathya Sai Institute of Higher Medical Sciences.',
  sections:[
    { type:'intro', eyebrow:'Commissioned 19 January 2017', title:'A First Step Into Green Energy',
      image:W + '2022/11/100-KVA-solar-plant-1.png', imageLabel:'100 KVA solar plant',
      body:[
        '19-Jan-2017 stands out as a red-letter day in the annals of Sri Sathya Sai Institute of Higher Medical Sciences (SSSIHMS), as on this day, the Institute, and the Sri Sathya Sai Central Trust (SSSCT), have taken their first a proud and responsible step forward towards investing in green energy by commissioning a 100 kWp roof-top, Grid-Integrated Solar Power Plant.'
      ] },
    { type:'prose', eyebrow:'The Commissioning', title:'Lighting the Lamp with Solar Power', alt:true,
      image:CDN + '2017/02/Ribbon-Cutting-1.jpg', imageCaption:'Ribbon Cutting',
      body:[
        'The Hon’ble Minister of Health, Govt. of Karnataka, Sri K.R. Ramesh Kumar, commissioned the plant on the occasion of the 16th Anniversary of the Institute. The Trustees of SSSCT, Dr. Sundaresh, Director, SSSIHMS-Whitefield & Dr. Upendra Acharya, MS, SSSGH-WFD and officials from Kotak Urja Pvt. Ltd., who supplied and installed the plant were also present.',
        'The plant has been christened as “Sri Sathya Sai Aarunya”. Shri P. Ravi Kumar, I.A.S, Addl. Chief Secretary, Dept. of Energy, turned on the switch to turn on a traditional lamp in the dome area, lit by LEDs, and powered by solar power to symbolically commission the plant. He also appreciated the initiative of the Trust to reduce the green-house gas emission, and of going green by inaugurating the 100 kW solar plant on the occasion of the Institute’s 16th Anniversary.'
      ] },
    { type:'prose', eyebrow:'A First for Karnataka', title:'The First Free Hospital in Bangalore to Build a Plant of This Size',
      image:CDN + '2017/02/Solar-lamp.jpg', imageCaption:'Solar lamp', reverse:true,
      body:[
        'This step makes SSSIHMS, Whitefield a completely free super-specialty hospital, the first free hospital in Bangalore, and perhaps the whole of Karnataka, to set up a pilot solar PV plant of this size. The participants inspected the facility and Dr. B. Raghavendra Prasad, Professor, Indian Institute of Astrophysics and a Consultant to the Trust for this project briefed them on the salient features of the plant. This is the first initiative by the Sri Sathya Sai Central Trust and represents their keenness in furthering the cause of green energy, and reducing one’s carbon foot-print. Basing on the experience with this plant, it is proposed to scale up the capacity of the plant at SSSIHMS-Whitefield and set up similar units in other institutions of the Trust.',
        'The 100 kWp plant is made up of 400 nos. multi-crystalline solar photo-voltaic panels, each of 250 W capacity. The panels are inter-connected together in strings of 20 panels each. Each of the strings is connected to one inverter of 20 kW capacity. The output of the plant is connected to the hospital supply, through a bi-directional meter. The output is monitored remotely through the Internet.'
      ] },
    { type:'prose', eyebrow:'Economics of Solar Power Plants', title:'The Feasibility Study', alt:true,
      body:[
        'Dr. B. Raghavendra Prasad, Professor at the Indian Institute of Astrophysics, an alumnus of Sri Sathya Sai Institute of Higher Learning, and a person with significant experience in the area of solar PV power generation, conducted a feasibility study before the Trust invested in this project.',
        'He proposed that, SSSIHMS-WFD could set up a 100 KWp (kilo-watt peak) roof-top solar power plant as a pilot project, which would generate up to 1.5 lakh units of energy per annum (5% of the hospital’s per annum requirement, and 30% of the subsidy shortfall). Considering the present rate of Rs.6.5 per kWH, and cost of Rs. 58 lakhs towards a 100 kWp power plant, the pay-back period for the investment would be 7 years on cost-to-cost basis & 9 years as per net-present-value (NPV).',
        'To promote investment in this clean technology, there is a 15% subsidy on the value of the project, being offered by MNRE (Ministry of New & Renewable Energy).',
        'There is adequate roof area available at SSSIHMS-WFD & ancillary buildings, almost to an extent of 1.5 lakh SFT (14,300 sq.m). Considering the nearness to the electrical infrastructure, it is proposed to install the solar PV system on the service block of the Hospital, with a terrace area of 15,000 sft, adequate to set up the 100 kWp solar PV power plant.',
        'It was decided to go in for a grid-connected system under a net-metering scheme, wherein, we could technically sell excess power to BESCOM. Also, we would be registered with BESCOM, as an institutional generator of solar power. No power storage solution (batteries) was considered, as it is expected the power generated from the plant would be utilized immediately upon generation. Batteries would also mean higher initial costs and also replacement costs every 4-5 years.',
        'Solar PV systems are known to be rugged, with no moving parts and requiring little maintenance. The sub-systems like the inverters are designed for long-life of 15 years and beyond. The only maintenance needed to improve power generation is to carry out periodic cleaning of the panels.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'At the Solar Site', items:[
      { src:W + '2022/11/100-KVA-solar-plant-1.png', caption:'100 KVA solar plant' },
      { src:CDN + '2017/02/at-solar-site-all.jpg', caption:'At solar site' },
      { src:CDN + '2017/02/Ribbon-Cutting-1.jpg', caption:'Ribbon Cutting' },
      { src:CDN + '2017/02/Solar-lamp.jpg', caption:'Solar lamp' }
    ] }
  ]
};

PAGES['gg-rainwater'] = {
  title:'Rain Water Harvesting', crumb:'Go Green · Rain Water Harvesting', subnav:'gogreen',
  subtitle:'Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield has made several Rainwater Harvesting initiatives over the years to tap and utilize the Rainwater falling on the campus.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Tapping the Rain That Falls on Campus',
      image:W + '2022/11/Rain-water-harvesting-lake-filled-up-1024x768.jpg', imageLabel:'Filled up Rainwater harvesting Lake',
      body:[
        'Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield has made several Rainwater Harvesting initiatives over the years to tap and utilize the Rainwater falling on the campus.',
        '<strong>1. Rainwater Harvesting Lake:</strong> A 25,00,000-liter man-made rainwater harvesting lake has been created in the year 2012 to capture majority of the water falling on the hospital terrace and roads on the right-hand side of the hospital and enrich the ground water. The main borewell supplying hospital is situated in this year and the yield has been very good from this borewall post this initiative.',
        '<strong>2. Rainwater Harvesting tank for HVAC plant:</strong> Rainwater falling on the service block is captured into a 2,00,000-liter tank which supplies water for the HVAC plant. This ensures water saving and also provides soft water for this purpose.',
        '<strong>3. Rainwater borewell recharge project</strong> has been done for two borewells on left-hand side of the hospital capturing water falling on the roads on this side.',
        'On the whole majority of the rainwater falling on campus is utilized.'
      ] }
  ]
};

PAGES['gg-trees'] = {
  title:'Trees on Campus', crumb:'Go Green · Trees on Campus', subnav:'gogreen',
  subtitle:'Rudraksha Vana, and 108 trees transplanted into the campus of Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield.',
  sections:[
    { type:'prose', eyebrow:'Rudraksha Vana', title:'Sacred Trees in the Temple of Healing',
      image:W + '2022/12/Rudraksha-on-campus-timeline.png', imageCaption:'Rudraksha on campus', stack:true,
      body:[
        'With grace of Bhagawan, sacred Rudraksha trees have found home in the holy precincts of Temple of Healing setup by Bhagawan Sri Sathya Sai Baba. When the saplings had arrived, we had placed in His Divine room and Baba blessed the saplings with Vibhuti.',
        'With Divine blessings, the saplings have become big trees yielding first crop of violet colored fruit containing the Rudrakshas. There are a total of 23-panchamukhi Rudraksha trees and 2-thrimukhi Rudraksha trees.'
      ] },
    { type:'prose', eyebrow:'108 Trees Transplanted', title:'A Project of This Magnitude, With 100% Survival', alt:true,
      image:W + '2022/12/Tree-transplantation.png', imageCaption:'Tree transplantation', stack:true,
      body:[
        'With Divine Blessings of Bhagawan Sri Sathya Sai Baba, 108 trees displaced due to ongoing metro construction work in the EPIP Area, Whitefield were provided shelter in Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield.',
        'For the first time in India, a project of this magnitude has happened with 100% survival rate. BMRCL, ITD Cem India, Mr. Vijay (Tree Doctor) and Mr. Ram, Volunteer from IBM came together to make this happen.',
        'Sri Sathya Sai Institute of Higher Medical Sciences has provided life to many patients suffering from severe illnesses. Now trees have also been saved from certain death. The Divine atmosphere of Temple of Healing has made it very conducive for the trees to be born again.',
        'As with every project, Bhagawan Baba has been providing the model to be replicated by the World for a Greener and Safer tomorrow for the Generations to come.'
      ] },
    { type:'gallery', eyebrow:'Gallery', title:'Bhagawan and the Trees', cols:2, items:[
      { src:W + '2018/05/Swami-on-tree.jpg', caption:'Swami on tree' },
      { src:W + '2018/05/sai1.jpg', caption:'Bhagawan Sri Sathya Sai Baba' }
    ] }
  ]
};

PAGES['gg-power'] = {
  title:'Power Conservation', crumb:'Go Green · Power Conservation', subnav:'gogreen',
  subtitle:'Hospital has initiated several power conservation methods to conserve electricity.',
  sections:[
    { type:'prose', eyebrow:'Electrical Installation', title:'Changes to Electrical Installation to Conserve Power',
      body:[
        '<strong>1) Street light</strong><br>OLD system 150W × 120nos — 18KW/hour. In 10 hours average energy consumption 180KW.<br>Present system 150w was replaced with 30W: 30W × 120nos — 3.6KW/hour. In 10 hours average energy consumption 36KW.',
        '<strong>2) Tube light</strong><br>Old system 40W × 2000nos — 80KW. In 10 hours average energy consumption 800KW.<br>Present system 40W was replaced with 20W: 20W × 2000nos — 40KW. In 10 hours average energy consumption 400KW.',
        '<strong>3) Dryers in Laundry</strong><br>60KW heating elements was replaced by 30KW.'
      ] },
    { type:'prose', eyebrow:'HVAC Installation', title:'Changes to HVAC Installation to Conserve Power', alt:true,
      body:[
        '<table class="data-table"><thead><tr><th>Sr. No</th><th>Description</th><th>Action taken</th><th>Energy savings</th><th>Energy savings per day</th><th>Energy saving per year 364 days at ₹8/unit</th></tr></thead><tbody>' +
        '<tr><td>1</td><td>Cooling tower no1, Cooling tower no2, Cooling tower no3</td><td>Cooling tower has been replace - 2nos of 10 hp/7.5 kw motor to 1no motor of 12.5hp/10kw.</td><td>5 Kw/Hr</td><td>An average working of cooling tower per day 12 hrs = 60 kw/day</td><td>21,840 kw/year — Rs 1,74,720</td></tr>' +
        '<tr><td>2</td><td>Radiology 2nos of AHUs 35TR with 12.5hp/10kw motor & 10hp/7.5 kw motor working contentiously in day time</td><td>Inter connected the ducting of 2 AHUs and switched off one AHU permanently.</td><td>7.5 kw/Hr</td><td>An average working of AHU per day is 12 hrs = 90 kw/day</td><td>32,760 kw/year — Rs 2,62,080</td></tr>' +
        '<tr><td>3</td><td>CTVS ICU and neuro ICU</td><td>100% Fresh air system converted into 70% Fresh air 30% Recirculated air system without effecting the standards. Disconnected 10hp/7.5 kw exhaust blower and Heat Recovery wheel of around 0.5 kw.</td><td>8 kw/hr</td><td>ICU works 24 hrs per day — 192 kw/day</td><td>69,888/year — Rs 5,59,104</td></tr>' +
        '<tr><td>4</td><td>MS.OT - 4nos</td><td>100% Fresh air system converted into 70% Fresh air 30% Recirculated air system without effecting the standards. Disconnected 1hp/.75 kw exhaust blower and Heat Recovery wheel of around 0.25 kw.</td><td>1 kw/hr</td><td>OT is working around 12 hrs per day — 12 kw/day</td><td>4,368 kw/year — 34,944</td></tr>' +
        '<tr><td>5</td><td>VFDs for Cath lab AHU-30TR-12.5HP/10KW, CCU AHU-30TR-10HP/7.5KW, Labor room AHU-30TR-10HP/7.5KW, CTVS ICU-15HP/12.5KW, Neuro ICU-15HP/12.5KW</td><td>By introducing the VFDs in different location AHUs the efficiency improved in AHUs and an average and overall 0.5 kw has been saved.</td><td>3 kw/hr</td><td>An average working AHUs all together 15 Hrs/day — 45 kw/day</td><td>16,380 kw/year — 1,31,040</td></tr>' +
        '</tbody></table>'
      ] }
  ]
};

PAGES['gg-water'] = {
  title:'Water Treatment to Maximize Water Usage', crumb:'Go Green · Water Use Maximization', subnav:'gogreen',
  subtitle:'Hospital is one of the first in Bangalore city to have its own water treatment plant several years before it became mandatory.',
  sections:[
    { type:'intro', eyebrow:'Overview', title:'Every Drop Used Three Times', body:[
      'Hospital is one of the first in Bangalore city to have its own water treatment plant several years before it became mandatory. Fresh water is used for drinking, bathing and in wash basins. Then this water goes to sullage treatment plant and is recycled in sewage treatment plant for use in flushing tanks. Then this water is again recycled for use in the gardens.'
    ] },
    { type:'prose', eyebrow:'Sullage Treatment', title:'Recycling Gray Water', alt:true,
      image:W + '2022/12/Sullage-treatment.png', imageCaption:'Sullage treatment',
      body:[
        'Sullage treatment is a term used to describe treatment of wastewater that arises as a byproduct of daily human activities such as showering, washing dishes, and doing the laundry. It’s also commonly referred to as gray water. Much of this gray water can be recycled and reintroduced into the environment instead of just being disposed of. Environmental experts have claimed that reusing gray water will have a great beneficial impact on fresh water supply over time. It’s estimated that up to 80 percent of all household wastewater is sullage. Many see this as a waste of water that could potentially be reused. Ecological experts claim reusing wastewater is not only better for the environment, but will also be vital in solving the planet’s predicted water shortages. By reusing it, the population can lower the consumption of fresh water, replace vital nutrients in the soil, promote plant growth, and lower the amount of chemicals used in treatment plants.'
      ] },
    { type:'prose', eyebrow:'Sewage Treatment', title:'Preventing Water Pollution',
      image:W + '2022/12/Sewage-treatment.jpg', imageCaption:'Sewage treatment', reverse:true,
      body:[
        'Sewage treatment is a type of wastewater treatment which aims to remove contaminants from sewage to produce an effluent that is suitable for discharge to the surrounding environment or an intended reuse application, thereby preventing water pollution from raw sewage discharges.'
      ] }
  ]
};

PAGES['gg-waste'] = {
  title:'Dry Waste Management — Segregation is the Key to Success', crumb:'Go Green · Waste Management', subnav:'gogreen',
  subtitle:'Case Study — Dry Waste Segregation, Global Green and Healthy Hospitals, November 2022.',
  sections:[
    { type:'cards', eyebrow:'The Full Case Study', title:'Read the Published Article', cols:1, items:[
      { icon:'◆', title:'Case Study — Dry Waste Segregation — GGHH — Nov 22', desc:'The complete case study as published by Global Green and Healthy Hospitals.', link:{ label:'Open PDF', href:W + '2022/11/Case-Study-Dry-Waste-Segregation-GGHH-Nov-22.pdf' } }
    ] },
    { type:'intro', eyebrow:'Demographic Information', title:'Sri Sathya Sai Institute of Higher Medical Sciences, Bangalore, India',
      image:W + '2022/11/hospital-side-view.jpg', imageLabel:'Side View of the Hospital',
      body:[
        'Region: Bangalore, Karnataka. Country: India. Number of staff: 400. Number of beds: 333. Type of institution: Tertiary healthcare Institute (100% charitable).',
        'The Institute is a unit of the Medical Care Division of Sri Sathya Sai Central Trust, a public-charitable Trust set up in 1972. SSSIHMS, Bangalore was set up in January 2001, with the mission of providing high-quality medical care free of charge to all, irrespective of caste, creed, race or religion. The campus is spread over 52.23 acres and consists of the main hospital building, residential quarters, canteens, dormitories for volunteers, attendants etc.',
        'GGHH agenda goals: Waste.'
      ] },
    { type:'prose', eyebrow:'Case Study Summary', title:'Segregation at Source', alt:true,
      body:[
        'The case study highlights the efforts of SSSIHMS in solid waste management, and the importance of waste segregation at source, which helps in recycling resources through authorized recyclers.',
        '<strong>The issue.</strong> The Institute was faced with the challenge of disposing of packaging waste, especially single-use plastic wrappers and paper wrappers, which do not have any economic value. The dry, recyclable waste, sometimes mixed along with organic waste, was being disposed of in black covers as per local waste management norms through the municipality, on payment basis.',
        'Due to lack of awareness amongst the patients and attendants, waste was not being segregated at the outpatient department (OPD) and inpatient department (IPD) levels and there was not adequate infrastructure/awareness regarding the impact of mixing up of waste. This led to inadequate waste recovery and disposing of waste in landfills.',
        '<strong>Hospital goal.</strong> Reduce waste generation as much as possible and minimize unsegregated waste. Improve resource recovery from waste as applicable.'
      ] },
    { type:'prose', eyebrow:'Sustainability Strategy Implemented', title:'The Stepwise Implementation Process',
      body:[
        'Considering long-term sustainability, and rising costs of waste disposal, efforts were initiated by the Institute in 2021 to reduce waste generation, implement waste segregation at source and recycle/monetize the waste generated as much as possible. The relevant Solid Waste Management Rules also mandate bulk generators of waste to manage in-house the waste they generate.',
        '1. Visiting downstream recipients of the waste being generated, viz. pig farm for food waste, municipal contractor for mixed waste, biomedical and e-waste handlers to understand the waste handling process.',
        '2. Sensitization of key stakeholders and hospital staff to the challenges in waste management practices and highlight the need for process improvement through presentations.',
        '3. Constitution of Waste Management Committee, as a sub-committee of the Hospital Infection Committee, to oversee the waste handling, storage and disposal process.',
        '4. Setting up of bins for dry waste collection in wards & OPDs and consolidating their storage in the Central Stores.'
      ] },
    { type:'features', eyebrow:'Eight Categories', title:'Dry Waste Bins Set Up in the Central Location', alt:true, items:[
      'Paper & paper wrappers',
      'Cardboard',
      'Plastic wrappers (LDPE, single-use plastic etc.)',
      'Polystyrene',
      'Hard plastics (HDPE, PET etc.)',
      'Metals (mild steel, stainless steel, aluminum, brass, copper)',
      'Glass',
      'E-waste'
    ] },
    { type:'gallery', eyebrow:'The Programme in Practice', title:'Bins, Collection Centres and Transport', cols:2, items:[
      { src:W + '2022/11/Dustbin-segregation.jpg', caption:'Figure 2 Three-way segregation bin in public spaces' },
      { src:W + '2022/11/dry-waste-collection-centers.png', caption:'Figure 3 Dry waste collection centers' },
      { src:W + '2022/11/Plogging.jpg', caption:'Figure 4 Litter collection by campus kids' },
      { src:W + '2022/11/battery-operated-waste-transport-vehicle.jpg', caption:'Figure 5 Electric vehicle to transport general waste' }
    ] },
    { type:'prose', eyebrow:'Tracking Progress', title:'Weighed, Reported, Recycled',
      image:W + '2022/11/Dry-waste-generation.png', imageCaption:'Dry waste generation',
      body:[
        'The Institute entered MoUs with authorized recyclers for dry waste (handling multiple categories of dry waste) and e-waste. The dry waste recycler collects the waste once every month and the e-waste vendor collects the waste, as per need (min 500 kg).',
        'At the end of each month, the authorized recycler collects all the waste accumulated over the month, weighs it and transports it in their vehicle to the yard for further segregation/sale. The success was measured in terms of the weight of items picked up by the recycler in each category. The recycler provides the Institute with a periodic Environmental Impact Report, which is part of the Hospital’s annual newsletter.',
        '<strong>Progress achieved.</strong> Prior to entering an MoU with the authorized recyclers, the unsegregated wastes as well as recyclables were given to a vendor who charged a fee. The vendor would retrieve whatever they found valuable and send rest of the waste to landfill/incinerators. In the 24 months since signing MoUs with the authorized recyclers, 46.5 tons of dry, recyclable waste has been sent for recycling to various vendors. While there are economic benefits from the sale of scrap (approx. Rs. 9.5 lakh or USD 12,000 during Jan 21-Oct 22), the environmental benefits are perceived to be far greater.'
      ] },
    { type:'prose', eyebrow:'Challenges and Lessons Learned', title:'Behaviour Change Was the Major Challenge', alt:true,
      body:[
        'The exercise brought to the fore the enormity of the problem of waste management and the day-to-day challenges being faced by the downstream vendors. The visits to down-stream vendors helped develop empathy towards waste handlers and helped in formulating the “why” of improving waste management practices within campus.',
        'Behaviour change is the major challenge experienced during the journey. The leadership of the Institute including the Director and the Secretary-Infection Control Committee along with work put in by the housekeeping staff on the ground, contributed to the success so far. Getting people on board through awareness building about the need for waste segregation and proper disposal helped change the narrative around waste.',
        'There were significant contributions from volunteers, who participated in monthly litter collection activities on campus and other waste-handling initiatives, which played a vital role in the success of the project.'
      ] },
    { type:'prose', eyebrow:'Next Steps', title:'Where the Work Goes From Here',
      body:[
        '1. Study biomedical waste generation for possibilities of resource recovery, through proper segregation.',
        '2. Management of organic waste, including food and garden waste. A pilot aerobic composting unit has been set up to compost the food waste from the residential campus. A couple of leaf composters have also been set up to handle the leaf litter.',
        '3. Reduction of mixed, unsegregated waste in the residential campus of SSSIHMS, and the public and volunteer canteens.',
        '4. Ensuring future conferences and events are zero-waste events which do not generate any mixed waste.',
        'The concepts of circularity will continue to be explored to avoid waste of all types across the Institute. There is also an aspiration that this program will expand to other institutions, run by Sri Sathya Sai Central Trust, and serve as a model for other healthcare institutions.'
      ] },
    { type:'features', eyebrow:'Links', title:'Further Reading', items:[
      '<a href="https://www.sssbpt.info/ssspeaks/volume29/d960718.pdf" target="_blank" rel="noopener">Bhagawan’s discourse urging not to waste natural resources</a>',
      '<a href="https://sssihms.org/" target="_blank" rel="noopener">sssihms.org</a>',
      '<a href="https://recykal.com/" target="_blank" rel="noopener">recykal.com</a>',
      '<a href="https://ewasteindia.com/" target="_blank" rel="noopener">ewasteindia.com</a>',
      '<a href="https://www.globalwmcindia.com/" target="_blank" rel="noopener">globalwmcindia.com</a>'
    ] },
    { type:'quote', image:'assets/baba/baba-05.jpg', eyebrow:'Quotes',
      text:'The Universe is the "University" for Man. Man should treat nature with reverence.',
      attr:'Bhagawan Sri Sathya Sai Baba, Founder Trustee, Sri Sathya Sai Central Trust' },
    { type:'prose', eyebrow:'Quotes', title:'From the Institute', alt:true,
      body:[
        '“As followers of Bhagawan’s message and example, we are making efforts to reduce our waste generation and become an ideal healthcare institution, not just in the healthcare delivery but also in how we handle waste in the day-to-day running of the Institute.” — Dr. D.C. Sundaresh, Director, SSSIHMS-Whitefield.',
        '“Hospitals are places, where the ailing come to find succor. Through scientific waste management practices, we can ensure an infection-free stay for the patient, and successful outcomes.” — Dr. Renuka Neravi, Microbiologist and Secretary, Waste Management Committee.',
        '“Through this exercise I learnt that waste management skills showcases our discipline towards the environment and that we are indebted to other fellow beings around us to ‘Live and let Live’.” — S.K. Rangarajan, Technical Consultant, CSSD & Laundry & Member, Waste Management Committee.',
        '“Through this exercise, I learnt that taking responsibility for one’s waste is the key to developing good waste management practices.” — B. Satish Chandra, Sr. Manager-Central Stores & Member, Waste Management Committee.'
      ] }
  ]
};
})();
