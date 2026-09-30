/**
 * E-Ink Navbar & Portfolio Interactive Script
 */
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const refreshBtn = document.getElementById('refreshBtn');
  const clockElement = document.getElementById('einkClock');
  const linkElements = document.querySelectorAll('.nav-link');

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

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. Active Nav Link Handler ---
  linkElements.forEach(link => {
    link.addEventListener('click', function (e) {
      linkElements.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // Close mobile menu on link click
      if (navLinks) {
        navLinks.classList.remove('open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

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

      // Trigger e-ink flash transition
      if (typeof window.triggerEInkFlash === 'function') {
        window.triggerEInkFlash();
      }
    });

    // Restore saved theme on load
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
});
