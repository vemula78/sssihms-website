// sssihms-render.jsx — Data-driven inner-page renderer for SSSIHMS Website
// Reads window.PAGES (defined in sssihms-data.jsx) and renders any page by key.
// Exports to window: ContentPage

// ── Department sub-navigation (tabs under banner) ──────────────────────────
function DeptSubNav({ dept, current, navigate }) {
  const items = (window.DEPT_SUBNAV || {})[dept];
  if (!items) return null;
  return (
    <div className="subnav">
      <div className="wrap subnav-inner">
        {items.map(([label, key]) => (
          <button key={key} className={`subnav-link${key === current ? ' active' : ''}`} onClick={() => navigate(key)}>{label}</button>
        ))}
      </div>
    </div>
  );
}

// ── Shared banner ──────────────────────────────────────────────────────────
function PageBanner({ title, subtitle, crumb, icon }) {
  return (
    <section className="page-banner">
      <div className="wrap">
        {crumb && (
          <div className="breadcrumb">
            <span>Home</span>
            <span style={{opacity:.5, margin:'0 6px'}}>›</span>
            <span style={{color:'var(--primary)'}}>{crumb}</span>
          </div>
        )}
        <div style={{display:'flex', alignItems:'center', gap:18}}>
          {icon && (
            <div className="banner-icon">
              <img src={icon} alt="" onError={e => { e.target.parentElement.style.display='none'; }} />
            </div>
          )}
          <h1 dangerouslySetInnerHTML={{__html:title}}></h1>
        </div>
        {subtitle && <p style={{marginTop:12, opacity:.8, fontSize:16, maxWidth:640, lineHeight:1.7}}>{subtitle}</p>}
      </div>
    </section>
  );
}

// ── Section building blocks ──────────────────────────────────────────────────
function SectionHead({ eyebrow, title, sub, center }) {
  if (!eyebrow && !title && !sub) return null;
  return (
    <div style={center ? {textAlign:'center', marginBottom:40, maxWidth:680, marginLeft:'auto', marginRight:'auto'} : {marginBottom:34}}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h2 className="section-title">{title}</h2>}
      {sub && <p className="section-sub" style={center ? {margin:'0 auto'} : {}}>{sub}</p>}
    </div>
  );
}

function LinkBtn({ link, navigate, variant }) {
  if (!link) return null;
  const cls = `btn ${variant || 'btn-outline'}`;
  if (link.href) return <a href={link.href} target="_blank" className={cls} style={{marginTop:8, display:'inline-flex'}}>{link.label} →</a>;
  return <button className={cls} style={{marginTop:8}} onClick={() => navigate(link.page)}>{link.label} →</button>;
}

