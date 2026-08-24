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
│   ├── partials/       head · navbar · footer · certifications · clients · tender
│   ├── scss/
│   │   ├── _variables.scss     all design tokens
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   ├── _layout.scss
│   │   ├── sections/           23 partials — one per section
│   │   └── main.scss
│   ├── js/             nav.js · counters.js · main.js
│   ├── img/            image plates (SVG)
│   └── icons/          three SVG sprites — UI, certifications, equipment
├── tools/              page assembler + asset generators
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

Everything routes through `src/scss/_variables.scss`. Change these seven values
and the entire kit follows, dark mode included.

| Token | Default | Used for |
| --- | --- | --- |
| `$ink` | `#0A0A0A` | Text, dark surfaces |
| `$paper` | `#FAFAF8` | Page ground (warm off-white) |
| `$panel` | `#F2F2EE` | Cards and panels |
| `$rule` | `#111111` | Strong rules and borders |
| `$rule-soft` | `#D6D5D0` | Dividers, hairline grids |
| `$mute` | `#6B6B66` | Captions, secondary text |
| `$reverse-bg` / `$reverse-fg` | `#111111` / `#F6F6F0` | Reversal blocks — hero, stats, CTA |

Then run `npm run css`.

Adding a brand colour? Put it on `$reverse-bg` first and check contrast. The
design is drawn around a maximum of three reversal blocks per page — past
that, the emphasis stops meaning anything.

**Dark mode** works out of the box: it follows the visitor's OS setting and can
be toggled with the "Invert" button in the footer (stored in `localStorage`).
To ship light-only, delete the `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]` blocks in `_variables.scss` and remove the toggle
button from `src/partials/footer.html`.

## 2 · Fonts

Three roles, set in `_variables.scss`:

```scss
$font-display: "Instrument Serif", Georgia, serif;   // 48–104px, headings
$font-body:    "Inter Tight", system-ui, sans-serif; // 16–18px, running copy
$font-mono:    "JetBrains Mono", ui-monospace;       // 10–12px labels, data
```

The demo loads them from Google Fonts in `src/partials/head.html`. For
production, self-host: drop woff2 files into `dist/fonts/`, replace that
`<link>` with `@font-face` rules, and preload the two faces used above the
fold. Keep the three roles even if you change the families — a display serif, a
humanist sans, and a mono for data. Italic is reserved for exactly one
highlighted word in the hero (`<em class="hilite">`).

## 3 · Images

The kit ships vector plates in `dist/img/` so it weighs almost nothing out of
the box. Replace them with real photography using the same filenames and
nothing else needs to change.

For photographs, use a `<picture>` block so modern formats are served first:

```html
<picture>
  <source srcset="img/hero.avif" type="image/avif">
  <source srcset="img/hero.webp" type="image/webp">
  <img src="img/hero.jpg" alt="Steel frame at sunset" width="2400" height="1350">
</picture>
```

The black-and-white treatment is applied in CSS
(`filter: grayscale(1) contrast(1.06)` on `.plate img`), so colour photos land
in the palette automatically. For a true duotone, export at 100% black on
`#FAFAF8` in your editor and remove that filter.

Always keep `width` and `height` on images — that is what holds CLS under 0.05.

**Icons** live in three sprites under `src/icons/` (UI, certification marks,
equipment silhouettes) and are inlined into each page at build time, so they
work over `file://` with no extra requests. Reference one with
`<svg><use href="#i-arrow-right"></use></svg>`. All draw in `currentColor`.

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
| K-01 | Certifications wall | `src/partials/certifications.html` |
| K-02 | Equipment fleet | `services.html` → `#fleet` |
| K-03 | Safety record | `about.html` → `#safety` |
| K-04 | Ongoing projects + map | `projects.html` → `#ongoing` |
| K-05 | Client logo strip | `src/partials/clients.html` |
| K-06 | Tender CTA | `src/partials/tender.html` |
| K-07 | Awards & press | `about.html` → `#awards` |

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

## 8 · GSAP and motion

GSAP is loaded on the home page only and drives exactly two things: the hero
reveal and the stats counter run-up. Delete
`<script src="js/gsap.min.js">` from `index.html` and both fall back to a CSS
transition and a `requestAnimationFrame` counter — nothing breaks and nothing
looks missing.

Scroll reveals use `IntersectionObserver` on any element with `class="reveal"`.
Everything respects `prefers-reduced-motion`: with it on, content appears
immediately and counters show their final value straight away.

GSAP's standard licence is free for most uses; if you charge end users for
access to the site, check <https://gsap.com/licensing>. The kit is fully
functional without it.

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
