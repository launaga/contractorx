/* ContractorX Kit — counters
   Runs each number up once when its band scrolls into view.
   Uses GSAP if it is on the page, otherwise a rAF fallback.
   Honours prefers-reduced-motion: the final value is set immediately. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (!nodes.length) return;

  function format(el, value) {
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var out = value.toFixed(decimals);
    if (el.getAttribute("data-group") === "true") {
      var parts = out.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      out = parts.join(".");
    }
    el.textContent = out;
  }

  function run(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (reduce) { format(el, target); return; }

    if (window.gsap) {
      var obj = { v: 0 };
      window.gsap.to(obj, {
        v: target, duration: 1.5, ease: "power2.out",
        onUpdate: function () { format(el, obj.v); }
      });
      return;
    }
    var start = null, dur = 1500;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      format(el, target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) { nodes.forEach(run); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  nodes.forEach(function (el) { format(el, 0); io.observe(el); });
})();
