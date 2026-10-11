#!/usr/bin/env python3
"""sssihms.org (multisite blog 1, homepage page 31) rebuilt in the Prasanthigram web brand.

The portal's own copy is carried over from the live page as of 11-Oct-2026. Four
spelling corrections are the only edits to it (TYPOS below); everything else is
asserted verbatim in the output. Photographs are the hospital's own, already
published on the two campus sites.

    python3 portal/build.py   ->  portal/out/preview.html   (open in a browser)
                                  portal/out/page-31.divi.txt (post_content for page 31)
"""
import html
import re
from pathlib import Path

OUT = Path(__file__).parent / 'out'

# sssihms.org's own lockup (no campus name). Grey wordmark drawn for a white ground,
# so this masthead is white rather than the Prasanthigram navy.
LOGO = 'https://sssihms.org/wp-content/uploads/2021/04/Logo_new.png'
PHOTO_PG = 'https://prasanthigram.sssihms.org/wp-content/uploads/sites/5/2021/05/hospitalpsg.jpg'
PHOTO_WF = 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/2015/05/hospital.jpg'
PG = 'https://prasanthigram.sssihms.org/'
WF = 'https://whitefield.sssihms.org'
ABOUT = 'https://www.srisathyasai.org/pages/sai-about-trust.html'

# The live page's copy, verbatim. Spelling fixes are applied through TYPOS so the
# check below still proves the rest of each sentence survived untouched.
TYPOS = {'experiensed': 'experienced', 'expereinces': 'experienced',
         'unforseen': 'unforeseen', 'Wholistic': 'Holistic'}
ORIGINAL = [
    'Service to Man is Service to God',
    'State of the Art Medical Services. Completely Free of Charge.',
    'Our Mission is to provide high quality medical care free of charge to all irrespective of caste, creed, religion, and financial status in an atmosphere of love and care.',
    'Sri Sathya Sai Institute of Higher Medical Sciences aims to provide free medical care to the sick and ailing with the dedication, commitment, love and the best of skills, so that they will be cured in body, mind and spirit.',
    'SSSIHMS, Prasanthigram', 'ANDHRA PRADESH', '+91 (08555) 287388 Ext: 1709', 'publicrelationspg@sssihms.org.in',
    'SSSIHMS, Whitefield', 'BANGALORE, KARNATAKA', '+91 (080) 47104600', 'hrblr@sssihms.org.in (for employment queries)',
    'View Site',
    'Experienced Doctors',
    'Each doctor at our hospital is a human care expert, going above and beyond the call of duty as they live by the belief that every single life is priceless.',
    'Professional & Loving Staff',
    'Love and compassion for the needy is the guiding principle of all our staff which reflects in all professional interactions.',
    'Wholistic Treatment',
    'Lifestyle counselling by experiensed staff to ensure treatment happens both at physical and mental level to avoid future ailments.',
    'Appointments',
    'Appointment system has reduced long queues outside the hospital. Patient can call 080-47104600 to get appointment.',
    'Emergency Care',
    '24/7 emergency care by expereinces doctors with life saving equipment support for any unforseen incidents.',
    'No Bill Counter',
    'World-class medical care absolutely free of cost with absolutely no billing counter. Love is the only currency in this temple of healing.',
    '“Health care is not just medical care. Medical care is one of the components of what you all are doing. Actually healthcare is medical care, education and nutrition. Health care happens only when all these three are combined…you are doing all the three… An antiballistic missile has been launched by Bhagawan against poverty: Through education, water and health care”.',
    'Dr.A.P.J.Abdul Kalam', 'Former President of India',
]
LINKS = [PG, WF, ABOUT]


def fixed(s):
    for bad, good in TYPOS.items():
        s = s.replace(bad, good)
    return s


C = {k: html.escape(fixed(v), quote=False) for k, v in enumerate(ORIGINAL)}

FEATURES = [(C[i], C[i + 1]) for i in (13, 15, 17, 19, 21, 23)]

