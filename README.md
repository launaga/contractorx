# ContractorX Website Kit v1

A premium, ready-to-launch website kit for contractors and construction firms.
Seven pages, 23 sections, natural black-and-white art direction, and the seven
sections a generic contractor theme never ships with: certifications,
equipment fleet, safety record, live project map, client strip, tender desk,
and awards & press.

Static HTML5 · Bootstrap 5.3 grid · SCSS · vanilla JS · GSAP optional.
No React, no CMS, no build framework beyond the SCSS compiler.

---

## What's in the box

```
contractorx/
├── dist/               ← the finished site. This is what you upload.
├── src/
│   ├── html/           7 pages + docs, written with {{> partial}} includes
│   ├── partials/       head · nav · footer · tender
│   ├── scss/
│   │   ├── _variables.scss     all design tokens
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   ├── _layout.scss
│   │   ├── sections/           26 partials — one per section
│   │   └── main.scss
│   ├── js/             nav.js · main.js
│   ├── img/            favicon only — content image slots ship empty
│   └── fonts/          self-hosted woff2 — Anton · Archivo · Caveat · JetBrains Mono
├── tools/              page assembler + QA harnesses
├── docs/               documentation (also at dist/docs.html)
├── LICENSE
└── README.md
```

**Pages** — Home · About · Services · Service Detail · Projects · Project Detail · Contact · Documentation

**Sections (23)** — 16 general-purpose (navbar, hero, logo cloud, statistics,
about, services grid, portfolio, process, testimonials, CTA band, FAQ, team,
pricing, blog cards, contact form, footer) plus 7 built specifically for
contractors (K-01 … K-07, listed under *Section library* below).

---

## Quick start

**Just editing text and images?** Open `dist/` in your editor, change what you
need, upload the folder. Every path is relative — you can double-click
`dist/index.html` and it runs from your file system. No tooling required.

**Editing the design?** You need Node 18+ once:

```bash
npm install          # sass + bootstrap + gsap
npm run build        # assemble HTML into dist/ and compile CSS
npm start            # build, then serve dist/ at http://localhost:4321
npm run css:watch    # recompile SCSS on every save while you work
```

---

## 1 · Colours

Everything routes through `src/scss/_variables.scss`. The palette is
light-dominant: **white and soft blue are the only section grounds** — navy is
reserved for objects that sit on those grounds (the tender docket, the footer
title block, stamps), never for a whole section.

| Token | Default | Used for |
| --- | --- | --- |
| `$white` | `#FFFFFF` | Primary page ground |
| `$soft` | `#F7F8FD` | Second ground — alternates with white |
| `$soft-2` | `#EDF1FA` | Panels, table stripes, inset blocks |
| `$line` | `#DCE3F2` | Hairlines, table rules, plate borders |
| `$ink` | `#0A1A2F` | Body text and headings |
| `$steel` | `#5C6B82` | Secondary copy |
| `$dim` | `#8A99AE` | Captions, mono labels, meta |
| `$doc-bg` / `$doc-fg` | `#0C1D33` / `#EEF3FB` | Navy objects — docket, title block |
| `$bright` | `#2E86FF` | The one accent: CTAs, key numbers, one word per headline |
| `$sky` | `#7FB2E5` | Accent support — bars, ticker, chart fills |
| `$deep` | `#0A2E6B` | Deep blue for emphasis rules and hover states |
| `$ok` / `$warn` | `#2F7D5A` / `#A66A22` | Status only — certification and permit states |

Then run `npm run css`.

Use `$bright` surgically. If more than three things on a screen are wearing the
accent, none of them is emphasised any more.

**Dark mode** ships as a toggle — the "Invert" button in the footer, stored in
`localStorage`. Light is the default; the dark tokens are one `@mixin
dark-tokens` block in `_variables.scss` applied through
`:root[data-theme="dark"]`. To ship light-only, delete that block and remove
the toggle button from `src/partials/footer.html`.

## 2 · Fonts

Four roles, set in `_variables.scss` — each doing a different job:

```scss
$font-display: "Anton", Impact, sans-serif;          // uppercase headlines
$font-body:    "Archivo", system-ui, sans-serif;     // 16–18px running copy
$font-mono:    "JetBrains Mono", ui-monospace;       // data, spec tables, labels
$font-hand:    "Caveat", cursive;                    // margin notes, annotations
```

