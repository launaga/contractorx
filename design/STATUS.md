# ContractorX — where we are

Last updated 24 Aug 2026 · branch `claude/contractorx-kit-build-h8qqg1` · PR #3

## Approved

- **Direction: B + C.** Datasheet structure (spec tables, data ticker, figures
  plotted against industry) carrying site-document texture (site log, stamps,
  tape, handwriting, dark ↔ charcoal ↔ kraft rhythm).
- **Palette: B's warm scale.** Every neutral on one warm temperature so the
  dark and kraft grounds read as one light source. Third ground (`--char`
  `#151312`) added so consecutive dark stretches over a long page differ.

## Done — design only, no implementation

Seven full pages designed and rendered to PNG in `design/`:

| File | Page | Its document object |
| --- | --- | --- |
| `D-home-full` | Home | Daily site log, 0 LTI stamp |
| `P02-about` | About | Territory map, milestone register, team ID cards |
| `P03-services` | Services | Rate card, coverage matrix |
| `P04-service-detail` | Civil works | Method statement MS-CIV-02 |
| `P05-projects` | Projects | Project register, live-site map |
| `P06-project-detail` | Meranti case study | As-built stamp, contact sheet |
| `P07-contact` | Contact | Enquiry slip as a permit form |

`kit.css` is the shared stylesheet for all seven. Earlier exploration frames:
`A-drawing-set`, `B-site-log`, `C-structural`.

## Not done

- **Naga has not signed off the six inner pages yet.** Home is approved;
  P-02 … P-07 were sent for review and the session ended before a verdict.
- **No implementation.** `dist/` and `src/` still hold the rejected v1 black
  and white kit. Rebuilding them in this language is the next step, and only
  after sign-off.
- Vercel preview builds from `dist/`, so it still serves the OLD design.
- Figma file `NwUODStvY4Z5VEBjM0e7D6` has tokens, text styles, and the Home
  light hero only — five sections and the dark artboard outstanding.

## Process (also in ~/.claude/CLAUDE.md)

Design first, always. PNG before code. Directions → one full page → sign-off →
build. No build machinery before the look is agreed.
