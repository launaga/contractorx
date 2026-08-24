// Generates the kit's placeholder imagery as duotone SVG plates.
// Buyers swap these for real photography — see README §Images.
import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("src/img", { recursive: true });

const INK = "#0A0A0A", PAPER = "#FAFAF8";
const rnd = (s) => () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);

const head = (w, h, id) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${PAPER}"/><stop offset="1" stop-color="#CFCEC8"/></linearGradient>
<pattern id="hatch${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
<line x1="0" y1="0" x2="0" y2="7" stroke="${INK}" stroke-width="1.6" opacity=".5"/></pattern>
</defs>
<rect width="${w}" height="${h}" fill="url(#sky${id})"/>`;

function crane(x, y, s, o = 1) {
  return `<g stroke="${INK}" stroke-width="${2.2 * s}" fill="none" opacity="${o}">
<path d="M${x} ${y} v${-150 * s}"/><path d="M${x - 90 * s} ${y - 150 * s} h${230 * s}"/>
<path d="M${x} ${y - 150 * s} l${-90 * s} ${-46 * s} M${x} ${y - 150 * s} l${140 * s} ${-46 * s}"/>
<path d="M${x - 90 * s} ${y - 196 * s} h${230 * s}"/>
<path d="M${x + 96 * s} ${y - 150 * s} v${52 * s}" stroke-width="${1.2 * s}"/>
<rect x="${x + 86 * s}" y="${y - 98 * s}" width="${20 * s}" height="${16 * s}"/>
${Array.from({ length: 9 }, (_, i) => `<path d="M${x - 6 * s} ${y - (14 + i * 15) * s} l${12 * s} ${-8 * s} M${x + 6 * s} ${y - (14 + i * 15) * s} l${-12 * s} ${-8 * s}"/>`).join("")}
</g>`;
}
function frame(x, y, w, h, cols, rows, fill = "none", op = 1) {
  const g = [];
  for (let c = 0; c <= cols; c++) g.push(`<path d="M${x + (w / cols) * c} ${y} v${h}"/>`);
  for (let r = 0; r <= rows; r++) g.push(`<path d="M${x} ${y + (h / rows) * r} h${w}"/>`);
  for (let c = 0; c < cols; c++) g.push(`<path d="M${x + (w / cols) * c} ${y + h} l${w / cols} ${-h / rows}"/>`);
  return `<g stroke="${INK}" fill="${fill}" stroke-width="2" opacity="${op}">${g.join("")}</g>`;
}
const mass = (d, op = 1) => `<path d="${d}" fill="${INK}" opacity="${op}"/>`;

const scenes = {
  "hero-steel": (w, h) => head(w, h, 1) +
    mass(`M0 ${h} L0 ${h * .62} L${w * .18} ${h * .55} L${w * .34} ${h * .66} L${w * .52} ${h * .5} L${w * .7} ${h * .6} L${w} ${h * .47} L${w} ${h} Z`, .1) +
    frame(w * .04, h * .2, w * .42, h * .68, 6, 5, "none", .92) +
    frame(w * .52, h * .34, w * .3, h * .54, 4, 4, "none", .55) +
    crane(w * .78, h * .9, (w / 1600) * 1.5, .95) +
    `<rect y="${h * .93}" width="${w}" height="${h * .07}" fill="${INK}" opacity=".85"/>`,
  "formwork": (w, h) => head(w, h, 2) +
    `<rect width="${w}" height="${h}" fill="url(#hatch2)" opacity=".22"/>` +
    Array.from({ length: 14 }, (_, i) => `<rect x="${i * (w / 14) + 4}" y="${h * .12 + (i % 3) * 8}" width="${w / 14 - 10}" height="${h * .8}" fill="${INK}" opacity="${.14 + (i % 4) * .16}"/>`).join("") +
    `<rect y="${h * .5}" width="${w}" height="6" fill="${PAPER}" opacity=".8"/>`,
  "crane-dusk": (w, h) => head(w, h, 3) +
    mass(`M0 ${h} L0 ${h * .78} L${w} ${h * .7} L${w} ${h} Z`, .92) +
    crane(w * .3, h * .8, (w / 1600) * 1.7, .9) + crane(w * .68, h * .78, (w / 1600) * 1.1, .55) +
    frame(w * .42, h * .38, w * .2, h * .42, 3, 4, "none", .35),
  "rebar": (w, h) => head(w, h, 4) +
    `<rect width="${w}" height="${h}" fill="${INK}" opacity=".55"/>` +
    Array.from({ length: 22 }, (_, i) => `<path d="M${i * (w / 22)} 0 v${h}" stroke="${PAPER}" stroke-width="3" opacity=".5"/>`).join("") +
    Array.from({ length: 13 }, (_, i) => `<path d="M0 ${i * (h / 13)} h${w}" stroke="${INK}" stroke-width="7" opacity=".95"/>`).join("") +
    Array.from({ length: 13 }, (_, i) => `<path d="M0 ${i * (h / 13) - 4} h${w}" stroke="${PAPER}" stroke-width="2" opacity=".45"/>`).join("") +
    `<rect width="${w}" height="${h}" fill="url(#hatch4)" opacity=".18"/>`,
  "warehouse": (w, h) => head(w, h, 5) + mass(`M0 ${h} L0 ${h * .58} L${w * .5} ${h * .38} L${w} ${h * .58} L${w} ${h} Z`, .88) +
    `<g stroke="${PAPER}" stroke-width="2" opacity=".5">${Array.from({ length: 9 }, (_, i) => `<path d="M${(i + 1) * (w / 10)} ${h * .62} v${h * .3}"/>`).join("")}</g>` + crane(w * .84, h * .6, (w / 1200), .6),
  "apron": (w, h) => head(w, h, 6) + mass(`M0 ${h} L0 ${h * .7} L${w} ${h * .62} L${w} ${h} Z`, .8) +
    `<g stroke="${PAPER}" stroke-width="6" stroke-dasharray="34 26" opacity=".55">${Array.from({ length: 4 }, (_, i) => `<path d="M0 ${h * (.76 + i * .06)} h${w}"/>`).join("")}</g>`,
  "hospital": (w, h) => head(w, h, 7) + frame(w * .1, h * .18, w * .8, h * .68, 7, 6, INK, .82),
  "tower": (w, h) => head(w, h, 8) + frame(w * .3, h * .06, w * .4, h * .86, 4, 10, INK, .88) + frame(w * .04, h * .5, w * .2, h * .42, 2, 4, "none", .4),
  "conveyor": (w, h) => head(w, h, 9) + mass(`M0 ${h * .72} L${w} ${h * .3} L${w} ${h * .44} L0 ${h * .86} Z`, .85) +
    `<g stroke="${INK}" stroke-width="3" opacity=".7">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * (w / 10) + 30} ${h * (.8 - i * .042)} v${h * .2}"/>`).join("")}</g>`,
  "school": (w, h) => head(w, h, 10) + mass(`M${w * .08} ${h} L${w * .08} ${h * .46} L${w * .5} ${h * .3} L${w * .92} ${h * .46} L${w * .92} ${h} Z`, .8) +
    `<g fill="${PAPER}" opacity=".6">${Array.from({ length: 12 }, (_, i) => `<rect x="${w * .14 + (i % 6) * (w * .13)}" y="${h * (.58 + Math.floor(i / 6) * .18)}" width="${w * .07}" height="${h * .1}"/>`).join("")}</g>`,
  "bridge": (w, h) => head(w, h, 11) + `<g stroke="${INK}" stroke-width="5" fill="none" opacity=".9"><path d="M0 ${h * .6} h${w}"/><path d="M${w * .5} ${h * .12} v${h * .48}"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${w * .5} ${h * .16} L${w * (.5 + (i - 6) * .075)} ${h * .6}" stroke-width="2"/>`).join("")}</g>` + mass(`M0 ${h * .64} h${w} v${h * .36} h${-w} Z`, .18),
  "fitout": (w, h) => head(w, h, 12) + frame(w * .06, h * .12, w * .88, h * .74, 6, 4, "none", .9) +
    mass(`M${w * .06} ${h * .86} h${w * .88} v${h * .08} h${-w * .88} Z`, .8),
  "road": (w, h) => head(w, h, 13) + mass(`M0 ${h} L${w * .38} ${h * .34} L${w * .52} ${h * .34} L${w} ${h} Z`, .82) +
    `<g stroke="${PAPER}" stroke-width="8" stroke-dasharray="40 34" opacity=".7"><path d="M${w * .45} ${h * .36} L${w * .5} ${h}"/></g>`,
  "weld": (w, h) => head(w, h, 14) + mass(`M0 ${h} L0 ${h * .5} L${w} ${h * .62} L${w} ${h} Z`, .9) +
    `<g stroke="${PAPER}" stroke-width="3" opacity=".8">${Array.from({ length: 16 }, (_, i) => `<path d="M${w * .3 + i * 6} ${h * .56} l${-14} ${-26}"/>`).join("")}</g>`,
  "survey": (w, h) => head(w, h, 15) + `<g stroke="${INK}" stroke-width="3" fill="none" opacity=".85"><path d="M${w * .5} ${h * .3} v${h * .5}"/><path d="M${w * .5} ${h * .8} l${-w * .1} ${h * .16} M${w * .5} ${h * .8} l${w * .1} ${h * .16} M${w * .5} ${h * .8} v${h * .18}"/><circle cx="${w * .5}" cy="${h * .26}" r="${h * .06}"/></g>` + mass(`M0 ${h * .9} h${w} v${h * .1} h${-w} Z`, .6),
  "pour": (w, h) => head(w, h, 16) + mass(`M0 ${h} L0 ${h * .66} L${w} ${h * .58} L${w} ${h} Z`, .9) +
    `<g fill="${PAPER}" opacity=".55">${Array.from({ length: 40 }, (_, i) => { const r = rnd(i + 7); return `<circle cx="${r() * w}" cy="${h * .6 + r() * h * .35}" r="${2 + r() * 5}"/>`; }).join("")}</g>`,
  "handover": (w, h) => head(w, h, 17) + frame(w * .12, h * .2, w * .76, h * .6, 4, 3, "none", .8) + mass(`M0 ${h * .88} h${w} v${h * .12} h${-w} Z`, .85),
};
const portrait = (id, seed) => {
  const w = 800, h = 1000, r = rnd(seed);
  return head(w, h, 20 + id) +
    `<rect width="${w}" height="${h}" fill="${PAPER}"/>` +
    `<rect width="${w}" height="${h}" fill="url(#hatch${20 + id})" opacity=".08"/>` +
    mass(`M${w * .5 - 250} ${h} c10 -190 90 -250 250 -250 s240 60 250 250 Z`, .9) +
    `<ellipse cx="${w * .5}" cy="${h * .52}" rx="104" ry="124" fill="${INK}" opacity=".92"/>` +
    `<path d="M${w * .5 - 104} ${h * .5} a104 124 0 0 1 208 0 Z" fill="${PAPER}" opacity="${.06 + r() * .06}"/>` +
    `<path d="M${w * .5 - 250} ${h * .86} h500" stroke="${PAPER}" stroke-width="2" opacity=".25"/>` +
    `<rect y="${h - 8}" width="${w}" height="8" fill="${INK}"/></svg>`;
};

const sizes = { "hero-steel": [2400, 1350], "formwork": [1600, 1000], "crane-dusk": [2400, 1200], "rebar": [1600, 900] };
let n = 0;
for (const [name, fn] of Object.entries(scenes)) {
  const [w, h] = sizes[name] || [1200, 900];
  writeFileSync(`src/img/${name}.svg`, fn(w, h) + "</svg>");
  n++;
}
for (let i = 1; i <= 4; i++) { writeFileSync(`src/img/team-0${i}.svg`, portrait(i, i * 97)); n++; }
console.log("wrote", n, "image plates");
