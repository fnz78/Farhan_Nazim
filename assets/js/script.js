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
    .eink-copy-btn,
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

  // --- Universal E-Ink Copy to Clipboard & Toast Notification Handler ---
  function showCopyToast(message) {
    let toast = document.getElementById('einkCopyToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'einkCopyToast';
      toast.className = 'eink-copy-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">✓</span> <span>${message}</span>`;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');

    if (window.copyToastTimeout) clearTimeout(window.copyToastTimeout);
    window.copyToastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (!copyBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const textToCopy = copyBtn.getAttribute('data-copy');
    const labelToCopy = copyBtn.getAttribute('data-copy-label') || textToCopy;
    if (!textToCopy) return;

    function handleSuccess() {
      const copyIcon = copyBtn.querySelector('.copy-icon');
      const checkIcon = copyBtn.querySelector('.check-icon');
      const tooltip = copyBtn.querySelector('.copy-tooltip');

      copyBtn.classList.add('copied');
      if (copyIcon) copyIcon.style.display = 'none';
      if (checkIcon) checkIcon.style.display = 'inline-block';
      if (tooltip) {
        if (!copyBtn.dataset.originalTooltip) {
          copyBtn.dataset.originalTooltip = tooltip.textContent;
        }
        tooltip.textContent = 'COPIED!';
      }

      showCopyToast(`Copied to clipboard: ${labelToCopy}`);

      if (navigator.vibrate && 'ontouchstart' in window) {
        try { navigator.vibrate([10, 25]); } catch (err) {}
      }

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (copyIcon) copyIcon.style.display = 'inline-block';
        if (checkIcon) checkIcon.style.display = 'none';
        if (tooltip && copyBtn.dataset.originalTooltip) {
          tooltip.textContent = copyBtn.dataset.originalTooltip;
        }
      }, 2200);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(handleSuccess).catch(err => {
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }

    function fallbackCopy(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        handleSuccess();
      } catch (err) {
        showCopyToast('Failed to copy');
      }
      document.body.removeChild(textArea);
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

      // Securely construct Formspree Endpoint at runtime (Obfuscated from automated HTML scrapers)
      const _fsEnc = 'aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi9tZGVrYnZqag==';
      const formEndpoint = (typeof window !== 'undefined' && window.ENV && window.ENV.FORMSPREE_ENDPOINT)
        || atob(_fsEnc);

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

  // --- Contact Detail Items: Reveal Masked Info & Click-to-Copy Handler ---
  const contactDetailsList = document.querySelector('.contact-details-list');
  if (contactDetailsList) {
    contactDetailsList.addEventListener('click', (e) => {
      const item = e.target.closest('.contact-detail-item');
      if (!item) return;

      const revealBtn = e.target.closest('.detail-reveal-pill, .detail-reveal-btn');
      const copyBtn = e.target.closest('.detail-copy-btn');
      const copyVal = item.getAttribute('data-copy');
      const fullVal = item.getAttribute('data-full');
      const maskedVal = item.getAttribute('data-masked');
      const valSpan = item.querySelector('.detail-val');
      const eyeIcon = item.querySelector('.icon-eye');
      const eyeOffIcon = item.querySelector('.icon-eye-off');
      const pillText = item.querySelector('.pill-text');

      // 1. Toggle Reveal / Mask
      if (revealBtn || (!copyBtn && item.classList.contains('contact-reveal-item') && !item.classList.contains('is-revealed'))) {
        const isCurrentlyRevealed = item.classList.contains('is-revealed');

        if (isCurrentlyRevealed && revealBtn) {
          // Mask back
          item.classList.remove('is-revealed');
          if (valSpan && maskedVal) valSpan.textContent = maskedVal;
          if (eyeIcon) eyeIcon.style.display = 'block';
          if (eyeOffIcon) eyeOffIcon.style.display = 'none';
          if (pillText) pillText.textContent = 'REVEAL';
          if (revealBtn) {
            revealBtn.classList.remove('is-active');
            revealBtn.setAttribute('title', 'Click to Reveal Info');
          }
        } else if (fullVal) {
          // Reveal full value
          item.classList.add('is-revealed');
          if (valSpan) valSpan.textContent = fullVal;
          if (eyeIcon) eyeIcon.style.display = 'none';
          if (eyeOffIcon) eyeOffIcon.style.display = 'block';
          if (pillText) pillText.textContent = 'HIDE';
          if (revealBtn) {
            revealBtn.classList.add('is-active');
            revealBtn.setAttribute('title', 'Click to Hide Info');
          }
          if (typeof window.triggerEInkFlash === 'function') {
            window.triggerEInkFlash();
          }
        }
        if (revealBtn) return;
      }

      // 2. Click to Copy
      if (copyBtn || copyVal) {
        const targetCopyBtn = copyBtn || item.querySelector('.detail-copy-btn');
        if (copyVal) {
          navigator.clipboard.writeText(copyVal).then(() => {
            if (targetCopyBtn) {
              targetCopyBtn.classList.add('copied');
              setTimeout(() => targetCopyBtn.classList.remove('copied'), 1800);
            }
            if (navigator.vibrate && 'ontouchstart' in window) {
              try { navigator.vibrate([8, 16]); } catch (err) {}
            }
          }).catch(err => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = copyVal;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            if (targetCopyBtn) {
              targetCopyBtn.classList.add('copied');
              setTimeout(() => targetCopyBtn.classList.remove('copied'), 1800);
            }
          });
        }
      }
    });
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

  // --- 10. Image Lightbox Modal Handler ---
  const lightboxModal = document.getElementById('imageLightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

  if (lightboxModal && lightboxImage) {
    function openLightbox(src, alt, captionText) {
      lightboxImage.src = src;
      lightboxImage.alt = alt || 'Enlarged Preview';
      if (lightboxCaption) {
        lightboxCaption.textContent = captionText || alt || '';
      }
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!lightboxModal.classList.contains('active')) {
          lightboxImage.src = '';
        }
      }, 250);
    }

    document.addEventListener('click', (e) => {
      const targetImg = e.target.closest('.project-ui-img');
      if (targetImg) {
        const src = targetImg.getAttribute('src');
        const alt = targetImg.getAttribute('alt') || 'Project UI Screenshot';
        const cardTitle = targetImg.closest('.project-card-item')?.querySelector('.project-card-title')?.textContent || alt;
        openLightbox(src, alt, cardTitle);
      }
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- 11. Interactive E-Ink Floral & Star Background Animation Engine ---
  (function initEInkFloralBackground() {
    let canvas = document.getElementById('einkFloralCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'einkFloralCanvas';
      canvas.className = 'eink-floral-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, isOver: false };
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;

    // Responsive Canvas Resize
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
      buildScene();
    }

    // Get current theme ink color dynamically
    function getInkColor() {
      const computed = getComputedStyle(document.documentElement);
      let ink = computed.getPropertyValue('--ink').trim() || '#1c1c1a';
      return ink;
    }

    let items = [];
    let particles = [];

    // Build Floral Border & Star Layout (Inspired by reference image)
    function buildScene() {
      items = [];
      particles = [];

      const isMobile = width < 680;
      const marginOffset = isMobile ? 35 : 75;
      const flowerScale = isMobile ? 0.75 : 1.0;

      // Left Border Flowers & Leaves
      const leftCount = isMobile ? 4 : 7;
      const stepYLeft = height / (leftCount + 1);
      for (let i = 1; i <= leftCount; i++) {
        const y = stepYLeft * i + (Math.sin(i * 1.5) * 20);
        const x = marginOffset + (Math.cos(i * 1.2) * 15);
        items.push({
          type: 'flower',
          side: 'left',
          x: x,
          y: y,
          baseRadius: (i % 2 === 0 ? 32 : 25) * flowerScale,
          petalCount: i % 2 === 0 ? 12 : 8,
          rotation: i * 0.4,
          bloom: 1.0,
          targetBloom: 1.0,
          bloomPhase: Math.random() * Math.PI * 2
        });
      }

      // Right Border Flowers & Leaves
      const rightCount = isMobile ? 4 : 7;
      const stepYRight = height / (rightCount + 1);
      for (let i = 1; i <= rightCount; i++) {
        const y = stepYRight * i + (Math.cos(i * 1.5) * 20);
        const x = width - marginOffset - (Math.sin(i * 1.2) * 15);
        items.push({
          type: 'flower',
          side: 'right',
          x: x,
          y: y,
          baseRadius: (i % 2 === 0 ? 28 : 34) * flowerScale,
          petalCount: i % 2 === 0 ? 10 : 14,
          rotation: i * 0.5,
          bloom: 1.0,
          targetBloom: 1.0,
          bloomPhase: Math.random() * Math.PI * 2
        });
      }

      // Floating 4-Point Sparkle Stars (Matching user's reference image!)
      const starPositions = isMobile ? [
        { x: width * 0.18, y: height * 0.22, size: 18 },
        { x: width * 0.82, y: height * 0.38, size: 22 },
        { x: width * 0.15, y: height * 0.75, size: 20 },
        { x: width * 0.85, y: height * 0.82, size: 16 }
      ] : [
        { x: width * 0.14, y: height * 0.25, size: 26 },
        { x: width * 0.18, y: height * 0.30, size: 16 },
        { x: width * 0.84, y: height * 0.32, size: 28 },
        { x: width * 0.88, y: height * 0.38, size: 18 },
        { x: width * 0.12, y: height * 0.70, size: 24 },
        { x: width * 0.16, y: height * 0.76, size: 14 },
        { x: width * 0.86, y: height * 0.78, size: 30 },
        { x: width * 0.82, y: height * 0.84, size: 16 }
      ];

      starPositions.forEach((pos, idx) => {
        items.push({
          type: 'star',
          x: pos.x,
          y: pos.y,
          size: pos.size * flowerScale,
          rotation: idx * 0.3,
          bloom: 1.0,
          targetBloom: 1.0,
          phase: Math.random() * Math.PI * 2
        });
      });

      // Background floating ambient particles
      const particleCount = isMobile ? 12 : 25;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.4 + 0.2
        });
      }
    }

    // Interactive Listeners: Mouse Move, Touch Move, Scroll
    window.addEventListener('resize', resize, { passive: true });

    function updatePointer(px, py) {
      mouse.targetX = px;
      mouse.targetY = py;
      mouse.isOver = true;
    }

    window.addEventListener('mousemove', (e) => {
      updatePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.isOver = false;
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollY);
      scrollBoost = Math.min(scrollBoost + delta * 0.04, 1.5);
      lastScrollY = currentY;
    }, { passive: true });

    // Drawing helper: 4-Point Diamond Sparkle Star (Exact match to image reference)
    function drawFourPointStar(ctx, cx, cy, size, rotation, opacity, strokeColor) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      const rOuter = size;
      const rInner = size * 0.28;
      for (let i = 0; i < 4; i++) {
        const outerAngle = (i * Math.PI) / 2;
        const innerAngle = outerAngle + Math.PI / 4;
        ctx.lineTo(Math.cos(outerAngle) * rOuter, Math.sin(outerAngle) * rOuter);
        ctx.lineTo(Math.cos(innerAngle) * rInner, Math.sin(innerAngle) * rInner);
      }
      ctx.closePath();
      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.restore();
    }

    // Drawing helper: Detailed E-Ink Line Art Flower (Petals + Stipple Center + Ribs)
    function drawEInkFlower(ctx, cx, cy, radius, petalCount, rotation, bloomFactor, opacity, strokeColor) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.25;

      // Outer petal bloom scaling
      const pLen = radius * bloomFactor;
      const innerCore = radius * 0.3 * bloomFactor;

      // Draw Petals
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, innerCore);
        ctx.bezierCurveTo(
          -radius * 0.24 * bloomFactor, pLen * 0.55,
          -radius * 0.16 * bloomFactor, pLen,
          0, pLen * 1.08
        );
        ctx.bezierCurveTo(
          radius * 0.16 * bloomFactor, pLen,
          radius * 0.24 * bloomFactor, pLen * 0.55,
          0, innerCore
        );
        ctx.stroke();

        // Petal central leaf vein line
        ctx.beginPath();
        ctx.moveTo(0, innerCore * 1.2);
        ctx.lineTo(0, pLen * 0.85);
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.restore();
      }

      // Center dual rings & stipple core
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(0, 0, innerCore, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, innerCore * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // Drawing helper: Continuous Stem Vine Curve along Left & Right Margins
    function drawStemVines(strokeColor) {
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.18 + scrollBoost * 0.1;

      // Left Margin Stem Vine
      const isMobile = width < 680;
      const leftX = isMobile ? 35 : 75;
      ctx.beginPath();
      ctx.moveTo(leftX, 0);
      for (let y = 0; y <= height; y += 30) {
        const waveX = leftX + Math.sin(y * 0.015 + Date.now() * 0.001) * 12;
        ctx.lineTo(waveX, y);
      }
      ctx.stroke();

      // Right Margin Stem Vine
      const rightX = width - (isMobile ? 35 : 75);
      ctx.beginPath();
      ctx.moveTo(rightX, 0);
      for (let y = 0; y <= height; y += 30) {
        const waveX = rightX + Math.cos(y * 0.015 + Date.now() * 0.001) * 12;
        ctx.lineTo(waveX, y);
      }
      ctx.stroke();

      ctx.restore();
    }

    // Animation Render Loop
    let time = 0;
    function render() {
      time += 0.018;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Decay scroll boost smoothly
      scrollBoost *= 0.94;

      ctx.clearRect(0, 0, width, height);

      const strokeColor = getInkColor();

      // 1. Draw side stem vines
      drawStemVines(strokeColor);

      // 2. Render & Animate Flowers & Stars
      items.forEach((item) => {
        // Compute distance to mouse
        const dx = mouse.x - item.x;
        const dy = mouse.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Hover bloom effect when pointer comes close (< 180px)
        const proximityThreshold = 180;
        let hoverBloom = 0;
        if (mouse.isOver && dist < proximityThreshold) {
          hoverBloom = (1 - dist / proximityThreshold) * 0.45;
        }

        // Combine natural breathing + hover bloom + scroll boost
        const breath = Math.sin(time * 1.5 + (item.bloomPhase || item.phase || 0)) * 0.06;
        item.targetBloom = 1.0 + breath + hoverBloom + scrollBoost * 0.35;
        item.bloom += (item.targetBloom - item.bloom) * 0.1;

        const baseAlpha = 0.22 + (hoverBloom * 0.5) + (scrollBoost * 0.15);

        if (item.type === 'flower') {
          const currentRotation = item.rotation + Math.sin(time * 0.5 + item.y * 0.01) * 0.08;
          drawEInkFlower(
            ctx,
            item.x,
            item.y,
            item.baseRadius,
            item.petalCount,
            currentRotation,
            item.bloom,
            Math.min(baseAlpha, 0.7),
            strokeColor
          );
        } else if (item.type === 'star') {
          const currentRotation = item.rotation + (time * 0.4) + (hoverBloom * 1.2);
          drawFourPointStar(
            ctx,
            item.x,
            item.y,
            item.size * item.bloom,
            currentRotation,
            Math.min(baseAlpha + 0.1, 0.75),
            strokeColor
          );
        }
      });

      // 3. Render Floating Ambient Particles
      ctx.save();
      ctx.fillStyle = strokeColor;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.globalAlpha = p.alpha * (0.4 + scrollBoost * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      requestAnimationFrame(render);
    }

    // Initialize Canvas & Start Loop
    resize();
    render();
  })();
});

