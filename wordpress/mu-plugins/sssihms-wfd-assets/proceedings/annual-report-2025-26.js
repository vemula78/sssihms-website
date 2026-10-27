(function(){
  var figs=[].slice.call(document.querySelectorAll('figure.ph')), lb=document.getElementById('lb'),
      im=lb.querySelector('img'), cap=lb.querySelector('.cap'), i=0;
  function show(k){i=(k+figs.length)%figs.length;var f=figs[i],img=f.querySelector('img');
    im.src=img.src;im.alt=img.alt;cap.innerHTML=(f.querySelector('figcaption')||{}).innerHTML||'';lb.classList.add('open');}
  figs.forEach(function(f,k){f.tabIndex=0;f.addEventListener('click',function(){show(k)});
    f.addEventListener('keydown',function(e){if(e.key==='Enter')show(k)});});
  lb.querySelector('.x').onclick=function(){lb.classList.remove('open')};
  lb.querySelector('.p').onclick=function(e){e.stopPropagation();show(i-1)};
  lb.querySelector('.nx').onclick=function(e){e.stopPropagation();show(i+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('open')});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1);});
  // highlight current section in the nav
  var links=[].slice.call(document.querySelectorAll('.toc a')),strip=document.querySelector('.toc .wrap'),cur=null;
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting||e.target.id===cur)return;
      cur=e.target.id;var on=null;
      links.forEach(function(a){var m=a.getAttribute('href')==='#'+cur;a.classList.toggle('on',m);if(m)on=a});
      // scroll only the nav strip sideways; scrollIntoView would also move the page and fight the user's scroll
      if(on){var r=on.getBoundingClientRect(),s=strip.getBoundingClientRect();
        if(r.left<s.left||r.right>s.right)strip.scrollLeft+=r.left-s.left-(s.width-r.width)/2;}})},{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('main section').forEach(function(s){io.observe(s)});
  }
})();
