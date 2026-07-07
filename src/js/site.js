// SSSIHMS Whitefield — progressive enhancement (mobile menu toggle)
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
