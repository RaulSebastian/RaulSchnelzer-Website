import { $, $$ } from "./dom.js";

export function initScrollReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? $$(".reveal", parent) : [entry.target];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach(el => {
    obs.observe(el);
  });
}

export function initBackToTop() {
  const btn = $("#back-to-top");
  if (!btn) return;

  function update() {
    if (globalThis.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  globalThis.addEventListener("scroll", update, { passive: true });
  btn.addEventListener("click", () => {
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  });
  update();
}

export function initSkillsAccordion() {
  const headers = $$(".skill-category-header");

  headers.forEach(header => {
    const category = header.parentElement;
    const panel = $(".skill-pills", category);

    function syncState() {
      const isCollapsed = category.classList.contains("collapsed");
      header.setAttribute("aria-expanded", String(!isCollapsed));
      if (panel) panel.setAttribute("aria-hidden", String(isCollapsed));
    }

    syncState();

    header.addEventListener("click", () => {
      category.classList.toggle("collapsed");
      syncState();
    });
  });
}

export function initOverlays() {
  const overlayHashById = new Map([
    ["privacy-overlay", "#privacy"],
    ["legal-overlay", "#legal"]
  ]);
  const overlayIdByHash = new Map(
    [...overlayHashById.entries()].map(([id, hash]) => [hash, id])
  );

  function openOverlay(id) {
    const overlay = $("#" + id);
    if (!overlay) return;
    overlay.inert = false;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const first = overlay.querySelector('button, a, [tabindex="0"]');
    if (first instanceof HTMLElement) {
      setTimeout(() => first.focus({ preventScroll: true }), 50);
    }
  }

  function closeOverlay(id) {
    const overlay = $("#" + id);
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    overlay.inert = true;
    document.body.style.overflow = "";
  }

  function setOverlayHash(hash) {
    globalThis.history.pushState(null, "", hash);
  }

  function clearOverlayHash(id) {
    if (overlayHashById.get(id) !== globalThis.location.hash) return;
    globalThis.history.pushState(null, "", globalThis.location.pathname + globalThis.location.search);
  }

  function syncOverlayFromHash() {
    const targetOverlayId = overlayIdByHash.get(globalThis.location.hash);

    $$(".overlay.open").forEach(overlay => {
      if (overlay.id !== targetOverlayId) closeOverlay(overlay.id);
    });

    if (targetOverlayId) openOverlay(targetOverlayId);
  }

  $$("#open-privacy, #open-privacy-mob").forEach(el => {
    el.addEventListener("click", event => {
      event.preventDefault();
      setOverlayHash("#privacy");
      syncOverlayFromHash();
    });
  });
  const closePrivacy = $("#close-privacy");
  if (closePrivacy) {
    closePrivacy.addEventListener("click", () => {
      closeOverlay("privacy-overlay");
      clearOverlayHash("privacy-overlay");
    });
  }

  $$("#open-legal, #open-legal-mob").forEach(el => {
    el.addEventListener("click", event => {
      event.preventDefault();
      setOverlayHash("#legal");
      syncOverlayFromHash();
    });
  });
  const closeLegal = $("#close-legal");
  if (closeLegal) {
    closeLegal.addEventListener("click", () => {
      closeOverlay("legal-overlay");
      clearOverlayHash("legal-overlay");
    });
  }

  $$(".overlay").forEach(overlay => {
    overlay.addEventListener("click", event => {
      if (event.target === overlay) {
        closeOverlay(overlay.id);
        clearOverlayHash(overlay.id);
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      $$(".overlay.open").forEach(overlay => {
        closeOverlay(overlay.id);
        clearOverlayHash(overlay.id);
      });
    }
  });

  globalThis.addEventListener("hashchange", syncOverlayFromHash);
  syncOverlayFromHash();
}

export function initQuoteFlyIn() {
  const introQuotes = $$(".quote-intro .quote-fly");
  const outroQuotes = $$(".quote-outro .quote-fly");
  const allQuotes = [...introQuotes, ...outroQuotes];

  if (!allQuotes.length) return;

  const introObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.55) {
        entry.target.classList.add("in-view");
      } else if (entry.intersectionRatio <= 0.08) {
        entry.target.classList.remove("in-view");
      }
    });
  }, { threshold: [0, 0.08, 0.3, 0.55, 1] });

  const outroObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.2) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  }, { threshold: [0, 0.2, 1], rootMargin: "0px 0px -12% 0px" });

  introQuotes.forEach(el => {
    introObs.observe(el);
  });
  outroQuotes.forEach(el => {
    outroObs.observe(el);
  });

  let ticking = false;

  function updateQuoteFade() {
    const navH = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
      10
    ) || 56;
    const stickyTop = navH + 24;

    allQuotes.forEach(quote => {
      const section = quote.closest(".quote-section");
      if (!section) return;

      const sectionRect = section.getBoundingClientRect();
      const distanceToEnd = sectionRect.bottom - stickyTop;
      const fadeDistance = section.classList.contains("quote-outro") ? 820 : 180;
      const opacity = Math.max(0, Math.min(1, distanceToEnd / fadeDistance));
      quote.style.setProperty("--quote-opacity", opacity.toFixed(3));
    });

    ticking = false;
  }

  function requestFadeUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateQuoteFade);
      ticking = true;
    }
  }

  globalThis.addEventListener("scroll", requestFadeUpdate, { passive: true });
  globalThis.addEventListener("resize", requestFadeUpdate);
  updateQuoteFade();
}
