const translations = {
  en: {
    'nav-home': 'Home',
    'nav-about': 'About',
    'nav-skills': 'Skills',
    'nav-projects': 'Projects',
    'nav-experience': 'Experience',
    'nav-education': 'Education',
    'nav-contact': 'Contact',
    'hero-name': 'Mohammad Ahmad Alsharawi',
    'hero-subtitle': 'AI Engineer & Backend Developer',
    'hero-academic': 'Informatics & Communications Engineering - AI Major',
    'hero-desc': 'Passionate AI Engineer and Backend Developer specializing in Laravel advanced systems, Machine Learning, Deep Learning, and LLM applications. Building scalable, production-ready solutions.',
    'view-projects': 'View Projects',
    'contact-me': 'Contact Me',
    'about-me': 'About Me',
    'my-skills': 'Skills & Technical Stack',
    'my-projects': 'Featured Projects',
    'my-experience': 'Work Experience',
    'my-education': 'Academic Education',
    'get-in-touch': 'Get In Touch',
    'send-message': 'Send Message',
    'programming-languages': 'Programming Languages',
    'ai-ml-data': 'AI / ML / Data Science',
    'backend-systems': 'Backend Systems',
    'rifad-title': 'Rifad Foundation',
    'rifad-short': 'Nonprofit Educational Platform for Syria',
    'rifad-desc': 'Educational foundation dedicated to empowering teachers and rebuilding education.',
    'allnewtech-title': 'All New Tech UK',
    'allnewtech-short': 'UK Security & Smart Automation Solutions',
    'allnewtech-desc': 'Security provider specializing in CCTV, access control, and smart automation.',
    'ai-engineer': 'AI Engineer',
    'backend-developer': 'Backend Developer & AI Specialist',
    'experience-present': '2025 – Present',
    'aiu-university': 'Arab International University (AIU)',
    'major-ai': 'Major: Artificial Intelligence',
    'grad-2027': 'Expected Graduation: July 2027',
    'copyright': '© 2026 Mohammad Ahmad Alsharawi. All rights reserved.'
  },
  ar: {
    'nav-home': 'الرئيسية',
    'nav-about': 'حولي',
    'nav-skills': 'المهارات',
    'nav-projects': 'المشاريع',
    'nav-experience': 'الخبرات',
    'nav-education': 'التعليم',
    'nav-contact': 'التواصل',
    'hero-name': 'محمد أحمد الشعراوي',
    'hero-subtitle': 'مهندس ذكاء اصطناعي ومطور خلفي (Backend)',
    'hero-academic': 'هندسة المعلوماتية والاتصالات - اختصاص الذكاء الاصطناعي',
    'hero-desc': 'مهندس ذكاء اصطناعي ومطور خلفية شغوف متخصص في أنظمة Laravel المتقدمة، التعلم الآلي، التعلم العميق، وتطبيقات نماذج اللغة الكبيرة (LLM). أعمل على بناء أنظمة ذكية وجاهزة للإنتاج تتميز بالمرونة والقابلية للتوسع.',
    'view-projects': 'عرض المشاريع',
    'contact-me': 'تواصل معي',
    'about-me': 'عنّي',
    'my-skills': 'المهارات والتقنيات',
    'my-projects': 'أبرز المشاريع',
    'my-experience': 'الخبرة العملية',
    'my-education': 'التعليم الأكاديمي',
    'get-in-touch': 'ابقَ على تواصل',
    'send-message': 'إرسال الرسالة',
    'programming-languages': 'لغات البرمجة',
    'ai-ml-data': 'الذكاء الاصطناعي / التعلم الآلي',
    'backend-systems': 'الأنظمة الخلفية',
    'rifad-title': 'مؤسسة ريفاد',
    'rifad-short': 'منصة تعليمية غير ربحية لسوريا',
    'rifad-desc': 'مؤسسة تعليمية غير ربحية مخصصة لتمكين المعلمين وتطوير الطلاب وإعادة بناء مستقبل التعليم.',
    'allnewtech-title': 'All New Tech UK',
    'allnewtech-short': 'حلول التقنية والأمان - المملكة المتحدة',
    'allnewtech-desc': 'مزود حلول أمن وتكنولوجيا بريطاني متخصص في كاميرات المراقبة والأتمتة الذكية.',
    'ai-engineer': 'مهندس ذكاء اصطناعي',
    'backend-developer': 'مطور خلفية وأخصائي ذكاء اصطناعي',
    'experience-present': '2025 – الحاضر',
    'aiu-university': 'الجامعة العربية الدولية (AIU)',
    'major-ai': 'التخصص: الذكاء الاصطناعي',
    'grad-2027': 'التخرج المتوقع: تموز 2027',
    'copyright': '© 2026 محمد أحمد الشعراوي. جميع الحقوق محفوظة.'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function initLanguage() {
  applyLanguage(currentLang);
}

function switchLanguage(lang) {
  const targetLang = lang || (currentLang === 'en' ? 'ar' : 'en');
  currentLang = targetLang;
  localStorage.setItem('lang', targetLang);
  applyLanguage(targetLang);
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl-mode', lang === 'ar');

  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.dataset.lang;
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  const switcherBtn = document.querySelector('.language-switcher');
  if (switcherBtn) {
    switcherBtn.textContent = lang === 'en' ? 'العربية' : 'English';
  }
}

document.addEventListener('DOMContentLoaded', initLanguage);

window.switchLanguage = switchLanguage;
window.translations = translations;