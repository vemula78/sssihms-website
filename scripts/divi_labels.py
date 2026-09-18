#!/usr/bin/env python3
"""Derive a Divi admin_label for a module from the content it holds.

Every page in the pack is a stack of near-identical [et_pb_text] / [et_pb_code]
modules, so Divi's layers panel reads "Code, Code, Text, Text, Text..." and whoever
maintains the site has to open each one to find the paragraph they want. Naming a
module after its own heading makes that list navigable.

Shared by scripts/regen-page-json.py, scripts/make-home-json.py and
scripts/label-modules.py so a regenerated page keeps the labels a relabel gave it.
"""
import html as _html
import re

MAX = 48

# A shortcode attribute is delimited by double quotes and the tag by ], so neither
# can appear in the value. Divi also trips over a stray backslash.
_BAD = re.compile(r'["\[\]\\]')


def _clean(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = _html.unescape(_html.unescape(s))
    s = _BAD.sub('', s)
    s = re.sub(r'\s+', ' ', s).strip(' .:·—–-')
    if len(s) > MAX:
        cut = s[:MAX].rsplit(' ', 1)[0]
        s = (cut if len(cut) > MAX * 0.6 else s[:MAX]).rstrip() + '…'
    return s


def _first(pattern, text):
    m = re.search(pattern, text, re.S | re.I)
    return _clean(m.group(1)) if m else ''


def module_label(inner, fallback='Content Section'):
    """Name a module after its content heading. `inner` is the module's raw HTML."""
    head = inner[:400]

    # The shared 37 KB stylesheet. Say so, because editing it breaks every page.
    if '<style' in head and '@import' in head:
        return 'Page Stylesheet — shared, do not edit'

    if 'page-banner' in head:
        title = _first(r'<h1[^>]*>(.*?)</h1>', inner)
        return f'Page Banner — {title}'[:MAX + 16] if title else 'Page Banner'

    if re.search(r'class="[^"]*\bsubnav\b', head):
        return 'Department Sub-navigation'

    # The row of pills that switches between the eleven department dashboards.
    if re.search(r'class="[^"]*\bdash-switch\b', head):
        return 'Dashboard Switcher'

    # A payload served from /static/ through an iframe — the title attribute names it.
    m = re.search(r'<iframe[^>]*\btitle="([^"]+)"', inner, re.I)
    if m:
        name = _clean(m.group(1).replace('-', ' ')).title()
        return f'Embedded Reader — {name}'

    # A heading is what the maintainer sees on the page, so prefer it. Headings are
    # unique within a page far more often than eyebrows are ("Infrastructure" labels
    # three different modules on /cardiology/).
    for tag in ('h1', 'h2', 'h3', 'h4'):
        t = _first(rf'<{tag}[^>]*>(.*?)</{tag}>', inner)
        if t:
            return t

    # A bare data table (e.g. the Trust's student-numbers table) carries no heading;
    # its first row header says what the table is about.
    if '<table' in inner:
        t = _first(r'<th[^>]*scope="row"[^>]*>(.*?)</th>', inner) or _first(r'<th[^>]*>(.*?)</th>', inner)
        if t:
            return _clean('Data Table — ' + t)

    for pat in (r'class="eyebrow"[^>]*>(.*?)</',
                r'class="section-title"[^>]*>(.*?)</',
                r'<p[^>]*>(.*?)</p>',
                # A bare prose list with no heading (e.g. /trust/): its first bullet
                # is the only thing that identifies it.
                r'<li[^>]*>(.*?)</li>'):
        t = _first(pat, inner)
        if t:
            return t

    return fallback


def dedupe(labels):
    """Divi allows duplicate names; a maintainer scanning the panel does not want them."""
    seen, out = {}, []
    for l in labels:
        seen[l] = seen.get(l, 0) + 1
        out.append(l if seen[l] == 1 else f'{l} ({seen[l]})')
    return out


MODULE = re.compile(r'\[et_pb_(text|code)([^\]]*)\](.*?)\[/et_pb_\1\]', re.S)
_HAS_LABEL = re.compile(r'\s*admin_label="[^"]*"')


def relabel(body):
    """Name every Text/Code module in a page body after its own heading.

    Only the opening tags change; module content is copied through untouched.
    Idempotent — an existing admin_label is replaced rather than appended to.
    """
    mods = list(MODULE.finditer(body))
    labels = dedupe([module_label(m.group(3)) for m in mods])
    out, last = [], 0
    for m, label in zip(mods, labels):
        attrs = _HAS_LABEL.sub('', m.group(2))
        out.append(body[last:m.start()])
        out.append(f'[et_pb_{m.group(1)} admin_label="{label}"{attrs}]{m.group(3)}[/et_pb_{m.group(1)}]')
        last = m.end()
    out.append(body[last:])
    return ''.join(out), labels
