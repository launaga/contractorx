/* ContractorX Kit — main
   1. Scroll reveals
   2. Progress and comparison bars
   3. Project register filters (sector × year)
   4. Form validation — client-side only, wire your own endpoint
   5. Theme toggle (light default, dark alternate) */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1 · Scroll reveals ------------------------------------------------ */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px" });
    Array.prototype.forEach.call(reveals, function (el) { ro.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-in"); });
  }

  /* 2 · Bars ---------------------------------------------------------- */
  var bars = document.querySelectorAll("[data-progress]");
  if (bars.length) {
    var fill = function (el) { el.style.width = el.getAttribute("data-progress") + "%"; };
    if ("IntersectionObserver" in window && !reduce) {
      var bo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { fill(e.target); bo.unobserve(e.target); } });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(bars, function (el) { bo.observe(el); });
    } else {
      Array.prototype.forEach.call(bars, fill);
    }
  }

  /* 3 · Project register filters -------------------------------------- */
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

  /* 4 · Form validation ------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll("[data-validate]"), function (form) {
    var status = form.querySelector("[data-status]");

    var check = function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input || !input.hasAttribute("required")) return true;
      var ok = input.checkValidity();
      field.classList.toggle("is-invalid", !ok);
      input.setAttribute("aria-invalid", String(!ok));
      return ok;
    };

    Array.prototype.forEach.call(form.querySelectorAll(".fld"), function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input) return;
      input.addEventListener("blur", function () { check(field); });
      input.addEventListener("input", function () {
        if (field.classList.contains("is-invalid")) check(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true, firstBad = null;
      Array.prototype.forEach.call(form.querySelectorAll(".fld"), function (field) {
        if (!check(field)) { valid = false; if (!firstBad) firstBad = field; }
      });

      if (!valid) {
        if (status) { status.textContent = "Check the highlighted fields."; status.classList.add("is-visible"); }
        var bad = firstBad && firstBad.querySelector("input, select, textarea");
        if (bad) bad.focus();
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var label = button ? button.textContent : "";
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      if (status) {
        status.textContent = "Demo only — no endpoint wired. See README §9 to connect Formspree or your own handler.";
        status.classList.add("is-visible");
      }
      window.setTimeout(function () {
        if (button) { button.disabled = false; button.textContent = label; }
      }, 2400);
    });
  });

  // The tender docket's submit button sits in a sibling panel.
  var tenderBtn = document.querySelector("[data-tender-submit]");
  if (tenderBtn) {
    var tenderForm = document.querySelector(".docket form[data-validate]");
    if (tenderForm) {
      tenderBtn.removeAttribute("form");
      tenderBtn.addEventListener("click", function () {
        tenderForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      });
    }
  }

  /* 5 · Theme toggle ---------------------------------------------------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    var current = function () { return document.documentElement.getAttribute("data-theme") || "light"; };
    var paint = function () {
      var dark = current() === "dark";
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.textContent = dark ? "Daylight" : "Invert";
    };
    paint();
    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      paint();
      try { localStorage.setItem("cx-theme", next); } catch (err) { /* private mode */ }
    });
  }
})();
