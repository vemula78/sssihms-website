#!/usr/bin/env python3
"""Rebuild one Divi page JSON in the import pack from the prototype's own build.

The pack was generated from dist/ in the first place, so restoring content means
editing the prototype, rebuilding, and regenerating — never hand-writing Divi
shortcodes. Everything above the page body (the stylesheet Code module and the
banner Code module) is preserved byte for byte; only the content modules are
re-emitted, one per <section> in the built page.

Prose sections become Text modules so they stay editable in Divi. Sections built
on a grid become Code modules, because Divi's own column handling reflows them.

    python3 scripts/regen-page-json.py <slug> [--pack DIR] [--dist DIR]
"""
import argparse, json, re, sys, pathlib

GRID = re.compile(r'class="[^"]*(auto-grid|faculty-grid|gallery-grid|stat-grid|table-wrap|subnav)', re.I)

TEXT_WRAP = ('[et_pb_text _builder_version="4.27.0" module_class="sssi-mod" '
             'text_font="DM Sans||||||||" hover_enabled="0" sticky_enabled="0"]%s[/et_pb_text]')
CODE_WRAP = '[et_pb_code _builder_version="4.27.0" module_class="sssi-mod"]%s[/et_pb_code]'


def sections(html):
    """Top-level <section> elements of the built page, in document order."""
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
    ap.add_argument('slug')
    ap.add_argument('--pack', default=str(pathlib.Path.home() / 'Downloads/divi-export/pages'))
    ap.add_argument('--dist', default=str(pathlib.Path(__file__).resolve().parent.parent / 'dist'))
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()

    jf = pathlib.Path(a.pack) / f'{a.slug}.json'
    hf = pathlib.Path(a.dist) / f'{a.slug}.html'
    for f in (jf, hf):
        if not f.exists():
            sys.exit(f'missing: {f}')

    doc = json.loads(jf.read_text())
    key = next(iter(doc['data']))
    old = doc['data'][key]

    # Keep everything up to the end of the second Code module: stylesheet + banner.
    heads = list(re.finditer(r'\[et_pb_code[^\]]*\].*?\[/et_pb_code\]', old, re.S))
    if len(heads) < 2:
        sys.exit(f'{a.slug}: expected a stylesheet and a banner Code module, found {len(heads)}')
    prefix = old[:heads[1].end()]

    body_html = re.sub(r'<(script|style)\b.*?</\1>', '', hf.read_text(), flags=re.S)
    secs = sections(body_html)
    # The banner is already carried by the preserved Code module.
    secs = [s for s in secs if 'page-banner' not in s[:200]]
    if not secs:
        sys.exit(f'{a.slug}: no content sections in the built page')

    # The prototype links pages by their own file names ("genesis.html") and the pack
    # once carried those verbatim, which under WordPress resolves beneath the current
    # page and 404s. scripts/link-map.json holds slug -> live permalink for every link
    # target on the site, so every internal link is rewritten to where the page really
    # lives — live URLs and slugs differ on 280 of them.
    lm_path = pathlib.Path(__file__).resolve().parent / 'link-map.json'
    link_map = json.loads(lm_path.read_text()) if lm_path.exists() else {}

    def remap(html):
        def sub(m):
            href = m.group(2)
            if re.match(r'^(https?:|#|mailto:|tel:|/static/|/wp-content/)', href):
                return m.group(0)
            if href.startswith('vahinis/'):
                return m.group(1) + '/static/' + href + m.group(3)
            key = href[:-5] if href.endswith('.html') else href
            key = key.strip('/').split('/')[-1]
            target = link_map.get(key)
            if not target:
                return m.group(0)
            if not href.endswith('.html') and target.strip('/') == href.strip('/'):
                return m.group(0)
            return m.group(1) + target + m.group(3)
        return re.sub(r'(href=")([^"]+)(")', sub, html)

    secs = [remap(s) for s in secs]

    # The built site iframes its dashboards at a relative "stats-pages/<slug>.html".
    # Inside a WordPress page that resolves under the page's own URL and 404s, so point
    # at the deployed copy, which is same-origin and keeps the postMessage height sync.
    secs = [s.replace('src="stats-pages/', 'src="/static/stats-pages/')
             .replace('src="poetry-pages/', 'src="/static/poetry-pages/') for s in secs]

    mods = ''.join((CODE_WRAP if GRID.search(s) else TEXT_WRAP) % s for s in secs)
    tail = '[/et_pb_column][/et_pb_row][/et_pb_section]'
    new = prefix + mods + tail

    kinds = ['code' if GRID.search(s) else 'text' for s in secs]
    print(f'{a.slug}: {len(secs)} sections ({kinds.count("text")} text, {kinds.count("code")} code)'
          f'  {len(old):,}b -> {len(new):,}b')
    if a.dry_run:
        return
    doc['data'][key] = new
    jf.write_text(json.dumps(doc, ensure_ascii=False))


if __name__ == '__main__':
    main()