CSS = """
.sssi-page{--blue-deep:#003366;--blue-mid:#1A5276;--gold:#C8A84B;--rose:#D9564B;--rose-hover:#c44a40;
--rose-text:#9B3329;--pink-band:#FFA299;--rose-wash:#FFF1EF;--grey-dark:#2C2C2C;--grey-mid:#6C6C6C;
--grey-light:#F4F4F4;--display:'Playfair Display',Georgia,serif;--body:'Lato',Arial,sans-serif}
.sssi-page *{box-sizing:border-box}
.sssi-page{font-family:var(--body);color:var(--grey-dark);background:#fff;line-height:1.5;font-size:16.5px}
.sssi-page h1,.sssi-page h2,.sssi-page h3{font-family:var(--display);color:var(--blue-deep);font-weight:700;line-height:1.15;margin:0 0 .45em}
.sssi-page a{color:var(--blue-mid)}
.sssi-page a:focus-visible{outline:3px solid var(--rose);outline-offset:2px}
.sssi-page .wrap{max-width:1140px;margin:0 auto;padding:0 24px}
.sssi-page .eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--rose-text);font-weight:700;margin:0 0 10px}

.sssi-page .util{background:var(--blue-mid);color:#fff;font-size:13px}
.sssi-page .util .wrap{display:flex;justify-content:space-between;gap:6px 18px;padding:7px 24px;flex-wrap:wrap}
.sssi-page .util span{white-space:nowrap}
.sssi-page header.mast{background:#fff;border-bottom:1px solid #e3e7eb}
.sssi-page .mast .wrap{display:flex;align-items:center;gap:20px;padding:20px 24px;flex-wrap:wrap}
.sssi-page .lock{display:block;line-height:0}
.sssi-page .lock img{height:52px;width:auto;max-width:100%;display:block}
.sssi-page nav.main{background:#00284f}
.sssi-page nav.main ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap}
.sssi-page nav.main a{display:block;color:#fff;text-decoration:none;padding:14px 18px;font-size:14px;font-weight:600;
 text-transform:uppercase;letter-spacing:.04em}
.sssi-page nav.main a:hover{background:var(--blue-mid)}
.sssi-page nav.main li:first-child a{padding-left:0}

.sssi-page .hero{position:relative;color:#fff;overflow:hidden;background:var(--blue-deep)}
.sssi-page .hero .ph{position:absolute;top:0;bottom:0;width:50%;background:center/cover no-repeat}
.sssi-page .hero .ph.l{left:0;background-position:50% 55%}
.sssi-page .hero .ph.r{right:0;background-position:50% 45%}
.sssi-page .hero:before{content:"";position:absolute;inset:0;z-index:1;
 background:linear-gradient(180deg,rgba(0,32,64,.55) 0%,rgba(0,32,64,.78) 100%)}
.sssi-page .hero .wrap{position:relative;z-index:2;padding:110px 24px 96px;text-align:center}
.sssi-page .hero h1{color:#fff;font-size:52px;margin:0 auto .3em;max-width:18ch;text-shadow:0 2px 18px rgba(0,26,51,.55)}
.sssi-page .hero p{font-size:19px;margin:0;color:#fff;text-shadow:0 1px 10px rgba(0,26,51,.6)}
.sssi-page .hero .rule{width:64px;height:2px;background:var(--gold);margin:0 auto 22px}
.sssi-page .bar{background:var(--gold);height:5px}
.sssi-page .strip{background:var(--pink-band)}
.sssi-page .strip .wrap{padding:11px 24px;text-align:center}
.sssi-page .strip p{margin:0;font-size:14.5px;color:var(--blue-deep);font-weight:600}

.sssi-page section{padding:64px 0}
.sssi-page .mission{text-align:center}
.sssi-page .mission .lead{font-family:var(--display);font-size:25px;line-height:1.4;color:var(--blue-deep);max-width:40ch;margin:0 auto 22px}
.sssi-page .mission p{max-width:66ch;margin:0 auto}

.sssi-page .campuses{background:var(--grey-light)}
.sssi-page .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:8px}
.sssi-page .campus{background:#fff;border-top:3px solid var(--blue-mid);display:flex;flex-direction:column}
.sssi-page .campus img{width:100%;height:240px;object-fit:cover;display:block}
.sssi-page .campus .in{padding:24px 26px 28px;display:flex;flex-direction:column;flex:1}
.sssi-page .campus h3{font-size:27px;margin:0 0 2px}
.sssi-page .campus .eyebrow{margin-bottom:16px}
.sssi-page .campus dl{margin:0 0 22px;font-size:15px}
.sssi-page .campus dt{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--grey-mid);margin-top:10px}
.sssi-page .campus dd{margin:2px 0 0}
.sssi-page .campus dd a{color:var(--rose-text);font-weight:600;text-decoration:none;word-break:break-word}
.sssi-page .btn{display:inline-block;align-self:flex-start;margin-top:auto;padding:12px 24px;font-weight:700;font-size:14px;
 text-decoration:none;background:var(--rose);color:#fff;letter-spacing:.04em}
.sssi-page .btn:hover{background:var(--rose-hover);color:#fff}

.sssi-page .fgrid3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.sssi-page .feat{border:1px solid #e3e7eb;border-top:3px solid var(--rose);padding:22px 22px 24px}
.sssi-page .feat h3{font-size:21px;margin:0 0 8px}
.sssi-page .feat p{margin:0;font-size:15.5px}
.sssi-page h2.sec{font-size:30px;margin-bottom:26px}

.sssi-page .quote{background:var(--blue-deep);color:#fff;text-align:center}
.sssi-page blockquote{font-family:var(--display);font-style:italic;font-size:22px;line-height:1.55;max-width:60ch;margin:0 auto 22px;color:#fff}
.sssi-page .quote .who{color:var(--gold);font-weight:700;letter-spacing:.06em}
.sssi-page .quote .role{color:#cfe0ee;font-size:14px}

.sssi-page footer{background:#00284f;color:#cfe0ee;font-size:14px;padding:40px 0 0}
.sssi-page footer h4{color:#fff;margin:0 0 8px;font-size:15px}
.sssi-page .fcols{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;padding-bottom:30px}
.sssi-page footer a{color:#cfe0ee;text-decoration:none;display:block;padding:3px 0}
.sssi-page footer a:hover{color:#fff}
.sssi-page .fbot{border-top:1px solid var(--blue-mid);padding:16px 0;font-size:13px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}
.sssi-page .fbot .lsb{color:var(--gold);font-style:italic}

@media(max-width:980px){.sssi-page .fgrid3{grid-template-columns:1fr 1fr}.sssi-page .hero h1{font-size:42px}}
@media(max-width:700px){
.sssi-page .cgrid,.sssi-page .fgrid3,.sssi-page .fcols{grid-template-columns:1fr}
.sssi-page .wrap{padding-left:16px;padding-right:16px}
.sssi-page .hero .ph.l{width:100%}.sssi-page .hero .ph.r{display:none}
.sssi-page .lock img{height:auto}.sssi-page .hero .wrap{padding:72px 16px 64px}.sssi-page .hero h1{font-size:34px}.sssi-page .hero p{font-size:17px}
.sssi-page .mission .lead{font-size:21px}.sssi-page section{padding:48px 0}
.sssi-page blockquote{font-size:19px}.sssi-page nav.main a{padding:12px 12px;font-size:13px}}
"""

