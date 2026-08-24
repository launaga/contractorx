# ContractorX Kit — Product Brief

**Doc**: MGL-KIT-001 · Rev B
**Product**: ContractorX Website Kit v1
**Parent roadmap**: MGL Website Kits · Day 08 – 11 (of 30)
**Owner**: Naga
**Date**: 2026-08-24

---

## 0 · Snapshot

| Field       | Value                                           |
| ----------- | ----------------------------------------------- |
| Product     | ContractorX Kit v1                              |
| Category    | Contractor · Construction                       |
| Price       | $39 · part of $79 Business Starter Bundle       |
| Channels    | Own store (primary) · Gumroad · Codester        |
| Stack       | HTML5 · Bootstrap 5.3 · SCSS · vanilla JS       |
| Pages       | 7 + documentation                               |
| Sections    | 23 total (16 master + 7 kit-specific)           |
| Timeline    | 4 working days (Day 08 – 11)                    |
| Definition of done | Packaged · published · live demo · promoted |

---

## 1 · Positioning

**Line** — *"Premium ready-to-launch website kits for real-world businesses."*

**Buyer** — freelance devs and small agencies serving contractor / construction clients, plus contractor owners hiring their first serious website.

**Why it wins the niche** — every generic contractor theme skips the sections that actually convert a tender: certifications, equipment fleet, safety record, past projects. This kit ships with them by default.

**Not for** — landing-page micro-sites, single-page brochures, or clients that need a headless CMS. Static HTML kit; buyer edits in-place.

---

## 2 · Sitemap (7 pages)

| Code | Page             | Contents                                                                                          |
| ---- | ---------------- | ------------------------------------------------------------------------------------------------- |
| P-01 | Home             | Hero · Stats · Services teaser · Featured projects · Certifications · Clients · CTA               |
| P-02 | About            | Story · Team · Values · Milestones · Certifications · Awards                                      |
| P-03 | Services         | All service offerings, categorised · Compare table · Tender CTA                                   |
| P-04 | Service Detail   | Deep-dive template — used by all 6 services (dynamic-ready)                                       |
| P-05 | Projects         | Filterable portfolio · By sector · By year · Featured strip                                       |
| P-06 | Project Detail   | Case study — brief, scope, timeline, gallery, testimonial, spec table                             |
| P-07 | Contact          | Form · Office locations · Tender submission CTA · Emergency line                                  |

Plus `docs/` page (getting started, folder structure, edit-in-place guides).

---

## 3 · Section library

### Master (16) — from MGL Business Kit Starter (Day 07). Same source across ContractorX, Eventra, Swift Auto.

Navbar · Hero · Logo Cloud · Statistics · About block · Services grid · Portfolio · Process · Testimonials · CTA band · FAQ · Team · Pricing · Blog cards · Contact form · Footer

### Kit-specific (7) — the reason a contractor picks this kit over a generic theme.

| Code | Section              | Purpose                                                                                          |
| ---- | -------------------- | ------------------------------------------------------------------------------------------------ |
| K-01 | Certifications wall  | ISO, safety cert, association logos in a monochrome grid — reads at a glance during procurement review |
| K-02 | Equipment fleet      | Cards for cranes, excavators, formwork, batching plant. Real numbers (units, capacity, year) build trust |
| K-03 | Safety record        | LTIR / TRIR stats, safety programme, PPE policy, incident-free days counter                      |
| K-04 | Ongoing projects     | Live map + progress bars — signals capacity and current pipeline                                 |
| K-05 | Client logo strip    | Named clients across sectors (industrial, commercial, government) — fastest trust signal         |
| K-06 | Tender CTA           | Dedicated section for tender / RFP submission — separate flow from general contact               |
| K-07 | Awards & press       | Industry awards, press mentions, project of the year — earned media stacked visually             |

---

## 4 · Art direction — **natural black & white**

### Palette

| Token             | Value       | Role                                       |
| ----------------- | ----------- | ------------------------------------------ |
| `--ink`           | `#0A0A0A`   | Base text · headings · dark surfaces       |
| `--paper`         | `#FAFAF8`   | Page ground · warm off-white               |
| `--panel`         | `#F2F2EE`   | Card / panel surface                       |
| `--rule`          | `#111111`   | Strong rules · borders on key elements     |
| `--rule-soft`     | `#D6D5D0`   | Dividers · dashed lines                    |
| `--mute`          | `#6B6B66`   | Secondary text · captions                  |
| `--hilite`        | `#F6F6F0` → `#111111` bg reversal | Section reversal for emphasis (only lever, use rarely) |

No colour accents. Emphasis comes from **weight, scale, ruled space, and reversal** (light-on-dark blocks used sparingly for the hero, one stat band, one CTA).

Dark mode inverts: `#0A0A0A` ground, `#FAFAF8` text, everything else follows.

### Typography

