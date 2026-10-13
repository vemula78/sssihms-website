// Click-to-play: swap thumbnail for the YouTube player only when asked (keeps the page light).
document.addEventListener('click', e => {
  const b = e.target.closest('.yt'); if (!b) return;
  const f = document.createElement('iframe');
  const s = +b.dataset.start || 0;
  f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0${s ? '&start=' + s : ''}`;
  f.title = b.getAttribute('aria-label');
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  f.allowFullscreen = true;
  b.replaceWith(f);
});
// Search across titles and speakers.
const q = document.getElementById('q'), talks = [...document.querySelectorAll('.talk')], count = document.getElementById('count');
q.addEventListener('input', () => {
  const t = q.value.trim().toLowerCase(); let n = 0;
  talks.forEach(a => { const hit = !t || a.dataset.search.includes(t); a.classList.toggle('hidden', !hit); n += hit; });
  count.textContent = t ? `${n} of ${talks.length}` : '';
});
// Print the full proceedings with transcripts expanded.
addEventListener('beforeprint', () => document.querySelectorAll('details').forEach(d => d.open = true));
