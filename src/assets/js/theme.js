import { $$ } from "./dom.js";

const THEME_STORAGE_ID = "rs-theme";

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_ID);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_ID, theme);
  } catch {
    // noop
  }
}

function syncThemeLogos(theme) {
  $$("[data-theme-logo]").forEach(img => {
    const nextSrc = theme === "light" ? img.dataset.logoLight : img.dataset.logoDark;
    if (nextSrc) img.setAttribute("src", nextSrc);
  });
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  syncThemeLogos(theme);
  storeTheme(theme);
}

export function initTheme() {
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
    return;
  }

  const prefersDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

export function toggleTheme() {
  const { theme: current } = document.documentElement.dataset;
  applyTheme(current === "dark" ? "light" : "dark");
}