# Divi theme chrome on blog 1 — hidden so the page carries its own header and footer.
SUPPRESS = """
#main-header,#top-header,#et-secondary-menu,#main-footer,#footer-bottom,.et_slide_in_menu_container,
.et-search-form,#sidebar,#breadcrumbs,.et_post_meta_wrapper,.entry-title{display:none!important}
#page-container{padding-top:0!important;margin-top:0!important}
#et-main-area,#main-content,#main-content .container,
.sssi-page.et_pb_section,.sssi-page.et_pb_row,.et_pb_column{padding:0!important;margin:0!important;width:100%!important;max-width:100%!important}
#main-content .container:before{display:none!important}
.sssi-page .et_pb_code_inner{width:100%}
.sssi-page h1,.sssi-page h2,.sssi-page h3,.sssi-page h4{text-transform:none!important;letter-spacing:normal!important;padding-bottom:0}
.sssi-page .eyebrow,.sssi-page nav.main a{text-transform:uppercase!important}
.sssi-page img{max-width:100%}
"""


def tel(s):
    # '+91 (08555) 287388 Ext: 1709' -> 'tel:+918555287388' (trunk 0 dropped, extension not dialable)
    d = re.sub(r'\D', '', s.split('Ext')[0])
    return 'tel:+91' + d[2:].lstrip('0')


def campus(name, region, phone, email_line, photo, alt, href):
    email = email_line.split(' ')[0]
    return ('<article class="campus"><img src="%s" alt="%s" loading="lazy"><div class="in">'
            '<h3>%s</h3><p class="eyebrow">%s</p><dl><dt>Phone</dt><dd><a href="%s">%s</a></dd>'
            '<dt>Email</dt><dd><a href="mailto:%s">%s</a></dd></dl>'
            '<a class="btn" href="%s">%s</a></div></article>'
            % (photo, alt, name, region, tel(html.unescape(phone)), phone, email, email_line, href, C[12]))


