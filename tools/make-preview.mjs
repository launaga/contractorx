// Builds a single self-contained HTML file containing all 8 pages,
// for hosting the demo as one static artifact. Not part of the kit itself.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const pages = [
  ["index", "Home"], ["services", "Services"], ["service-detail", "Service Detail"],
  ["projects", "Projects"], ["project-detail", "Project Detail"], ["about", "About"],
  ["contact", "Contact"], ["docs", "Documentation"],
];

const css = readFileSync("dist/css/bootstrap-grid.min.css", "utf8") + "\n" + readFileSync("dist/css/main.css", "utf8");
const js = ["nav", "counters", "main"].map(f => readFileSync(`dist/js/${f}.js`, "utf8")).join("\n;\n");
const gsap = readFileSync("dist/js/gsap.min.js", "utf8");

const imgCache = new Map();
function dataUri(src) {
  if (!src.endsWith(".svg") || !existsSync(`dist/${src}`)) return src;
  if (!imgCache.has(src)) {
    const svg = readFileSync(`dist/${src}`, "utf8");
    imgCache.set(src, "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64"));
  }
  return imgCache.get(src);
}

const grab = (html, tag) => {
  const open = html.indexOf(`<${tag}`);
  const close = html.lastIndexOf(`</${tag}>`);
  return html.slice(html.indexOf(">", open) + 1, close);
};

let sprites = "", nav = "", footer = "", sections = "";
pages.forEach(([slug], i) => {
  let html = readFileSync(`dist/${slug}.html`, "utf8");
  html = html.replace(/src="(img\/[^"]+)"/g, (_, p) => `src="${dataUri(p)}"`);
  if (i === 0) {
    sprites = html.slice(html.indexOf('<div hidden aria-hidden="true">'), html.indexOf("</div>", html.indexOf("</svg>\n</div>")) + 6);
    nav = html.slice(html.indexOf('<a class="skip-link"'), html.indexOf("</header>") + 9);
    footer = html.slice(html.indexOf('<footer class="footer-x">'), html.indexOf("</footer>") + 9);
  }
  const main = grab(html, "main");
  sections += `\n<div class="cx-page" id="p-${slug}" hidden>${main}</div>\n`;
});

const link = (h) => h.replace(/href="([a-z-]+)\.html(#[\w-]+)?"/g, (_, p, hash) => `href="#/${p}${hash || ""}"`);

const out = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ContractorX Kit — Live Demo</title>
<meta name="description" content="Live demo of the ContractorX Website Kit v1 — 7 pages, 23 sections, natural black and white.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>${css}
.cx-page[hidden]{display:none}
.cx-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:200;display:flex;gap:1px;background:var(--rule-soft);border:1px solid var(--rule);max-width:calc(100vw - 24px);overflow-x:auto}
.cx-bar button{background:var(--paper);color:var(--ink);border:0;padding:9px 13px;font-family:var(--font-mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
.cx-bar button[aria-current="true"]{background:var(--ink);color:var(--paper)}
body{padding-bottom:60px}
</style>
</head><body>
${sprites}
${link(nav)}
${link(sections)}
${link(footer)}
<nav class="cx-bar" aria-label="Demo pages">
${pages.map(([s, l]) => `<button type="button" data-go="${s}">${l}</button>`).join("\n")}
</nav>
<script>${gsap}</script>
<script>
document.documentElement.classList.add('js');
(function(){
  var pages = ${JSON.stringify(pages.map(p => p[0]))};
  function show(slug, hash){
    if (pages.indexOf(slug) < 0) slug = 'index';
    pages.forEach(function(p){ document.getElementById('p-' + p).hidden = (p !== slug); });
    document.querySelectorAll('.cx-bar button').forEach(function(b){ b.setAttribute('aria-current', String(b.dataset.go === slug)); });
    document.querySelectorAll('.nav-x__links a').forEach(function(a){
      var t = (a.getAttribute('href') || '').replace('#/', '').split('#')[0];
      if (t === slug) { a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); }
    });
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-in'); });
    var target = hash && document.getElementById(hash);
    window.scrollTo({ top: target ? target.getBoundingClientRect().top + window.scrollY - 70 : 0, behavior: 'instant' });
  }
  function route(){
    var raw = (location.hash || '#/index').replace('#/', '');
    var parts = raw.split('#');
    show(parts[0] || 'index', parts[1]);
  }
  window.addEventListener('hashchange', route);
  document.querySelectorAll('.cx-bar button').forEach(function(b){
    b.addEventListener('click', function(){ location.hash = '#/' + b.dataset.go; });
  });
  route();
})();
</script>
<script>${js}</script>
</body></html>`;

mkdirSync("marketing/demo", { recursive: true });
writeFileSync("marketing/demo/contractorx-demo.html", out);
console.log("preview written:", (out.length / 1024).toFixed(0) + " kB");
