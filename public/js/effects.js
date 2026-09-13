/* =========================================================
   Peigne et bla-bla — COUCHE D'EFFETS (ajout)
   Aucun changement de HTML nécessaire : le script pose ses
   propres classes sur les éléments existants.
   <script src="/js/effects.js" defer></script>
   ========================================================= */
(function () {
  "use strict";

  var STEP = 140; // décalage entre deux éléments d'un même bloc (ms)
  var MAX_STEPS = 5; // au-delà, le décalage n'augmente plus
  var ROW_STEP = 55; // cascade des lignes de tarifs (ms)
  var PARALLAX_BASE = 0.03; // force de la parallaxe (3/10)

  /* Blocs : chaque bloc cascade indépendamment, dans l'ordre du DOM */
  var BLOCKS = [".green-band", ".hero-cream", ".section", ".site-footer"];

  /* Éléments animés à l'intérieur d'un bloc */
  var TARGETS = [
    ".green-row > *",
    ".hero-tagline",
    ".hero-actions",
    ".eyebrow",
    ".h2",
    ".services-subtitle",
    ".offer-details",
    ".tabs-flow",
    ".gallery-grid > *",
    ".availability-intro",
    ".hours-card",
    ".availability-cta",
    ".google-badge",
    ".review-grid > *",
    ".contact-layout > *",
    ".footer-tagline",
    ".footer-hours",
    ".footer-social"
  ].join(",");

  var VARIANTS = [
    [".gallery-grid > *", "fx-zoom"],
    [".review-grid > *", "fx-zoom"],
    [".hero-actions", "fx-zoom"],
    [".eyebrow", "fx-left"],
    [".services-subtitle", "fx-left"],
    [".availability-intro", "fx-left"],
    [".hours-card", "fx-left"],
    [".contact-layout > .coords-area", "fx-left"],
    [".contact-layout > .fields-area", "fx-right"]
  ];

  var PARALLAX = [
    [".green-band .decor", 1.6],
    [".green-logo", 0.7]
  ];

  var SECTIONS = ["home", "services", "gallery", "hours", "reviews", "contact"];

  var looping = false;

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function vh() {
    return window.innerHeight || document.documentElement.clientHeight || 800;
  }

  /* Conteneur de défilement réel : le document, ou un parent scrollable
     (cas d'un aperçu intégré dans un cadre). */
  function scroller() {
    var de = document.documentElement;
    if (de.scrollHeight > de.clientHeight + 4) return null;
    var probe = document.querySelector(".site-nav") || document.body;
    var el = probe.parentElement;
    while (el && el !== de) {
      var oy = getComputedStyle(el).overflowY;
      if (
        (oy === "auto" || oy === "scroll" || el === document.body) &&
        el.scrollHeight > el.clientHeight + 4
      )
        return el;
      el = el.parentElement;
    }
    return null;
  }

  function scrollTop(host) {
    return host
      ? host.scrollTop
      : window.scrollY || window.pageYOffset || document.body.scrollTop || 0;
  }

  /* Préparation : classe, variante et décalage en cascade par bloc */
  function prepare() {
    document.querySelectorAll(BLOCKS.join(",")).forEach(function (block) {
      var els = block.querySelectorAll(TARGETS);
      Array.prototype.forEach.call(els, function (el, i) {
        if (el.dataset.fxReveal) return;
        el.dataset.fxReveal = "1";
        el.classList.add("fx-reveal");
        VARIANTS.forEach(function (v) {
          if (el.matches(v[0])) el.classList.add(v[1]);
        });
        el.dataset.fxDelay = Math.min(i, MAX_STEPS) * STEP + "ms";
        el.style.transitionDelay = el.dataset.fxDelay;
        if (reduced()) el.classList.add("fx-in");
      });
    });
  }

  /* Apparition / disparition symétrique, rejouée à chaque passage */
  function reveal() {
    if (reduced()) return;
    var h = vh();
    var els = document.querySelectorAll(".fx-reveal");
    Array.prototype.forEach.call(els, function (el) {
      var r = el.getBoundingClientRect();
      if (!r.height && !r.width) return;
      var visible = r.top < h * 0.9 && r.bottom > h * 0.04;
      var was = el.classList.contains("fx-in");
      if (visible === was) return;
      el.classList.toggle("fx-in", visible);
      /* Le décalage ne sert qu'à l'entrée : on le libère ensuite pour que
         les interactions (retournement des photos) répondent au clic. */
      if (visible)
        setTimeout(function () {
          if (el.classList.contains("fx-in")) el.style.transitionDelay = "";
        }, 1500);
      else el.style.transitionDelay = el.dataset.fxDelay || "";
    });
  }

  /* Images : fondu au chargement */
  function images() {
    /* Les photos de la galerie ne sont plus masquées au chargement :
       un fondu resté bloqué à 0 cachait la face "après". */
    document.querySelectorAll(".ba-slide img").forEach(function (im) {
      if (im.style.opacity !== "") im.style.opacity = "";
    });
    var imgs = document.querySelectorAll(".green-logo");
    Array.prototype.forEach.call(imgs, function (img) {
      if (img.dataset.fxImg) return;
      img.dataset.fxImg = "1";
      img.style.transition = "opacity .8s ease";
      if (img.complete || reduced()) return;
      img.style.opacity = "0";
      var show = function () {
        img.style.opacity = "1";
      };
      img.addEventListener("load", show);
      img.addEventListener("error", show);
    });
  }

  /* Lignes de tarifs : cascade à l'ouverture de l'onglet */
  function rowsCascade(panel) {
    if (!panel || reduced()) return;
    var rows = panel.querySelectorAll(".price-table tr");
    Array.prototype.forEach.call(rows, function (tr, i) {
      tr.classList.remove("fx-row");
      tr.style.animationDelay = i * ROW_STEP + "ms";
      void tr.offsetWidth; // relance l'animation
      tr.classList.add("fx-row");
    });
  }

  /* Galerie : le clic bascule une classe sur la carte. Plus fiable que
     l'état de la case seule, qui peut être réinitialisé par un re-rendu. */
  function setupGallery() {
    var cards = document.querySelectorAll(".ba-slider");
    Array.prototype.forEach.call(cards, function (card) {
      if (card.dataset.fxFlip) return;
      card.dataset.fxFlip = "1";
      var box = card.querySelector(".ba-toggle-input");
      if (!box) return;
      /* Le label coché/décoché reste le déclencheur (il fonctionne sans JS) ;
         on ne fait que recopier son état dans une classe, qui survit aux
         re-rendus. */
      box.addEventListener("change", function () {
        card.classList.toggle("fx-flipped", box.checked);
      });
      card.classList.toggle("fx-flipped", box.checked);
    });
  }

  function setupTabs() {
    var radios = document.querySelectorAll(".tab-radio");
    Array.prototype.forEach.call(radios, function (r) {
      if (r.dataset.fxTab) return;
      r.dataset.fxTab = "1";
      r.addEventListener("change", function () {
        setTimeout(function () {
          var visible = null;
          document.querySelectorAll(".tab-panel").forEach(function (p) {
            if (getComputedStyle(p).display !== "none") visible = p;
          });
          rowsCascade(visible);
        }, 20);
      });
    });
    if (!window.__pbbFirstRows) {
      window.__pbbFirstRows = true;
      rowsCascade(document.getElementById("panel-femme"));
    }
  }

  function parallax() {
    if (reduced()) return;
    var h = vh();
    PARALLAX.forEach(function (pair) {
      var els = document.querySelectorAll(pair[0]);
      Array.prototype.forEach.call(els, function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) return;
        var mid = r.top + r.height / 2 - h / 2;
        el.style.translate =
          "0 " + (-mid * PARALLAX_BASE * pair[1]).toFixed(1) + "px";
      });
    });
  }

  function progress(y, host) {
    var bar = document.querySelector(".fx-progress");
    if (!bar) {
      var hdr = document.querySelector(".site-header");
      if (!hdr) return;
      bar = document.createElement("span");
      bar.className = "fx-progress";
      bar.setAttribute("aria-hidden", "true");
      hdr.appendChild(bar);
    }
    var max = host
      ? host.scrollHeight - host.clientHeight
      : (document.documentElement.scrollHeight || 0) - vh();
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  function currentLink() {
    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!links.length) return;
    var best = null;
    var bestTop = -Infinity;
    SECTIONS.forEach(function (id) {
      var s = document.getElementById(id);
      if (!s) return;
      var t = s.getBoundingClientRect().top - vh() * 0.35;
      if (t <= 0 && t > bestTop) {
        bestTop = t;
        best = id;
      }
    });
    Array.prototype.forEach.call(links, function (a) {
      a.classList.toggle(
        "fx-current",
        !!best && a.getAttribute("href") === "#" + best
      );
    });
  }

  /* Une seule boucle pilote tout ce qui dépend du défilement :
     cet hôte ne délivre pas toujours d'événement "scroll". */
  function tick() {
    var host = scroller();
    var y = scrollTop(host);
    var hdr = document.querySelector(".site-header");
    var top = document.querySelector(".back-to-top");
    if (hdr) hdr.classList.toggle("fx-compact", y > 20);
    if (top) top.classList.toggle("fx-visible", y > 400);
    reveal();
    parallax();
    progress(y, host);
    currentLink();
  }

  function init() {
    prepare();
    images();
    setupGallery();
    setupTabs();
    tick();
    if (!looping) {
      looping = true;
      var loop = function () {
        tick();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      window.addEventListener("resize", tick);
    }
  }

  window.PBB_EFFECTS_INIT = init;

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
