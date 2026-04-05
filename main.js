/**
 * Raul Schnelzer — main.js  v3.0.0
 */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const THEME_KEY = 'rs-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch { /* noop */
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    storeTheme(theme);
  }

  function initTheme() {
    const stored = getStoredTheme();
    if (stored) {
      applyTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function setFooterYear() {
    const el = $('#footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initNavScroll() {
    const nav = $('#nav');
    if (!nav) return;

    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      if (y < 80) {
        nav.classList.remove('nav--hidden');
      } else if (y > lastY + 4) {
        nav.classList.add('nav--hidden');
      } else if (y < lastY - 4) {
        nav.classList.remove('nav--hidden');
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, {passive: true});
  }

  function initActiveNav() {
    const sections = $$('section[id], div[id]').filter(el => el.id);
    const links = $$('.nav-link');
    if (!sections.length || !links.length) return;

    const linkMap = {};
    links.forEach(l => {
      linkMap[l.getAttribute('href').replace('#', '')] = l;
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && linkMap[e.target.id]) {
          links.forEach(l => l.classList.remove('active'));
          linkMap[e.target.id].classList.add('active');
        }
      });
    }, {rootMargin: '-40% 0px -55% 0px', threshold: 0});

    sections.forEach(s => obs.observe(s));
  }

  function initMobileMenu() {
    const btn = $('#hamburger');
    const menu = $('#mobile-menu');
    const links = $$('.mobile-link, .mobile-sub-link');
    if (!btn || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      links.forEach(l => l.setAttribute('tabindex', '0'));
    }

    function closeMenu() {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      links.forEach(l => l.setAttribute('tabindex', '-1'));
    }

    btn.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    links.forEach(l => l.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  function initScrollReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const siblings = $$('.reveal', e.target.parentElement);
          const idx = siblings.indexOf(e.target);
          const delay = idx * 80;
          setTimeout(() => {
            e.target.classList.add('visible');
          }, delay);
          obs.unobserve(e.target);
        }
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});

    items.forEach(el => obs.observe(el));
  }

  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    function update() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', update, {passive: true});
    btn.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
    update();
  }

  function initSkillsAccordion() {
    const headers = $$('.skill-category-header');

    headers.forEach(header => {
      const category = header.parentElement;

      header.addEventListener('click', () => {
        const isCollapsed = category.classList.contains('collapsed');
        category.classList.toggle('collapsed', !isCollapsed);
        header.setAttribute('aria-expanded', String(isCollapsed));
      });

      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  function initOverlays() {
    function openOverlay(id) {
      const overlay = $('#' + id);
      if (!overlay) return;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const first = overlay.querySelector('button, a, [tabindex="0"]');
      if (first) setTimeout(() => first.focus(), 50);
    }

    function closeOverlay(id) {
      const overlay = $('#' + id);
      if (!overlay) return;
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    $$('#open-privacy, #open-privacy-mob').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        openOverlay('privacy-overlay');
      });
    });
    $('#close-privacy') && $('#close-privacy').addEventListener('click', () => closeOverlay('privacy-overlay'));

    $$('#open-legal, #open-legal-mob').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        openOverlay('legal-overlay');
      });
    });
    $('#close-legal') && $('#close-legal').addEventListener('click', () => closeOverlay('legal-overlay'));

    $$('.overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeOverlay(overlay.id);
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        $$('.overlay.open').forEach(o => closeOverlay(o.id));
      }
    });
  }

  function initQuoteFlyIn() {
    const quotes = $$('.quote-fly');
    if (!quotes.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, {threshold: 0.25});

    quotes.forEach(el => obs.observe(el));
  }

  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') {
          e.preventDefault();
          window.scrollTo({top: 0, behavior: 'smooth'});
          return;
        }
        const target = $(href);
        if (target) {
          e.preventDefault();
          const navH = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 56;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({top, behavior: 'smooth'});
        }
      });
    });
  }

  function init() {
    initTheme();
    setFooterYear();
    initNavScroll();
    initActiveNav();
    initMobileMenu();
    initScrollReveal();
    initBackToTop();
    initSkillsAccordion();
    initOverlays();
    initQuoteFlyIn();
    initSmoothAnchors();

    const themeBtn = $('#theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
