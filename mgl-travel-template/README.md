# Wanderlane Travel — HTML Template

A six-page static template for small-group travel and tour operators. Hand-written
SCSS, one vanilla JS file, no build step required to preview.

## Quick start

Open `index.html` in a browser — everything is relative-linked and works from the
filesystem. For local development:

```bash
npx http-server . -p 4321 -c-1 -o
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, stats, featured tours, testimonials, CTA |
| `about.html` | Story, timeline, team |
| `services.html` | Tour listing with chip filtering |
| `service-details.html` | Single tour: itinerary accordion, pricing, departures |
| `portfolio.html` | Photo gallery |
| `contact.html` | Enquiry form and office details |

## Structure

```
mgl-travel-template/
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
follows.

## JavaScript

`assets/js/main.js` is driven by data attributes (`data-header`, `data-reveal`,
`data-count`, `data-filters`, `data-accordion`, `data-contact`) and each feature
no-ops when its markup is absent. GSAP is used for reveals when loaded, with a
CSS-transition fallback otherwise. All motion respects
`prefers-reduced-motion: reduce`.

**Forms are front-end only.** They validate and show a confirmation message but
submit nothing — wire `initForms()` to your endpoint.

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `IntersectionObserver`,
`aspect-ratio` and CSS custom-property-free SCSS output.

## Credits

Bootstrap 5.3.3 (MIT) · GSAP 3.12.5 · Inter and Fraunces (SIL OFL).
Demo copy, prices and departures are fictional.

Full documentation: [`documentation/index.html`](documentation/index.html).
