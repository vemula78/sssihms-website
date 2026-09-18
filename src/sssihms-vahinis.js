// sssihms-vahinis.jsx — The Vahini Series reading library (files under vahinis/).
(function(){
const PAGES = window.PAGES;
const V = p => 'vahinis/' + encodeURIComponent(p) + '.dc.html';
const BOOKS = [
  ['Prema Vahini','Stream of Love','Short, urgent chapters on love as the ground of all spiritual practice — the first of the series, written for Sanathana Sarathi.'],
  ['Dharma Vahini','Stream of Righteousness','What righteousness is, how it is misunderstood, and how it is to be practised at every stage of life.'],
  ['Dhyana Vahini','Stream of Meditation','A manual of meditation: posture, breath, the light, and the mind’s slow taming.'],
  ['Jnana Vahini','Stream of Spiritual Wisdom','Forty-seven brief inquiries into the Atma, the mind’s obstacles, and the wisdom that ends them.'],
  ['Prasanthi Vahini','Stream of Supreme Peace','On peace that does not depend on circumstance — prayer, discrimination, silence, and the eightfold path.'],
  ['Prasnothara Vahini','Answers to Spiritual Questions','Questions put to Baba and answered directly, from the nature of the body to the disciplines of yoga.'],
  ['Sandeha Nivarini','Dissolving Doubts','A devotee’s doubts and Swami’s replies, in dialogue — the most conversational of the series.'],
  ['Sathya Sai Vahini','Stream of Divine Grace','Baba’s own survey of spiritual truth — the supreme reality, the scriptures, the Avatar as guru.'],
  ['Sutra Vahini','Stream of Aphorisms on Brahman','The Brahma Sutras taken one aphorism at a time, each rendered in plain speech.'],
  ['Upanishad Vahini','Stream of the Upanishads','The principal Upanishads expounded in turn — Isavasya, Katha, Kena, Mundaka and the rest.'],
  ['Vidya Vahini','Stream of Illuminating Knowledge','On education that illumines rather than merely informs, and on the teacher’s part in it.'],
  ['Leela Kaivalya Vahini','Stream of Divine Cosmic Play','The Vedas, the cosmic play, and the aspirant’s place in it — the briefest volume of the series.'],
  ['Bhagavatha Vahini','Stream of Divine Devotion','The Bhagavatha retold — Parikshith, Prahlada, Dhruva and the devotees whose lives are its argument.'],
  ['Ramakatha Rasavahini I','Stream of Sacred Sweetness','The Ramayana as Baba tells it: Rama’s birth, Sita’s winning, the exile and the years in the forest.'],
  ['Ramakatha Rasavahini II','Stream of Sacred Sweetness','The second half of the Rama story — Lanka, the war, the return, and the reign.']
];

PAGES['vahinis'] = {
  title:'The Vahini Series', crumb:'Bhagawan · The Vahini Series',
  subtitle:'Fifteen volumes written by Bhagawan Sri Sathya Sai Baba — complete texts, with a glossary and a reading place kept for each.',
  sections:[
    { type:'intro', eyebrow:'The Vahinis', title:'Fifteen Streams',
      body:[
        'The Vahinis were written by Bhagawan Sri Sathya Sai Baba for <em>Sanathana Sarathi</em> and gathered afterwards into volumes. Each is a stream: love, righteousness, meditation, wisdom, peace — and, in the two Ramakatha volumes and the Bhagavatha, the old stories told again as instruction rather than legend.',
        'Every volume carries the complete text and its own glossary, and the reading library keeps your place between visits. Search across all fifteen volumes from the library, or open a single volume below.'
      ],
      link:{ label:'Open the Reading Library', href:'vahinis/Library.dc.html' } },
    { type:'cards', eyebrow:'The Volumes', title:'Open a Volume', cols:3, alt:true,
      items:BOOKS.map(([t, sub, desc]) => ({ icon:'◆', title:t, desc:'<em>' + sub + '</em> — ' + desc, link:{ label:'Read', href:V(t) } })) },
    { type:'cta', eyebrow:'Reading Library', title:'Search All Fifteen Volumes',
      body:'The library opens the complete Vahini series in one place — search 376 chapters by title, move between volumes, and return to where you left off.',
      action:{ label:'Open the Library', href:'vahinis/Library.dc.html' } }
  ]
};
})();
