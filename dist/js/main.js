/* ContractorX Kit — main
   1. Hero reveal (GSAP if present, CSS fallback otherwise)
   2. Scroll reveals
   3. Progress bars (K-04 ongoing projects)
   4. Portfolio filters
   5. Form validation (client-side only — wire your own endpoint)
   6. Theme toggle (light / dark inversion) */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1 · Hero reveal ------------------------------------------------- */
  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var bits = hero.querySelectorAll("[data-hero-item]");
    if (reduce || !window.gsap) {
      Array.prototype.forEach.call(bits, function (b) { b.style.opacity = 1; });
    } else {
      window.gsap.set(bits, { opacity: 0, y: 22 });
      window.gsap.to(bits, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.1 });
      var media = hero.querySelector("[data-hero-media]");
      if (media) window.gsap.fromTo(media, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: "power2.out" });
    }
  }

  /* 2 · Scroll reveals ---------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    Array.prototype.forEach.call(reveals, function (el) { ro.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-in"); });
  }

  /* 3 · Progress bars ------------------------------------------------ */
  var bars = document.querySelectorAll("[data-progress]");
  if (bars.length) {
    var fill = function (el) {
      el.style.width = el.getAttribute("data-progress") + "%";
    };
    if ("IntersectionObserver" in window && !reduce) {
      var bo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { fill(e.target); bo.unobserve(e.target); } });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(bars, function (el) { bo.observe(el); });
    } else {
      Array.prototype.forEach.call(bars, fill);
    }
  }

  /* 4 · Portfolio filters -------------------------------------------- */
  var filterRoot = document.querySelector("[data-filter-root]");
  if (filterRoot) {
    var buttons = filterRoot.querySelectorAll("[data-filter]");
    var items = document.querySelectorAll("[data-project]");
    var empty = document.querySelector("[data-empty]");
    var state = { sector: "all", year: "all" };

    var apply = function () {
      var shown = 0;
      Array.prototype.forEach.call(items, function (item) {
        var okSector = state.sector === "all" || item.getAttribute("data-sector") === state.sector;
        var okYear = state.year === "all" || item.getAttribute("data-year") === state.year;
        var show = okSector && okYear;
        item.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var group = btn.getAttribute("data-group");
        state[group] = btn.getAttribute("data-filter");
        Array.prototype.forEach.call(
          filterRoot.querySelectorAll('[data-group="' + group + '"]'),
          function (b) { b.setAttribute("aria-pressed", String(b === btn)); }
        );
        apply();
      });
    });
    apply();
  }

  /* 5 · Form validation ---------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-validate]"), function (form) {
    var status = form.querySelector("[data-status]");
    var check = function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input) return true;
      var ok = input.checkValidity();
      field.classList.toggle("is-invalid", !ok);
      if (input.hasAttribute("aria-invalid") || !ok) input.setAttribute("aria-invalid", String(!ok));
      return ok;
    };

    Array.prototype.forEach.call(form.querySelectorAll(".field"), function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input) return;
      input.addEventListener("blur", function () { check(field); });
      input.addEventListener("input", function () {
        if (field.classList.contains("is-invalid")) check(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll(".field");
      var valid = true, firstBad = null;
      Array.prototype.forEach.call(fields, function (field) {
        if (!check(field)) { valid = false; if (!firstBad) firstBad = field; }
      });
      if (!valid) {
        if (status) { status.textContent = "Check the highlighted fields."; status.classList.add("is-visible"); }
        var input = firstBad && firstBad.querySelector("input, select, textarea");
        if (input) input.focus();
        return;
      }
      var button = form.querySelector('button[type="submit"]');
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      if (status) { status.textContent = "Demo only — no endpoint wired. See README to connect Formspree or your own handler."; status.classList.add("is-visible"); }
      window.setTimeout(function () {
        if (button) { button.disabled = false; button.textContent = "Send again"; }
      }, 2200);
    });
  });

  /* 6 · Theme toggle -------------------------------------------------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    var current = function () {
      return document.documentElement.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    };
    toggle.setAttribute("aria-pressed", String(current() === "dark"));
    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      toggle.setAttribute("aria-pressed", String(next === "dark"));
      try { localStorage.setItem("cx-theme", next); } catch (err) { /* private mode */ }
    });
  }
})();
