/**
 * Raul Schnelzer — main.js  v3.0.0
 */

(function () {
  'use strict';

  /**
   * @param {string} sel
   * @param {ParentNode} [ctx=document]
   */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  /**
   * @param {string} sel
   * @param {ParentNode} [ctx=document]
   */
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const THEME_KEY = 'rs-theme';
  let heroScrollFrame = 0;

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

  function syncThemeLogos(theme) {
    $$('[data-theme-logo]').forEach(img => {
      const nextSrc = theme === 'light' ? img.dataset.logoLight : img.dataset.logoDark;
      if (nextSrc) img.setAttribute('src', nextSrc);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    syncThemeLogos(theme);
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
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function parseYearMonth(value) {
    if (!value) return null;
    if (value === 'present') {
      const now = new Date();
      return {year: now.getFullYear(), month: now.getMonth() + 1};
    }

    const match = /^(\d{4})-(\d{2})$/.exec(value);
    if (!match) return null;

    return {
      year: Number(match[1]),
      month: Number(match[2])
    };
  }

  function formatDuration(start, end) {
    let totalMonths = (end.year - start.year) * 12 + (end.month - start.month);
    if (totalMonths < 0) totalMonths = 0;

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const parts = [];

    if (years > 0) parts.push(`${years} yr${years === 1 ? '' : 's'}`);
    if (months > 0) parts.push(`${months} mo${months === 1 ? '' : 's'}`);

    return parts.join(' ') || '0 mos';
  }

  function initDurationBadges() {
    $$('[data-duration-badge]').forEach(badge => {
      const start = parseYearMonth(badge.dataset.start);
      const end = parseYearMonth(badge.dataset.end);
      if (!start || !end) return;
      badge.textContent = formatDuration(start, end);
    });
  }

  function initNavScroll() {
    const nav = $('#nav');
    if (!nav) return;

    let lastY = window.scrollY;
    let ticking = false;

    function syncNavState() {
      document.body.classList.toggle('nav-is-hidden', nav.classList.contains('nav--hidden'));
    }

    function update() {
      const y = window.scrollY;
      if (y < 80) {
        nav.classList.remove('nav--hidden');
      } else if (y > lastY + 4) {
        nav.classList.remove('nav--hidden');
      } else if (y < lastY - 4) {
        nav.classList.add('nav--hidden');
      }
      syncNavState();
      lastY = y;
      ticking = false;
    }

    update();

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, {passive: true});
  }

  function initFloatingFooter() {
    const footer = $('#footer');
    if (!footer) return;

    const floatFooter = footer.cloneNode(true);
    floatFooter.removeAttribute('id');
    floatFooter.classList.add('footer-float');

    const clonedYear = $('#footer-year', floatFooter);
    if (clonedYear) clonedYear.removeAttribute('id');

    document.body.appendChild(floatFooter);

    let footerInView = false;
    let ticking = false;

    function updateVisibility() {
      const isAtTop = window.scrollY < 24;
      const shouldShow = (isAtTop || document.body.classList.contains('nav-is-hidden')) && !footerInView;
      floatFooter.classList.toggle('footer-float--visible', shouldShow);
      ticking = false;
    }

    const footerObserver = new IntersectionObserver(entries => {
      footerInView = entries.some(entry => entry.isIntersecting);
      updateVisibility();
    }, {threshold: 0.01});

    footerObserver.observe(footer);

    function requestUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestUpdate, {passive: true});
    window.addEventListener('resize', requestUpdate);
    updateVisibility();
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
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const parent = e.target.parentElement;
          const siblings = parent ? $$('.reveal', parent) : [e.target];
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
    const overlayHashById = {
      'privacy-overlay': '#privacy',
      'legal-overlay': '#legal'
    };
    const overlayIdByHash = Object.fromEntries(
      Object.entries(overlayHashById).map(([id, hash]) => [hash, id])
    );

    function openOverlay(id) {
      const overlay = $('#' + id);
      if (!overlay) return;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const first = overlay.querySelector('button, a, [tabindex="0"]');
      if (first instanceof HTMLElement) {
        setTimeout(() => first.focus({preventScroll: true}), 50);
      }
    }

    function closeOverlay(id) {
      const overlay = $('#' + id);
      if (!overlay) return;
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function setOverlayHash(hash) {
      window.history.pushState(null, '', hash);
    }

    function clearOverlayHash(id) {
      if (overlayHashById[id] !== window.location.hash) return;
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }

    function syncOverlayFromHash() {
      const targetOverlayId = overlayIdByHash[window.location.hash];

      $$('.overlay.open').forEach(overlay => {
        if (overlay.id !== targetOverlayId) closeOverlay(overlay.id);
      });

      if (targetOverlayId) openOverlay(targetOverlayId);
    }

    $$('#open-privacy, #open-privacy-mob').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        setOverlayHash('#privacy');
        syncOverlayFromHash();
      });
    });
    const closePrivacy = $('#close-privacy');
    if (closePrivacy) {
      closePrivacy.addEventListener('click', () => {
        closeOverlay('privacy-overlay');
        clearOverlayHash('privacy-overlay');
      });
    }

    $$('#open-legal, #open-legal-mob').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        setOverlayHash('#legal');
        syncOverlayFromHash();
      });
    });
    const closeLegal = $('#close-legal');
    if (closeLegal) {
      closeLegal.addEventListener('click', () => {
        closeOverlay('legal-overlay');
        clearOverlayHash('legal-overlay');
      });
    }

    $$('.overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          closeOverlay(overlay.id);
          clearOverlayHash(overlay.id);
        }
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        $$('.overlay.open').forEach(o => {
          closeOverlay(o.id);
          clearOverlayHash(o.id);
        });
      }
    });

    window.addEventListener('hashchange', syncOverlayFromHash);
    syncOverlayFromHash();
  }

  function initQuoteFlyIn() {
    const introQuotes = $$('.quote-intro .quote-fly');
    const outroQuotes = $$('.quote-outro .quote-fly');
    const allQuotes = [...introQuotes, ...outroQuotes];

    if (!allQuotes.length) return;

    const introObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.intersectionRatio >= 0.55) {
          e.target.classList.add('in-view');
        } else if (e.intersectionRatio <= 0.08) {
          e.target.classList.remove('in-view');
        }
      });
    }, {threshold: [0, 0.08, 0.3, 0.55, 1]});

    const outroObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.intersectionRatio >= 0.2) {
          e.target.classList.add('in-view');
        } else {
          e.target.classList.remove('in-view');
        }
      });
    }, {threshold: [0, 0.2, 1], rootMargin: '0px 0px -12% 0px'});

    introQuotes.forEach(el => introObs.observe(el));
    outroQuotes.forEach(el => outroObs.observe(el));

    let ticking = false;

    function updateQuoteFade() {
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 56;
      const stickyTop = navH + 24;
      const fadeDistance = 180;

      allQuotes.forEach(quote => {
        const section = quote.closest('.quote-section');
        if (!section) return;

        const sectionRect = section.getBoundingClientRect();
        const distanceToEnd = sectionRect.bottom - stickyTop;
        const fadeDistance = section.classList.contains('quote-outro') ? 820 : 180;
        const opacity = Math.max(0, Math.min(1, distanceToEnd / fadeDistance));
        quote.style.setProperty('--quote-opacity', opacity.toFixed(3));
      });

      ticking = false;
    }

    function requestFadeUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateQuoteFade);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestFadeUpdate, {passive: true});
    window.addEventListener('resize', requestFadeUpdate);
    updateQuoteFade();
  }

  function scrollToAnchorTarget(href, behavior = 'smooth') {
    if (href === '#') {
      window.scrollTo({top: 0, behavior});
      return true;
    }

    const target = $(href);
    if (!target) return false;

    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 56;
    const preferredTarget = target.matches('.content-section')
      ? $('.section-title, .section-label, .section-inner', target) || target
      : target;
    const top = target.id === 'about'
      ? target.getBoundingClientRect().top + window.scrollY
      : preferredTarget.getBoundingClientRect().top + window.scrollY - navH - 16;

    window.scrollTo({top, behavior});
    return true;
  }

  function slowScrollToAnchorTarget(href) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return scrollToAnchorTarget(href, 'auto');
    }

    const target = $(href);
    if (!target) return false;

    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 56;
    const preferredTarget = target.matches('.content-section')
      ? $('.section-title, .section-label, .section-inner', target) || target
      : target;
    const destination = target.id === 'about'
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
      window.scrollTo({top: startTop + (delta * eased), behavior: 'auto'});

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
    if (href === '#') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
      return;
    }

    window.history.pushState(null, '', href);
  }

  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href) return;

        if (link.matches('.hero-cta')) {
          if (slowScrollToAnchorTarget(href)) {
            e.preventDefault();
            updateUrlHash(href);
          }
          return;
        }

        if (scrollToAnchorTarget(href)) {
          e.preventDefault();
          updateUrlHash(href);
        }
      });
    });

    function syncHashNavigation() {
      const {hash} = window.location;
      if (!hash || hash === '#') return;
      if (!$(hash)) return;

      window.scrollTo({top: 0, behavior: 'auto'});
      requestAnimationFrame(() => {
        scrollToAnchorTarget(hash);
      });
    }

    window.addEventListener('hashchange', syncHashNavigation);
    syncHashNavigation();
  }

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

    const themeBtn = $('#theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
