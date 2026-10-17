(function () {
  var dlg = document.getElementById('lb');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var set = [], pos = 0;
  function show(i) {
    pos = (i + set.length) % set.length;
    var a = set[pos];
    img.src = a.getAttribute('href');
    img.alt = a.querySelector('img').alt;
    var sec = a.closest('section');
    var h = sec ? sec.querySelector('h2') : null;
    cap.textContent = [a.dataset.cap, h ? h.textContent : '', 'e-book page ' + a.dataset.page,
      (pos + 1) + ' of ' + set.length].filter(Boolean).join(' · ');
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-lb]');
    if (!a) return;
    e.preventDefault();
    var scope = a.closest('section') || document;
    set = Array.prototype.slice.call(scope.querySelectorAll('a[data-lb]'));
    show(set.indexOf(a));
    if (dlg.showModal) dlg.showModal(); else window.open(a.href);
  });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(pos - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { show(pos + 1); });
  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
  dlg.addEventListener('close', function () { img.removeAttribute('src'); });
  document.addEventListener('keydown', function (e) {
    if (!dlg.open) return;
    if (e.key === 'ArrowLeft') show(pos - 1);
    if (e.key === 'ArrowRight') show(pos + 1);
  });
})();
