// Portfolio navigation, reveal and accessibility behavior.
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.navbar-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Missing optional local media should not leave broken-image icons in the UI.
  document.querySelectorAll('img').forEach(img => {
    const markMissing = () => img.classList.add('media-missing');
    img.addEventListener('error', markMissing, { once: true });
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  const closeMenu = () => {
    if (!hamburger || !navList) return;
    hamburger.classList.remove('active');
    navList.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  const toggleMenu = () => {
    if (!hamburger || !navList) return;
    const willOpen = !navList.classList.contains('active');
    hamburger.classList.toggle('active', willOpen);
    navList.classList.toggle('active', willOpen);
    hamburger.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('no-scroll', willOpen);
  };

  if (hamburger && navList) {
    hamburger.addEventListener('click', toggleMenu);
    navList.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1180) closeMenu();
  });

  const updateNavbar = () => navbar?.classList.toggle('scrolled', window.scrollY > 40);
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // Only intercept valid same-page fragment links. A bare '#' must never reach querySelector.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    anchor.addEventListener('click', event => {
      let target;
      try { target = document.querySelector(href); } catch (_) { return; }
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const revealTargets = document.querySelectorAll('.animate, .card, .timeline-item');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealTargets.forEach(el => el.classList.add('reveal'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  let backToTop = document.querySelector('.back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    document.body.appendChild(backToTop);
  }
  const updateBackToTop = () => backToTop.classList.toggle('visible', window.scrollY > 700);
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const langButton = document.querySelector('.language-switcher');
  if (langButton && typeof window.switchLanguage === 'function') {
    const syncLangButton = () => {
      const current = document.documentElement.lang === 'ar' ? 'ar' : 'en';
      langButton.textContent = current === 'en' ? 'AR' : 'EN';
      langButton.setAttribute('aria-label', current === 'en' ? 'Switch to Arabic' : 'Switch to English');
    };
    syncLangButton();
    langButton.addEventListener('click', () => {
      const current = document.documentElement.lang === 'ar' ? 'ar' : 'en';
      window.switchLanguage(current === 'en' ? 'ar' : 'en');
      syncLangButton();
      closeMenu();
    });
  }
});
