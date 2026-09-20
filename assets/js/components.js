// Shared portfolio components: contact form, modals, carousels and progress bars.
// Add real EmailJS IDs below only if EmailJS is configured for this site.
const EMAILJS_CONFIG = {
  serviceId: '',
  templateId: '',
  publicKey: ''
};

function hasEmailJSConfig() {
  return Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey);
}

function showFormMessage(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `form-message ${type}`;
  alert.setAttribute('role', 'status');
  alert.textContent = message;
  document.body.appendChild(alert);
  window.setTimeout(() => alert.remove(), 4000);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const original = button?.innerHTML || '';
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || 'Portfolio Contact').trim();
    const message = String(data.get('message') || '').trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !validEmail || !message) {
      showFormMessage('Please fill in your name, a valid email, and your message.', 'error');
      return;
    }

    if (button) {
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    }

    try {
      if (hasEmailJSConfig() && window.emailjs) {
        window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        await window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
          from_name: name, from_email: email, subject, message
        });
        form.reset();
        showFormMessage('Thank you! Your message was sent successfully.', 'success');
      } else {
        const body = `${message}\n\nFrom: ${name} (${email})`;
        window.location.href = `mailto:eng.mohammadalsharawi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showFormMessage('The form could not send the message. Please use the email link instead.', 'error');
    } finally {
      if (button) { button.disabled = false; button.innerHTML = original; }
    }
  });
}

function openModal(modalId, contentId) {
  const modal = document.getElementById(modalId);
  const source = document.getElementById(contentId);
  const body = modal?.querySelector('#modal-body');
  if (!modal || !source || !body) return;
  body.innerHTML = source.innerHTML;
  modal.classList.add('active');
  document.body.classList.add('no-scroll');
}
function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

class TestimonialCarousel {
  constructor(selector) {
    this.carousel = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.carousel) return;
    this.track = this.carousel.querySelector('.carousel-track');
    this.cards = [...this.carousel.querySelectorAll('.testimonial-card')];
    this.currentIndex = 0;
    this.timer = null;
    if (!this.track || this.cards.length < 2) return;
    this.update();
    this.start();
    this.carousel.addEventListener('mouseenter', () => this.stop());
    this.carousel.addEventListener('mouseleave', () => this.start());
  }
  update() { this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`; }
  next() { this.currentIndex = (this.currentIndex + 1) % this.cards.length; this.update(); }
  start() { this.stop(); this.timer = window.setInterval(() => this.next(), 6000); }
  stop() { if (this.timer) window.clearInterval(this.timer); }
}

function animateProgressBars(root = document) {
  root.querySelectorAll('.progress-bar[data-progress]').forEach(bar => {
    const value = bar.dataset.progress || '0%';
    bar.style.width = value.endsWith('%') ? value : `${value}%`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', event => {
    if (event.target === modal) closeModal(modal.id);
  }));
  document.querySelectorAll('.close-modal').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal')?.id)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id));
  });
  document.querySelectorAll('.carousel').forEach(el => new TestimonialCarousel(el));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { animateProgressBars(entry.target); observer.unobserve(entry.target); }
    }), { threshold: .1 });
    document.querySelectorAll('.skills-section, [data-progress]').forEach(el => observer.observe(el));
  } else animateProgressBars();
});

window.openModal = openModal;
window.closeModal = closeModal;
window.TestimonialCarousel = TestimonialCarousel;