- **Display** — a modern serif with editorial weight: **Instrument Serif** or **Fraunces** (opsz-variable). Used at 48–104 px, italic reserved for a single highlighted word.
- **Body** — a humanist sans: **Inter Tight** or **Söhne** substitute (Geist works). 16 – 18 px, 1.55 leading.
- **Data / labels** — **JetBrains Mono** or **IBM Plex Mono** at 10 – 12 px, uppercase, 0.12 – 0.14em tracking. Used for section numbers, meta rows, table headers.

Never all-uppercase body copy. Never colour highlights — italic + weight only.

### Photography

- Real construction — steel, concrete, cranes, sites at dusk.
- **Duotone black-on-warm-white** (or straight B&W) treatment across every image so the palette holds.
- Wide, industrial, uncropped — the scale is the story.
- No stock handshakes. No hi-vis-jacket portraits. No aerial city shots.

### Structure & motion

- Blueprint-inspired dimension lines and tick corners as dividers.
- Dense grids — trust signals stack visually.
- Motion: reserved. Hero reveal, one counter run-up on stats band. Nothing bouncy. No parallax.
- Respect `prefers-reduced-motion`.

---

## 5 · Tech spec

| Area            | Detail                                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Markup          | Semantic HTML5 · WAI-ARIA where needed · WCAG 2.1 AA target                                                     |
| CSS             | Bootstrap 5.3 grid + utilities · custom overrides via SCSS partials                                             |
| SCSS            | Tokens in `_variables.scss` · one partial per section · single output CSS                                       |
| JavaScript      | Vanilla JS + Bootstrap bundle · **GSAP optional** (hero reveal + counters only)                                 |
| Forms           | Contact form UI + client-side validation · no backend (buyer wires Formspree or their own)                      |
| Responsive      | Mobile-first · 320 · 768 · 1024 · 1440 breakpoints                                                              |
| SEO             | OG tags · Twitter cards · JSON-LD `LocalBusiness` · `sitemap.xml` · `robots.txt`                                |
| Performance     | Lighthouse Perf ≥ 90 · LCP < 2.0s · CLS < 0.05 · JS < 80 kB                                                     |
| Accessibility   | Skip link · visible focus states · alt text · axe-clean                                                         |
| Assets          | AVIF + WebP with `<picture>` fallback · SVG icons via sprite · fonts self-hosted with preload                   |
| Figma           | Light + dark artboards · shared styles · component-linked                                                       |
| Docs            | HTML docs (+ PDF export) covering 12 topics from Day 06 template                                                |

Folder shape:

```
contractorx/
├── src/
│   ├── html/            # 7 pages + docs
│   ├── scss/
│   │   ├── _variables.scss
│   │   ├── _reset.scss
│   │   ├── sections/    # 23 partials
│   │   └── main.scss
│   ├── js/
│   │   ├── main.js
│   │   ├── counters.js
│   │   └── nav.js
│   ├── img/             # AVIF + WebP
│   └── icons/
├── dist/                # built output shipped in ZIP
├── docs/
├── figma/
├── LICENSE
└── README.md
```

---

## 6 · Copy starter (bilingual)

| Block            | English                                                                                                       | Bahasa Indonesia                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Hero headline    | Built to last. Priced to bid competitively.                                                                   | Dibangun untuk tahan lama. Dihargai untuk menang tender.                                                        |
| Hero sub         | Full-service general contractor for commercial, industrial, and residential projects across Southeast Asia. 18 years, 240+ completed sites, zero missed deadlines. | Kontraktor umum untuk proyek komersial, industri, dan residensial di Indonesia. 18 tahun, 240+ proyek selesai, tanpa keterlambatan. |
| Services         | General Contracting · Civil Works · Mechanical, Electrical & Plumbing · Renovation · Interior Fit-out · Site Preparation | Kontraktor Umum · Pekerjaan Sipil · Mekanikal, Elektrikal & Plumbing · Renovasi · Interior Fit-out · Persiapan Lahan |
| Stats band       | 18 years in business · 240+ projects delivered · 1.2M m² built · 96% on-time · 0 lost-time incidents in 2025  | 18 tahun berdiri · 240+ proyek selesai · 1,2 juta m² terbangun · 96% tepat waktu · 0 insiden hilang jam kerja 2025 |
| Tender CTA       | Have an RFP? Send us the docs — you'll get a full technical proposal within 5 business days.                  | Punya RFP? Kirim dokumennya — proposal teknis lengkap dalam 5 hari kerja.                                       |
| Footer promise   | One contractor, from ground-breaking to hand-over.                                                            | Satu kontraktor, dari peletakan batu pertama sampai serah terima.                                               |

---

## 7 · Deliverables (Day 10)

