/* ContractorX Kit — navigation
   Mobile panel toggle. No dependencies. */
(function () {
  "use strict";
  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.getElementById("nav-panel");
  if (!toggle || !panel) return;

  function close() {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  }

  toggle.addEventListener("click", function () {
    var open = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });

  panel.addEventListener("click", function (e) {
    if (e.target.tagName === "A") close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("is-open")) { close(); toggle.focus(); }
  });
})();
