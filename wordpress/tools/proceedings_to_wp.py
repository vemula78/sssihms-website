"""Turn a standalone conference-proceedings page into mu-plugin assets.

The proceedings page is generated outside WordPress (its own build.py) as one
self-contained index.html. WordPress serves it through [sssihms_proceedings slug=...]
(sssihms-wfd-patient-access.php), so this writes three files:

  <slug>.html  the body between the masthead and the footer, wrapped in .sssihms-proc
  <slug>.css   the page CSS with every selector scoped under .sssihms-proc
  <slug>.js    the page script
  <slug>/      inline base64 photos, written out as image files

The page's own masthead and footer are dropped; the site header and footer replace them.

Usage: python3 proceedings_to_wp.py <index.html> <slug>
"""
import base64
import pathlib
import re
import sys

SCOPE = '.sssihms-proc'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'mu-plugins' / 'sssihms-wfd-assets' / 'proceedings'
URL = '/wp-content/mu-plugins/sssihms-wfd-assets/proceedings'

# Rules for parts that are not carried over (masthead, footer).
DROP = re.compile(r'^(\.mast\b|\.lock\b|footer\b)')

# Divi adds padding under every <p> and list; undo it inside the proceedings.
RESET = (f'{SCOPE} p{{padding-bottom:0}}\n{SCOPE} ul,{SCOPE} ol{{line-height:inherit}}\n'
         # Printing the proceedings should not print the site header and footer.
         '@media print{.et-l--header,.et-l--footer,#wpadminbar{display:none !important}}\n')


def between(s, start, end):
    i = s.index(start) + len(start)
    return s[i:s.index(end, i)]


def scope_selector(sel):
    sel = sel.strip()
    if sel in (':root', 'body'):
        return SCOPE
    if sel == 'html':
        return 'html'
    if DROP.match(sel):
        return None
    return f'{SCOPE} {sel}'


def scope_rules(css):
    out = []
    for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
        parts = [p for p in (scope_selector(x) for x in sel.split(',')) if p]
        if parts:
            out.append(','.join(parts) + '{' + body.strip() + '}')
    return '\n'.join(out) + '\n'


def scope_css(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out, pos = [], 0
    for m in re.finditer(r'@media[^{]+\{', css):
        out.append(scope_rules(css[pos:m.start()]))
        depth, i = 1, m.end()
        while depth:
            depth += {'{': 1, '}': -1}.get(css[i], 0)
            i += 1
        out.append(m.group(0).strip() + '\n' + scope_rules(css[m.end():i - 1]) + '}\n')
        pos = i
    out.append(scope_rules(css[pos:]))
    return ''.join(out) + RESET


def main(src, slug):
    s = pathlib.Path(src).read_text(encoding='utf-8')
    body = s[s.index('<section class="hero">'):s.index('<footer>')].strip()
    OUT.mkdir(parents=True, exist_ok=True)
    # Inline base64 photos become files in <slug>/, so the page HTML stays small and
    # loading="lazy" works.
    images = []

    def save(m):
        ext = 'jpg' if m.group(1) == 'jpeg' else m.group(1)
        name = f'{len(images) + 1:02d}.{ext}'
        images.append(name)
        (OUT / slug).mkdir(exist_ok=True)
        (OUT / slug / name).write_bytes(base64.b64decode(m.group(2)))
        return f'{URL}/{slug}/{name}'
    body = re.sub(r'data:image/(jpeg|png);base64,([A-Za-z0-9+/=]+)', save, body)
    if images:
        print('images', len(images))
    (OUT / f'{slug}.html').write_text(f'<div class="sssihms-proc">\n{body}\n</div>\n', encoding='utf-8')
    (OUT / f'{slug}.css').write_text(scope_css(between(s, '<style>', '</style>')), encoding='utf-8')
    (OUT / f'{slug}.js').write_text(between(s, '<script>', '</script>').strip() + '\n', encoding='utf-8')
    for ext in ('html', 'css', 'js'):
        print(ext, (OUT / f'{slug}.{ext}').stat().st_size)


if __name__ == '__main__':
    main(*sys.argv[1:3])
