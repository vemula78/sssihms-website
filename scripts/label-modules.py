#!/usr/bin/env python3
"""Give every module in the import pack an admin_label taken from its own heading.

Divi shows admin_label in the builder's layers panel and on each module's block. The
pack's pages are a stack of near-identical Text/Code modules, so that panel reads
"Code, Code, Text, Text, Text..." and finding the paragraph you want means opening
them one at a time. After this it reads "Page Banner — Cardiology", "Cathlab
Facilities", "Cardiac Care Unit", and so on.

This edits ONLY the module opening tags — no content is re-emitted and no section is
rebuilt — so it is safe to run over pages that are already live. Idempotent: an
existing admin_label is replaced, not appended to.

    python3 scripts/label-modules.py [--pack DIR] [--dry-run] [slug ...]
"""
import argparse, json, pathlib, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from divi_labels import relabel


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slugs', nargs='*')
    ap.add_argument('--pack', default=str(pathlib.Path.home() / 'Downloads/divi-export/pages'))
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()

    pack = pathlib.Path(a.pack)
    files = [pack / f'{s}.json' for s in a.slugs] if a.slugs else sorted(pack.glob('*.json'))

    total = 0
    for f in files:
        if not f.exists():
            sys.exit(f'missing: {f}')
        doc = json.loads(f.read_text())
        key = next(iter(doc['data']))
        new, labels = relabel(doc['data'][key])
        total += len(labels)
        print(f'{f.stem}: {len(labels)} modules')
        if a.dry_run:
            for l in labels:
                print(f'    {l}')
            continue
        doc['data'][key] = new
        f.write_text(json.dumps(doc, ensure_ascii=False))

    print(f'\n{len(files)} pages, {total} modules labelled')


if __name__ == '__main__':
    main()
