// sssihms-extra-pages.jsx — Poetry pages (Claude-designed Divi imports) and
// Go Green sub-pages. Mutates window.PAGES / window.DEPT_SUBNAV.
(function(){
const PAGES = window.PAGES;

// ── SONGS & POEMS (designed pages, rendered full-bleed in-page) ─────────────
PAGES['divine-poetry'] = {
  title:'Divine Poetry', crumb:'Bhagawan · Songs & Poems · Divine Poetry',
  subtitle:'Poems written in devotion and remembrance of Bhagawan.',
  bareBanner:true,
  sections:[ { type:'framepage', slug:'divine-poetry', src:'poetry-pages/divine-poetry.html', bg:'#FCF9F4' } ]
};
PAGES['songs-baba'] = {
  title:'Sri Sathya Sai Compositions', crumb:'Bhagawan · Songs & Poems · Compositions',
  subtitle:'Devotional songs and compositions dedicated to Bhagawan.',
  bareBanner:true,
  sections:[ { type:'framepage', slug:'sai-compositions', src:'poetry-pages/sai-compositions.html', bg:'#FCF9F4' } ]
};
PAGES['sai_padhyam'] = {
  title:'Sri Sathya Sai Padya Sudha', crumb:'Bhagawan · Songs & Poems · Padya Sudha',
  subtitle:'Devotional poems (padyams) in Telugu.',
  bareBanner:true,
  sections:[ { type:'framepage', slug:'padya-sudha', src:'poetry-pages/padya-sudha.html', bg:'#FCF9F4' } ]
};

// ── GO GREEN SUB-PAGES ───────────────────────────────────────────────────────
window.DEPT_SUBNAV.gogreen = [
  ['Overview','gogreen'], ['Solar Power','gg-solar'], ['Rain Water Harvesting','gg-rainwater'],
  ['Water Use Maximization','gg-water'], ['Trees on Campus','gg-trees'], ['Power Conservation','gg-power'],
  ['Waste Management','gg-waste'], ['Biomedical Waste','gg-biomedical']
];
if (PAGES.gogreen) PAGES.gogreen.subnav = 'gogreen';

PAGES['gg-solar'] = {
  title:'Solar Power Plant', crumb:'Go Green · Solar Power', subnav:'gogreen',
  subtitle:'Harvesting the sun to power free healthcare.',
  sections:[
    { type:'intro', eyebrow:'Renewable Energy', title:'First Hospital With Its Own Solar Plant', narrow:true,
      body:[
        'SSSIHMS was the first hospital in the country to commission its own 100 KVA solar power plant on campus, and an additional 180 KVA of capacity is planned.',
        'Every unit of clean power generated reduces the cost of running the hospital — and every rupee saved flows back into free patient care.'
      ] },
    { type:'stats', eyebrow:'Capacity', title:'Solar at SSSIHMS', alt:true, items:[
      { v:'100 KVA', l:'Installed Solar Capacity' },
      { v:'180 KVA', l:'Additional Capacity Planned' },
      { v:'1st', l:'Hospital in India With Its Own Plant' }
    ] }
  ]
};
PAGES['gg-rainwater'] = {
  title:'Rain Water Harvesting', crumb:'Go Green · Rain Water Harvesting', subnav:'gogreen',
  subtitle:'Capturing every drop that falls on campus.',
  sections:[
    { type:'intro', eyebrow:'Water Stewardship', title:'Harvesting the Rains', narrow:true,
      body:[
        'Rain water falling across the hospital campus is harvested and channelled to recharge groundwater and supplement the campus water supply — part of the Institute\'s comprehensive approach to water stewardship, alongside its own treatment and recycling plants.'
      ], link:{ label:'Water Use Maximization', page:'gg-water' } }
  ]
};
PAGES['gg-water'] = {
  title:'Water Use Maximization', crumb:'Go Green · Water Use', subnav:'gogreen',
  subtitle:'One of the first hospitals in Bangalore with its own water treatment plant.',
  sections:[
    { type:'intro', eyebrow:'Recycle & Reuse', title:'Every Drop Used Twice', narrow:true,
      body:[
        'The hospital operates its own water treatment plant — one of the first in Bangalore — and recycles water in a cascade: treated sullage and sewage water is reused for toilet flushing and then for the campus gardens.',
        'This closed loop sharply reduces the hospital\'s draw on the city\'s water supply while keeping the green campus thriving.'
      ] }
  ]
};
PAGES['gg-trees'] = {
  title:'Trees on Campus', crumb:'Go Green · Trees', subnav:'gogreen',
  subtitle:'A green canopy over a place of healing.',
  sections:[
    { type:'intro', eyebrow:'Green Campus', title:'108 Trees Given a Second Life', narrow:true,
      body:[
        'When Metro construction works threatened mature trees, 108 of them were carefully transplanted onto the hospital campus rather than felled — a living expression of the reverence for life that guides the Institute.',
        'The tree-lined campus offers patients and families shade, calm and clean air as part of the healing environment.'
      ] }
  ]
};
PAGES['gg-power'] = {
  title:'Power Conservation', crumb:'Go Green · Power Conservation', subnav:'gogreen',
  subtitle:'Doing more healing with less energy.',
  sections:[
    { type:'features', eyebrow:'Efficiency', title:'Conservation Measures', items:[
      'Air-conditioning optimisation across the hospital complex',
      'Campus-wide transition to LED lighting',
      'Solar generation offsetting grid consumption',
      'Continuous monitoring of energy use'
    ] }
  ]
};
PAGES['gg-waste'] = {
  title:'Waste Management', crumb:'Go Green · Waste Management', subnav:'gogreen',
  subtitle:'Recognised as a national Changemaker in solid waste management.',
  sections:[
    { type:'intro', eyebrow:'Swachh Bharat Mission', title:'A Changemaker in Waste Management', narrow:true,
      body:[
        'All waste generated on campus is segregated at source and recycled wherever possible. In December 2024, SSSIHMS Whitefield was recognised as a Changemaker for its sustainable solid waste management practices under Swachh Bharat Mission (SBM) 2.0 by the Centre for Science and Environment (CSE), New Delhi.',
        'The recognition followed the Institute deputing staff to CSE\'s Anil Agrawal Environment Training Institute for training in sustainable solid-waste practices; a case study on SSSIHMS Whitefield features in the CSE report released at the Changemakers\' Conclave in New Delhi.'
      ] }
  ]
};
PAGES['gg-biomedical'] = {
  title:'Biomedical Waste Report', crumb:'Go Green · Biomedical Waste Report', subnav:'gogreen',
  sections:[
    { type:'covers', eyebrow:'Reports', title:'Biomedical Waste Report', sub:'Select a report to open the PDF.', items:[
      { label:'Sep 2025 Bio-Waste',
        src:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2025/10/Sep-2025-Bio-Waste_Image-232x300.jpg',
        href:'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2025/10/Sep-2025-Bio-Waste.pdf' }
    ] }
  ]
};

})();
