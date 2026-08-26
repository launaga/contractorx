// ContractorX Kit — page assembler.
// Expands {{> partial}} includes and {{vars}} from src/html into dist/,
// copies assets, and inlines the SVG sprites so the kit works from file://.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const P = "src/partials", H = "src/html", OUT = "dist";
const partial = (n) => readFileSync(join(P, n + ".html"), "utf8");


function expand(html, vars) {
  let out = html;
  for (let i = 0; i < 5; i++) {
    out = out.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => partial(n));
  }
  out = out.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ""));
  return out;
}

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const pages = readdirSync(H).filter((f) => f.endsWith(".html"));
for (const file of pages) {
  const raw = readFileSync(join(H, file), "utf8");
  const meta = raw.match(/<!--meta\s+([\s\S]*?)-->/);
  const vars = meta ? JSON.parse(meta[1]) : {};
  vars.slug = file === "index.html" ? "" : file;
  const nav = { "services.html": "navServices", "projects.html": "navProjects", "about.html": "navAbout", "contact.html": "navContact" }[file];
  if (nav) vars[nav] = ' aria-current="page"';
  // Only pages that opt in load the motion layer — the rest never pay for GSAP.
  vars.motionScript = vars.motion ? '<script src="js/motion.js" defer></script>' : "";
  let html = expand(raw.replace(/<!--meta[\s\S]*?-->\n?/, ""), vars);
  writeFileSync(join(OUT, file), html);
}

// assets
mkdirSync(`${OUT}/css`, { recursive: true });
cpSync("src/js", `${OUT}/js`, { recursive: true });
cpSync("src/img", `${OUT}/img`, { recursive: true });
cpSync("src/fonts", `${OUT}/fonts`, { recursive: true });

cpSync("node_modules/bootstrap/dist/css/bootstrap-grid.min.css", `${OUT}/css/bootstrap-grid.min.css`);
cpSync("node_modules/gsap/dist/gsap.min.js", `${OUT}/js/gsap.min.js`);
cpSync("node_modules/gsap/dist/ScrollTrigger.min.js", `${OUT}/js/ScrollTrigger.min.js`);
for (const f of ["robots.txt", "sitemap.xml", "LICENSE"]) if (existsSync(f)) cpSync(f, `${OUT}/${f}`);
console.log(`built ${pages.length} pages → ${OUT}/`);
