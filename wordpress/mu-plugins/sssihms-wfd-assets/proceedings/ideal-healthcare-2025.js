// Click-to-play: swap thumbnail for the YouTube player only when asked (keeps the page light).
document.addEventListener('click', e => {
  const b = e.target.closest('.yt'); if (!b) return;
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0`;
  f.title = b.getAttribute('aria-label');
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  f.allowFullscreen = true;
  b.replaceWith(f);
});
// Search across titles, speakers and transcript text.
const q = document.getElementById('q'), talks = [...document.querySelectorAll('.talk')], count = document.getElementById('count');
const text = talks.map(a => a.textContent.toLowerCase());
q.addEventListener('input', () => {
  const t = q.value.trim().toLowerCase(); let n = 0;
  talks.forEach((a, i) => { const hit = !t || text[i].includes(t); a.classList.toggle('hidden', !hit); n += hit; });
  count.textContent = t ? `${n} of ${talks.length}` : '';
});
// Expand / collapse every transcript.
const all = document.getElementById('all'), ds = [...document.querySelectorAll('details.transcript')];
all.addEventListener('click', () => {
  const open = !ds.every(d => d.open);
  ds.forEach(d => d.open = open);
  all.textContent = open ? 'Collapse all transcripts' : 'Expand all transcripts';
});
// Print the full proceedings with transcripts expanded.
addEventListener('beforeprint', () => ds.forEach(d => d.open = true));
