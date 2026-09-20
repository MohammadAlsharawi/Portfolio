const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; 
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; 
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; 

function initEmailJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  };
  document.head.appendChild(script);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    const formData = new FormData(form);
    const name = formData.get('name')?.trim() || '';
    const email = formData.get('email')?.trim() || '';
    const subject = formData.get('subject')?.trim() || 'Portfolio Contact';
    const message = formData.get('message')?.trim() || '';

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!name || !email || !message || !emailRegex.test(email)) {
      const isRtl = document.documentElement.dir === 'rtl';
      showFormMessage(
        isRtl ? 'يرجى إدخال جميع البيانات بشكل صحيح' : 'Please fill all fields correctly', 
        'error'
      );
      return;
    }

    const isRtl = document.documentElement.dir === 'rtl';
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${isRtl ? 'جاري الإرسال...' : 'Sending...'}`;
    btn.disabled = true;

    try {
      if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message
        });
        showFormMessage(
          isRtl ? 'تم إرسال الرسالة بنجاح!' : 'Thank you! Message sent successfully.', 
          'success'
        );
        form.reset();
      } else {
        const mailto = `mailto:eng.mohammadalsharawi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`;
        window.location.href = mailto;
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      const mailto = `mailto:eng.mohammadalsharawi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`;
      window.location.href = mailto;
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

function showFormMessage(msg, type) {
  const alert = document.createElement('div');
  alert.className = `form-message ${type}`;
  
  const isRtl = document.documentElement.dir === 'rtl';
  alert.style.cssText = `
    position: fixed; bottom: 30px; ${isRtl ? 'left: 30px' : 'right: 30px'}; 
    padding: 1rem 1.5rem; border-radius: 12px; color: #fff; font-weight: 600; 
    z-index: 3000; transform: translateY(100px); opacity: 0;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); 
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    direction: ${isRtl ? 'rtl' : 'ltr'};
  `;
  alert.textContent = msg;
  document.body.appendChild(alert);
  
  requestAnimationFrame(() => {
    alert.style.transform = 'translateY(0)';
    alert.style.opacity = '1';
  });

  setTimeout(() => {
    alert.style.transform = 'translateY(100px)';
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 400);
  }, 4000);
}

function openModal(modalId, contentId) {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (modal && content) {
    const modalBody = modal.querySelector('#modal-body');
    if (modalBody) modalBody.innerHTML = content.innerHTML;
    modal.classList.add('active');
  }
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function animateProgressBars() {
  document.querySelectorAll('.progress-bar').forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.dataset.progress;
      if (width) bar.style.width = width;
    }, index * 100);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal.id);
    });
  });
  
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) closeModal(modal.id);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBars();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.skills-section, [data-progress]').forEach(el => observer.observe(el));

  initContactForm();
  initEmailJS();
});

window.openModal = openModal;
window.closeModal = closeModal;