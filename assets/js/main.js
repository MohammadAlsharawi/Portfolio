// Enhanced Main JS v2 - Premium Nav, Scroll, RTL, Accessibility

document.addEventListener('DOMContentLoaded', () => {
  // Premium Navbar Effects
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile Menu - Enhanced
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.navbar-nav');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navList.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Close on overlay/escape/link click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('navbar-nav') || e.target.closest('.nav-link')) {
      hamburger.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('active')) {
      hamburger.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  // Active Nav Link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href]');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });

  sections.forEach(section => observer.observe(section));

  // Smooth Scroll All Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Mobile close
      if (navList.classList.contains('active')) {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // Scroll Reveals - Enhanced Stagger
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', `delay-${(index % 3) + 1}`);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.animate, .card, .timeline-item').forEach(el => revealObserver.observe(el));

  // Navbar Reveal on Scroll Home
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const progress = Math.min(window.scrollY / (hero.offsetHeight * 0.7), 1);
      navbar.style.background = `rgba(10,10,10,${0.9 + progress * 0.1})`;
    });
  }

  // Back to Top Button (Progressive)
  let backToTop = document.querySelector('.back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; width: 56px; height: 56px;
      background: var(--accent); color: var(--bg-primary); border: none;
      border-radius: 50%; font-size: 1.2rem; cursor: pointer; z-index: 999;
      opacity: 0; visibility: hidden; transition: var(--transition);
      box-shadow: 0 8px 25px rgba(0,212,255,0.4);
    `;
    document.body.appendChild(backToTop);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 800) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// CSS-in-JS for Back to Top (if needed)
const style = document.createElement('style');
style.textContent = `
  .back-to-top:hover { transform: scale(1.1) rotate(360deg); box-shadow: 0 12px 40px rgba(0,212,255,0.6); }
  .no-scroll { overflow: hidden; }
`;
document.head.appendChild(style);

// Export
window.navEffects = true;
