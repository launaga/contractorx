import pw from "/opt/node22/lib/node_modules/playwright/index.js";
const b = await pw.chromium.launch();
const OUT = "marketing/screenshots";
const shots = [
  ["01-hero.png", "index.html", null],
  ["02-services.png", "services.html", "#fleet"],
  ["03-projects.png", "projects.html", "#ongoing"],
  ["04-project-detail.png", "project-detail.html", "#spec"],
  ["05-about.png", "about.html", "#safety"],
  ["06-contact.png", "contact.html", null],
];
for (const [file, page, sel] of shots) {
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto(`http://localhost:4321/${page}`, { waitUntil: "networkidle" });
  await p.evaluate(async () => { const s = Math.round(innerHeight*0.8); for (let y=0;y<document.body.scrollHeight;y+=s){ scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,110)); } scrollTo({top:0,behavior:'instant'}); });
  await p.waitForTimeout(800);
  if (sel) { await p.evaluate(s => document.querySelector(s).scrollIntoView({block:"start",behavior:"instant"}), sel); await p.waitForTimeout(600); }
  await p.screenshot({ path: `${OUT}/${file}` });
  await p.close();
  console.log(file);
}
const c = await b.newPage({ viewport: { width: 1600, height: 900 } });
await c.goto("file://" + process.cwd() + "/marketing/cover.html", { waitUntil: "networkidle" });
await c.waitForTimeout(1200);
await c.screenshot({ path: "marketing/cover-1600x900.png" });
await c.close();
console.log("cover-1600x900.png");
await b.close();
