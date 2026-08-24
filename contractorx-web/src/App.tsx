import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  Sun,
  MoonStar,
  Laptop,
  Hammer,
  Ruler,
  Camera,
  Wallet,
  Users,
  Building2,
  BookMarked,
  Send,
  ShieldCheck,
  Circle,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────── */
/* Small utilities                                 */
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
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.2, margin: "0px 0px -60px 0px" });
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

/* Animated count-up when in view */
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
/* Theme (system → light → dark cycle)             */
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
            CX
          </span>
          <span className="f-display text-[17px] font-bold tracking-tight">
            ContractorX
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {[
            ["Problem", "#problem"],
            ["Product", "#product"],
            ["PRD", "#prd"],
            ["Roadmap", "#roadmap"],
            ["Metrics", "#metrics"],
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
            Launch <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* Meta strip under nav */
function MetaStrip() {
  const cells = [
    ["Sheet", "00 / 09"],
    ["Project", "ContractorX Web"],
    ["Author", "Naga · Studio"],
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
  const words = ["The", "site", "office", "in", "your", "pocket,"];
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      {/* Background: blueprint grid + spotlight + beam */}
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
              Sheet 00 · Cover
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
                    {w === "site" ? (
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
                not in your{" "}
                <em className="text-accent font-medium italic" style={{ fontVariationSettings: "'opsz' 96" }}>
                  truck.
                </em>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.55, ease }}
              className="mt-7 max-w-[48ch] text-[17px] leading-[1.55] text-foreground/75"
            >
              ContractorX is the operating system for independent contractors
              and small construction firms — quote to invoice, one thread. Built
              for the mandor who runs three sites, a WhatsApp group of 40, and a
              client who wants a weekly progress photo before sundown.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#prd"
                className="group f-mono inline-flex items-center gap-2 bg-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-background transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_hsl(var(--accent))]"
              >
                Read the spec
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#product"
                className="group f-mono inline-flex items-center gap-2 border border-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-foreground transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_hsl(var(--foreground))]"
              >
                See the product
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
                Doc · Rev A
              </span>
              <span className="f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                CX-PRD-001
              </span>
            </div>
            <ul className="space-y-0">
              {[
                ["Product", "ContractorX Web + PWA"],
                ["Segment", "Kontraktor 5 – 100 crew"],
                ["Market", "Indonesia · SEA"],
                ["Stack", "Next 15 · Supabase"],
                ["Team", "1 PM · 2 Eng · 1 Design"],
                ["Runway", "22 wks to v1.0"],
                ["Pricing", "Rp 199k / user / mo"],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="grid grid-cols-[90px_1fr] gap-3 border-b border-dashed border-border/70 py-2 f-mono text-[11px]"
                >
                  <span className="uppercase tracking-[0.1em] text-muted-foreground">
                    {k}
                  </span>
                  <span>{v}</span>
                </li>
              ))}
              <li className="grid grid-cols-[90px_1fr] gap-3 py-2 f-mono text-[11px]">
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
    "Renovasi rumah 2 lantai",
    "Bedah dapur",
    "Interior apartemen studio",
    "Konstruksi ruko",
    "Kamar mandi upgrade",
    "Fasad + landscape",
    "Kantor 120 m²",
    "Villa 1 tingkat",
    "Renovasi kamar tidur utama",
    "Loteng jadi kamar",
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
      className={cn(
        "border-b border-border/70 py-20 md:py-28",
        className,
      )}
    >
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* Problem — asymmetric bento                      */
/* ─────────────────────────────────────────────── */

function ProblemBento() {
  const cells = [
    {
      big: true,
      qty: <><Counter to={73} suffix="%" /></>,
      sub: "of quotes lose money",
      body:
        "Quotes are built from memory or a two-year-old Excel; margins evaporate before the first pour of concrete. The BOQ nobody keeps up-to-date is where profit goes to die.",
    },
    {
      qty: <><Counter to={21} suffix="d" /></>,
      sub: "avg. time-to-first-invoice",
      body:
        "Progress claims sit in a notebook until Sunday. Cashflow stalls; workers get paid from personal savings.",
    },
    {
      qty: <><Counter to={4} decimals={1} suffix=" tools" /></>,
      sub: "used per active project",
      body:
        "WhatsApp, Excel, Google Photos, printed BOQ, sometimes Trello. No single source of truth — disputes are word-vs-word.",
    },
    {
      qty: <>0</>,
      sub: "clients happy with visibility",
      body:
        "Owners get a weekly voice note. They pay tens of millions of rupiah on faith and blurry screenshots.",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-[1px] bg-border md:grid-cols-3 md:grid-rows-2">
      {cells.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease }}
          className={cn(
            "group relative overflow-hidden bg-card p-6 md:p-8",
            c.big && "md:col-span-1 md:row-span-2",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bp-grid-sm opacity-0 transition-opacity duration-500 group-hover:opacity-40"
          />
          <div className="relative">
            <div className="f-display text-[44px] md:text-[54px] font-bold leading-none tracking-[-0.03em] text-accent">
              {c.qty}
            </div>
            <div className="mt-2 f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {c.sub}
            </div>
            <p className="mt-4 text-[14px] leading-[1.55] text-foreground/80">
              {c.body}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Product bento                                   */
/* ─────────────────────────────────────────────── */

type Feat = {
  id: string;
  title: string;
  tag: string;
  Icon: React.ComponentType<{ className?: string }>;
  desc: string;
  span?: string;
  visual: React.ReactNode;
};

/* Little inline mocks used inside feature tiles */
function BOQMock() {
  const rows = [
    ["Pas. batako 20×10×40", "230 m²", "Rp 78.000", "6.240k"],
    ["Plester + acian", "230 m²", "Rp 62.000", "4.960k"],
    ["Cat interior 2 lapis", "230 m²", "Rp 41.000", "3.280k"],
    ["Kusen alumunium", "12 unit", "Rp 850.000", "10.200k"],
  ];
  return (
    <div className="relative mt-6 border border-border bg-background/60 p-3 shadow-[3px_3px_0_hsl(var(--foreground)/0.1)]">
      <div className="mb-2 flex items-center justify-between f-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>BOQ · Kamar utama</span>
        <span className="text-accent">margin +18%</span>
      </div>
      <div className="space-y-1">
        {rows.map(([n, q, r, t], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease }}
            className="grid grid-cols-[1fr_60px_74px_60px] items-center gap-2 border-b border-dashed border-border/60 py-1.5 f-mono text-[10px] last:border-b-0"
          >
            <span className="truncate">{n}</span>
            <span className="text-right text-muted-foreground">{q}</span>
            <span className="text-right text-muted-foreground">{r}</span>
            <span className="text-right font-medium">{t}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TimelineMock() {
  const gates = [
    { label: "Pondasi", w: 12, done: true },
    { label: "Struktur", w: 22, done: true },
    { label: "Atap", w: 18, done: false },
    { label: "Finishing", w: 26, done: false },
    { label: "Serah terima", w: 22, done: false },
  ];
  return (
    <div className="mt-6 space-y-3">
      {gates.map((g, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-24 f-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            {g.label}
          </div>
          <div className="relative flex-1 h-4 border border-border bg-background/60">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${g.w * 3}%` }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease }}
              className={cn(
                "h-full",
                g.done ? "bg-accent" : "bg-foreground/30",
              )}
              style={{ maxWidth: "100%" }}
            />
          </div>
          <div className="w-14 text-right f-mono text-[10px] text-muted-foreground num-tabular">
            {g.done ? "✓" : ""} {g.w}%
          </div>
        </div>
      ))}
    </div>
  );
}

function InvoiceMock() {
  return (
    <div className="relative mt-6 border border-border bg-background/60 p-4 shadow-[3px_3px_0_hsl(var(--foreground)/0.1)]">
      <div className="mb-3 flex justify-between border-b border-border pb-2 f-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>INV/2026/08/017</span>
        <span className="text-accent">DIBAYAR</span>
      </div>
      <div className="space-y-1.5 f-mono text-[11px]">
        <div className="flex justify-between"><span>Progress gate 2</span><span>Rp 42.500.000</span></div>
        <div className="flex justify-between text-muted-foreground"><span>PPN 11%</span><span>Rp 4.675.000</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Retensi 5%</span><span>–Rp 2.125.000</span></div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 text-[13px] font-bold text-accent">
          <span>Terbayar</span><span className="num-tabular">Rp 45.050.000</span>
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease }}
        style={{ transformOrigin: "left" }}
        className="mt-3 h-0.5 bg-accent"
      />
    </div>
  );
}

function PhotoLogMock() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-1.5">
      {[
        ["hsl(35 45% 55%)", "hsl(200 40% 30%)"],
        ["hsl(20 55% 45%)", "hsl(0 0% 20%)"],
        ["hsl(45 40% 50%)", "hsl(210 40% 25%)"],
        ["hsl(10 60% 40%)", "hsl(30 15% 40%)"],
        ["hsl(200 30% 35%)", "hsl(180 20% 30%)"],
        ["hsl(50 60% 50%)", "hsl(20 30% 25%)"],
      ].map((g, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease }}
          className="relative aspect-square border border-border"
          style={{
            background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
          }}
        >
          <div className="absolute bottom-1 right-1 f-mono text-[8px] text-white/90 bg-black/40 px-1">
            {`0${i + 1}·8${i + 20}`}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PayrollMock() {
  const rows = [
    ["Adi", "Mandor", "6d", "1.500k"],
    ["Ujang", "Tukang", "6d", "1.020k"],
    ["Iwan", "Tukang", "5d", "850k"],
    ["Rudi", "Kenek", "6d", "720k"],
  ];
  return (
    <div className="mt-6 border border-border bg-background/60">
      <div className="grid grid-cols-4 border-b border-border bg-muted/50 px-3 py-1.5 f-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        <span>Nama</span><span>Peran</span><span>Hari</span><span className="text-right">Bayar</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-4 border-b border-border/60 px-3 py-2 f-mono text-[11px] last:border-b-0">
          <span>{r[0]}</span>
          <span className="text-muted-foreground">{r[1]}</span>
          <span className="text-muted-foreground">{r[2]}</span>
          <span className="text-right font-medium num-tabular">{r[3]}</span>
        </div>
      ))}
    </div>
  );
}

function PortalMock() {
  return (
    <div className="relative mt-6 mx-auto w-full max-w-[260px] rounded-[24px] border-2 border-foreground bg-background p-3 shadow-[6px_6px_0_hsl(var(--foreground)/0.15)]">
      <div className="mb-2 h-1 w-14 mx-auto rounded-full bg-foreground/30" />
      <div className="f-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Ibu Sari · Renovasi 2 lt</div>
      <div className="mt-2 f-display text-[15px] font-bold leading-tight">Gate 2 · Struktur</div>
      <div className="mt-3 border border-border p-2">
        <div className="flex items-center justify-between f-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          <span>Progress</span><span>72%</span>
        </div>
        <div className="mt-1 h-1.5 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "72%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease }}
            className="h-full bg-accent"
          />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {["hsl(20 45% 45%)", "hsl(210 30% 30%)", "hsl(35 45% 50%)"].map((c, i) => (
          <div key={i} className="aspect-square" style={{ background: c }} />
        ))}
      </div>
      <div className="mt-3 flex gap-1.5">
        <div className="flex-1 border border-foreground bg-foreground px-2 py-1.5 text-center f-mono text-[9px] uppercase tracking-[0.12em] text-background">Approve gate</div>
        <div className="border border-border px-2 py-1.5 f-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Nanti</div>
      </div>
    </div>
  );
}

function TemplateMock() {
  const items = [
    "Renovasi rumah 2 lantai",
    "Bedah dapur",
    "Interior apartemen studio",
    "Kamar mandi upgrade",
    "Fasad + landscape",
  ];
  return (
    <div className="mt-6 space-y-1.5">
      {items.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease }}
          className="flex items-center justify-between border border-border bg-background/60 px-3 py-2 f-mono text-[11px]"
        >
          <span>{t}</span>
          <span className="text-muted-foreground text-[10px]">use →</span>
        </motion.div>
      ))}
    </div>
  );
}

const features: Feat[] = [
  {
    id: "F-01",
    title: "Quote & BOQ Builder",
    tag: "Core · v1.0",
    Icon: Ruler,
    desc: "Drag rooms and scopes on a canvas; pull unit rates from your own library or the seeded SNI reference. Every line has a live margin badge.",
    span: "md:col-span-2 md:row-span-2",
    visual: <BOQMock />,
  },
  {
    id: "F-02",
    title: "Timeline & Gates",
    tag: "Core · v1.0",
    Icon: Building2,
    desc: "Stripped-down Gantt with milestone gates. Approval unlocks the invoice draft — 72h auto-approve if the client goes quiet.",
    span: "md:col-span-2",
    visual: <TimelineMock />,
  },
  {
    id: "F-04",
    title: "Progress Invoicing",
    tag: "Core · v1.0",
    Icon: Wallet,
    desc: "Gate approved → invoice drafted at the agreed percentage. One tap sends it via WhatsApp with a Xendit link.",
    span: "md:col-span-2",
    visual: <InvoiceMock />,
  },
  {
    id: "F-03",
    title: "Daily Site Log",
    tag: "Core · v1.0",
    Icon: Camera,
    desc: "Snap 6 photos, tick the crew count, note weather. Works offline. Client sees a curated feed.",
    span: "md:col-span-2",
    visual: <PhotoLogMock />,
  },
  {
    id: "F-05",
    title: "Crew & Payroll",
    tag: "v1.0",
    Icon: Users,
    desc: "Day- or scope-rates, auto-calc from attendance, batch bank transfer.",
    span: "md:col-span-2",
    visual: <PayrollMock />,
  },
  {
    id: "F-06",
    title: "Client Portal",
    tag: "Core · v1.0",
    Icon: ShieldCheck,
    desc: "Magic-link web view for owners. Timeline, gate approvals, photo feed, invoices. No login friction.",
    span: "md:col-span-2",
    visual: <PortalMock />,
  },
  {
    id: "F-07",
    title: "Playbook Templates",
    tag: "v1.1",
    Icon: BookMarked,
    desc: "Ship with 12 curated BOQ + timeline templates. First-sent-quote in under 15 minutes.",
    span: "md:col-span-2",
    visual: <TemplateMock />,
  },
];

function FeatureBento() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(240px,auto)]">
      {features.map((f, i) => (
        <motion.article
          key={f.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: (i % 4) * 0.06, duration: 0.55, ease }}
          className={cn(
            "group tick-corners relative overflow-hidden border border-foreground bg-card p-6 md:p-7 transition-shadow hover:shadow-[6px_6px_0_hsl(var(--accent)/0.35)]",
            f.span,
          )}
        >
          <span className="tc-bl" />
          <span className="tc-br" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bp-grid-sm opacity-0 transition-opacity duration-500 group-hover:opacity-30"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 f-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                <span>{f.id}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{f.tag}</span>
              </div>
              <h3 className="mt-3 f-display text-[22px] md:text-[26px] font-semibold leading-[1.1] tracking-[-0.015em]">
                {f.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-foreground/75">
                {f.desc}
              </p>
            </div>
            <div className="shrink-0 border border-border p-2 text-muted-foreground group-hover:text-accent group-hover:border-accent transition-colors">
              <f.Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="relative">{f.visual}</div>
        </motion.article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Personas                                        */
/* ─────────────────────────────────────────────── */

const personas = [
  {
    name: "Rian, 34",
    role: "Primary · Contractor",
    initials: "R",
    color: "from-[hsl(16_82%_51%)] to-[hsl(30_60%_40%)]",
    facts: [
      ["Runs", "Small renovation firm, 8 – 15 crew, Bandung. 4 – 6 active projects."],
      ["Job", "Look as organised as the big firms so I can quote bigger jobs and stop losing margin."],
      ["Stack", "WhatsApp, Excel, printed BOQs, personal bank account."],
      ["Wins if", "Sends a branded quote in <20 min, gets paid within 5 days of gate approval."],
    ],
  },
  {
    name: "Adi, 28",
    role: "Secondary · Mandor Lapangan",
    initials: "A",
    color: "from-[hsl(210_50%_35%)] to-[hsl(200_60%_25%)]",
    facts: [
      ["Runs", "Foreman on site — 6 – 20 workers per project. Android mid-range, spotty 4G."],
      ["Job", "Report progress in under 3 minutes so I can get back to actual work."],
      ["Stack", "WhatsApp voice notes, phone camera, a notebook."],
      ["Wins if", "Log takes 90 seconds, works when signal drops, no re-login every time."],
    ],
  },
  {
    name: "Ibu Sari, 42",
    role: "Tertiary · Client",
    initials: "S",
    color: "from-[hsl(40_50%_50%)] to-[hsl(20_40%_35%)]",
    facts: [
      ["Runs", "Homeowner mid-renovation. Paying Rp 240jt for a two-storey extension."],
      ["Job", "Know what my money is buying, without phoning the contractor at 9pm."],
      ["Stack", "WhatsApp updates from Rian, some blurry photos."],
      ["Wins if", "Opens a link once a week and sees progress, next gate, next payment."],
    ],
  },
];

function Personas() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {personas.map((p, i) => (
        <motion.article
          key={p.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.08, duration: 0.55, ease }}
          whileHover={{ y: -4 }}
          className="tick-corners relative border border-border bg-card p-6"
        >
          <span className="tc-bl" />
          <span className="tc-br" />
          <div className="mb-4 flex items-start justify-between border-b border-border pb-4">
            <div>
              <div className="f-display text-[20px] font-semibold leading-tight tracking-tight">
                {p.name}
              </div>
              <div className="mt-1 f-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {p.role}
              </div>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-background f-display text-[18px] font-bold shadow-inner",
                p.color,
              )}
            >
              {p.initials}
            </div>
          </div>
          <dl className="space-y-3 text-[13.5px] leading-[1.55]">
            {p.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="f-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Golden path — horizontal-scroll timeline        */
/* ─────────────────────────────────────────────── */

const flow = [
  { step: "01", title: "Create project from lead", actor: "Rian · Web" },
  { step: "02", title: "Build BOQ from template", actor: "Rian · Web" },
  { step: "03", title: "Send quote via WA link", actor: "Rian → Sari" },
  { step: "04", title: "Sari e-signs, DP unlocked", actor: "Sari · Portal" },
  { step: "05", title: "Adi files first daily log", actor: "Adi · Mobile" },
  { step: "06", title: "Gate 1 approved by Sari", actor: "Sari · Portal" },
  { step: "07", title: "Invoice paid via Xendit", actor: "System" },
];

function GoldenPath() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} className="border border-border bg-card p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Target · seven steps ≤ 7 days, median</span>
        <span className="text-accent">Golden path</span>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-[38px] h-px bg-border" />
        <motion.div
          style={{ width }}
          className="absolute left-0 top-[38px] h-px bg-accent"
        />

        <div className="grid grid-cols-7 gap-2 min-w-[720px] overflow-x-auto">
          {flow.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease }}
              className="flex flex-col"
            >
              <div className="mb-2 flex justify-center">
                <div className="flex h-9 w-9 items-center justify-center border border-foreground bg-background f-mono text-[11px] font-bold">
                  {s.step}
                </div>
              </div>
              <div className="border border-border bg-background p-3 min-h-[110px] flex flex-col">
                <div className="f-display text-[13.5px] font-semibold leading-tight tracking-tight">
                  {s.title}
                </div>
                <div className="mt-auto pt-2 f-mono text-[9px] uppercase tracking-[0.12em] text-accent">
                  {s.actor}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Scope — in / out                                */
/* ─────────────────────────────────────────────── */

function Scope() {
  const in_ = [
    ["Multi-project workspace", "Org · projects · roles (owner, PM, mandor, sub, client)"],
    ["Quote & BOQ builder with templates", "PDF export, e-sign, version history"],
    ["Timeline with milestone gates", "Gate approval flow tied to invoicing"],
    ["Daily site log (PWA, offline)", "Photo, weather, crew count, voice notes"],
    ["Progress invoicing + payments", "Xendit + Midtrans; retensi + PPN"],
    ["Crew & sub-contractor payroll (basic)", "Day- and scope-rates, weekly batch"],
    ["Client portal (magic-link)", "Read-only timeline, photo feed, gate approvals"],
    ["Notifications", "WhatsApp Business API + email + push"],
  ];
  const out = [
    ["Full accounting / GL", "Users export to Jurnal or Accurate; we integrate later"],
    ["Procurement marketplace", "Different business model — v2 conversation"],
    ["Government e-tender integration", "Different segment (mid/large contractors)"],
    ["Native iOS/Android app", "PWA covers 90% at 20% of the cost"],
    ["Multi-currency", "IDR only until we cross a border"],
    ["In-app chat", "WhatsApp is where the conversation already lives"],
    ["AI-generated BOQ from photo", "After templates prove usage"],
  ];
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      {[
        { label: "In scope · v1.0", items: in_, mark: "check" },
        { label: "Non-goals · v1.0", items: out, mark: "cross" },
      ].map((col) => (
        <div key={col.label}>
          <div className="mb-4 flex items-center justify-between border-b-2 border-foreground pb-2 f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>{col.label}</span>
            <span>{col.mark === "check" ? "Ship" : "Defer"}</span>
          </div>
          <ul className="divide-y divide-dashed divide-border">
            {col.items.map(([k, v], i) => (
              <motion.li
                key={k}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease }}
                className="flex gap-4 py-3.5"
              >
                <div className="mt-1 shrink-0">
                  {col.mark === "check" ? (
                    <div className="h-4 w-4 border-[1.5px] border-accent bg-accent/10 flex items-center justify-center text-accent text-[10px]">✓</div>
                  ) : (
                    <div className="relative h-4 w-4 border-[1.5px] border-muted-foreground">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_46%,hsl(var(--muted-foreground))_46%_54%,transparent_54%)]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[15px] font-medium">{k}</div>
                  <div className="text-[12.5px] text-muted-foreground mt-0.5">{v}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Architecture                                    */
/* ─────────────────────────────────────────────── */

const layers = [
  ["Client", "Next.js 15 · React Server Components"],
  ["Mobile", "PWA · Service Worker · IndexedDB queue"],
  ["API", "Route Handlers · tRPC · Zod"],
  ["Auth", "Supabase · phone-OTP · magic-link"],
  ["Data", "Supabase Postgres · Row-Level Security"],
  ["Storage", "Supabase Storage · WebP compressor"],
  ["Jobs", "Trigger.dev · nightly rollups · nudges"],
  ["Payments", "Xendit primary · Midtrans failover"],
  ["Comms", "WhatsApp Cloud API · Resend · Web Push"],
  ["Ops", "Vercel · Sentry · PostHog · Grafana"],
];

const stack = [
  ["Data model — first cut",
    "orgs · users · memberships · projects · scopes · line_items · quotes · quote_versions · gates · logs · log_photos · invoices · payments · payouts · crew_members · attendance"],
  ["Auth",
    "phone-OTP for contractor + mandor · magic-link for client · RLS scoped by org_id + role"],
  ["Offline",
    "daily-log form → IndexedDB draft; photos → resumable uploads; sync on foreground"],
  ["Payments",
    "Xendit (VA + e-wallet + QRIS); Midtrans failover if success-rate <92% for 24h"],
  ["Cost envelope · steady",
    "≈ Rp 3.8M / mo at 500 active orgs (Supabase + Vercel + Trigger + WA + fees)"],
  ["Compliance",
    "UU PDP alignment · encryption at rest · signed audit log for gates + payments"],
];

function Architecture() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.05fr_1fr]">
      <div className="border border-border bg-card p-5">
        <div className="mb-3 flex justify-between f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>System layers</span><span>hover to inspect</span>
        </div>
        <div className="space-y-2">
          {layers.map(([name, tech], i) => (
            <motion.div
              key={name}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease }}
              className={cn(
                "flex items-center justify-between border px-3.5 py-2.5 f-mono text-[12px] transition-all",
                hover === i
                  ? "border-accent bg-accent/5 translate-x-1"
                  : "border-foreground bg-background",
              )}
            >
              <span className="font-bold uppercase tracking-[0.1em]">{name}</span>
              <span className="text-muted-foreground">{tech}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="border border-border bg-card p-5">
        <div className="mb-3 f-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border pb-2">
          Stack details · CX-ARCH-001
        </div>
        <dl className="space-y-4">
          {stack.map(([k, v]) => (
            <div key={k}>
              <dt className="f-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-b border-dashed border-border pb-1">
                {k}
              </dt>
              <dd className="mt-2 f-mono text-[12.5px] leading-[1.55]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Roadmap                                         */
/* ─────────────────────────────────────────────── */

const roadmap = [
  { ms: "M0 · Foundation", wk: "Wk 01 – 04", w: "Design system, auth, org & project scaffolding", d: "Tokens, PWA shell, RLS policies, staging on Vercel", pct: 100, status: "ship" },
  { ms: "M1 · Quote & Log", wk: "Wk 05 – 10", w: "BOQ builder, timeline w/ gates, mobile daily log", d: "First real quotes sent; first real logs from site", pct: 55, status: "build" },
  { ms: "M2 · Money", wk: "Wk 11 – 16", w: "Progress invoicing, payments, client portal", d: "Golden path lands end-to-end; first paid invoice", pct: 10, status: "plan" },
  { ms: "M3 · Beta", wk: "Wk 17 – 22", w: "Payroll, notifications, templates, polish", d: "Closed beta with 15 contractors · pricing test", pct: 0, status: "plan" },
  { ms: "v1.1+", wk: "Wk 23 →", w: "Playbook library, offline hardening, Jurnal export", d: "Retention plays after activation numbers land", pct: 0, status: "plan" },
] as const;

function Roadmap() {
  const statusChip: Record<string, string> = {
    ship: "text-[hsl(140_45%_40%)] border-[hsl(140_45%_40%)]",
    build: "text-[hsl(38_75%_45%)] border-[hsl(38_75%_45%)]",
    plan: "text-muted-foreground border-muted-foreground",
  };
  const statusLabel: Record<string, string> = { ship: "Ready", build: "In build", plan: "Planned" };
  return (
    <div className="border-t-2 border-foreground">
      {roadmap.map((r, i) => (
        <motion.div
          key={r.ms}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: i * 0.06, duration: 0.45, ease }}
          className="grid grid-cols-1 gap-3 border-b border-border py-5 md:grid-cols-[150px_110px_1fr_120px_90px] md:items-center md:gap-6"
        >
          <div className="f-mono text-[11.5px] font-bold uppercase tracking-[0.1em] text-accent">{r.ms}</div>
          <div className="f-mono text-[11px] text-muted-foreground">{r.wk}</div>
          <div>
            <div className="f-display text-[16px] font-medium leading-tight tracking-tight">{r.w}</div>
            <div className="mt-1 text-[13px] text-foreground/65">{r.d}</div>
          </div>
          <div className="hidden md:block">
            <div className="h-1.5 bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${r.pct}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease, delay: 0.1 }}
                className="h-full bg-accent"
              />
            </div>
            <div className="mt-1 f-mono text-[10px] text-muted-foreground text-right num-tabular">{r.pct}%</div>
          </div>
          <div className={cn("border px-2 py-1 text-center f-mono text-[10px] uppercase tracking-[0.12em] w-fit md:w-auto", statusChip[r.status])}>
            {statusLabel[r.status]}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* Metrics — animated                              */
/* ─────────────────────────────────────────────── */

function Metrics() {
  const items = [
    { k: "Activation", v: <><Counter to={24} /><span className="text-[22px] ml-1">h</span></>, u: "First project ≤ 24h after signup" },
    { k: "Time-to-first-invoice", v: <>&lt;<Counter to={7} /><span className="text-[22px] ml-1">d</span></>, u: "Median across new orgs" },
    { k: "Week-8 retention", v: <><Counter to={60} suffix="%" /></>, u: "Active orgs, cohort basis" },
    { k: "Projects / org · 90d", v: <><Counter to={3.0} decimals={1} suffix="+" /></>, u: "Habit forms above three" },
    { k: "Payment success", v: <><Counter to={96} suffix="%" /></>, u: "Xendit + Midtrans combined" },
    { k: "NPS · contractors", v: <><Counter to={40} suffix="+" /></>, u: "Rolling 30-day" },
    { k: "Design-partner LOI", v: <><Counter to={15} /></>, u: "Signed before beta cohort" },
    { k: "Gross margin", v: <><Counter to={78} suffix="%" /></>, u: "After payments processor + infra" },
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
/* Risks                                           */
/* ─────────────────────────────────────────────── */

const risks = [
  ["Contractors won't leave WhatsApp for anything", "H", "So we don't ask them. WA is the delivery channel; ContractorX is the source of truth."],
  ["Mandor mobile UX doesn't clear a 90-second daily log", "H", "Weekly stopwatch tests with real mandors starting week 5."],
  ["Client portal treated as spam", "M", "Magic-link with named sender + WA delivery; A/B copy from week 12."],
  ["Payment failure spikes on Xendit", "M", "Midtrans failover with per-project router; monitored per hour."],
];

const mit = [
  ["Design-partner cohort locked before M1", "PM", "Wk 04"],
  ["Field research day, monthly, on-site", "Design", "From Wk 03"],
  ["Payment monitor with per-hour alerting", "Eng", "Wk 14"],
  ["Public trust page: uptime + payment stats", "PM", "Wk 20"],
];

function Risks() {
  const rank: Record<string, string> = { H: "bg-accent text-accent-foreground", M: "bg-[hsl(38_75%_45%)] text-background" };
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div>
        <div className="mb-4 flex justify-between border-b-2 border-foreground pb-2 f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Risk</span><span>Rank</span>
        </div>
        <ul className="space-y-3.5">
          {risks.map(([r, k, m], i) => (
            <motion.li
              key={r}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease }}
              className="flex gap-4 border-b border-dashed border-border pb-3.5"
            >
              <div className={cn("f-mono h-5 w-5 shrink-0 text-center text-[11px] font-bold leading-5", rank[k])}>
                {k}
              </div>
              <div>
                <div className="text-[14.5px] font-medium">{r}</div>
                <div className="mt-1 text-[12.5px] text-muted-foreground">{m}</div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-4 flex justify-between border-b-2 border-foreground pb-2 f-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Mitigation</span><span>Owner · When</span>
        </div>
        <ul className="space-y-3.5">
          {mit.map(([m, o, w], i) => (
            <motion.li
              key={m}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease }}
              className="flex items-start gap-4 border-b border-dashed border-border pb-3.5"
            >
              <div className="mt-1 h-2 w-2 shrink-0 bg-accent rounded-full" />
              <div className="flex-1">
                <div className="text-[14.5px] font-medium">{m}</div>
                <div className="mt-1 f-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
                  {o} · {w}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
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
          <div className="mx-auto max-w-[24ch] text-center">
            <p className="f-display text-[clamp(32px,5.5vw,64px)] font-medium leading-[1.05] tracking-[-0.025em] text-balance">
              Build the tool the{" "}
              <em className="italic text-accent">mandor</em> can hold in one
              hand while pouring concrete with the other.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#top"
              className="f-mono inline-flex items-center gap-2 bg-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Kick off week 01 <Send className="h-3.5 w-3.5" />
            </a>
            <a
              href="#prd"
              className="f-mono inline-flex items-center gap-2 border border-foreground px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] hover:bg-foreground hover:text-background transition-colors"
            >
              Re-read the spec
            </a>
          </div>
        </Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 f-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span>ContractorX · CX-PRD-001 · Rev A</span>
          <span>© 2026 · Naga Studio · For internal review</span>
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
      {/* scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-accent"
      />

      <TopNav />
      <MetaStrip />
      <Hero />
      <Marquee />

      <Section id="problem">
        <SectionHead
          no="§01 · Problem"
          title="Small contractors run million-rupiah projects on WhatsApp, Excel, and a folded BOQ in the glovebox."
          lede={
            <>
              The big firms have Procore. Homeowners doing one renovation have
              nothing but their contractor's word. In between — the 300,000+
              small contractors that actually build South-East Asia — is a
              tooling desert. Every number below comes from 34 discovery
              interviews.
            </>
          }
        />
        <Reveal>
          <ProblemBento />
        </Reveal>
      </Section>

      <Section id="product">
        <SectionHead
          no="§02 · Product"
          title={
            <>
              One thread from lead to last-payment — every project, every
              crew, every&nbsp;photo.
            </>
          }
          lede="Seven tools collapsed into one workspace tuned to how a small contractor actually operates: mobile-first for the field, desktop-clean for the office, read-only mirror for the client."
        />
        <FeatureBento />
      </Section>

      <Section id="prd">
        <SectionHead
          no="§03 · Users"
          title="Three real people the product owes an answer to."
          lede="Everything is designed backward from these three. If a feature doesn't serve at least one, it doesn't ship in v1."
        />
        <Reveal><Personas /></Reveal>
      </Section>

      <Section>
        <SectionHead
          no="§04 · Golden path"
          title="Quote to first-payment in seven steps."
          lede="Every screen and API is measured against this flow. Time-to-first-invoice under 7 days is a v1 gate."
        />
        <Reveal><GoldenPath /></Reveal>
      </Section>

      <Section>
        <SectionHead
          no="§05 · Scope"
          title="What v1 is — and what it deliberately is not."
          lede="Discipline about non-goals is how we ship in 22 weeks. Each non-goal has a reason to wait, not a reason to never build."
        />
        <Scope />
      </Section>

      <Section>
        <SectionHead
          no="§06 · Architecture"
          title="Boring stack. Interesting product."
          lede="The novel work is at the seam between BOQ, gate, and invoice — not in the infrastructure. Every choice optimises for a two-engineer team shipping in 22 weeks."
        />
        <Reveal><Architecture /></Reveal>
      </Section>

      <Section id="roadmap">
        <SectionHead
          no="§07 · Roadmap"
          title="Twenty-two weeks. Four milestones. One beta."
          lede="Each milestone ends with a demo to the same three design-partner contractors. If they can't run their next real project on it, we don't move on."
        />
        <Reveal><Roadmap /></Reveal>
      </Section>

      <Section id="metrics">
        <SectionHead
          no="§08 · Success"
          title="Numbers we would defend to an investor at week 24."
          lede="Activation is the north star. Retention, revenue, referrals — all downstream of a first project shipped end-to-end."
        />
        <Metrics />
      </Section>

      <Section>
        <SectionHead
          no="§09 · Risks"
          title="What kills this — and what we do about it."
        />
        <Reveal><Risks /></Reveal>
      </Section>

      <Footer />
    </div>
  );
}
