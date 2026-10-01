/**
 * E-Ink Navbar, Contact Form & Portfolio Interactive Script
 */

// --- HTTP Protection: Enforce HTTPS in Production ---
(function enforceHTTPS() {
  if (
    window.location.protocol === 'http:' &&
    !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) &&
    !window.location.hostname.endsWith('.local')
  ) {
    window.location.replace(
      'https://' +
        window.location.host +
        window.location.pathname +
        window.location.search +
        window.location.hash
    );
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const refreshBtn = document.getElementById('refreshBtn');
  const clockElement = document.getElementById('einkClock');
  const linkElements = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');

  // --- 1. Live E-Ink Clock ---
  function updateClock() {
    if (!clockElement) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  // --- 2. Mobile Menu Toggle ---
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. Active Nav Link Handler & Smooth Scrolling ---
  linkElements.forEach(link => {
    link.addEventListener('click', function (e) {
      linkElements.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      if (navLinks) {
        navLinks.classList.remove('open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Highlight active nav item on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navItem && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        linkElements.forEach(l => l.classList.remove('active'));
        navItem.classList.add('active');
      }
    });
  }, { passive: true });

  // --- 4. Dark/Light Theme Toggle ---
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      let newTheme = 'dark';

      if (currentTheme === 'dark') {
        newTheme = 'light';
      } else if (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        newTheme = 'light';
      }

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);

      if (typeof window.triggerEInkFlash === 'function') {
        window.triggerEInkFlash();
      }
    });

    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  // --- 5. Manual E-Ink Refresh Button ---
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      if (typeof window.triggerEInkFlash === 'function') {
        window.triggerEInkFlash();
      }
    });
  }

  // --- 6. Formspree Contact Form Validation & AJAX Handler ---
  if (contactForm) {
    const submitBtn = contactForm.querySelector('[data-fs-submit-btn]');
    const successBanner = document.getElementById('formSuccessBanner');
    const errorBanner = document.getElementById('formErrorBanner');

    function showError(fieldId, message) {
      const errorSpan = contactForm.querySelector(`[data-fs-error="${fieldId}"]`);
      const inputEl = document.getElementById(fieldId);
      if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = message ? 'block' : 'none';
      }
      if (inputEl) {
        if (message) {
          inputEl.classList.add('invalid');
          inputEl.setAttribute('aria-invalid', 'true');
        } else {
          inputEl.classList.remove('invalid');
          inputEl.removeAttribute('aria-invalid');
        }
      }
    }

    function clearAllErrors() {
      const errorSpans = contactForm.querySelectorAll('[data-fs-error]');
      errorSpans.forEach(span => {
        span.textContent = '';
        span.style.display = 'none';
      });
      const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
      inputs.forEach(input => {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
      });
      if (errorBanner) {
        errorBanner.style.display = 'none';
        errorBanner.textContent = '';
      }
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrors();

      // Honeypot spam check
      const gotcha = contactForm.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value !== '') {
        // Silent drop for automated bots
        return;
      }

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        showError('name', 'Please enter your name.');
        isValid = false;
      } else if (nameVal.length < 2) {
        showError('name', 'Name must be at least 2 characters.');
        isValid = false;
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        showError('email', 'Please enter your email address.');
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal) {
        showError('message', 'Please write a message.');
        isValid = false;
      } else if (messageVal.length < 10) {
        showError('message', 'Message should be at least 10 characters long.');
        isValid = false;
      }

      if (!isValid) {
        if (typeof window.triggerEInkFlash === 'function') {
          window.triggerEInkFlash();
        }
        return;
      }

      // Prepare AJAX Submission to Formspree
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('sending');
        submitBtn.innerHTML = `
          <span class="btn-dot-pulse"></span>
          <span>TRANSMITTING...</span>
        `;
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formspree.io/f/mdekbvjj', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success Feedback
          if (typeof window.triggerEInkFlash === 'function') {
            window.triggerEInkFlash();
          }
          contactForm.reset();
          contactForm.style.display = 'none';
          if (successBanner) {
            successBanner.style.display = 'block';
          }
        } else {
          const data = await response.json();
          let errText = 'Submission error. Please check fields and try again.';
          if (Object.hasOwn(data, 'errors')) {
            errText = data.errors.map(err => err.message).join(', ');
          }
          if (errorBanner) {
            errorBanner.style.display = 'block';
            errorBanner.textContent = errText;
          }
        }
      } catch (err) {
        if (errorBanner) {
          errorBanner.style.display = 'block';
          errorBanner.textContent = 'Network error. Please check your connection and try again.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('sending');
          submitBtn.innerHTML = `
            <span class="btn-dot">●</span>
            <span>SEND MESSAGE</span>
          `;
        }
      }
    });

    // Reset button inside success banner
    const resetFormBtn = document.getElementById('resetFormBtn');
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.style.display = 'block';
        if (successBanner) successBanner.style.display = 'none';
        clearAllErrors();
        if (typeof window.triggerEInkFlash === 'function') {
          window.triggerEInkFlash();
        }
      });
    }
  }

  // --- XSS Security Sanitization Utility ---
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, '&#96;');
  }

  // --- 7. E-Ink Tech Stack Marquee Populator ---
  const marqueeTrack = document.querySelector('.eink-marquee-track');
  if (marqueeTrack && window.TECH_STACK_ICONS) {
    const techItems = [
      { name: 'Python', icon: window.TECH_STACK_ICONS.python },
      { name: 'NumPy', icon: window.TECH_STACK_ICONS.numpy },
      { name: 'Pandas', icon: window.TECH_STACK_ICONS.pandas },
      { name: 'OpenCV', icon: window.TECH_STACK_ICONS.opencv },
      { name: 'HTML5', icon: window.TECH_STACK_ICONS.html5 },
      { name: 'CSS3', icon: window.TECH_STACK_ICONS.css3 },
      { name: 'JavaScript', icon: window.TECH_STACK_ICONS.javascript },
      { name: 'TypeScript', icon: window.TECH_STACK_ICONS.typescript },
      { name: 'React', icon: window.TECH_STACK_ICONS.react },
      { name: 'Vite', icon: window.TECH_STACK_ICONS.vite },
      { name: 'Tailwind CSS', icon: window.TECH_STACK_ICONS.tailwindcss },
      { name: 'FastAPI', icon: window.TECH_STACK_ICONS.fastapi },
      { name: 'Node.js', icon: window.TECH_STACK_ICONS.nodejs },
      { name: 'npm', icon: window.TECH_STACK_ICONS.npm },
      { name: 'C', icon: window.TECH_STACK_ICONS.c },
      { name: 'Git', icon: window.TECH_STACK_ICONS.git },
      { name: 'GitHub', icon: window.TECH_STACK_ICONS.github },
      { name: 'Antigravity', icon: window.TECH_STACK_ICONS.antigravity },
      { name: 'Jupyter', icon: window.TECH_STACK_ICONS.jupyter },
      { name: 'Kaggle', icon: window.TECH_STACK_ICONS.kaggle },
      { name: 'MySQL', icon: window.TECH_STACK_ICONS.mysql },
      { name: 'SQLite', icon: window.TECH_STACK_ICONS.sqlite },
      { name: 'REST API', icon: window.TECH_STACK_ICONS.restapi }
    ];

    const fragment = document.createDocumentFragment();

    // Duplicate set to create seamless infinite scrolling loop
    [...techItems, ...techItems].forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'tech-marquee-item';
      itemEl.setAttribute('data-tooltip', escapeHTML(item.name));
      itemEl.setAttribute('aria-label', escapeHTML(item.name));
      if (item.icon) {
        itemEl.innerHTML = item.icon;
      }
      fragment.appendChild(itemEl);
    });

    marqueeTrack.replaceChildren(fragment);
  }
});

