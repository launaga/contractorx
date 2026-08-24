import pw from "/opt/node22/lib/node_modules/playwright/index.js";
const pages = ["index","services","service-detail","projects","project-detail","about","contact","docs"];
const widths = [320, 375, 414, 768, 1024, 1440];
const b = await pw.chromium.launch();
let bad = 0;
for (const w of widths) {
  const page = await b.newPage({ viewport: { width: w, height: 800 } });
  for (const p of pages) {
    await page.goto(`http://localhost:4321/${p}.html`, { waitUntil: "domcontentloaded" });
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const over = doc.scrollWidth > window.innerWidth + 1;
      const wide = over ? [...document.querySelectorAll("body *")].filter(e => {
        const b = e.getBoundingClientRect();
        return b.right > window.innerWidth + 1 && getComputedStyle(e).overflowX !== "auto";
      }).slice(0, 4).map(e => e.tagName + "." + (e.className.toString().split(" ")[0] || "")) : [];
      return { sw: doc.scrollWidth, iw: window.innerWidth, wide };
    });
    if (r.sw > r.iw + 1) { console.log(`OVERFLOW ${w}px ${p}: ${r.sw} > ${r.iw}`, r.wide.join(", ")); bad++; }
  }
  await page.close();
}
await b.close();
console.log(bad ? `${bad} overflow issues` : "no horizontal overflow at 320/375/414/768/1024/1440");