def page():
    feats = ''.join('<div class="feat"><h3>%s</h3><p>%s</p></div>' % f for f in FEATURES)
    return (
        '<div class="util"><div class="wrap"><span>Prasanthigram %s</span><span>Whitefield %s</span></div></div>'
        '<header class="mast"><div class="wrap"><a class="lock" href="/">'
        '<img src="%s" alt="Sri Sathya Sai Institute of Higher Medical Sciences"></a></div></header>'
        '<nav class="main" aria-label="Main"><div class="wrap"><ul>'
        '<li><a href="%s">About Us</a></li><li><a href="%s">SSSIHMS-Prasanthigram</a></li>'
        '<li><a href="%s">SSSIHMS-Whitefield</a></li></ul></div></nav>'
        '<div class="hero"><div class="ph l" style="background-image:url(%s)"></div>'
        '<div class="ph r" style="background-image:url(%s)"></div>'
        '<div class="wrap"><div class="rule"></div><h1>%s</h1><p>%s</p></div></div>'
        '<div class="bar"></div>'
        '<div class="strip"><div class="wrap"><p>Tertiary care, provided at no charge to the patient.</p></div></div>'
        '<section class="mission"><div class="wrap"><p class="eyebrow">Our mission</p>'
        '<p class="lead">%s</p><p>%s</p></div></section>'
        '<section class="campuses"><div class="wrap"><p class="eyebrow">Two campuses</p>'
        '<div class="cgrid">%s%s</div></div></section>'
        '<section><div class="wrap"><p class="eyebrow">What patients can expect</p>'
        '<div class="fgrid3">%s</div></div></section>'
        '<section class="quote"><div class="wrap"><blockquote>%s</blockquote>'
        '<div class="who">%s</div><div class="role">%s</div></div></section>'
        '<footer><div class="wrap"><div class="fcols">'
        '<div><h4>Prasanthigram</h4>Sri Sathya Sai Institute of Higher Medical Sciences,<br>Prasanthigram, Puttaparthi,<br>'
        'Sri Sathya Sai District,<br>Andhra Pradesh 515134, India<a href="%s">%s</a></div>'
        '<div><h4>Whitefield</h4>Sri Sathya Sai Institute of Higher Medical Sciences,<br>EPIP Area, Whitefield,<br>'
        'Bangalore 560 066,<br>Karnataka, India<a href="%s">%s</a></div>'
        '<div><h4>Sites</h4><a href="%s">SSSIHMS-Prasanthigram</a><a href="%s">SSSIHMS-Whitefield</a>'
        '<a href="%s">About Us</a></div></div>'
        '<div class="fbot"><span>&copy; 2026 Sri Sathya Sai Institute of Higher Medical Sciences.</span>'
        '<span class="lsb">Loka Samastha Sukhino Bhavantu</span></div></div></footer>'
        % (C[6], C[10], LOGO, ABOUT, PG, WF, PHOTO_PG, PHOTO_WF, C[0], C[1], C[2], C[3],
           campus(C[4], C[5], C[6], C[7], PHOTO_PG, 'The Prasanthigram hospital building, Puttaparthi', PG),
           campus(C[8], C[9], C[10], C[11], PHOTO_WF, 'The Whitefield hospital building, Bengaluru', WF),
           feats, C[25], C[26], C[27],
           tel(ORIGINAL[6]), C[6], tel(ORIGINAL[10]), C[10], PG, WF, ABOUT))


BV = '4.27.9'


def divi(inner):
    assert '[' not in inner and ']' not in inner, 'square brackets would break the shortcode parser'
    g = 'global_colors_info="{}"'
    return ('[et_pb_section fb_built="1" fullwidth="off" _builder_version="%s" custom_padding="0px||0px||false|false" module_class="sssi-page" collapsed="off" %s]'
            '[et_pb_row column_structure="4_4" _builder_version="%s" width="100%%" max_width="100%%" custom_padding="0px||0px||false|false" module_class="sssi-page" %s]'
            '[et_pb_column type="4_4" _builder_version="%s" custom_padding="|||" %s custom_padding__hover="|||"]'
            '[et_pb_code _builder_version="%s" module_class="sssi-page" %s]%s[/et_pb_code]'
            '[/et_pb_column][/et_pb_row][/et_pb_section]' % (BV, g, BV, g, BV, g, BV, g, inner))


def flat(x):
    return re.sub(r'\s+', '', html.unescape(re.sub(r'<[^>]+>', ' ', x)))


inner = page()
body = flat(inner)
lost = [s for s in ORIGINAL if flat(fixed(s)) not in body]
assert not lost, 'COPY LOST: %r' % lost
for u in LINKS + [PHOTO_PG, PHOTO_WF, LOGO]:
    assert u in inner, 'LOST LINK ' + u

OUT.mkdir(exist_ok=True)
payload = '<div class="sssi-page"><style>' + CSS + SUPPRESS + '</style>' + inner + '</div>'
(OUT / 'page-31.divi.txt').write_text(divi(payload))
(OUT / 'preview.html').write_text(
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    '<title>Sri Sathya Sai Institute of Higher Medical Sciences</title>'
    '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@400;600;700&display=swap" rel="stylesheet">'
    '<style>body{margin:0}</style></head><body>' + payload + '</body></html>')
print('%d original strings verified, %d spelling fixes applied, %d links/images verified'
      % (len(ORIGINAL), sum(any(b in s for b in TYPOS) for s in ORIGINAL), len(LINKS) + 3))
print('wrote', OUT / 'preview.html', 'and', OUT / 'page-31.divi.txt')
