# Ridgeline Builders — Contractor HTML Template

A six-page static template for general contractors, remodelers and construction
firms. Hand-written SCSS, one vanilla JS file, no build step required to preview.

## Quick start

Open `index.html` in a browser — everything is relative-linked and works from the
filesystem. For local development:

```bash
npx http-server . -p 4321 -c-1 -o
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, stats, services, process, testimonials, CTA |
| `about.html` | Story, timeline, team, licence & insurance credentials |
| `services.html` | Service listing with chip filtering |
| `service-details.html` | Single service: phased scope accordion, bid range, availability |
| `portfolio.html` | Completed projects gallery |
| `contact.html` | Estimate request form with budget and start-date fields |

## Structure

```
mgl-contractor-template/
├── index.html  about.html  services.html
├── service-details.html  portfolio.html  contact.html
├── assets/
│   ├── css/     style.css, responsive.css  (compiled — do not edit)
│   ├── scss/    main.scss, _variables, _components, _responsive
│   ├── js/      main.js
│   └── images/  icons/  fonts/
├── vendor/      bootstrap/  gsap/
├── documentation/index.html
├── changelog.txt
└── README.md
```

## Building the CSS

```bash
sass assets/scss/main.scss        assets/css/style.css      --no-source-map
sass assets/scss/_responsive.scss assets/css/responsive.css --no-source-map
```

Add `--watch` while developing, `--style=compressed` for production.
`_responsive.scss` holds every media query, so breakpoint work never touches
component code.

## Customising

Edit `assets/scss/_variables.scss` first — colours, fonts, spacing scale, radii,
container width and breakpoints all live there. Recompile and the whole template
follows. The default palette is charcoal and safety amber; changing `$brand-700`
and `$accent-500` rebrands it.

## JavaScript

`assets/js/main.js` is driven by data attributes (`data-header`, `data-reveal`,
`data-count`, `data-filters`, `data-accordion`, `data-contact`) and each feature
no-ops when its markup is absent. GSAP is used for reveals when loaded, with a
CSS-transition fallback otherwise. All motion respects
`prefers-reduced-motion: reduce`.

**Forms are front-end only.** They validate and show a confirmation message but
submit nothing — wire `initForms()` to your endpoint.

## Before you publish

The demo copy is fictional. Replace the licence number (CCB #4471820), insurance
figures, warranty terms and testimonials with your own — those claims are
regulated in most jurisdictions.

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `IntersectionObserver` and
`aspect-ratio`.

## Credits

Bootstrap 5.3.3 (MIT) · GSAP 3.12.5 · Inter and Archivo (SIL OFL).

Full documentation: [`documentation/index.html`](documentation/index.html).
