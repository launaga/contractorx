/* ContractorX Kit — scroll motion (Home and Projects only).
   Loaded from src/partials/scripts.html on pages whose meta block sets
   "motion": true. Everything degrades: with no JS, a narrow viewport, or
   prefers-reduced-motion the pages render as ordinary static documents —
   the elevation is already drawn and the register is a swipeable row.

   GSAP is fetched by this file rather than linked in the <head>, so the
   six pages without motion never pay for it. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wide   = window.matchMedia("(min-width: 900px)").matches;

  /* ---- 1 · reading progress rail --------------------------------------
     Plain DOM + scroll listener. Cheap, and it works on every viewport
     including the ones that never load GSAP. */
  (function rail() {
    var bar = document.createElement("div");
    bar.className = "pgrail";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = "<i></i>";

    var out = document.createElement("div");
    out.className = "pgrail__out";
    out.setAttribute("aria-hidden", "true");
    out.innerHTML = '<span class="m">Programme</span><b>0%</b>';

    document.body.appendChild(bar);
    document.body.appendChild(out);

    var fill = bar.firstChild, pct = out.lastChild, ticking = false;

    function paint() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      fill.style.width = (p * 100).toFixed(2) + "%";
      pct.textContent = Math.round(p * 100) + "%";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  })();

  /* Below 900px, or with reduced motion, we stop here. The static markup
     is already the finished state, so there is nothing to undo. */
  if (!wide || reduce) return;

  var needsGsap = document.querySelector("[data-seq], [data-hreg], [data-px]");
  if (!needsGsap) return;

  /* ---- 2 · load GSAP, then start ------------------------------------- */
  load("js/gsap.min.js", function () {
    load("js/ScrollTrigger.min.js", start);
  });

  function load(src, done) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = done;
    s.onerror = function () { /* motion is optional — the page already works */ };
    document.head.appendChild(s);
  }

  function start() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    parallax();
    sequence();
    register();
  }

  /* ---- 3 · hero parallax ---------------------------------------------- */
  function parallax() {
    var hero = document.querySelector(".hero");
    if (!hero) return;

    document.querySelectorAll("[data-px]").forEach(function (el) {
      var rate = parseFloat(el.getAttribute("data-px"));
      if (!rate) return;
      gsap.to(el, {
        y: function () { return (1 - rate) * window.innerHeight * 0.45; },
        ease: "none",
        scrollTrigger: {
          trigger: hero, start: "top top", end: "bottom top",
          scrub: true, invalidateOnRefresh: true
        }
      });
    });
  }

  /* ---- 4 · pinned build sequence -------------------------------------- */
  var PHASES = [
    { name: "Foundation", stat: "On programme" },
    { name: "Structure",  stat: "On programme" },
    { name: "Envelope",   stat: "On programme" },
    { name: "Fit-out",    stat: "2 weeks ahead" },
    { name: "Handover",   stat: "11 days early" }
  ];

  function sequence() {
    var sec = document.querySelector("[data-seq]");
    if (!sec) return;

    var groups = sec.querySelectorAll(".seq-g");
    var strokes = sec.querySelectorAll(".seq-l");
    var chips = sec.querySelectorAll(".seq__phase");
    var note = sec.querySelector("[data-seq-note]");
    var elPct  = sec.querySelector("[data-seq-pct]"),
        elBar  = sec.querySelector("[data-seq-bar]"),
        elPh   = sec.querySelector("[data-seq-phase]"),
        elWk   = sec.querySelector("[data-seq-week]"),
        elVal  = sec.querySelector("[data-seq-val]"),
        elStat = sec.querySelector("[data-seq-stat]");

    if (!groups.length || !elPct) return;

    /* Prime every stroke so it can draw on. The ground line is a datum,
       not a phase — it stays visible throughout. */
    Array.prototype.forEach.call(strokes, function (el) {
      var len = 0;
      try { len = el.getTotalLength ? el.getTotalLength() : 0; } catch (e) {}
      if (!len) {
        var b = el.getBBox();
        len = (b.width + b.height) * 2;
      }
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    });

    function paint(p) {
      var i = Math.min(4, Math.floor(p * 5));
      elPct.textContent = Math.round(p * 100);
      elBar.style.width = (p * 100).toFixed(1) + "%";
      elPh.textContent = PHASES[i].name;
      elWk.textContent = Math.round(p * 74);
      elVal.textContent = Math.round(p * 238);
      elStat.textContent = PHASES[i].stat;
      Array.prototype.forEach.call(chips, function (c, n) {
        c.classList.toggle("is-on", n === i);
      });
    }

    sec.classList.add("seq--pinned");

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: "top top", end: "+=420%",
        pin: true, scrub: 0.6, anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) { paint(self.progress); }
      }
    });

    Array.prototype.forEach.call(groups, function (g, i) {
      tl.to(g.querySelectorAll(".seq-l"), {
        strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: "none"
      }, i);
    });
    if (note) tl.to(note, { opacity: 1, duration: 0.4 }, 4.4);

    paint(0);
  }

  /* ---- 5 · horizontal register ---------------------------------------- */
  function register() {
    var sec = document.querySelector("[data-hreg]");
    if (!sec) return;

    var track = sec.querySelector(".hreg__track");
    var dot   = sec.querySelector("[data-hreg-dot]");
    var num   = sec.querySelector("[data-hreg-num]");
    if (!track) return;

    var count = track.children.length;
    var span = function () {
      return Math.max(0, track.scrollWidth - window.innerWidth + 40);
    };
    if (span() <= 0) return;

    sec.classList.add("hreg--pinned");

    gsap.to(track, {
      x: function () { return -span(); },
      ease: "none",
      scrollTrigger: {
        trigger: sec, start: "top top",
        end: function () { return "+=" + span(); },
        pin: true, scrub: 0.5, anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (dot) dot.style.left = (self.progress * 100).toFixed(1) + "%";
          if (num) num.textContent = Math.min(count, Math.floor(self.progress * count) + 1);
        }
      }
    });
  }
})();
