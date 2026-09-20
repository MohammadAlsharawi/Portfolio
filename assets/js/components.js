// Enhanced Components v2: Modals, Carousel, EmailJS Form, Progress

// EmailJS Setup - Replace with your keys (sign up at emailjs.com free)
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // e.g. 'service_portfolio'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // e.g. 'template_contact'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // e.g. 'user_abc123'

function initEmailJS() {
  // Load EmailJS CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  };
  document.head.appendChild(script);
}

// Contact Form with EmailJS + Validation
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject')?.trim() || 'Portfolio Contact';
    const message = formData.get('message').trim();

    // Client validation
    if (!name || !email || !message || !/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(email)) {
      showFormMessage('Please fill all fields correctly.', 'error');
      return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      if (emailjs) {
        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message
        });
        showFormMessage('Thank you! Message sent successfully.', 'success');
        form.reset();
      } else {
        // Fallback mailto
        const mailto = `mailto:eng.mohammadalsharawi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\\n\\nFrom: ${name} (${email})`)}`;
        window.location.href = mailto;
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      showFormMessage('Failed to send. Please try email directly.', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

function showFormMessage(msg, type) {
  const alert = document.createElement('div');
  alert.className = `form-message ${type}`;
  alert.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 1.5rem 2rem; border-radius: 12px; color: white; font-weight: 600; z-index: 3000; transform: translateX(400px); transition: transform 0.4s ease; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
  alert.textContent = msg;
  document.body.appendChild(alert);
  
  setTimeout(() => alert.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    alert.style.transform = 'translateX(400px)';
    setTimeout(() => alert.remove(), 400);
  }, 4000);
}

// Modals
function openModal(modalId, contentId) {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (modal && content) {
    modal.querySelector('.modal-content #modal-body').innerHTML = content.innerHTML;
    modal.classList.add('active');
  }
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
  document.body.style.overflow = '';
}

// Testimonial Carousel
class TestimonialCarousel {
  constructor(selector) {
    this.carousel = document.querySelector(selector);
    this.track = this.carousel.querySelector('.carousel-track');
    this.cards = [...this.carousel.querySelectorAll('.testimonial-card')];
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.init();
  }

  init() {
    this.updateCarousel();
    this.startAutoPlay();
    
    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  updateCarousel() {
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.updateCarousel();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), 6000);
  }

  pauseAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }
}

// Progress Bars
function animateProgressBars() {
  document.querySelectorAll('.progress-bar').forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.dataset.progress;
      bar.style.width = width;
    }, index * 200);
  });
}

// Init on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Modals
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal.id);
    });
  });
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal').id));
  });

  // Progress observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBars();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.skills-section, [data-progress]').forEach(el => observer.observe(el));

  // Contact forms
  initContactForm();
  initEmailJS();

  // Carousel
  document.querySelectorAll('.carousel').forEach(el => new TestimonialCarousel(el));
});

// Global API
window.openModal = openModal;
window.closeModal = closeModal;
window.TestimonialCarousel = TestimonialCarousel;
window.initContactForm = initContactForm;
