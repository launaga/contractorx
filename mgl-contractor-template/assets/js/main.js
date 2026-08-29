/*!
 * Ridgeline Builders — main.js
 * Vanilla ES2017. No build step. Every block is independent and no-ops
 * when its markup is absent from the page.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  }

  /* ---------- sticky header shadow ---------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(
          el.closest('[data-reveal-group]') ? el.closest('[data-reveal-group]').querySelectorAll('[data-reveal]') : [el]
        );
        var delay = Math.min(siblings.indexOf(el), 5) * 0.08;

        if (hasGsap) {
          window.gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay: delay, ease: 'power2.out' });
          el.classList.add('is-visible');
        } else {
          el.style.transitionDelay = delay + 's';
          el.classList.add('is-visible');
        }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------- animated counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(counters, function (el) { el.textContent = el.dataset.count; });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10) || 0;
        io.unobserve(el);

        if (reduceMotion) { el.textContent = target; return; }

        var start = performance.now();
        var dur = 1200;
        (function step(now) {
          var t = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
          if (t < 1) window.requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.4 });

    Array.prototype.forEach.call(counters, function (el) { io.observe(el); });
  }

  /* ---------- service filters ---------- */
  function initFilters() {
    var bar = document.querySelector('[data-filters]');
    var grid = document.querySelector('[data-grid]');
    if (!bar || !grid) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;

      var tag = btn.dataset.filter;
      Array.prototype.forEach.call(bar.querySelectorAll('.chip'), function (c) {
        c.classList.toggle('is-active', c === btn);
      });
      Array.prototype.forEach.call(grid.children, function (card) {
        var show = tag === 'all' || card.dataset.tag === tag;
        card.hidden = !show;
      });
    });
  }

  /* ---------- accordion ---------- */
  function initAccordion() {
    var root = document.querySelector('[data-accordion]');
    if (!root) return;

    root.addEventListener('click', function (e) {
      var head = e.target.closest('.acc-head');
      if (!head) return;
      var item = head.parentElement;
      var open = head.getAttribute('aria-expanded') === 'true';

      Array.prototype.forEach.call(root.querySelectorAll('.acc-head'), function (h) {
        h.setAttribute('aria-expanded', 'false');
        h.parentElement.classList.remove('is-open');
      });

      if (!open) {
        head.setAttribute('aria-expanded', 'true');
        item.classList.add('is-open');
      }
    });
  }

  /* ---------- forms ---------- */
  function showMessage(form, text, isError) {
    var msg = form.querySelector('[data-msg]');
    if (!msg) return;
    msg.textContent = text;
    msg.classList.toggle('is-error', !!isError);
  }

  function initForms() {
    var forms = document.querySelectorAll('[data-contact], [data-newsletter]');

    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var invalid = null;
        Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (field) {
          var ok = field.checkValidity();
          field.classList.toggle('is-invalid', !ok);
          if (!ok && !invalid) invalid = field;
        });

        if (invalid) {
          showMessage(form, 'Please check the highlighted field.', true);
          invalid.focus();
          return;
        }

        // Demo template: no backend. Point this at your endpoint.
        showMessage(form, 'Thanks — we will reply within one working day.', false);
        form.reset();
      });
    });
  }

  /* ---------- boot ---------- */
  function init() {
    initNav();
    initHeader();
    initReveal();
    initCounters();
    initFilters();
    initAccordion();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
