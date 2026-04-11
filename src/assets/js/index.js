/**
 * Raul Schnelzer â€” main.js  v3.0.0
 */

import { $ } from "./dom.js";
import {
  initActiveNav,
  initFloatingFooter,
  initMobileMenu,
  initNavScroll,
  initSmoothAnchors,
} from "./navigation.js";
import { initTheme, toggleTheme } from "./theme.js";
import { initDurationBadges, setFooterYear } from "./timeline.js";
import {
  initBackToTop,
  initOverlays,
  initQuoteFlyIn,
  initScrollReveal,
  initSkillsAccordion,
} from "./ui.js";

function init() {
  initTheme();
  setFooterYear();
  initDurationBadges();
  initNavScroll();
  initFloatingFooter();
  initActiveNav();
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initSkillsAccordion();
  initOverlays();
  initQuoteFlyIn();
  initSmoothAnchors();

  const themeBtn = $("#theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
