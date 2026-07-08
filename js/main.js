(function () {
  'use strict';

  const NAV_BREAKPOINT = 1200;
  const header = document.getElementById('site-header');
  const nav = document.getElementById('site-nav');
  const overlay = document.getElementById('site-overlay');
  const menuToggle = document.getElementById('site-menu-toggle');
  const navLinks = nav ? nav.querySelectorAll('a') : [];

  function isDesktop() {
    return window.innerWidth > NAV_BREAKPOINT;
  }

  // Prefer CSS-mode over innerWidth: scrollbar / zoom can change innerWidth
  // without actually switching the layout rules.
  function isMenuPanelMode() {
    if (!nav) return false;
    return window.getComputedStyle(nav).position === 'fixed';
  }

  function setChromeHeight() {
    if (!header) return;
    document.documentElement.style.setProperty(
      '--site-chrome-height',
      header.offsetHeight + 'px'
    );
  }

  function setMenuOpen(open) {
    if (!nav || !menuToggle || !overlay) return;

    const isOpen = Boolean(open);
    document.body.classList.toggle('menu-open', isOpen);
    nav.classList.toggle('header__nav--open', isOpen);
    overlay.classList.toggle('header__overlay--visible', isOpen);
    menuToggle.classList.toggle('header__menu-toggle--open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    if (!isMenuPanelMode()) {
      nav.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'true');
    } else {
      nav.setAttribute('aria-hidden', String(!isOpen));
      overlay.setAttribute('aria-hidden', String(!isOpen));
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    if (!nav) return;
    setMenuOpen(!nav.classList.contains('header__nav--open'));
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    setChromeHeight();
    if (!isMenuPanelMode()) {
      closeMenu();
    }
  });

  if (header && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(setChromeHeight);
    observer.observe(header);
  }

  window.addEventListener('load', setChromeHeight);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setChromeHeight);
  } else {
    setChromeHeight();
  }

  if (nav) {
    // Closed by default in mobile panel mode.
    nav.setAttribute('aria-hidden', String(isMenuPanelMode()));
  }
  if (overlay) {
    overlay.setAttribute('aria-hidden', 'true');
  }
})();
