# ContractorX Kit v1 — QA report

Run date: 2026-08-25 · build: `dist/` from `npm run build`

This report covers the kit as rebuilt on the approved blue, light-dominant
design — white and soft blue grounds, navy reserved for document objects.

## Lighthouse (desktop preset, local server)

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home | 100 | 100 | 100 | 100 |
| About | 100 | 100 | 100 | 100 |
| Services | 100 | 100 | 100 | 100 |
| Service Detail | 100 | 100 | 100 | 100 |
| Projects | 100 | 100 | 100 | 100 |
| Project Detail | 99 | 100 | 100 | 100 |
| Contact | 100 | 100 | 100 | 100 |
| Documentation | 100 | 100 | 100 | 100 |

Gate: Perf ≥ 90 · A11y ≥ 95 · Best practices ≥ 95 · SEO 100 — **met on every
page, with margin.**

The previous run capped at Perf 90 / Best practices 96 because of the Google
Fonts stylesheet request. The fonts are now self-hosted (`src/fonts/` →
`dist/fonts/`, `@font-face` in `src/scss/_fonts.scss`), which removed the
third-party round-trip and the sandbox console error together. There is no
longer any external request on any page.

## Fixes made during QA

- **Palette contrast.** `--dim` (#8A99AE) and the accent `--hi` (#2E86FF) both
  failed 4.5:1 against white and soft blue at the small mono sizes the kit uses
  for labels and data. Retuned to `#606E85` and `#1568D6` — 5.16:1 and 5.27:1
  on white, and still ≥ 4.5:1 on `#EDF1FA`, the deepest ground.
- **Muted text on navy objects.** Several partials hard-coded `#6B7F96`, which
  reads at 4.11:1 on the navy docket. Added a `--doc-dim` token (`#8FA2B8`,
  6.48:1 on navy) and routed every navy-context label through it; light-ground
  labels use `--dim`.
- **Heading order.** Card titles were `h4` under an `h2`, skipping a level —
  promoted site-wide to `h3`. Four pages open with a card grid and no section
  heading above it; those got a visually-hidden `h2` (`.sr-only`). The Home
  site log and the Contact enquiry slip are real section titles and became `h2`.
- **Crawlable links.** The two hero buttons on Home were `<a>` with no `href`.
- **Missing anchor targets.** `services.html#fleet`, `about.html#safety`,
  `projects.html#ongoing`, and `project-detail.html#spec` were referenced but
  the ids had been lost in the rebuild.
- **Narrow-viewport overflow.** Grid children default to `min-width: auto`;
  `min-width: 0` is applied across the grid-child selector list in
  `_layout.scss`. Spec tables scroll inside `.table-scroll`; the as-built stamp
  goes static below 768 px rather than driving page width.
- Removed two orphaned v1 partials (`certifications.html`, `clients.html`) that
  still referenced a deleted icon sprite.

## Structural checks (all 8 pages)

- No console errors — none at all, including no external request failures
- No duplicate `id` attributes
- No broken internal references
- Exactly one `<h1>` per page
- `alt` present on every `<img>`
- No internal links to missing files; every in-page anchor resolves

## Responsive

No horizontal overflow at 320, 375, 414, 768, 1024, or 1440 px on any page.
Verified per-page with a scripted scan of `documentElement.scrollWidth`
(`node tools/responsive-qa.mjs`).

## Interaction

- Mobile nav: opens, closes on link click, closes on Escape, returns focus
- Portfolio filters: sector × year combinations, empty state shows when a
  combination has no matches
- Forms: invalid fields marked, focus moves to the first error, submit button
  disabled while sending, status announced via `role="status"`
- Progress bars and counters: run once on scroll-in; final values shown
  immediately under `prefers-reduced-motion`
- Theme toggle: light default, inverts to dark, persists in `localStorage`,
  wrapped in try/catch

## Motion (all 8 pages)

Every page carries the same baseline — a reading-progress rail and a
parallaxed page head — plus exactly one signature, so no effect repeats twice
in a row. Contact and Docs get reading aids rather than performances: the
enquiry slip stays put while its second column scrolls, and a corner strip
names the current documentation topic.

The Home build sequence was shortened from `+=420%` to `+=260%` after review —
roughly 2.5 screens instead of 4. The drawing still reads phase by phase and
the page is 1.5 screens shorter.

Verified:

- **Gate held.** All 8 pages still score 99–100 / 100 / 100 / 100. GSAP and
  ScrollTrigger are fetched by `motion.js` at runtime rather than linked in
  `<head>`, so they never block first paint.
- **Reduced motion, all 8 pages** — GSAP loads on **zero** of them. The
  elevation renders already drawn, both registers are swipeable rows, and the
  sticky aids keep working because they are CSS, not script.
- **390 px, all 8 pages** — GSAP loads on **zero** of them.
- **JavaScript disabled** — every page renders as an ordinary static document
  with the finished drawing visible. Nothing looks missing.
- Three of the six signatures need no animation library at all: the Services
  rate-card header and the Service Detail capability table are
  `position: sticky`, and the About year readout is an `IntersectionObserver`.

Defects found and fixed while wiring the motion up:

- **The Projects filters were dead.** The chips were bound to `[data-project]`
  but no card carried the attribute after the redesign, so clicking a sector or
  year did nothing. All nine cards now carry `data-project`, `data-sector` and
  `data-year`, and the empty state — which could never appear before — is in
  place. Verified: all → 9 shown, Government → 3, Government + 2025 → 1,
  Government + 2022 → 0 with the empty message shown.
- **Home section numbering** had a duplicate `06` once the programme section
  was inserted; it now runs 01–07.
- The progress rail was labelled "Programme" on every page; it now only says
  that where a programme is actually being shown, and reads "Read" elsewhere.
- **The Contact two-column layout was broken.** A stray `</div>` closed
  `.contact-split` immediately after the form, so the direct-lines column had
  been rendering full-width outside the grid since the redesign. Removing it
  restored the intended two columns; the contact table's inherited 640 px
  min-width is now scoped off, since that was written for the wide spec tables.

## Images

Every content image slot ships **empty** by design — a dashed plate with a
blueprint grid and an `IMAGE` marker at the aspect ratio the layout expects.
No placeholder artwork is included. Dropping a real photo into the slot
replaces the plate with no CSS changes.

## Browsers

Chromium 141 (Chrome/Edge engine) automated, at all six widths. Safari and
Firefox use the same standard features — no vendor-prefixed or engine-specific
CSS is used. The kit relies on `IntersectionObserver`, CSS grid, custom
properties, and `color-mix()`, all supported in Safari 16.2+ and Firefox 113+.
