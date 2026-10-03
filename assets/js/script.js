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

// --- Instant Theme Initialization (Prevents FOUC) ---
(function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
})();

// --- Global E-Ink Transition Flash Function ---
window.triggerEInkFlash = function () {
  let overlay = document.getElementById('einkFlashOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'einkFlashOverlay';
    overlay.className = 'eink-flash-overlay';
    document.body.appendChild(overlay);
  }

  overlay.classList.remove('active');
  void overlay.offsetWidth; // Trigger DOM reflow to restart animation
  overlay.classList.add('active');

  // Haptic feedback vibration for mobile devices
  if (navigator.vibrate && 'ontouchstart' in window) {
    try { navigator.vibrate([6, 18, 6]); } catch (e) {}
  }

  setTimeout(() => {
    overlay.classList.remove('active');
  }, 420);
};

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. E-Ink Preloader Overlay Controller (1-Second Curve Slider & 0-100% Counter) ---
  const einkPreloader = document.getElementById('einkPreloader');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const preloaderCurveProgress = document.getElementById('preloaderCurveProgress');
  const preloaderStatusText = document.getElementById('preloaderStatusText');

  if (einkPreloader && preloaderPercent && preloaderCurveProgress) {
    const totalDuration = 1000; // 1 second total animation duration
    const startTime = performance.now();

    // Calculate SVG curve total length for accurate stroke fill animation
    let pathLength = 380;
    try {
      pathLength = preloaderCurveProgress.getTotalLength() || 380;
    } catch (e) {
      pathLength = 380;
    }

    preloaderCurveProgress.style.strokeDasharray = pathLength;
    preloaderCurveProgress.style.strokeDashoffset = pathLength;

    function animatePreloader(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1.0);

      // Smooth cubic easing
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentPercent = Math.floor(easedProgress * 100);
      preloaderPercent.textContent = currentPercent;
      einkPreloader.setAttribute('aria-valuenow', currentPercent);

      const offset = pathLength * (1 - easedProgress);
      preloaderCurveProgress.style.strokeDashoffset = offset;

      if (currentPercent > 70 && preloaderStatusText) {
        preloaderStatusText.textContent = 'RENDERING INTERFACE...';
      }

      if (progress < 1.0) {
        requestAnimationFrame(animatePreloader);
      } else {
        preloaderPercent.textContent = '100';
        preloaderCurveProgress.style.strokeDashoffset = 0;
        if (preloaderStatusText) preloaderStatusText.textContent = 'SYSTEM READY';

        // Trigger signature E-Ink Flash transition on completion
        setTimeout(() => {
          if (typeof window.triggerEInkFlash === 'function') {
            window.triggerEInkFlash();
          }
          einkPreloader.classList.add('fade-out');
          setTimeout(() => {
            einkPreloader.style.display = 'none';
          }, 450);
        }, 120);
      }
    }

    requestAnimationFrame(animatePreloader);
  }

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
  const currentYearEls = document.querySelectorAll('.current-year');
  const thisYear = new Date().getFullYear();
  currentYearEls.forEach(el => {
    el.textContent = thisYear;
  });

  // --- Universal Squishy Wiggly Physics Trigger ---
  window.triggerSquishyAnimation = function (el) {
    if (!el) return;
    el.classList.remove('squishy-active');
    void el.offsetWidth; // Force DOM reflow to restart CSS keyframe animation
    el.classList.add('squishy-active');
    setTimeout(() => {
      el.classList.remove('squishy-active');
    }, 560);
  };

  const interactiveElementsSelector = `
    .hero-btn,
    .social-icon-btn,
    .hero-social-link,
    .cert-back-link,
    .year-chip,
    .filter-tab,
    .project-action-btn,
    .eink-btn,
    .eink-theme-toggle,
    .nav-brand,
    .footer-brand,
    .nav-link
  `;

  // Global event delegation for click and tap squishy wiggly physics animation
  document.addEventListener('click', (e) => {
    const target = e.target.closest(interactiveElementsSelector);
    if (target) {
      window.triggerSquishyAnimation(target);
    }
  });

  // Touch device haptics
  document.addEventListener('touchstart', (e) => {
    const target = e.target.closest(interactiveElementsSelector);
    if (target && navigator.vibrate && 'ontouchstart' in window) {
      try { navigator.vibrate(6); } catch (err) {}
    }
  }, { passive: true });

  const backToTopBtns = document.querySelectorAll('.back-to-top-btn');
  backToTopBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const scrollBottomBtns = document.querySelectorAll('.scroll-bottom-btn');
  scrollBottomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  });

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

  // --- E-Ink Top Scroll Progress Line & Touch Haptics ---
  let progressBar = document.getElementById('einkScrollProgress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'einkScrollProgress';
    progressBar.className = 'eink-scroll-progress';
    document.body.appendChild(progressBar);
  }

  // Highlight active nav item on scroll & update progress line
  const sections = document.querySelectorAll('section[id], .cert-year-group[id]');
  let lastActiveSection = '';

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && totalHeight > 0) {
      const progress = Math.min((scrollY / totalHeight) * 100, 100);
      progressBar.style.width = progress + '%';
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navItem) {
          linkElements.forEach(l => l.classList.remove('active'));
          navItem.classList.add('active');
        }
        if (lastActiveSection !== sectionId) {
          lastActiveSection = sectionId;
          // Touch haptic feedback vibration for section transition on mobile
          if (navigator.vibrate && 'ontouchstart' in window) {
            try { navigator.vibrate(6); } catch (e) {}
          }
        }
      }
    });
  }, { passive: true });

  // --- 4. Dark/Light Theme Toggle ---
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Trigger squishy wiggly physics animation
      triggerSquishyAnimation(themeToggle);

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

  // --- 6. Formspree Contact Form Security, Sanitization & Validation Handler ---
  if (contactForm) {
    const submitBtn = contactForm.querySelector('[data-fs-submit-btn]');
    const successBanner = document.getElementById('formSuccessBanner');
    const errorBanner = document.getElementById('formErrorBanner');
    const formRenderTime = Date.now();
    const SUBMIT_COOLDOWN_MS = 45000; // 45-second rate limit guard per client

    function sanitizeInput(str) {
      if (typeof str !== 'string') return '';
      // Strip HTML tags & control characters to eliminate XSS payload injection
      return str.replace(/<[^>]*>?/gm, '').trim();
    }

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
      // RFC 5322 compliant regex preventing email header injections & bad formatting
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }

    function validateName(name) {
      // Allow letters, spaces, hyphens, dots, apostrophes; min 2, max 70
      const re = /^[a-zA-Z\s\.\-']{2,70}$/;
      return re.test(name);
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrors();

      // Security Check 1: Honeypot Anti-Spam (Bots auto-fill hidden input)
      const gotcha = contactForm.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value !== '') {
        return; // Silent drop for automated bots
      }

      // Security Check 2: Automated Bot Load-Time Threshold (< 1.5 seconds from page render)
      if (Date.now() - formRenderTime < 1500) {
        if (errorBanner) {
          errorBanner.style.display = 'block';
          errorBanner.textContent = 'Automated submission detected. Please wait a moment and try again.';
        }
        return;
      }

      // Security Check 3: Client Rate-Limiting / Submission Cooldown Guard
      const lastSubmit = localStorage.getItem('fnz_form_last_sub');
      if (lastSubmit) {
        const timeElapsed = Date.now() - parseInt(lastSubmit, 10);
        if (timeElapsed < SUBMIT_COOLDOWN_MS) {
          const remainingSec = Math.ceil((SUBMIT_COOLDOWN_MS - timeElapsed) / 1000);
          if (errorBanner) {
            errorBanner.style.display = 'block';
            errorBanner.textContent = `Security Rate Limit: Please wait ${remainingSec} second(s) before sending another message.`;
          }
          return;
        }
      }

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Extract & Sanitize raw inputs
      const rawName = nameInput ? nameInput.value : '';
      const rawEmail = emailInput ? emailInput.value : '';
      const rawMessage = messageInput ? messageInput.value : '';

      const nameVal = sanitizeInput(rawName);
      const emailVal = sanitizeInput(rawEmail);
      const messageVal = sanitizeInput(rawMessage);

      // Validate Name
      if (!nameVal) {
        showError('name', 'Please enter your name.');
        isValid = false;
      } else if (nameVal.length < 2) {
        showError('name', 'Name must be at least 2 characters.');
        isValid = false;
      } else if (nameVal.length > 70) {
        showError('name', 'Name must not exceed 70 characters.');
        isValid = false;
      } else if (!validateName(nameVal)) {
        showError('name', 'Name contains invalid or dangerous characters.');
        isValid = false;
      }

      // Validate Email
      if (!emailVal) {
        showError('email', 'Please enter your email address.');
        isValid = false;
      } else if (emailVal.length > 100) {
        showError('email', 'Email address is too long.');
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        showError('email', 'Please enter a valid email address (e.g. name@example.com).');
        isValid = false;
      }

      // Validate Message
      if (!messageVal) {
        showError('message', 'Please write a message.');
        isValid = false;
      } else if (messageVal.length < 10) {
        showError('message', 'Message should be at least 10 characters long.');
        isValid = false;
      } else if (messageVal.length > 2000) {
        showError('message', 'Message must not exceed 2000 characters.');
        isValid = false;
      }

      if (!isValid) {
        if (typeof window.triggerEInkFlash === 'function') {
          window.triggerEInkFlash();
        }
        return;
      }

      // Prepare Secure AJAX Submission Payload
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('sending');
        submitBtn.innerHTML = `
          <span class="btn-dot-pulse"></span>
          <span>TRANSMITTING...</span>
        `;
      }

      const cleanFormData = new FormData();
      cleanFormData.append('name', nameVal);
      cleanFormData.append('email', emailVal);
      cleanFormData.append('message', messageVal);
      cleanFormData.append('_subject', 'Portfolio Contact Message from ' + nameVal);

      const formEndpoint = (typeof window !== 'undefined' && window.ENV && window.ENV.FORMSPREE_ENDPOINT)
        || contactForm.getAttribute('action')
        || 'https://formspree.io/f/mdekbvjj';

      try {
        const response = await fetch(formEndpoint, {
          method: 'POST',
          body: cleanFormData,
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.ok) {
          localStorage.setItem('fnz_form_last_sub', Date.now().toString());
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
          let errText = 'Submission error. Please verify your entries and try again.';
          if (data && Array.isArray(data.errors)) {
            errText = data.errors.map(err => sanitizeInput(err.message)).join(', ');
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

  // --- 8. Interactive Piano Keys Hover & Wave Ripple Animation ---
  const pianoKeys = document.querySelectorAll('.piano-key');
  pianoKeys.forEach((key, index, keysList) => {
    function activateKey() {
      key.classList.add('active-key');
      if (keysList[index - 1]) keysList[index - 1].classList.add('neighbor-left');
      if (keysList[index + 1]) keysList[index + 1].classList.add('neighbor-right');

      // Haptic vibration feedback for touch devices
      if (navigator.vibrate && 'ontouchstart' in window) {
        try { navigator.vibrate(6); } catch (e) {}
      }
    }

    function deactivateKey() {
      key.classList.remove('active-key');
      if (keysList[index - 1]) keysList[index - 1].classList.remove('neighbor-left');
      if (keysList[index + 1]) keysList[index + 1].classList.remove('neighbor-right');
    }

    key.addEventListener('mouseenter', activateKey);
    key.addEventListener('mouseleave', deactivateKey);

    // Touch events for mobile swiping / tapping across letter keys
    key.addEventListener('touchstart', (e) => {
      activateKey();
    }, { passive: true });

    key.addEventListener('touchend', deactivateKey);
    key.addEventListener('touchcancel', deactivateKey);
  });

  // --- 9. Projects Page Category Filter Handler ---
  const filterTabs = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('[data-project-category]');

  if (filterTabs.length > 0 && projectCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-project-filter');
        projectCards.forEach(card => {
          const categories = card.getAttribute('data-project-category') || '';
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});

