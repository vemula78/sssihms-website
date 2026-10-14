(function () {
  var root = document.querySelector('.sssihms-proc');
  var dock = document.getElementById('dock');
  var frame = document.getElementById('dock-if');
  var dockTitle = document.getElementById('dock-title');
  var titles = {};
  root.querySelectorAll('.vcard').forEach(function (c) { titles[c.dataset.v] = c.dataset.title; });

  root.addEventListener('click', function (e) {
    var a = e.target.closest('[data-v]');
    if (!a) return;
    e.preventDefault();
    var t = parseInt(a.dataset.t || '0', 10);
    frame.src = 'https://www.youtube-nocookie.com/embed/' + a.dataset.v +
      '?autoplay=1&rel=0&start=' + t;
    dockTitle.textContent = titles[a.dataset.v] || 'Video';
    document.getElementById('dock-yt').href = 'https://www.youtube.com/watch?v=' + a.dataset.v + '&t=' + t + 's';
    dock.hidden = false;
  });
  document.getElementById('dock-close').addEventListener('click', function () {
    frame.src = 'about:blank';
    dock.hidden = true;
  });

  root.querySelectorAll('.toggle').forEach(function (tg) {
    var disc = tg.nextElementSibling;
    tg.addEventListener('click', function (e) {
      var b = e.target.closest('.tg');
      if (!b) return;
      tg.querySelectorAll('.tg').forEach(function (x) { x.classList.toggle('on', x === b); });
      disc.classList.toggle('en-only', b.dataset.mode === 'en');
    });
  });
})();