- [ ] ZIP package: clean `dist/` + `src/`, README at root, LICENSE included
- [ ] Hosted live demo at `/demo/contractor` on own store, linked from product page
- [ ] Figma file: light + dark artboards, shared styles, handoff-ready
- [ ] 6 marketing screenshots — hero · services · projects · project detail · about · contact
- [ ] Product page copy in 3 variants — own store · Gumroad · Codester
- [ ] Cover image, 1600×900, niche-obvious visual, marketplace-thumbnail-optimised
- [ ] Documentation — HTML + PDF, covers 12 topics from Day 06 template

## 8 · QA gate (Day 11) — nothing ships until every box is ticked

- [ ] Chrome + Safari desktop — no console errors, no layout shifts
- [ ] iOS Safari + Android Chrome — 375 · 414 · 768 viewports
- [ ] Tablet portrait + landscape — no hidden overflow
- [ ] All internal links — no 404s, anchors land on correct section
- [ ] Contact form — client-side validation, disabled-state on submit
- [ ] Lighthouse — Perf ≥ 90 · A11y ≥ 95 · Best Prac ≥ 95 · SEO 100
- [ ] HTML validity — no unclosed tags, no duplicate IDs, alt on every `<img>`
- [ ] Cross-check with sitemap — every page present, every kit-section rendered in demo

---

## 9 · Timeline (Day 08 – 11, sequence mandatory)

### Day 08 — Struktur
**Output:** sitemap + wireframe + art direction
- Lock sitemap (§2)
- Wireframe Home + Service Detail + Project Detail
- Art direction moodboard (30-min timebox)
- Copy starter (§6)
- Asset shortlist (photos + logos, B&W treatment planned)

### Day 09 — Build
**Output:** all 7 pages built + responsive from the start
- Home + Services + Contact (master sections)
- About + Projects + Project Detail
- Service Detail template (reusable across 6)
- Kit-specific sections wired to real content (§3)
- Responsive audited during build, not after

### Day 10 — Polish & package
**Output:** marketplace-ready package
- GSAP pass (hero + counters only)
- Figma-ready layout + docs + metadata
- 6 marketing screenshots + cover image
- ZIP with clean folder + README + LICENSE
- Product copy for 3 channels (§10)

### Day 11 — QA
**Output:** ContractorX passes gate
- Chrome + Safari + iOS + Android
- Tablet + mobile + desktop viewports
- Links + typos + HTML validity + console
- Lighthouse targets met
- One outside eye clicks through the demo blind

---

## 10 · Distribution

| Channel     | Role                     | Setup notes                                                                                             |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| Own store   | Home base · primary      | Product page (Day 16 template) linked from Featured Kits. Live demo at `/demo/contractor`. Gumroad checkout embedded — skip account/dashboard build. Analytics: visitors → demo → buy click → checkout → sale. |
| Gumroad     | Mirror · optimize Day 19 | Thumbnail = strong visual of the site itself, not text-heavy. Title = niche + format. Clear buyer, package contents, demo link, license, CTA. Same live demo URL. |
| Codester    | Submit Day 20            | ContractorX submitted first — learn the review process. Complete screenshots, docs, metadata, tags, requirements. Capture any rejection reason before uploading Eventra. |

---

## 11 · Marketing angles (Day 26 — 10 assets per kit)

1. Launch post — Threads + LinkedIn — story of the niche gap
2. Homepage walkthrough — 45-second video, voice-over
3. Responsive comparison — carousel across three devices
4. Before / after — generic contractor site vs ContractorX on same content
5. UI detail zoom — Pinterest pins, certifications wall + spec table
6. Animation clip — 8-second hero reel, shareable
7. Design process — Threads thread on why parallax was killed
8. Component showcase — Behance case, each kit section as a hero shot
9. "Why we built this" — LinkedIn essay, founder POV
10. Bundle offer — Day-10 post-launch push, "ContractorX + Eventra + Swift Auto = $79, save $38"

---

## 12 · Success gate (Day 30 scorecard slice)

| Metric                | Target       |
| --------------------- | ------------ |
| Finished product      | 1 (packaged) |
| Live demo             | 1 active     |
| Marketplace listings  | 2 (own store + Gumroad)  |
| Codester submission   | 1            |
| Content assets        | 10 from this kit alone |
| Lighthouse Perf       | ≥ 90         |
| Lighthouse A11y       | ≥ 95         |
| First sales (30d)     | 1 – 5        |

---

## 13 · Guardrails

- **Sequence is mandatory.** Day 09 does not start until Day 08 output exists. Day 10 does not start on a non-responsive page. Day 11 catches everything else.
- **B&W only.** No colour accents. Emphasis via weight, scale, rule, and reversal.
- **Real content beats lorem.** Copy starter (§6) is used verbatim in the demo — the buyer sees a template that reads like a real firm.
- **One kit at a time.** Do not open Eventra until ContractorX is packaged, published, has a live demo, and is promoted.

---

*End of brief — MGL-KIT-001 · Rev B*
