// Portfolio UI: navigation, reveal animations, smooth scrolling and accessibility

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.navbar-nav');
  const navLinks = [...document.querySelectorAll('.nav-link[href]')];

  const setMenu = (open) => {
    if (!hamburger || !navList) return;
    hamburger.classList.toggle('active', open);
    navList.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  };

  if (hamburger && navList) {
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', hamburger.getAttribute('aria-label') || 'Toggle menu');

    hamburger.addEventListener('click', () => setMenu(!navList.classList.contains('active')));
    hamburger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setMenu(!navList.classList.contains('active'));
      }
    });

    navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', (event) => {
      if (!navList.classList.contains('active')) return;
      if (!navList.contains(event.target) && !hamburger.contains(event.target)) setMenu(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1180) setMenu(false);
    });
  }

  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // Same-page anchors only. Cross-page navigation remains untouched.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const selector = anchor.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Reveal animation. Content stays visible if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll('.animate, .card, .timeline-item, .project-timeline-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('reveal'));
  }

  // Back to top
  let backToTop = document.querySelector('.back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    document.body.appendChild(backToTop);
  }

  const updateBackToTop = () => {
    const visible = window.scrollY > 500;
    backToTop.classList.toggle('show', visible);
    backToTop.style.opacity = visible ? '1' : '0';
    backToTop.style.visibility = visible ? 'visible' : 'hidden';
  };
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
