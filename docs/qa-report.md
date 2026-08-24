# ContractorX Kit v1 — QA report (Day 11)

Run date: 2026-08-24 · build: `dist/` from `npm run build`

## Lighthouse (desktop preset, local server)

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home | 90 | 100 | 96 | 100 |
| Services | 90 | 100 | 96 | 100 |
| Service Detail | 90 | 100 | 96 | 100 |
| Projects | 90 | 100 | 96 | 100 |
| Project Detail | 90 | 100 | 96 | 100 |
| About | 90 | 100 | 96 | 100 |
| Contact | 90 | 100 | 96 | 100 |
| Documentation | 90 | 100 | 96 | 100 |

Gate: Perf ≥ 90 · A11y ≥ 95 · Best practices ≥ 95 · SEO 100 — **met on every page.**

Home page metrics: LCP 0.5 s · CLS 0 · TBT 0 ms.

Best practices sits at 96, not 100, because of one console error in this test
environment: the Google Fonts stylesheet request is blocked by the sandbox's
network policy. On a normal connection that request succeeds and the audit
passes. Self-hosting the fonts (README §2) removes the dependency entirely.

## Fixes made during QA

- Counter values inherited a 10.5 px label size from a descendant `span` rule
  in the safety and hero sections — selectors scoped to direct children.
- Horizontal overflow at 320 px from grid items defaulting to `min-width: auto`
  — `min-width: 0` applied to every grid child, certifications and client
  strips drop to one column below 420 px.
- `<dl class="hero__facts">` used `b`/`span` instead of `dt`/`dd`.
- Ghost buttons on the dark CTA band inherited the light-theme ink colour —
  reversal token overrides now apply to every dark section, not only `.reverse`.
- Tender form labels inherited `--mute` on a dark ground (3.17:1).
- Heading order: Projects featured strip and the two Services groups had `h3`
  cards with no `h2` above them.

## Structural checks (all 8 pages)

- No console errors beyond the sandboxed font request
- No duplicate `id` attributes
- No broken sprite references (`<use href="#…">` all resolve)
- Exactly one `<h1>` per page
- `alt` present on every `<img>`
- No internal links to missing files; every in-page anchor resolves

## Responsive

No horizontal overflow at 320, 375, 414, 768, 1024, or 1440 px on any page.
Verified per-page with a scripted scan of `documentElement.scrollWidth`.

## Interaction

- Mobile nav: opens, closes on link click, closes on Escape, returns focus
- Portfolio filters: sector × year combinations, empty state shows when a
  combination has no matches
- Forms: invalid fields marked, focus moves to the first error, submit button
  disabled while sending, status announced via `role="status"`
- Counters: run once on scroll-in; final values shown immediately under
  `prefers-reduced-motion`
- Theme toggle: inverts, persists in `localStorage`, wrapped in try/catch

## Browsers

Chromium 141 (Chrome/Edge engine) automated, at all six widths. Safari and
Firefox use the same standard features — no vendor-prefixed or engine-specific
CSS is used. The kit relies on `IntersectionObserver`, CSS grid, custom
properties, and `color-mix()`, all supported in Safari 16.2+ and Firefox 113+.
