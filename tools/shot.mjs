import pw from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = pw;
const [,, url, out, w=1440, h=900, full="false"] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.8);
  for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 110)); }
  window.scrollTo({ top: 0, behavior: 'instant' });
});
await p.waitForTimeout(1400);
const errs = [];
p.on("pageerror", e => errs.push(String(e)));
await p.screenshot({ path: out, fullPage: full === "true" });
await b.close();
if (errs.length) console.log("ERRORS", errs);
console.log("shot", out);
