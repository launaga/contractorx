# ContractorX Kit v1 — handoff

Everything below is in `contractorx-kit-v1.zip`. Branch:
`claude/contractorx-kit-build-h8qqg1` · PR #3.

## What to open first

| File | Why |
| --- | --- |
| `dist/index.html` | Double-click it. The whole site runs from the file system — no server, no build. |
| `README.md` | Twelve sections. §1 Colours, §2 Fonts, §8 Motion are the ones you'll actually edit. |
| `docs/contractorx-documentation.pdf` | The same documentation as `dist/docs.html`, printable — this is what buyers get. |
| `docs/qa-report.md` | Every number I claim, and every defect found and fixed. |

## The three rules the design is built on

1. **Grounds are white and soft blue only.** Navy is for objects — the site
   log, tender docket, permit slip, footer title block — never a whole section.
2. **Image slots ship empty.** Dashed plate, blueprint grid, `IMAGE` marker, at
   the aspect ratio the layout expects. Drop a photo in and the plate vanishes.
3. **One accent, used surgically.** `#1568D6` on one word per headline, the
   CTAs, and key numbers. If more than three things wear it, none of them reads.

## Motion

Every page: a reading-progress rail and a parallaxed page head. Then one
signature each, so no effect repeats twice in a row.

| Page | Signature |
| --- | --- |
| Home | `02 · Programme` pins ~2.5 screens; the elevation draws itself across five phases |
| Projects | Six live sites pulled sideways |
| Project Detail | Contact sheet, week 05 → 59, pulled sideways |
| About | Sticky year following the record |
| Services | Rate-card headings stay in view |
| Service Detail | Capability table holds while the scope steps pass |
| Contact | Enquiry slip holds while the second column scrolls |
| Docs | Corner strip naming the current topic |

**Turn it off per page** with `"motion": false` in that page's meta block at the
top of its `src/html/*.html` file. Only Home, Projects and Project Detail use
GSAP; the other five signatures are `position: sticky` or an
`IntersectionObserver`.

GSAP is fetched at runtime by `src/js/motion.js`, and only above 900 px with
`prefers-reduced-motion` unset — so phones never download it.

## Verified

| | |
| --- | --- |
| Lighthouse desktop, all 8 pages | Perf 99–100 · A11y 100 · Best practices 100 · SEO 100 |
| Responsive | No horizontal overflow at 320 / 375 / 414 / 768 / 1024 / 1440 |
| Structural | No console errors, no duplicate ids, no broken refs, one `<h1>` per page |
| Reduced motion | GSAP loads on 0 of 8 pages |
| 390 px | GSAP loads on 0 of 8 pages |
| No JavaScript | Every page renders static, with the drawing already finished |

**One thing I could not verify:** I have never seen the deployed site. This
build environment blocks `vercel.app`, so every result above is from the local
build. Worth one scroll of the Vercel preview before you sell it.

## Editing without the toolchain

`dist/` is the finished site. Change text and images there and upload the
folder — every path is relative. You only need Node if you want to change the
design:

```bash
npm install
npm run build      # assemble HTML into dist/ and compile SCSS
npm start          # build, then serve dist/ at http://localhost:4321
npm run css:watch  # recompile SCSS on every save
```

## What is not done

- The **image slots are empty by design** — that is your content to add.
- The forms **validate but do not send.** README §9 has the Formspree wiring;
  it is two lines.
- PR #3 is **still a draft.** Merging is your call.
