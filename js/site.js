// SSSIHMS Whitefield — progressive enhancement (mobile menu toggle,
// embedded-page auto-resize)
(function () {
  var burger = document.querySelector('.nav-hamburger');
  var menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Stats dashboards and poetry pages are embedded via <iframe> and post their
// own content height so the frame can grow to fit without internal scrollbars.
window.addEventListener('message', function (e) {
  var d = e.data;
  if (!d || d.type !== 'ssdash-height' || !(d.h > 200)) return;
  var frame = document.querySelector('iframe[data-slug="' + d.slug + '"]');
  if (frame) frame.style.height = d.h + 'px';
});
