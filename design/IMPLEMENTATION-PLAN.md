# ContractorX — implement the approved design into the kit

## Context

The ContractorX Kit v1 shipped in this session (7 pages, packaged, QA-passed,
merged to `main`) was **rejected on look**: "monoton, boring, generik — orang
bisa liat dalam 3 detik, oh ini AI yang bikin."

The design was then redone properly, design-first: three directions as PNG →
Naga chose a **combination of B and C** → one full Home page → he approved it
and asked for B's warm palette → six remaining pages designed in the same
language. All seven live as rendered HTML/PNG in `design/`, committed at
`f4aab89`.

**Nothing has been implemented.** `src/` and `dist/` still contain the rejected
black-and-white v1. The Vercel preview still serves it. This plan covers
porting the approved visual language into the real kit.

**This work is gated.** Home is approved. P-02 … P-07 were sent for review and
the session ended before a verdict. Do not start until those six are signed off
or amended.

## What changes and what survives

The infrastructure was never the problem — only the look. Keep it:

| Keep as-is | Rewrite |
| --- | --- |
| `tools/build.mjs` (partial includes, meta block, nav map) | `src/scss/` — tokens and all 23 section partials |
| `src/js/*` — nav, counters, main (reveals, filters, validation, theme) | All 8 page bodies in `src/html/` |
| `tools/make-icons.mjs` sprite pipeline | `tools/make-assets.mjs` — image plates need the night-render treatment |
| SEO head, JSON-LD, sitemap, robots, `vercel.json` | `src/partials/head.html` — font stack changes |
| `_print.scss`, `docs.html` structure, README structure | Docs + README content — tokens and fonts are different now |

## Approved design language (locked)

Source of truth: `design/kit.css` plus the seven page files.

- **Palette** — one warm scale. `--ink #0C0C0C`, `--char #151312` (third
  ground), `--panel #191817`, `--line #2C2A26`, `--fg #F1ECE2`,
  `--steel #948C81`, `--dim #6A635A`, `--kraft #D8CFBC`, `--kraft2 #C9BFA8`,
  `--hi #FF6A00`, `--ok #4A7C42`, `--warn #B24A00`.
- **Type** — Anton (display, uppercase), Archivo (body/UI), JetBrains Mono
  (data/labels), Caveat (handwritten margin notes). Replaces Instrument
  Serif / Inter Tight.
- **Rhythm** — near-black → charcoal → kraft, separated by torn edges. Never
  two identical dark grounds in a row on a long page.
- **Character objects, one per page** — this is what keeps repetition from
  reading as monotony: site log (Home), territory map + ID cards (About), rate
  card (Services), method statement MS-CIV-02 (Service Detail), project
  register (Projects), as-built stamp + contact sheet (Case study), permit-form
  enquiry slip (Contact). Plus the recurring tender docket and footer title
  block.

## Sequence

**1 · Tokens and shell.** Rewrite `_variables.scss`, `_reset.scss`,
`_typography.scss`, `_layout.scss` from `design/kit.css`. Update
`src/partials/head.html` for the new fonts and `src/partials/nav.html` /
`footer.html` for the new markup (footer becomes the title block). Build and
confirm the shell renders before touching sections.

**2 · Home.** Port `design/D-home-full.html` into `src/html/index.html` plus
its section partials. This is the reference implementation — get responsive
behaviour right here before repeating it six times.

**3 · Remaining six pages.** `P02…P07` → `about`, `services`,
`service-detail`, `projects`, `project-detail`, `contact`. Reuse the shared
partials (`certifications`, `clients`, `tender`) rewritten in the new language.

**4 · Assets.** Rewrite `tools/make-assets.mjs`: image plates become dark
night-renders (the `grayscale invert contrast` treatment in `kit.css`
`.pimg img`), not the old grey-gradient plates. Regenerate sprites if new icons
are needed.

**5 · Docs and packaging.** README §1 Colours and §2 Fonts change materially.
`docs.html` topics 04 and 05 likewise. Regenerate the PDF, the six marketing
screenshots, the 1600×900 cover, and the ZIP.

## Responsive — the main risk

Every design frame is fixed 1440. The kit must hold 320 · 375 · 414 · 768 ·
1024 · 1440. Specific hazards, all seen in v1:

- Grid children default to `min-width: auto` — apply `min-width: 0` to every
  grid child (v1 fix is in `src/scss/_layout.scss`, reuse the selector list).
- The six-column spec table (`.srow`) must collapse to a stacked card per row
  below 1024, not scroll.
- Anton at 124px needs a fluid clamp; the hero and section heads all do.
- The three-column docket and the `.hgrid` split go single-column at 768.
- Absolutely-positioned pieces — stamps, tape, `.pmeta` — need repositioning
  or hiding on narrow screens.

## Open decision — dark mode

v1 shipped a light/dark toggle. The approved design is **committed to one
world**: near-black grounds with kraft interludes. A light theme would mean
inventing an inverted palette nobody has seen or approved.

**Recommendation: drop the toggle**, remove the theme block from `main.js` and
the footer, and say so in the README. It is reversible later. Confirm with
Naga before implementing — the old PRD §4 said "dark mode inverts", but that
PRD described the rejected direction.

## Verification

Run in order; all of these exist in the repo already:

1. `npm run build` — assembles `dist/`, compiles SCSS.
2. `npm start` — serve `dist/` at :4321 and click through all 8 pages.
3. `node tools/responsive-qa.mjs` — must report no horizontal overflow at the
   six widths.
4. `node tools/qa.mjs` — console errors, duplicate IDs, broken sprite refs,
   one `<h1>` per page, `alt` on every image, no dead internal links.
5. Lighthouse desktop on all 8 pages — gate is Perf ≥ 90 · A11y ≥ 95 ·
   Best Practices ≥ 95 · SEO 100. Command and the known sandbox
   font-request caveat are in `docs/qa-report.md`.
6. Print check — `_print.scss` still hides nav toggle, theme button, filter
   bar, and flattens the reversal blocks.
7. Visually diff the built pages against `design/*.png` at 1440 before calling
   it done.
