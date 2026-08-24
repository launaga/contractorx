// Builds three SVG sprites: UI icons, certification marks, equipment silhouettes.
import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("src/icons", { recursive: true });

const ui = {
  "arrow-right": '<path d="M4 12h16M14 6l6 6-6 6"/>',
  "arrow-down": '<path d="M12 4v16M6 14l6 6 6-6"/>',
  "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
  "chevron-right": '<path d="m9 5 7 7-7 7"/>',
  "chevron-down": '<path d="m5 9 7 7 7-7"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
  upload: '<path d="M12 21V9M7 13l5-5 5 5M4 4h16"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  close: '<path d="M6 6 18 18M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  helmet: '<path d="M3 16h18M5 16a7 7 0 0 1 14 0M10 9V5h4v4"/>',
  crane: '<path d="M6 21V4M2 8h16M6 4l-4 4M6 4l12 4M14 8v5M12 13h4v3h-4z"/>',
  building: '<rect x="4" y="3" width="16" height="18"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/>',
  ruler: '<rect x="2" y="8" width="20" height="8"/><path d="M7 8v4M12 8v4M17 8v4"/>',
  shield: '<path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  file: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};
writeFileSync("src/icons/sprite.svg",
`<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${Object.entries(ui).map(([k, d]) =>
`<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">${d}</symbol>`).join("\n")}
</svg>`);

// Certification marks — geometric monochrome badges
const certMark = (id, inner) =>
`<symbol id="c-${id}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">${inner}</symbol>`;
const certs = [
  ["iso9001", '<circle cx="32" cy="32" r="26"/><path d="M32 12v40M12 32h40"/>'],
  ["iso14001", '<circle cx="32" cy="32" r="26"/><path d="M32 50c12-6 14-18 14-28-10 2-22 8-22 20 0 4 3 7 8 8Z"/>'],
  ["iso45001", '<path d="M32 6 8 16v18c0 12 10 21 24 24 14-3 24-12 24-24V16Z"/><path d="m22 33 7 7 14-14"/>'],
  ["smk3", '<rect x="8" y="8" width="48" height="48"/><path d="M20 44V26l12-8 12 8v18"/><path d="M28 44V34h8v10"/>'],
  ["lpjk", '<path d="M32 6 6 20v24l26 14 26-14V20Z"/><path d="M32 22v20M22 32h20"/>'],
  ["k3gold", '<circle cx="32" cy="28" r="18"/><path d="m24 46-4 12 12-6 12 6-4-12"/><path d="m26 28 5 5 8-9"/>'],
  ["gbci", '<circle cx="32" cy="32" r="24"/><path d="M32 48V24M32 30c-8 0-12-5-12-11 7 0 12 4 12 11ZM32 34c8 0 12-5 12-11-7 0-12 4-12 11Z"/>'],
  ["ohsas", '<rect x="10" y="10" width="44" height="44" rx="0"/><circle cx="32" cy="32" r="12"/><path d="M32 20v24M20 32h24"/>'],
];
writeFileSync("src/icons/certs.svg",
`<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${certs.map(([a, b]) => certMark(a, b)).join("\n")}\n</svg>`);

// Equipment silhouettes
const eq = {
  "tower-crane": '<path d="M26 56V14M8 18h56M26 14 8 18M26 14l38 8M60 22v14M54 36h12v8H54zM18 56h16"/>',
  "excavator": '<path d="M4 50h44v-14H30l-6-10H8l-4 10Z"/><path d="m48 40 14-22 6 4-10 22"/><circle cx="16" cy="54" r="6"/><circle cx="38" cy="54" r="6"/>',
  "batching-plant": '<path d="M10 56V22h20v34M30 30h16l6 10v16H30M14 22l6-10h6l6 10M38 44h8"/>',
  "formwork": '<path d="M6 12h56v40H6z"/><path d="M20 12v40M34 12v40M48 12v40M6 32h56"/>',
  "wheel-loader": '<path d="M6 46h30V30h12l8 6v10"/><path d="m6 30 10-8v10"/><circle cx="18" cy="52" r="7"/><circle cx="46" cy="52" r="7"/>',
  "concrete-pump": '<path d="M6 50h34V36H16l-4 8Z"/><path d="M22 36 40 12l10 4-14 24"/><circle cx="14" cy="54" r="5"/><circle cx="32" cy="54" r="5"/>',
};
writeFileSync("src/icons/equipment.svg",
`<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${Object.entries(eq).map(([k, d]) =>
`<symbol id="e-${k}" viewBox="0 0 72 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="miter">${d}</symbol>`).join("\n")}\n</svg>`);
console.log("sprites written");
