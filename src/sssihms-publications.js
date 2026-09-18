// sssihms-publications.jsx — Manohriday (hospital journal) and AntharDhwani (Counselling newsletter).
// Sources: /about-hospital/manohriday/ and /counseling/anthardhwani/
(function(){
const PAGES = window.PAGES;
const SUBNAV = window.DEPT_SUBNAV || {};
const W = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/';
const CDN = 'https://cdn.sssihms.org/sssihms/wp-content/uploads/';

SUBNAV.counseling = [['Counselling','counseling'], ['AntharDhwani','anthardhwani']];
window.DEPT_SUBNAV = SUBNAV;

PAGES['manohriday'] = {
  title:'Manohriday', crumb:'About Hospital · Manohriday-Newsletter',
  subtitle:'Manohriday is the Journal of Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Bangalore.',
  sections:[
    { type:'covers', eyebrow:'Annual Issues', title:'Read Manohriday', sub:'Select a cover to open the issue.', items:[
      { label:'Manohriday Silver Jubilee Commemorative Issue', src:W + '2026/01/2026-01-19-Manohriday-Front-Cover--212x300.jpg', href:W + '2026/01/2026-01-19-Manohriday-Commemorative-Edition.pdf' },
      { label:'Manohriday 2026', src:W + '2026/05/MH2026_Cover-217x300.jpg', href:W + '2026/05/manohriday_Jan26_lowres.pdf' },
      { label:'Manohriday 2025', src:W + '2025/01/manohriday_Jan25_lowres-1-212x300.png', href:W + '2025/01/manohriday_Jan25_lowres.pdf' },
      { label:'Manohriday 2024', src:W + '2024/01/Manohriday-2024-front-213x300.png', href:W + '2024/01/manohriday_Jan24_lowres_240121_202602.pdf' },
      { label:'Manohriday 2023', src:W + '2023/01/Mano-Hriday-2023-1-212x300.jpg', href:W + '2023/01/Mano-Hriday-2023.pdf' },
      { label:'Manohriday 2022', src:W + '2024/01/Manohriday-2022-212x300.jpg', href:W + '2024/01/jan_2022.pdf' },
      { label:'Manohriday 2021', src:CDN + '2021/02/Manohriday-Sai-2021-211x300.jpg', href:CDN + '2021/02/manohriday_Jan21-1.pdf' },
      { label:'Manohriday 2020', src:'', href:W + '2020/01/manohriday_Jan2020-1.pdf' },
      { label:'Manohriday 2019', src:CDN + '2019/01/manohriday_Jan19-pg-1-212x300.jpg', href:CDN + '2019/01/manohriday_Jan19.pdf' },
      { label:'Manohriday 2018', src:CDN + '2015/05/Manohruday-cover-2018-219x300.png', href:CDN + '2015/05/Manohruday-cover-2018.png' },
      { label:'Manohriday 2017', src:CDN + '2015/05/manohriday-2017-cover-page-220x300.png', href:CDN + '2015/05/manohriday-2017-cover-page.png' },
      { label:'Manohriday 2016', src:CDN + '2018/01/manohriday-2016-219x300.png', href:CDN + '2018/01/manohriday-2016.png' },
      { label:'Manohriday 2015', src:W + '2015/06/Manohriday-Jan-20151-212x300.jpg', href:CDN + '2015/06/Manohriday-Jan-20151.jpg' }
    ] },
    { type:'covers', eyebrow:'Quarterly Issues', title:'Earlier Quarterly Issues', alt:true, items:[
      { label:'Manohriday Jul-Sep 2013', src:W + '2015/06/Manohriday-July-Sep-2013-211x300.jpg', href:CDN + '2015/06/Manohriday-July-Sep-2013.jpg' },
      { label:'Manohriday Apr-Jun 2013', src:W + '2015/06/manohriday-April-June_13-213x300.jpg', href:CDN + '2015/06/manohriday-April-June_13.jpg' },
      { label:'Manohriday Jan-Mar 2013', src:W + '2015/05/manohriday-jan-mar_13-page-001-212x300.jpg', href:CDN + '2015/05/manohriday-jan-mar_13-page-001.jpg' },
      { label:'Manohriday Oct-Dec 2012', src:W + '2015/05/mano_hriday_Oct-Dec_12-page-001-212x300.jpg', href:CDN + '2015/05/mano_hriday_Oct-Dec_12-page-001.jpg' }
    ] }
  ]
};

PAGES['anthardhwani'] = {
  title:'AntharDhwani', crumb:'Departments · Services · Counselling · AntharDhwani', subnav:'counseling',
  subtitle:'AntharDhwani — Newsletter of the Counselling Department.',
  sections:[
    { type:'covers', eyebrow:'All Volumes', title:'Read AntharDhwani', sub:'Select a cover to open the issue.', items:[
      { label:'AntharDhwani XV – Jan 2026', src:W + '2026/03/AD-XV-low-res-222x300.jpg', href:W + '2026/03/AD-XV15-Low-Res-version-for-website.pdf' },
      { label:'AntharDhwani XIV – July 2025', src:W + '2026/03/AD-XIV-low-res-222x300.jpg', href:W + '2026/03/AD-XIV-low-res.pdf' },
      { label:'AntharDhwani XIII – Jan 2025', src:W + '2025/01/AD-XIII-low-res-1-222x300.png', href:W + '2025/01/AD-XIII-low-res.pdf' },
      { label:'AntharDhwani XII – July 2024', src:W + '2024/07/Anthar-Dhwani-XII-low-res-1-222x300.jpg', href:W + '2024/07/Anthar-Dhwani-XII-low-res.pdf' },
      { label:'AntharDhwani XI – Jan 2024', src:W + '2024/01/AntharDhwani-vol-XI-221x300.png', href:W + '2024/01/Anthar-Dhwani-XI-audio.pdf' },
      { label:'AntharDhwani X – Jul 2023', src:W + '2023/07/Anthar-Dhwani-X--222x300.jpg', href:W + '2023/07/Anthar-Dhwani-X-Digital-File-with-Links.pdf' },
      { label:'AntharDhwani IX – Jan 2023', src:W + '2023/01/Anthar-Dhwani-IX-low-res-1-222x300.jpg', href:W + '2023/01/Anthar-Dhwani-IX-low-res.pdf' },
      { label:'AntharDhwani VIII – Jul 2022', src:W + '2022/07/Anthar-Dhwani-VIII_low-res-1-222x300.jpg', href:W + '2022/07/Anthar-Dhwani-VIII_low-res.pdf' },
      { label:'AntharDhwani VII – Jan 2022', src:W + '2022/02/Anthar-Dhwani-VII-low-res-1-222x300.jpg', href:W + '2022/02/Anthar-Dhwani-VII-low-res.pdf' },
      { label:'AntharDhwani VI – Jul 2021', src:W + '2021/10/Anthar-Dhwani-VI-223x300.jpg', href:W + '2021/10/Anthar-Dhwani-VI_low-res.pdf' },
      { label:'AntharDhwani V – Jan 2021', src:W + '2021/02/AntharDhwani-Vol-V-230x300.jpg', href:W + '2021/01/Final_Anthar-Dhwani-V_Hope_-LowRes.pdf' },
      { label:'AntharDhwani IV – Jul 2020', src:W + '2020/07/Anthar-Dhwani-IV-cover-page-221x300.jpg', href:W + '2020/07/Anthar-Dhwani-IV-pages-low-res.pdf' },
      { label:'AntharDhwani III – Jan 2020', src:W + '2020/01/Anthardhwani-2020-221x300.jpg', href:W + '2020/01/Anthar-Dhwani-III_1-28_final_low-res.pdf' },
      { label:'AntharDhwani II – Jul 2019', src:W + '2020/01/Anthardhwani-2020-221x300.jpg', href:W + '2019/07/Website-Anthar-Dhwani-II_1-32-low-res.pdf' },
      { label:'AntharDhwani I – Jan 2019', src:'', href:W + '2019/01/AntharDwani-Jan2019_low-res-pdf.pdf' }
    ] }
  ]
};
})();
