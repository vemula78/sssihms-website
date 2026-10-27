"""Turn the standalone annual report page into mu-plugin assets.

The annual report is generated outside WordPress (its own src/build.py, which reconciles
the figures) as one index.html with an images/ folder beside it. WordPress serves it
through [sssihms_proceedings slug=...], like the proceedings and magazine pages, so this
writes:

  <slug>.html  the hero, section nav, sections, source note and photo viewer, in .sssihms-proc
  <slug>.css   the page CSS scoped under .sssihms-proc (see proceedings_to_wp.py)
  <slug>.js    the page script, unchanged
  <slug>/      the images, copied

The masthead and the address part of the footer are dropped; the site header and footer
replace them. The footer's source note is kept. Never edit figures here: change the
report's src/template.html and rebuild index.html.

Usage: python3 annual_report_to_wp.py <report folder> <slug>
"""
import pathlib
import re
import shutil
import sys

from proceedings_to_wp import OUT, READABLE, SCOPE, URL, between, scope_css

# Source note, styled as the report's footer .src was.
SRC_CSS = ('.sssihms-proc .ar-src{border-top:1px solid var(--line);padding:22px 0 40px}\n'
           '.sssihms-proc .ar-src p{margin:0;font-size:12.5px;color:var(--muted)}\n'
           # Single-column .two/.split used 1fr, which cannot shrink below the bar charts'
           # content, so phones scrolled sideways (the standalone page does too, 500 px at 375).
           '@media (max-width:960px){.sssihms-proc .two,.sssihms-proc .split{grid-template-columns:minmax(0,1fr)}'
           '.sssihms-proc .chart{min-width:0}}\n')

# Undo Divi and site rules that outrank the scoped report CSS: global heading weight and
# padding, list padding, the .entry-content table styles, the button font, and the site's
# contrast rule that turns every .eyebrow brown (the report's sits on a navy panel).
# Placed before the report rules so the report's own values still win.
DIVI_RESET = ('.sssihms-proc.sssihms-proc :is(h1,h2,h3,h4,h5,h6){padding-bottom:0}\n'
              '.sssihms-proc h1,.sssihms-proc h2{font-weight:700}\n'
              '.sssihms-proc.sssihms-proc ul{padding-bottom:0}\n'
              '.sssihms-proc.sssihms-proc .table-wrap table{border:0;margin:0;text-align:start}\n'
              '.sssihms-proc.sssihms-proc :is(tr,td,th){border-top:0;text-align:inherit}\n'
              '.sssihms-proc .lb button{font-family:Arial,sans-serif}\n'
              '.sssihms-proc .hero-panel .eyebrow{color:var(--gold) !important}\n')

TABLE = re.compile(r'(^|[\s,>+~(])(table|thead|tbody|tfoot|tr|th|td)\b')


def table_rules_first(css):
    """Double the scope on table rules so they outrank Divi's .entry-content table rules."""
    out = []
    for line in css.split('\n'):
        sel = line.split('{', 1)[0]
        if line.startswith(SCOPE) and '{' in line and TABLE.search(sel.replace(SCOPE, '')):
            line = sel.replace(SCOPE + ' ', SCOPE + SCOPE + ' ') + '{' + line.split('{', 1)[1]
        out.append(line)
    return '\n'.join(out)


def main(folder, slug):
    folder = pathlib.Path(folder)
    s = (folder / 'index.html').read_text(encoding='utf-8')
    img = f'{URL}/{slug}/'
    src_note = re.search(r'<p class="src">.*?</p>', between(s, '<footer>', '</footer>'), re.S).group(0)
    body = (s[s.index('<div class="hero"'):s.index('<footer>')].rstrip()
            + f'\n<div class="ar-src"><div class="wrap">{src_note}</div></div>\n'
            + s[s.index('</footer>') + len('</footer>'):s.index('<script>')].strip())
    body = body.replace('src="images/', f'src="{img}')
    if 'images/' in body:
        sys.exit('unrewritten images/ path in the body')

    css = re.sub(r'url\((["\']?)images/', lambda m: f'url({m.group(1)}{img}', between(s, '<style>', '</style>'))
    if 'images/' in css.replace(img, ''):
        sys.exit('unrewritten images/ path in the CSS')
    fonts = re.search(r'<link href="(https://fonts.googleapis.com/css2\?[^"]+)"', s).group(1)
    # The report sets its own type sizes, so the proceedings' larger reading text is left out.
    css = f'@import url("{fonts}");\n' + DIVI_RESET + table_rules_first(scope_css(css).replace(READABLE, '')) + SRC_CSS

    (OUT / slug).mkdir(parents=True, exist_ok=True)
    names = sorted(p.name for p in (folder / 'images').iterdir() if p.suffix.lower() in ('.jpg', '.jpeg', '.png'))
    for n in names:
        shutil.copy2(folder / 'images' / n, OUT / slug / n)
    missing = sorted(set(re.findall(re.escape(img) + r'([^"\')]+)', body + css)) - set(names))
    if missing:
        sys.exit(f'missing images: {missing}')
    print('images', len(names))

    (OUT / f'{slug}.html').write_text(f'<div class="sssihms-proc">\n{body}\n</div>\n', encoding='utf-8')
    (OUT / f'{slug}.css').write_text(css, encoding='utf-8')
    (OUT / f'{slug}.js').write_text(between(s, '<script>', '</script>').strip() + '\n', encoding='utf-8')
    for ext in ('html', 'css', 'js'):
        print(ext, (OUT / f'{slug}.{ext}').stat().st_size)


if __name__ == '__main__':
    main(*sys.argv[1:3])