**The fonts ship with the kit.** The woff2 files live in `src/fonts/` (copied
to `dist/fonts/` on build) and the `@font-face` rules are in
`src/scss/_fonts.scss`. There is no Google Fonts request, no `preconnect`, and
nothing external to block the first paint — the site renders correctly offline
and over `file://`.

To swap a family: drop its woff2 into `src/fonts/`, edit the matching
`@font-face` block in `_fonts.scss`, and change the `$font-*` variable.

Keep the four roles even if you swap the families — a condensed display face, a
neutral sans for copy, a mono carrying every number and code on the site, and a
handwriting face for the annotations. The handwriting is what stops the
document texture from reading as machine output; do not drop it to three.

## 3 · Images

**The image slots ship empty on purpose.** Each one is a dashed plate with a
blueprint grid and an `IMAGE` marker, sized to the aspect ratio the layout
expects. Drop your own photography in and the plate disappears:

```html
<figure class="plate">
  <picture>
    <source srcset="img/hero.avif" type="image/avif">
    <source srcset="img/hero.webp" type="image/webp">
    <img src="img/hero.jpg" alt="Steel frame at sunset" width="2400" height="1350">
  </picture>
</figure>
```

Always keep `width` and `height` on images — that is what holds CLS under 0.05.

No filter is applied to photography, so what you export is what ships. If you
want the whole site to sit in one tonal range, grade the photos before export
rather than adding a CSS filter — the layout already carries the blue.

There is no icon sprite. The kit draws its marks with type, rules, and CSS
shapes, which is why `dist/` is under 400 KB with nothing to preload.

## 4 · Navigation

Desktop links and the mobile panel both live in `src/partials/nav.html` — edit
them together so they never drift apart. The footer's four columns are in
`src/partials/footer.html`.

The current page gets `aria-current="page"` automatically from the page map at
the top of `tools/build.mjs`; add your new page there when you add a nav link.

## 5 · Adding a page

Duplicate any file in `src/html/`, change the meta block at the top, and run
`npm run build`:

```html
<!--meta {
  "title": "Careers",
  "description": "Open roles at RKU — site engineers, QS, and plant operators."
} -->
```

Those two values feed `<title>`, the meta description, Open Graph, and Twitter
cards. Add the new file to `sitemap.xml`, and to `nav.html` if it belongs in
the menu.

The six services all render from `service-detail.html`. For a static site,
duplicate it once per service and change the copy; the template maps cleanly
onto one CMS content type if you move it later.

## 6 · Section library

Every section is one SCSS partial in `src/scss/sections/`, named for what it
is. Copy the markup from any page and it brings its own styling.

| Code | Section | Copy it from |
| --- | --- | --- |
| K-01 | Certifications wall | `index.html` → `06 · Certifications` |
| K-02 | Equipment fleet | `services.html` → `#fleet` |
| K-03 | Safety record | `about.html` → `#safety` |
| K-04 | Live sites + map | `projects.html` → `#ongoing` |
| K-05 | Client strip | `about.html` → clients row |
| K-06 | Tender CTA | `src/partials/tender.html` |
| K-07 | Awards & press | `about.html` → `05 · Earned` |
| K-08 | Build sequence | `src/partials/build-sequence.html` |
| K-09 | Horizontal site register | `projects.html` → `.hreg` |

K-08 and K-09 are the two motion sections — see §8. Both are written so the
static markup *is* the finished state, so you can drop either into a page that
has no motion flag and it still reads correctly.

The K-04 map is inline SVG, not a tile provider — no API key, no third-party
script, no cookie banner. Move a pin by editing its `cx` / `cy`.

## 7 · SCSS compile

All partials compile to a single stylesheet:

```bash
npx sass src/scss/main.scss dist/css/main.css --style=compressed --no-source-map
```

Bootstrap 5.3's grid and utilities load separately as
`dist/css/bootstrap-grid.min.css`; the kit's own layer always loads after it,
so your overrides win without `!important`.

## 8 · Motion

Scroll motion runs on **Home and Projects only**. Every other page is static.

