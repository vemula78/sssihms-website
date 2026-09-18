#!/usr/bin/env python3
"""Build the pack's home layout from the prototype's dist/index.html.

Every other page was exported to ~/Downloads/divi-export/pages/<slug>.json by the
original design pass, but the home page never was — in the prototype it is
index.html, not home.html, so the exporter's slug loop skipped it.

This produces home.json in the same shape the rest of the pack uses: the shared
stylesheet Code module copied verbatim from an existing pack page, then one module
per <section>. The home page has a hero rather than a page-banner, so unlike
regen-page-json.py there is no second (banner) module to preserve — the hero is
emitted as an ordinary content section.

    python3 scripts/make-home-json.py [--dry-run]
"""
import argparse, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent

# The home page lays nearly every section out on its own named CSS grid
# (spec-grid, stats-grid, acad-grid, inv-grid, pat-grid, news-grid) rather than the
# shared auto-grid the inner pages use, so match any "*-grid" class. Divi's Text
# module reflows grid children into its own columns; Code modules keep the markup.
GRID = re.compile(r'class="[^"]*([a-z]+-grid|auto-grid|faculty-grid|gallery-grid|stat-grid|'
                  r'table-wrap|subnav|hero|admit-section)', re.I)
TEXT_WRAP = ('[et_pb_text _builder_version="4.27.0" module_class="sssi-mod" '
             'text_font="DM Sans||||||||" hover_enabled="0" sticky_enabled="0"]%s[/et_pb_text]')
CODE_WRAP = '[et_pb_code _builder_version="4.27.0" module_class="sssi-mod"]%s[/et_pb_code]'


def sections(html):
    out, i = [], 0
    while True:
        m = re.compile(r'<section\b[^>]*>').search(html, i)
        if not m:
            return out
        depth, j = 1, m.end()
        while depth:
            n = re.compile(r'<section\b[^>]*>|</section>').search(html, j)
            if not n:
                return out
            depth += 1 if n.group(0).startswith('<section') else -1
            j = n.end()
        out.append(html[m.start():j])
        i = j


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pack', default=str(pathlib.Path.home() / 'Downloads/divi-export/pages'))
    ap.add_argument('--dist', default=str(HERE.parent / 'dist'))
    ap.add_argument('--seed', default='about-hospital', help='pack page to copy the stylesheet from')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()

    pack = pathlib.Path(a.pack)
    seed = json.loads((pack / f'{a.seed}.json').read_text())
    seed_body = seed['data'][next(iter(seed['data']))]
    head = re.search(r'\[et_pb_code[^\]]*\].*?\[/et_pb_code\]', seed_body, re.S)
    if not head:
        sys.exit('no stylesheet Code module in the seed page')
    # Everything before the stylesheet module is the section/row wrapper the pack uses.
    prefix = seed_body[:head.end()]

    html = re.sub(r'<(script|style)\b.*?</\1>', '', (pathlib.Path(a.dist) / 'index.html').read_text(), flags=re.S)
    secs = sections(html)
    if not secs:
        sys.exit('no sections in dist/index.html')

    link_map = json.loads((HERE / 'link-map.json').read_text())

    def remap(h):
        def sub(m):
            href = m.group(2)
            if re.match(r'^(https?:|#|mailto:|tel:|/static/|/wp-content/)', href):
                return m.group(0)
            if href.startswith('vahinis/'):
                return m.group(1) + '/static/' + href + m.group(3)
            key = (href[:-5] if href.endswith('.html') else href).strip('/').split('/')[-1]
            if key in ('index', ''):
                return m.group(1) + '/' + m.group(3)
            target = link_map.get(key)
            if not target:
                return m.group(0)
            if not href.endswith('.html') and target.strip('/') == href.strip('/'):
                return m.group(0)
            return m.group(1) + target + m.group(3)
        return re.sub(r'(href=")([^"]+)(")', sub, h)

    secs = [remap(s).replace('src="stats-pages/', 'src="/static/stats-pages/')
                    .replace('src="poetry-pages/', 'src="/static/poetry-pages/') for s in secs]

    mods = ''.join((CODE_WRAP if GRID.search(s) else TEXT_WRAP) % s for s in secs)
    body = prefix + mods + '[/et_pb_column][/et_pb_row][/et_pb_section]'

    kinds = ['code' if GRID.search(s) else 'text' for s in secs]
    print(f'home: {len(secs)} sections ({kinds.count("text")} text, {kinds.count("code")} code)  -> {len(body):,}b')

    if a.dry_run:
        return
    doc = dict(seed)
    doc['data'] = {next(iter(seed['data'])): body}
    (pack / 'home.json').write_text(json.dumps(doc, ensure_ascii=False))
    print(f'wrote {pack / "home.json"}')


if __name__ == '__main__':
    main()
