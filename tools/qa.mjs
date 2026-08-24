import pw from "/opt/node22/lib/node_modules/playwright/index.js";
const pages = ["index","services","service-detail","projects","project-detail","about","contact","docs"];
const b = await pw.chromium.launch();
for (const p of pages) {
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const problems = [];
  page.on("console", m => { if (m.type() === "error") problems.push("console: " + m.text()); });
  page.on("pageerror", e => problems.push("pageerror: " + e.message));
  const res = await page.goto(`http://localhost:4321/${p}.html`, { waitUntil: "networkidle" });
  const audit = await page.evaluate(() => {
    const out = {};
    out.overflow = document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth : 0;
    out.imgNoAlt = [...document.querySelectorAll("img")].filter(i => !i.hasAttribute("alt")).length;
    const ids = [...document.querySelectorAll("[id]")].map(e => e.id);
    out.dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
    out.badUse = [...document.querySelectorAll("use")].filter(u => {
      const h = u.getAttribute("href") || "";
      return h.startsWith("#") && !document.getElementById(h.slice(1));
    }).map(u => u.getAttribute("href"));
    out.links = [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")).filter(h => h && !h.startsWith("http") && !h.startsWith("mailto") && !h.startsWith("tel"));
    out.h1 = document.querySelectorAll("h1").length;
    return out;
  });
  console.log(`\n== ${p} (${res.status()})`);
  if (problems.length) console.log("  ", problems.join("\n   "));
  if (audit.overflow) console.log("   H-OVERFLOW", audit.overflow);
  if (audit.imgNoAlt) console.log("   IMG-NO-ALT", audit.imgNoAlt);
  if (audit.dupIds.length) console.log("   DUP-IDS", [...new Set(audit.dupIds)].join(","));
  if (audit.badUse.length) console.log("   BROKEN-SPRITE", [...new Set(audit.badUse)].join(","));
  if (audit.h1 !== 1) console.log("   H1-COUNT", audit.h1);
  const bad = [...new Set(audit.links)].filter(h => { const f = h.split("#")[0]; return f && !pages.includes(f.replace(".html","")); });
  if (bad.length) console.log("   BAD-LINK", bad.join(","));
  await page.close();
}
await b.close();
