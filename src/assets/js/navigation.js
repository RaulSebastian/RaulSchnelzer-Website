import { $, $$ } from "./dom.js";

let heroScrollFrame = 0;

export function initNavScroll() {
  const nav = $("#nav");
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  function syncNavState() {
    document.body.classList.toggle("nav-is-hidden", nav.classList.contains("nav--hidden"));
  }

  function update() {
    const y = window.scrollY;
    if (y < 80) {
      nav.classList.remove("nav--hidden");
    } else if (y > lastY + 4) {
      nav.classList.remove("nav--hidden");
    } else if (y < lastY - 4) {
      nav.classList.add("nav--hidden");
    }
    syncNavState();
    lastY = y;
    ticking = false;
  }

  update();

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

export function initFloatingFooter() {
  const footer = $("#footer");
  if (!footer) return;

  const floatFooter = footer.cloneNode(true);
  floatFooter.removeAttribute("id");
  floatFooter.classList.add("footer-float");

  const clonedYear = $("#footer-year", floatFooter);
  if (clonedYear) clonedYear.removeAttribute("id");

  document.body.appendChild(floatFooter);

  let footerInView = false;
  let ticking = false;

  function updateVisibility() {
    const isAtTop = window.scrollY < 24;
    const shouldShow = (isAtTop || document.body.classList.contains("nav-is-hidden")) && !footerInView;
    floatFooter.classList.toggle("footer-float--visible", shouldShow);
    ticking = false;
  }

  const footerObserver = new IntersectionObserver(entries => {
    footerInView = entries.some(entry => entry.isIntersecting);
    updateVisibility();
  }, { threshold: 0.01 });

  footerObserver.observe(footer);

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateVisibility();
}

export function initActiveNav() {
  const sections = $$("section[id], div[id]").filter(el => el.id);
  const links = $$(".nav-link");
  if (!sections.length || !links.length) return;

  const linkMap = {};
  links.forEach(link => {
    linkMap[link.getAttribute("href").replace("#", "")] = link;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && linkMap[entry.target.id]) {
        links.forEach(link => link.classList.remove("active"));
        linkMap[entry.target.id].classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach(section => obs.observe(section));
}

export function initMobileMenu() {
  const btn = $("#hamburger");
  const menu = $("#mobile-menu");
  const closeBtn = $("#mobile-menu-close");
  const links = $$(".mobile-link, .mobile-sub-link");
  if (!btn || !menu) return;

  function openMenu() {
    if (typeof menu.showModal === "function" && !menu.open) {
      menu.showModal();
    }
    menu.classList.add("open");
    btn.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    links.forEach(link => link.setAttribute("tabindex", "0"));
  }

  function closeMenu() {
    menu.classList.remove("open");
    if (typeof menu.close === "function" && menu.open) {
      menu.close();
    }
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    links.forEach(link => link.setAttribute("tabindex", "-1"));
  }

  btn.addEventListener("click", () => {
    menu.open ? closeMenu() : openMenu();
  });

  links.forEach(link => link.addEventListener("click", closeMenu));
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) closeMenu();
  });

  menu.addEventListener("close", () => {
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    links.forEach(link => link.setAttribute("tabindex", "-1"));
    menu.classList.remove("open");
  });
}

function scrollToAnchorTarget(href, behavior = "smooth") {
  if (href === "#") {
    window.scrollTo({ top: 0, behavior });
    return true;
  }

  const target = $(href);
  if (!target) return false;

  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 56;
  const preferredTarget = target.matches(".content-section")
    ? $(".section-title, .section-label, .section-inner", target) || target
    : target;
  const top = target.id === "about"
    ? target.getBoundingClientRect().top + window.scrollY
    : preferredTarget.getBoundingClientRect().top + window.scrollY - navH - 16;

  window.scrollTo({ top, behavior });
  return true;
}

function slowScrollToAnchorTarget(href) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return scrollToAnchorTarget(href, "auto");
  }

  const target = $(href);
  if (!target) return false;

  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 56;
  const preferredTarget = target.matches(".content-section")
    ? $(".section-title, .section-label, .section-inner", target) || target
    : target;
  const destination = target.id === "about"
    ? target.getBoundingClientRect().top + window.scrollY
    : preferredTarget.getBoundingClientRect().top + window.scrollY - navH - 16;

  if (heroScrollFrame) {
    cancelAnimationFrame(heroScrollFrame);
  }

  const startTop = window.scrollY;
  const delta = destination - startTop;
  const duration = 1150;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo({ top: startTop + (delta * eased), behavior: "auto" });

    if (progress < 1) {
      heroScrollFrame = requestAnimationFrame(step);
    } else {
      heroScrollFrame = 0;
    }
  }

  heroScrollFrame = requestAnimationFrame(step);
  return true;
}

function updateUrlHash(href) {
  if (href === "#") {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    return;
  }

  window.history.pushState(null, "", href);
}

export function initSmoothAnchors() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (link.matches(".hero-cta")) {
        if (slowScrollToAnchorTarget(href)) {
          event.preventDefault();
          updateUrlHash(href);
        }
        return;
      }

      if (scrollToAnchorTarget(href)) {
        event.preventDefault();
        updateUrlHash(href);
      }
    });
  });

  function syncHashNavigation() {
    const { hash } = window.location;
    if (!hash || hash === "#") return;
    if (!$(hash)) return;

    window.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      scrollToAnchorTarget(hash);
    });
  }

  window.addEventListener("hashchange", syncHashNavigation);
  syncHashNavigation();
}
