import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  Sun,
  MoonStar,
  Laptop,
  HardHat,
  Ruler,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Camera,
  FileCode2,
  Palette,
  Package,
  Send,
  ClipboardCheck,
} from "lucide-react";

/* ─────────────────────────────────────────────── */
/* Utilities                                       */
/* ─────────────────────────────────────────────── */

const cn = (...v: (string | false | null | undefined)[]) =>
  v.filter(Boolean).join(" ");

const ease = [0.2, 0.7, 0.2, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -60px 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return { ref, value };
}

function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const { ref, value } = useCountUp(to);
  return (
    <span ref={ref} className={cn("num-tabular", className)}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────── */
/* Theme                                           */
/* ─────────────────────────────────────────────── */

type Theme = "system" | "light" | "dark";

function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const t = localStorage.getItem("cx-theme") as Theme | null;
      return t ?? "system";
    } catch {
      return "system";
    }
  });
  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: Theme) => {
      const isDark =
        t === "dark" ||
        (t === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };
    apply(theme);
    try {
      if (theme === "system") localStorage.removeItem("cx-theme");
      else localStorage.setItem("cx-theme", theme);
    } catch {
      /* ignore */
    }
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => apply("system");
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [theme]);
  return [theme, setTheme];
}

function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const cycle = () =>
    setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system");
  const Icon = theme === "dark" ? MoonStar : theme === "light" ? Sun : Laptop;
  const label = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "Auto";
  return (
    <button
      onClick={cycle}
      className="f-mono flex items-center gap-2 border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
      aria-label="Toggle theme"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────── */
/* Nav                                             */
/* ─────────────────────────────────────────────── */

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3 md:px-10">
        <a href="#top" className="flex items-baseline gap-2.5">
          <span className="f-mono bg-foreground px-1.5 py-0.5 text-[10px] font-bold tracking-[0.15em] text-background">
            MGL
          </span>
          <span className="f-display text-[17px] font-bold tracking-tight">
            ContractorX <span className="text-muted-foreground font-medium">/ Kit v1</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {[
            ["Overview", "#overview"],
            ["Sitemap", "#sitemap"],
            ["Sections", "#sections"],
            ["Direction", "#direction"],
            ["Spec", "#spec"],
            ["Timeline", "#timeline"],
            ["Distro", "#distro"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#cta"
            className="hidden md:inline-flex items-center gap-1.5 bg-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-background f-mono hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Ship it <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}

function MetaStrip() {
  const cells = [
    ["Sheet", "01 / 12"],
    ["Brand", "MGL Website Kits"],
    ["Product", "ContractorX Kit"],
    ["Rev", "A · 2026·08·24"],
  ];
  return (
    <div className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <div className="grid grid-cols-2 border-l border-border/70 md:grid-cols-4">
          {cells.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-0.5 border-r border-border/70 px-4 py-2.5"
            >
              <span className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {k}
              </span>
              <span className="f-mono text-[11px] font-medium uppercase tracking-[0.12em]">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Hero                                            */
/* ─────────────────────────────────────────────── */

function Hero() {
  const words = ["The", "website", "kit", "contractors", "would"];
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="absolute inset-0 -z-10 bp-grid opacity-70 [mask-image:radial-gradient(ellipse_at_50%_30%,black_35%,transparent_85%)]" />
      <div className="absolute inset-0 -z-10 spotlight" />
      <div className="beam absolute inset-0 -z-10 overflow-hidden">
        <div className="beam-line" />
      </div>

      <div className="mx-auto max-w-[1240px] px-6 pt-16 pb-24 md:px-10 md:pt-24 md:pb-32">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6 flex items-center gap-3 f-mono text-[11px] uppercase tracking-[0.16em] text-accent"
            >
              <span className="h-px w-6 bg-accent" />
              Brief · ContractorX Kit · $39
            </motion.div>

            <h1 className="f-display text-[clamp(44px,7.8vw,104px)] font-bold leading-[0.94] tracking-[-0.035em] text-balance">
              <motion.span
                variants={stagger}
                initial="hidden"
                animate="show"
                className="inline"
              >
                {words.map((w, i) => (
                  <motion.span key={i} variants={fadeUp} className="inline-block mr-[0.22em]">
                    {w === "website" ? (
                      <span className="border-b-[3px] border-foreground pb-1">
                        {w}
                      </span>
                    ) : (
                      w
                    )}
                  </motion.span>
                ))}
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease }}
                className="block"
              >
                actually{" "}
                <em className="text-accent font-medium italic" style={{ fontVariationSettings: "'opsz' 96" }}>
                  buy.
                </em>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.55, ease }}
              className="mt-7 max-w-[52ch] text-[17px] leading-[1.55] text-foreground/75"
            >
              <strong className="font-semibold">MGL Website Kits</strong> —
              premium ready-to-launch templates for real-world businesses. This
              brief specs ContractorX v1: seven pages, twenty-plus sections,
              Bootstrap 5 + SCSS, built for construction firms who are tired of
              looking like a 2014 boxed theme. Four days end-to-end.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#sitemap"
                className="group f-mono inline-flex items-center gap-2 bg-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-background transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_hsl(var(--accent))]"
              >
                Read the brief
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#timeline"
                className="group f-mono inline-flex items-center gap-2 border border-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-foreground transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_hsl(var(--foreground))]"
              >
                4-day plan
              </a>
            </motion.div>
          </div>

          {/* Spec card */}
          <motion.aside
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease }}
            whileHover={{ y: -4 }}
            className="tick-corners relative border border-foreground bg-card p-5 shadow-[6px_6px_0_hsl(var(--foreground)/0.15)]"
          >
            <span className="tc-bl" />
            <span className="tc-br" />
            <div className="mb-3 flex justify-between border-b border-border pb-2.5">
              <span className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Product · Rev A
              </span>
              <span className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                MGL-KIT-001
              </span>
            </div>
            <ul className="space-y-0">
              {[
                ["Product", "ContractorX Kit v1"],
                ["Category", "Contractor · Construction"],
                ["Price", "$39 · Bundle $79"],
                ["Channels", "Store · Gumroad · Codester"],
                ["Stack", "HTML5 · Bootstrap 5"],
                ["Pages", "7 + docs"],
                ["Sections", "20+ (15 master · 7 kit)"],
                ["Timeline", "Day 08 – 11 · 4 days"],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="grid grid-cols-[95px_1fr] gap-3 border-b border-dashed border-border/70 py-2 f-mono text-[11px]"
                >
                  <span className="uppercase tracking-[0.1em] text-muted-foreground">
                    {k}
                  </span>
                  <span>{v}</span>
                </li>
              ))}
              <li className="grid grid-cols-[95px_1fr] gap-3 py-2 f-mono text-[11px]">
                <span className="uppercase tracking-[0.1em] text-muted-foreground">
                  Status
                </span>
                <span className="text-accent">Ready to build ▸</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2 f-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <span>0</span>
              <span className="relative h-px flex-1 bg-border">
                <span className="absolute -top-1 left-0 h-2 w-px bg-border" />
                <span className="absolute -top-1 right-0 h-2 w-px bg-border" />
              </span>
              <span>320 mm</span>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* Marquee                                         */
/* ─────────────────────────────────────────────── */

function Marquee() {
  const items = [
    "General contracting",
    "Civil works",
    "MEP",
    "Renovation",
    "Fit-out",
    "Site preparation",
    "Design-build",
    "Infrastructure",
    "Industrial construction",
    "Structural steel",
  ];
  const track = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border/70 bg-secondary py-3">
      <div className="marquee-track">
        {track.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-3 f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            <span className="text-accent">◆</span>
            {label}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-secondary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-secondary to-transparent" />
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Section wrapper                                 */
/* ─────────────────────────────────────────────── */

function SectionHead({
  no,
  title,
  lede,
}: {
  no: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
}) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-[110px_1fr] md:gap-8">
      <Reveal>
        <div className="border-t-2 border-foreground pt-2.5 f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {no}
        </div>
      </Reveal>
      <div>
        <Reveal>
          <h2 className="f-display text-[clamp(28px,3.8vw,44px)] font-bold leading-[1.05] tracking-[-0.02em] text-balance">
            {title}
          </h2>
        </Reveal>
        {lede && (
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.55] text-foreground/75">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("border-b border-border/70 py-20 md:py-28", className)}
    >
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* §01 Positioning                                 */
/* ─────────────────────────────────────────────── */

function Positioning() {
  const rows = [
    {
      title: "The line",
      body:
        "\"Premium ready-to-launch website kits for real-world businesses.\"",
      mono: false,
    },
    {
      title: "Who buys this kit",
      body:
        "Freelance devs and small agencies serving contractor / construction clients — plus contractor owners hiring their first serious website.",
    },
    {
      title: "Why it wins the niche",
      body:
        "Every generic contractor theme skips the sections that actually convert a tender: certifications, equipment fleet, safety record, past projects. This kit ships with them by default.",
    },
    {
      title: "Not for",
      body:
        "Not for landing-page micro-sites, single-page brochures, or clients that need a headless CMS. Static HTML kit, buyer edits in-place.",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease }}
          className="tick-corners relative border border-border bg-card p-6"
        >
          <span className="tc-bl" />
          <span className="tc-br" />
          <div className="f-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            {r.title}
          </div>
          <p className={cn("mt-3 text-[16px] leading-[1.5]", r.mono && "f-mono text-[14px]")}>
            {r.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §02 Sitemap                                     */
/* ─────────────────────────────────────────────── */

const pages = [
  { code: "P-01", name: "Home", note: "Hero · Stats · Services teaser · Featured projects · Certifications · Clients · CTA" },
  { code: "P-02", name: "About", note: "Story · Team · Values · Milestones · Certifications · Awards" },
  { code: "P-03", name: "Services", note: "All service offerings, categorised · Compare table · Tender CTA" },
  { code: "P-04", name: "Service Detail", note: "Deep-dive template — used by all 6 services (dynamic-ready)" },
  { code: "P-05", name: "Projects", note: "Filterable portfolio · By sector · By year · Featured strip" },
  { code: "P-06", name: "Project Detail", note: "Case study — brief, scope, timeline, gallery, testimonial, spec table" },
  { code: "P-07", name: "Contact", note: "Form · Office locations · Tender submission CTA · Emergency line" },
];

function Sitemap() {
  return (
    <div className="border border-border bg-card">
      <div className="grid grid-cols-[70px_180px_1fr] border-b border-border bg-muted/50 px-4 py-2 f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Code</span>
        <span>Page</span>
        <span>Contents</span>
      </div>
      {pages.map((p, i) => (
        <motion.div
          key={p.code}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease }}
          className="grid grid-cols-[70px_180px_1fr] items-baseline border-b border-border/60 px-4 py-4 last:border-b-0 hover:bg-accent/5 transition-colors"
        >
          <span className="f-mono text-[11px] text-accent">{p.code}</span>
          <span className="f-display text-[17px] font-semibold tracking-tight">{p.name}</span>
          <span className="f-mono text-[12px] leading-[1.55] text-foreground/75">{p.note}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §03 Sections library                            */
/* ─────────────────────────────────────────────── */

const masterSections = [
  "Navbar", "Hero", "Logo Cloud", "Statistics", "About block",
  "Services grid", "Portfolio", "Process", "Testimonials", "CTA band",
  "FAQ", "Team", "Pricing", "Blog cards", "Contact form", "Footer",
];

const kitSections = [
  { name: "Certifications wall", body: "ISO, safety cert, association logos in a monochrome grid — reads at a glance during procurement review." },
  { name: "Equipment fleet", body: "Cards for cranes, excavators, formwork, batching plant. Real numbers (units, capacity, year) build trust." },
  { name: "Safety record", body: "LTIR / TRIR stats, safety programme, PPE policy, incident-free days counter." },
  { name: "Ongoing projects", body: "Live map + progress bars — signals capacity and current pipeline to prospective clients." },
  { name: "Client logo strip", body: "Named clients across sectors (industrial, commercial, government) — the fastest trust signal." },
  { name: "Tender CTA", body: "Dedicated section for tender / RFP submission — separate flow from general contact." },
  { name: "Awards & press", body: "Industry awards, press mentions, project of the year — earned media stacked visually." },
];

function SectionsLibrary() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.2fr]">
      <div>
        <div className="mb-3 flex justify-between border-b-2 border-foreground pb-2 f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Master library · reusable</span>
          <span>16</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {masterSections.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.03, duration: 0.35, ease }}
              className="f-mono border border-border bg-card px-3 py-2 text-[11px] tracking-tight"
            >
              <span className="text-muted-foreground mr-1.5 text-[9px]">M·{String(i + 1).padStart(2, "0")}</span>
              {s}
            </motion.div>
          ))}
        </div>
        <div className="mt-4 f-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
          → Pulled from <span className="text-accent">MGL Business Kit Starter</span>. Same source across ContractorX, Eventra, Swift Auto.
        </div>
      </div>

      <div>
        <div className="mb-3 flex justify-between border-b-2 border-foreground pb-2 f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Kit-specific · contractor only</span>
          <span>7</span>
        </div>
        <ul className="space-y-2.5">
          {kitSections.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease }}
              className="border border-border bg-card p-4"
            >
              <div className="flex items-baseline gap-3">
                <span className="f-mono text-[10px] text-accent">K·{String(i + 1).padStart(2, "0")}</span>
                <span className="f-display text-[15px] font-semibold leading-tight tracking-tight">{s.name}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-foreground/75">{s.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §04 Art direction                               */
/* ─────────────────────────────────────────────── */

function Swatch({ hex, name, role }: { hex: string; name: string; role: string }) {
  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="aspect-[3/2]" style={{ background: hex }} />
      <div className="p-3">
        <div className="f-display text-[14px] font-semibold tracking-tight">{name}</div>
        <div className="f-mono mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{role}</div>
        <div className="f-mono mt-1 text-[11px]">{hex}</div>
      </div>
    </div>
  );
}

function ArtDirection() {
  const swatches = [
    { hex: "#0F1519", name: "Steel Ink", role: "Base · Text" },
    { hex: "#F4F1EA", name: "Bone", role: "Paper · Ground" },
    { hex: "#E85A1A", name: "Safety Orange", role: "Accent · CTA" },
    { hex: "#1B3A5C", name: "Draft Blue", role: "Secondary" },
    { hex: "#C7C2B8", name: "Concrete", role: "Neutral · Rules" },
    { hex: "#F5C518", name: "Hi-Vis Yellow", role: "Warning · Highlight" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border pb-2">
          Palette · 6 tokens
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {swatches.map((s, i) => (
            <motion.div
              key={s.hex}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease }}
            >
              <Swatch {...s} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-border bg-card p-5">
          <div className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border pb-2">Type pairing</div>
          <div className="mt-3">
            <div className="f-display text-[38px] font-bold leading-none tracking-[-0.03em]">Ag</div>
            <div className="f-mono mt-2 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">Display · Bricolage Grotesque</div>
          </div>
          <div className="mt-4">
            <div className="text-[26px] leading-none">Ag</div>
            <div className="f-mono mt-2 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">Body · Geist</div>
          </div>
          <div className="mt-4">
            <div className="f-mono text-[22px] leading-none">Ag</div>
            <div className="f-mono mt-2 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">Data · JetBrains Mono</div>
          </div>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border pb-2">Photography</div>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            <li className="flex gap-2"><span className="text-accent">✓</span> Real construction — steel, concrete, cranes, sites at dusk</li>
            <li className="flex gap-2"><span className="text-accent">✓</span> Wide, industrial, uncropped — the scale is the story</li>
            <li className="flex gap-2"><span className="text-accent">✓</span> High-contrast grade with warm midtones</li>
            <li className="flex gap-2 text-muted-foreground"><span className="text-destructive">✕</span> No stock handshakes, no white-collar shots</li>
            <li className="flex gap-2 text-muted-foreground"><span className="text-destructive">✕</span> No aerial city shots divorced from real projects</li>
          </ul>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border pb-2">Motion & density</div>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            <li className="flex gap-2"><span className="text-accent">✓</span> GSAP for hero reveal + numbers count-up only</li>
            <li className="flex gap-2"><span className="text-accent">✓</span> Dense grids — trust signals stack visually</li>
            <li className="flex gap-2"><span className="text-accent">✓</span> Blueprint-inspired dimension lines as dividers</li>
            <li className="flex gap-2 text-muted-foreground"><span className="text-destructive">✕</span> No parallax hero, no bouncy micro-animations</li>
            <li className="flex gap-2 text-muted-foreground"><span className="text-destructive">✕</span> No rounded-2xl gradient cards — this isn't a SaaS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §05 Tech spec                                   */
/* ─────────────────────────────────────────────── */

const techRows = [
  ["Markup", "Semantic HTML5 · WAI-ARIA where needed · WCAG 2.1 AA target"],
  ["CSS framework", "Bootstrap 5.3 grid + utilities · custom overrides via SCSS"],
  ["SCSS", "Tokens in _variables.scss · partials per section · 1 output CSS"],
  ["JavaScript", "Vanilla JS · Bootstrap JS bundle · GSAP optional (hero + counters)"],
  ["Forms", "Contact form UI + client validation · no backend (buyer wires Formspree / own)"],
  ["Responsive", "Mobile-first · 320 · 768 · 1024 · 1440 breakpoints"],
  ["SEO", "OG tags · Twitter cards · JSON-LD LocalBusiness · sitemap.xml · robots.txt"],
  ["Performance", "Lighthouse Perf ≥ 90 · LCP < 2.0s · CLS < 0.05 · JS < 80kb"],
  ["Accessibility", "Skip link · focus states · alt text · axe-clean"],
  ["Assets", "AVIF + WebP · SVG icons via sprite · fonts self-hosted with preload"],
  ["Figma", "Light + dark artboards · shared styles · component-linked · Figma-ready"],
  ["Docs", "getting-started, folder-structure, colors, fonts, images, nav, pages, SCSS, GSAP, form, deploy"],
];

function TechSpec() {
  return (
    <div className="border-t-2 border-foreground">
      {techRows.map(([k, v], i) => (
        <motion.div
          key={k}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.03, duration: 0.35, ease }}
          className="grid grid-cols-[120px_1fr] items-baseline gap-4 border-b border-border/60 py-3.5 md:grid-cols-[180px_1fr]"
        >
          <div className="f-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">{k}</div>
          <div className="f-mono text-[13px] leading-[1.55]">{v}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §06 Copy starter                                */
/* ─────────────────────────────────────────────── */

const copyBlocks = [
  {
    label: "Hero headline (EN)",
    text: "Built to last. Priced to bid competitively.",
  },
  {
    label: "Hero sub (EN)",
    text: "Full-service general contractor for commercial, industrial, and residential projects across Southeast Asia. 18 years, 240+ completed sites, zero missed deadlines.",
  },
  {
    label: "Hero headline (ID)",
    text: "Dibangun untuk tahan lama. Dihargai untuk menang tender.",
  },
  {
    label: "Hero sub (ID)",
    text: "Kontraktor umum untuk proyek komersial, industri, dan residensial di Indonesia. 18 tahun, 240+ proyek selesai, tanpa keterlambatan.",
  },
  {
    label: "Services",
    text: "General Contracting · Civil Works · Mechanical, Electrical & Plumbing · Renovation · Interior Fit-out · Site Preparation",
  },
  {
    label: "Stats band",
    text: "18 years in business · 240+ projects delivered · 1.2M m² built · 96% on-time · 0 lost-time incidents in 2025",
  },
  {
    label: "Tender CTA",
    text: "Have an RFP? Send us the docs — you'll get a full technical proposal within 5 business days.",
  },
  {
    label: "Footer promise",
    text: "One contractor, from ground-breaking to hand-over.",
  },
];

function CopyStarter() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {copyBlocks.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.04, duration: 0.4, ease }}
          className="border border-border bg-card p-5"
        >
          <div className="f-mono text-[10px] uppercase tracking-[0.14em] text-accent">{c.label}</div>
          <p className="mt-2 f-display text-[17px] leading-[1.35] tracking-tight">{c.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §07 Deliverables & §08 QA                       */
/* ─────────────────────────────────────────────── */

const deliverables = [
  ["ZIP package (dist + src)", "clean folder, README at root, license included"],
  ["Hosted live demo", "/demo/contractor on own store · linked from product page"],
  ["Figma file", "light + dark artboards · shared styles · handoff-ready"],
  ["6 marketing screenshots", "hero · services · projects · project detail · about · contact"],
  ["Product page copy", "own store + Gumroad + Codester variants (each tuned to channel)"],
  ["Cover image", "1600×900 · niche-obvious visual · optimized for marketplace thumbnail"],
  ["Documentation", "HTML docs + PDF export · covers 12 topics (Day 06)"],
];

const qaChecks = [
  ["Chrome + Safari desktop", "no console errors · no layout shifts"],
  ["iOS Safari · Android Chrome", "375 · 414 · 768 viewports"],
  ["Tablet portrait + landscape", "no hidden overflow"],
  ["All internal links", "no 404s · anchors land on correct section"],
  ["Contact form", "client-side validation · disabled-state on submit"],
  ["Lighthouse", "Perf ≥ 90 · A11y ≥ 95 · Best Prac ≥ 95 · SEO 100"],
  ["HTML validity", "no unclosed tags · no duplicate IDs · alt text on every img"],
  ["Cross-check with sitemap", "every page present · every kit-section rendered in demo"],
];

function DeliverablesQA() {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div>
        <div className="mb-4 flex justify-between border-b-2 border-foreground pb-2 f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Deliverables · Day 10</span>
          <span>Ship</span>
        </div>
        <ul className="space-y-3">
          {deliverables.map(([k, v], i) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease }}
              className="flex gap-3 border-b border-dashed border-border/70 pb-3"
            >
              <div className="mt-1 h-4 w-4 border-[1.5px] border-accent bg-accent/10 flex items-center justify-center text-accent text-[10px] shrink-0">✓</div>
              <div>
                <div className="text-[14.5px] font-medium">{k}</div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">{v}</div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-4 flex justify-between border-b-2 border-foreground pb-2 f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>QA gate · Day 11</span>
          <span>Verify</span>
        </div>
        <ul className="space-y-3">
          {qaChecks.map(([k, v], i) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease }}
              className="flex gap-3 border-b border-dashed border-border/70 pb-3"
            >
              <div className="mt-1 h-4 w-4 border-[1.5px] border-foreground bg-transparent shrink-0" />
              <div>
                <div className="text-[14.5px] font-medium">{k}</div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">{v}</div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §09 Timeline — Day 08–11                        */
/* ─────────────────────────────────────────────── */

const days = [
  {
    day: "Day 08",
    focus: "Struktur",
    output: "Sitemap + wireframe + art direction",
    Icon: Ruler,
    tasks: [
      "Lock sitemap: 7 pages",
      "Wireframe home + service detail + project detail",
      "Art direction moodboard (30-min timebox)",
      "Copy starter (this doc)",
      "Asset shortlist (photos + logos)",
    ],
  },
  {
    day: "Day 09",
    focus: "Build",
    output: "All 7 pages built + responsive",
    Icon: FileCode2,
    tasks: [
      "Home + Services + Contact (master sections)",
      "About + Projects + Project Detail",
      "Service Detail template (reusable across 6)",
      "Kit-specific sections wired to real content",
      "Responsive from the start — not last",
    ],
  },
  {
    day: "Day 10",
    focus: "Polish & package",
    output: "Marketplace-ready package",
    Icon: Package,
    tasks: [
      "Micro-animation pass (GSAP hero + counters)",
      "Figma-ready layout + docs + metadata",
      "6 marketing screenshots + cover image",
      "ZIP with clean folder + README + license",
      "Write product copy for 3 channels",
    ],
  },
  {
    day: "Day 11",
    focus: "QA",
    output: "ContractorX passes gate",
    Icon: ClipboardCheck,
    tasks: [
      "Chrome + Safari + iOS + Android",
      "Tablet + mobile + desktop viewports",
      "Links + typos + HTML validity + console",
      "Lighthouse ≥ 90/95/95/100",
      "One outside eye clicks through demo blind",
    ],
  },
];

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref}>
      <div className="mb-4 flex items-center justify-between f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Target · 4 working days, mandatory sequence</span>
        <span className="text-accent">Day 08 → 11</span>
      </div>
      <div className="relative border border-border bg-card">
        {/* progress rail */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-border" />
        <motion.div style={{ width }} className="absolute left-0 top-0 h-[3px] bg-accent" />

        <div className="grid grid-cols-1 md:grid-cols-4">
          {days.map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              className="border-b border-border md:border-b-0 md:border-r last:border-r-0 p-6 group hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="f-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">{d.day}</div>
                  <div className="mt-1 f-display text-[22px] font-bold leading-none tracking-[-0.02em]">{d.focus}</div>
                </div>
                <div className="border border-border p-1.5 text-muted-foreground group-hover:text-accent group-hover:border-accent transition-colors">
                  <d.Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 f-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
                → {d.output}
              </div>
              <ul className="mt-4 space-y-1.5 text-[13px] leading-[1.5]">
                {d.tasks.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 border border-foreground/60" />
                    <span className="text-foreground/80">{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §10 Distribution                                */
/* ─────────────────────────────────────────────── */

const channels = [
  {
    name: "Own store",
    tag: "Home base · primary",
    price: "$39",
    Icon: BadgeCheck,
    checks: [
      "Product page (Day 16 template) linked from Featured Kits",
      "Live demo at /demo/contractor",
      "Gumroad checkout embedded — skip account/dashboard build",
      "Analytics on: visitors → demo → buy click → checkout → sale",
    ],
  },
  {
    name: "Gumroad",
    tag: "Mirror · Day 19 optimize",
    price: "$39",
    Icon: Send,
    checks: [
      "Thumbnail: strong visual of the website itself (not text-heavy)",
      "Title: niche + format (\"Contractor Website Template · HTML/Bootstrap\")",
      "Clear buyer, package contents, demo link, license, CTA",
      "Same live demo URL as own store (single source of truth)",
    ],
  },
  {
    name: "Codester",
    tag: "Submit · Day 20",
    price: "$39",
    Icon: ShieldCheck,
    checks: [
      "ContractorX submitted first — learn the review process",
      "Complete screenshots, docs, metadata, tags, requirements",
      "Capture any feedback / rejection reason for Eventra + Swift Auto",
      "Do not upload Eventra until ContractorX outcome known",
    ],
  },
];

function Distribution() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {channels.map((c, i) => (
        <motion.article
          key={c.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease }}
          className="tick-corners relative border border-foreground bg-card p-6"
        >
          <span className="tc-bl" />
          <span className="tc-br" />
          <div className="flex items-start justify-between">
            <div>
              <div className="f-display text-[22px] font-bold leading-none tracking-tight">{c.name}</div>
              <div className="mt-1 f-mono text-[10px] uppercase tracking-[0.14em] text-accent">{c.tag}</div>
            </div>
            <div className="border border-border p-2 text-muted-foreground">
              <c.Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 f-display text-[36px] font-bold leading-none tracking-[-0.02em]">
            {c.price}
          </div>
          <ul className="mt-5 space-y-2 text-[13px] leading-[1.5]">
            {c.checks.map((t) => (
              <li key={t} className="flex gap-2 border-b border-dashed border-border/70 pb-2">
                <span className="text-accent">✓</span>
                <span className="text-foreground/80">{t}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §11 Marketing angles                            */
/* ─────────────────────────────────────────────── */

const contentIdeas = [
  { no: "01", title: "Launch post — Threads + LinkedIn", body: "Story of the niche gap: why contractor sites still look like 2014." },
  { no: "02", title: "Homepage walkthrough — 45s video", body: "Scroll from hero → certifications → tender CTA with voice-over." },
  { no: "03", title: "Responsive comparison — carousel", body: "Same page, three devices — proof it holds up on mobile." },
  { no: "04", title: "Before / after — the transformation", body: "Real contractor site vs ContractorX on the same content." },
  { no: "05", title: "UI detail zoom — Pinterest pin", body: "Certifications wall close-up · project detail spec table." },
  { no: "06", title: "Animation clip — 8s hero reel", body: "GSAP reveal + stats counter — shareable, no context needed." },
  { no: "07", title: "Design process — Threads thread", body: "Why we killed the parallax and how the trust-signal grid replaced it." },
  { no: "08", title: "Component showcase — Behance case", body: "Every kit section as its own hero shot with a caption." },
  { no: "09", title: "\"Why we built this\" — LinkedIn essay", body: "Founder POV on why service businesses deserve better templates." },
  { no: "10", title: "Bundle offer — day-10 post-launch push", body: "\"ContractorX + Eventra + Swift Auto = $79. Save $38.\"" },
];

function ContentIdeas() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {contentIdeas.map((c, i) => (
        <motion.div
          key={c.no}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: (i % 3) * 0.05, duration: 0.4, ease }}
          className="border border-border bg-card p-5 hover:border-accent transition-colors"
        >
          <div className="f-mono text-[10px] uppercase tracking-[0.14em] text-accent">C·{c.no}</div>
          <div className="mt-2 f-display text-[15.5px] font-semibold leading-tight tracking-tight">
            {c.title}
          </div>
          <p className="mt-2 text-[13px] leading-[1.5] text-foreground/75">{c.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* §12 Success gate                                */
/* ─────────────────────────────────────────────── */

function SuccessGate() {
  const items = [
    { k: "Finished product", v: <><Counter to={1} /></>, u: "ContractorX packaged" },
    { k: "Live demos", v: <><Counter to={1} /></>, u: "/demo/contractor active" },
    { k: "Marketplace listings", v: <><Counter to={2} /></>, u: "Own store + Gumroad" },
    { k: "Codester submission", v: <>1</>, u: "Submitted for review" },
    { k: "Content assets", v: <><Counter to={10} /></>, u: "From this kit alone" },
    { k: "Lighthouse Perf", v: <>≥<Counter to={90} /></>, u: "Non-negotiable" },
    { k: "Lighthouse A11y", v: <>≥<Counter to={95} /></>, u: "Non-negotiable" },
    { k: "First sales · 30d", v: <><Counter to={1} suffix="–5" /></>, u: "Target window" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((m, i) => (
        <motion.div
          key={m.k}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: i * 0.05, duration: 0.5, ease }}
          className="tick-corners relative border border-foreground bg-card p-5"
        >
          <span className="tc-bl" />
          <span className="tc-br" />
          <div className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{m.k}</div>
          <div className="mt-2 f-display text-[36px] md:text-[42px] font-bold leading-none tracking-[-0.02em]">
            {m.v}
          </div>
          <div className="mt-3 f-mono text-[10.5px] uppercase tracking-[0.1em] text-accent">{m.u}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Footer                                          */
/* ─────────────────────────────────────────────── */

function Footer() {
  return (
    <footer id="cta" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bp-grid opacity-40 [mask-image:radial-gradient(ellipse_at_50%_60%,black_30%,transparent_80%)]" />
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:px-10 md:py-28">
        <Reveal>
          <div className="mx-auto max-w-[26ch] text-center">
            <p className="f-display text-[clamp(30px,5.2vw,58px)] font-medium leading-[1.05] tracking-[-0.025em] text-balance">
              Selesaikan → package → publish → demo → promote → review data →{" "}
              <em className="italic text-accent">baru bikin produk berikutnya.</em>
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#top"
              className="f-mono inline-flex items-center gap-2 bg-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Start Day 08 <Send className="h-3.5 w-3.5" />
            </a>
            <a
              href="#sitemap"
              className="f-mono inline-flex items-center gap-2 border border-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] hover:bg-foreground hover:text-background transition-colors"
            >
              Re-read the brief
            </a>
          </div>
        </Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 f-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span>MGL Website Kits · ContractorX Kit · MGL-KIT-001 · Rev A</span>
          <span>© 2026 · For internal production use</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────── */
/* App                                             */
/* ─────────────────────────────────────────────── */

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div id="top" className="relative min-h-screen bg-background text-foreground">
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-accent"
      />

      <TopNav />
      <MetaStrip />
      <Hero />
      <Marquee />

      <Section id="overview">
        <SectionHead
          no="§01 · Positioning"
          title="What ContractorX is — and who it's for."
          lede={
            <>
              ContractorX is kit #1 of three in this MGL Website Kits sprint.
              Every choice below points at one thing: a template a real
              contractor or their agency would rather buy than build.
            </>
          }
        />
        <Reveal><Positioning /></Reveal>
      </Section>

      <Section id="sitemap">
        <SectionHead
          no="§02 · Sitemap"
          title="Seven pages. No filler."
          lede="The buyer wants to publish and go, not delete unused pages. Every page below earns its place in a construction firm's sales cycle."
        />
        <Reveal><Sitemap /></Reveal>
      </Section>

      <Section id="sections">
        <SectionHead
          no="§03 · Section library"
          title="Sixteen sections from the master. Seven built just for this niche."
          lede="Master sections come from MGL Business Kit Starter (Day 07). Kit-specific sections are the reason a contractor picks this template over a generic multi-purpose theme."
        />
        <SectionsLibrary />
      </Section>

      <Section id="direction">
        <SectionHead
          no="§04 · Art direction"
          title="Steel-ink, safety-orange, blueprint grid — not another SaaS-style landing."
          lede="Design pulled from the site, not from Dribbble. Photography is real construction. Motion is minimal. Density is high because the buyer scans for trust signals."
        />
        <Reveal><ArtDirection /></Reveal>
      </Section>

      <Section id="spec">
        <SectionHead
          no="§05 · Tech spec"
          title="Boring, buyer-editable, marketplace-standards."
          lede="Every buyer has different hosting and different taste. Ship a kit they can crack open, understand in twenty minutes, and edit without breaking."
        />
        <Reveal><TechSpec /></Reveal>
      </Section>

      <Section>
        <SectionHead
          no="§06 · Copy starter"
          title="First draft of every block. Bilingual."
          lede="Copy is 60% of what makes a template feel real. Buyers rarely rewrite from scratch — they tune what you gave them. So the starter has to be usable as-is."
        />
        <CopyStarter />
      </Section>

      <Section>
        <SectionHead
          no="§07 · Deliverables + §08 · QA gate"
          title="What ships on Day 10, and what has to be true before it ships."
          lede="No deliverable in the left column ships unless every check in the right column is green."
        />
        <DeliverablesQA />
      </Section>

      <Section id="timeline">
        <SectionHead
          no="§09 · Timeline"
          title="Four days, four gates. Sequence is mandatory."
          lede="Day 09 does not start until Day 08 output exists. Day 10 does not start on a page that isn't responsive. Day 11 catches everything else."
        />
        <Reveal><Timeline /></Reveal>
      </Section>

      <Section id="distro">
        <SectionHead
          no="§10 · Distribution"
          title="Three channels. Same demo, three thumbnails."
          lede="Own store is the home base — the source of truth for demo, price, and case study. Gumroad and Codester are mirrors that funnel traffic back."
        />
        <Distribution />
      </Section>

      <Section>
        <SectionHead
          no="§11 · Marketing angles"
          title="One kit → ten content assets."
          lede="Day 26 rule: don't ship a kit without also planning the ten pieces of content that will announce it. Below are the ten for ContractorX."
        />
        <Reveal><ContentIdeas /></Reveal>
      </Section>

      <Section>
        <SectionHead
          no="§12 · Success gate"
          title="What has to be true before ContractorX counts as done."
          lede="These map to the Day 30 scorecard. Kit-level slice — the bundle and 3-kit numbers live in the parent roadmap."
        />
        <SuccessGate />
      </Section>

      <Footer />
    </div>
  );
}
