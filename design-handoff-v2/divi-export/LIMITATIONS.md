# What will NOT be a 1:1 port from the React SPA to Divi

Read this before generating pages in bulk — these are decisions for whoever scopes the Divi
phase, not bugs to fix in the templates.

## Can be kept functionally identical (just needs the same JS re-attached)

- **StatsDash / FramePage** (`sssihms-render.jsx:390-447`) — `<iframe>` + `postMessage`
  height/scroll sync. Not React-specific. Port the exact script into a Divi Code module
  wrapping an `<iframe>` pointed at the same static `stats-pages/*.html` files (already plain
  HTML, no server dependency). No native Divi module needed or possible — keep as raw
  embedded HTML/JS on both the source site and the Divi site.
- **Image `onError` fallbacks** (broken image → hidden element / "Cover image unavailable"
  placeholder / initials avatar for faculty) — plain DOM `onerror`, not React-specific. Needs
  one small JS snippet added once via Divi Theme Options → Integration ("head/body code"),
  since Divi's native Image/Team Member/Gallery modules don't support this out of the box.
  Functionally identical once attached; just isn't a per-block template concern.

## Cannot be kept as-is — inherent to being a single-page app

- **DeptSubNav** (`sssihms-render.jsx:6-18`) — the department sub-tab bar swaps page content
  instantly via in-memory React state (`navigate()`), no URL change, no reload. WordPress/Divi
  is server-rendered and page-based: each department is a real page with a real URL. The tab
  bar's *look* (active-state highlighting) is fully reproducible; the *no-reload instant swap*
  is not, without bolting a custom AJAX/SPA layer onto WordPress — which fights the platform
  for a cosmetic gain. **Recommendation: accept normal page-to-page navigation here.** This is
  the one place where "1:1 with the SPA" and "sensible WordPress build" genuinely conflict —
  flag it to whoever signs off on Divi scope rather than silently reimplementing it.

## Not modeled as reusable block templates (out of scope for the 11-block set)

- `Banner` — a single full-width raw `<img>`, trivial; just use Divi's Image module directly
  per occurrence, no template needed.
- Faculty `image-slot` custom web component (`sssihms-render.jsx:353`) — a bespoke element for
  swapping in staff photos by ID; Divi's Team Member module has no equivalent. Either every
  staff photo must exist as a real uploaded image before the Divi build (removing the need for
  the slot indirection), or this needs a small custom Code module — decide before templating
  the Faculty block at scale.