| Where | What it does |
| --- | --- |
| Home hero | Blueprint ground 0.5×, site log 1.0×, safety stamp 1.4× |
| Home `02 · Programme` | Pinned section; the elevation draws itself across five phases while the readout counts week 0 → 74 |
| Projects site register | Six live sites pulled sideways — vertical scroll, horizontal output |
| Both | A reading-progress rail across the top |

**Turning it on or off** is one line. Each page's `<!--meta -->` block carries a
flag:

```json
{ "title": "…", "description": "…", "sheet": "Home · 01 / 07", "motion": true }
```

Set it to `false`, or delete the line, and `tools/build.mjs` stops emitting the
`motion.js` tag for that page. Add it to another page and that page gets the
rail plus whichever motion sections it contains. Nothing else changes.

**It costs those two pages nothing on mobile.** `src/js/motion.js` fetches GSAP
and ScrollTrigger itself, at runtime, and only when *all* of these hold:

- the viewport is at least 900 px wide,
- `prefers-reduced-motion` is not set,
- the page actually contains a motion section.

Below that bar the two libraries are never downloaded. The six pages without
the flag never reference them at all.

**Everything degrades to the finished state**, which is why the fallback never
looks broken:

- No JS, reduced motion, or a phone → the elevation is *already drawn*, the
  readout reads 100% / Handover / 11 days early, and the register is an
  ordinary swipeable row.
- The progress rail is plain DOM and a scroll listener, so it works even where
  GSAP is deliberately skipped.

Scroll reveals elsewhere still use `IntersectionObserver` on `class="reveal"`
and need no library.

GSAP's standard licence is free for most uses; if you charge end users for
access to the site, check <https://gsap.com/licensing>. Delete `"motion": true`
from both meta blocks and the kit is fully functional without it.

## 9 · Contact and tender forms

Both forms validate in the browser, mark invalid fields, move focus to the
first error, and disable the submit button while sending. No data leaves the
page in the demo.

**Formspree** — add the action, then delete the `e.preventDefault()` branch at
the end of the submit handler in `src/js/main.js`:

```html
<form class="form-x" action="https://formspree.io/f/YOUR_ID" method="POST" data-validate>
```

**Netlify Forms** — add the `netlify` attribute and a hidden `form-name` field.

**Your own backend** — post the `FormData` from the submit handler.

The tender form accepts ZIP, PDF, DWG, and XLSX uploads. Check your endpoint's
upload limit before promising 40 MB.

## 10 · Deploying

It's static HTML, so anything works: Netlify, Vercel, Cloudflare Pages, GitHub
Pages, or plain shared hosting over FTP. Upload `dist/`. There is no build step
to configure.

Before you go live:

- Put your real domain in `robots.txt` and `sitemap.xml`
- Replace the `ranggakaryautama.example` URLs in the canonical, Open Graph, and
  Twitter tags in `src/partials/head.html`
- Replace the JSON-LD `GeneralContractor` block with the real business details
  — name, address, phone, opening hours, service area
- Replace all demo content (see below)

## 11 · SEO and accessibility

Shipped as standard: semantic HTML5 landmarks, one `<h1>` per page, skip link,
visible focus states, `alt` on every image, ARIA on the nav toggle and filter
buttons, `role="status"` on form feedback, Open Graph and Twitter cards, JSON-LD
`GeneralContractor`, `sitemap.xml`, and `robots.txt`.

Targets: Lighthouse Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95,
SEO 100. JavaScript is ~9 kB without GSAP, ~80 kB with it.

## 12 · Demo content

The firm **Rangga Karya Utama (RKU)** — its projects, staff, clients,
certificates, awards, and statistics — is fictitious and exists only to show
the kit reading like a real company. Replace all of it before launch. In
particular: certification numbers and validity dates, the safety statistics,
client names and logos, team names and portraits, and every project case study.

## Browser support

Chrome, Edge, Safari, Firefox — current and previous major versions. iOS Safari
15+ and Android Chrome. Tested at 320, 375, 414, 768, 1024, and 1440 px.

## Support and licence

Six months of support is included with your purchase — reply to your receipt.
Licence terms are in `LICENSE`: one end product per licence, no redistribution
of the kit itself.

---

ContractorX Kit v1 · MGL Website Kits
