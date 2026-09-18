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