function Intro({ s, navigate }) {
  const text = (
    <div>
      {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
      {s.title && <h2 className="section-title">{s.title}</h2>}
      {(s.body || []).map((p, i) => <p key={i} className="prose-p">{p}</p>)}
      {s.pill && <span className="free-pill" style={{marginTop:6, display:'inline-block'}}>✦ {s.pill}</span>}
      {s.link && <div><LinkBtn link={s.link} navigate={navigate} /></div>}
    </div>
  );
  const media = s.image ? (
    <div className="intro-media">
      <img src={s.image} alt={s.title || ''} onError={e => { e.target.parentElement.classList.add('media-fallback'); e.target.style.display='none'; if(s.imageLabel) e.target.parentElement.setAttribute('data-label', s.imageLabel); }} />
    </div>
  ) : s.imageLabel ? (
    <div className="intro-media media-fallback" data-label={s.imageLabel}></div>
  ) : null;
  return (
    <section className={`section${s.alt ? ' section-alt' : ''}`}>
      <div className="wrap">
        {media ? (
          <div className="intro-grid" style={s.reverse ? {direction:'rtl'} : {}}>
            <div style={s.reverse ? {direction:'ltr'} : {}}>{text}</div>
            <div style={s.reverse ? {direction:'ltr'} : {}}>{media}</div>
          </div>
        ) : (
          <div style={{maxWidth: s.narrow ? 760 : 'none', margin: s.narrow ? '0 auto' : '0'}}>{text}</div>
        )}
      </div>
    </section>
  );
}

function Cards({ s, navigate }) {
  const cols = s.cols || 3;
  return (
    <section className={`section${s.alt ? ' section-alt' : ''}`}>
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} center={s.center} />
        <div className="auto-grid" style={{'--cols':cols}}>
          {s.items.map((c, i) => (
            <div key={i} className="info-card">
              {c.icon && <div className="info-card-icon">{c.icon}</div>}
              <div className="info-card-head">
                <h3>{c.title}</h3>
                {c.badge && <span className="free-pill-sm">{c.badge}</span>}
              </div>
              {c.desc && <p>{c.desc}</p>}
              {c.link && <LinkBtn link={c.link} navigate={navigate} variant="btn-outline" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features({ s }) {
  return (
    <section className={`section${s.alt ? ' section-alt' : ''}`}>
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} center={s.center} />
        <div className="feature-grid">
          {s.items.map((f, i) => (
            <div key={i} className="feature-item">
              <span className="feature-tick">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ s }) {
  return (
    <section className={`section${s.alt ? ' section-alt' : ''}`}>
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} center />
        <div className="stats-grid">
          {s.items.map((st, i) => (
            <div key={i} className="stat-card" style={{animationDelay:`${i*0.06}s`}}>
              <div className="stat-val">{st.v}</div>
              <div className="stat-lbl">{st.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote({ s }) {
  return (
    <section className="section section-dark">
      <div className="wrap" style={{maxWidth:780, margin:'0 auto', textAlign:'center'}}>
        {s.eyebrow && <span className="eyebrow" style={{color:'var(--primary)'}}>{s.eyebrow}</span>}
        <span className="quote-mark" style={{display:'block'}}>"</span>
        <p className="quote-text">{s.text}</p>
        <div className="quote-attr">— {s.attr}</div>
      </div>
    </section>
  );
}

function Split({ s, navigate }) {
  return (
    <section className={`section${s.alt ? ' section-alt' : ''}`}>
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
        <div className="split-grid">
          {s.cols.map((c, i) => (
            <div key={i}>
              {c.eyebrow && <span className="eyebrow">{c.eyebrow}</span>}
              {c.title && <h3 className="split-title">{c.title}</h3>}
              {(c.body || []).map((p, j) => <p key={j} className="prose-p">{p}</p>)}
              {c.link && <LinkBtn link={c.link} navigate={navigate} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ s }) {
  return (
    <section className={`section${s.alt ? ' section-alt' : ''}`}>
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} center />
        <div className="auto-grid" style={{'--cols':s.cols || 3}}>
          {s.items.map((t, i) => (
            <div key={i} className="testimonial-card">
              <span className="t-quote">"</span>
              <p className="t-text">{t.quote}</p>
              <div className="t-attr">
                <strong>{t.name}</strong>
                {t.place && <span>{t.place}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faculty({ s }) {
  return (
    <section className={`section${s.alt ? ' section-alt' : ''}`}>
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
        <div className="auto-grid" style={{'--cols':s.cols || 4}}>
          {s.items.map((f, i) => (
            <div key={i} className="faculty-card">
              <div className="faculty-avatar">{f.name.split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('')}</div>
              <div>
                <div className="faculty-name">{f.name}</div>
                <div className="faculty-role">{f.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ s, navigate }) {
  return (
    <section className="admit-section">
      <div className="wrap admit-inner">
        <div>
          {s.pill && <span className="free-pill" style={{marginBottom:14, display:'inline-block'}}>{s.pill}</span>}
          <h2>{s.title}</h2>
          {s.body && <p style={{marginTop:10}} dangerouslySetInnerHTML={{__html:s.body}}></p>}
        </div>
        <div className="admit-cta">
          {s.action.href
            ? <a href={s.action.href} target="_blank" className="btn btn-white">{s.action.label} →</a>
            : <button className="btn btn-white" onClick={() => navigate(s.action.page)}>{s.action.label} →</button>}
        </div>
      </div>
    </section>
  );
}

function StatsDash({ s, navigate }) {
  const [h, setH] = React.useState(1200);
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.type === 'ssdash-height' && d.slug === s.slug && d.h > 200) setH(d.h);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [s.slug]);
  const dashes = window.STATS_DASHBOARDS || [];
  return (
    <section className="section" style={{paddingTop:36}}>
      <div className="wrap">
        <div className="dash-switch">
          {dashes.map(d => (
            <button key={d.slug} className={`dash-pill${d.slug === s.slug ? ' active' : ''}`} onClick={() => navigate(d.slug)}>{d.label}</button>
          ))}
        </div>
        <div className="dash-frame">
          <iframe src={`stats-pages/${s.slug}.html`} title="Statistics dashboard" style={{width:'100%', height:h, border:'none', display:'block'}}></iframe>
        </div>
      </div>
    </section>
  );
}

function FramePage({ s }) {
  const [h, setH] = React.useState(900);
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.type === 'ssdash-height' && d.slug === s.slug && d.h > 200) setH(d.h);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [s.slug]);
  return (
    <div style={{background: s.bg || '#fff'}}>
      <iframe src={s.src} title={s.slug} style={{width:'100%', height:h, border:'none', display:'block'}}></iframe>
    </div>
  );
}

function Banner({ s }) {
  return <div className="full-banner"><img src={s.src} alt="" onError={e => { e.target.parentElement.style.display='none'; }} /></div>;
}

function Section({ s, navigate }) {
  switch (s.type) {
    case 'intro':        return <Intro s={s} navigate={navigate} />;
    case 'cards':        return <Cards s={s} navigate={navigate} />;
    case 'features':     return <Features s={s} />;
    case 'stats':        return <Stats s={s} />;
    case 'quote':        return <Quote s={s} />;
    case 'split':        return <Split s={s} navigate={navigate} />;
    case 'testimonials': return <Testimonials s={s} />;
    case 'faculty':      return <Faculty s={s} />;
    case 'cta':          return <CTA s={s} navigate={navigate} />;
    case 'banner':       return <Banner s={s} />;
    case 'statsdash':    return <StatsDash key={s.slug} s={s} navigate={navigate} />;
    case 'framepage':    return <FramePage key={s.slug} s={s} />;
    default:             return null;
  }
}

function ContentPage({ pageKey, navigate }) {
  const PAGES = window.PAGES || {};
  const data = PAGES[pageKey];
  if (!data) {
    return (
      <div>
        <PageBanner title="Page" crumb="SSSIHMS" />
        <section className="section"><div className="wrap"><p className="prose-p">Content coming soon.</p></div></section>
      </div>
    );
  }
  return (
    <div>
      <PageBanner title={data.title} subtitle={data.subtitle} crumb={data.crumb} icon={data.icon} />
      {data.subnav && <DeptSubNav dept={data.subnav} current={pageKey} navigate={navigate} />}
      {(data.sections || []).map((s, i) => <Section key={i} s={s} navigate={navigate} />)}
    </div>
  );
}

Object.assign(window, { ContentPage });
