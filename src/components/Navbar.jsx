import React, { useState, useEffect } from 'react';

export const Navbar = ({ currentPage, setCurrentPage, activeSection }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setClock(`${h}:${m}`);
    }
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    if (typeof window.triggerEInkFlash === 'function') {
      window.triggerEInkFlash();
    }
  };

  const handleRefresh = () => {
    if (typeof window.triggerEInkFlash === 'function') {
      window.triggerEInkFlash();
    }
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);

    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.querySelector(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCertClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    setCurrentPage('certifications');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-container">
      <nav className="eink-navbar" aria-label="Main Navigation">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="nav-brand"
          aria-label="Home"
        >
          <span className="brand-dot"></span>
          <span>FNZ</span>
          <span className="brand-tag">78</span>
        </a>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`} id="navLinks">
          <li>
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className={`nav-link ${currentPage === 'home' && activeSection === 'home' ? 'active' : ''}`}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className={`nav-link ${currentPage === 'home' && activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, '#projects')}
              className={`nav-link ${currentPage === 'home' && activeSection === 'projects' ? 'active' : ''}`}
            >
              Work
            </a>
          </li>
          <li>
            <a
              href="#experience"
              onClick={(e) => handleNavClick(e, '#experience')}
              className={`nav-link ${currentPage === 'home' && activeSection === 'experience' ? 'active' : ''}`}
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#certifications"
              onClick={handleCertClick}
              className={`nav-link ${currentPage === 'certifications' ? 'active' : ''}`}
            >
              Certifications
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={`nav-link ${currentPage === 'home' && activeSection === 'contact' ? 'active' : ''}`}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-controls">
          {/* Certifications Page Switcher Button */}
          <button
            onClick={handleCertClick}
            className="eink-btn nav-cert-btn"
            title="View Certifications & Timeline"
            aria-label="View Certifications & Timeline"
          >
            <svg className="eink-btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.86866 15.4599L7 22L11.5884 19.247C11.7381 19.1572 11.8129 19.1123 11.8928 19.0947C11.9634 19.0792 12.0366 19.0792 12.1072 19.0947C12.1871 19.1123 12.2619 19.1572 12.4116 19.247L17 22L16.1319 15.4571M16.4259 4.24888C16.5803 4.6224 16.8768 4.9193 17.25 5.0743L18.5589 5.61648C18.9325 5.77121 19.2292 6.06799 19.384 6.44154C19.5387 6.81509 19.5387 7.23481 19.384 7.60836L18.8422 8.91635C18.6874 9.29007 18.6872 9.71021 18.8427 10.0837L19.3835 11.3913C19.4602 11.5764 19.4997 11.7747 19.4997 11.975C19.4998 12.1752 19.4603 12.3736 19.3837 12.5586C19.3071 12.7436 19.1947 12.9118 19.0531 13.0534C18.9114 13.195 18.7433 13.3073 18.5582 13.3839L17.2503 13.9256C16.8768 14.0801 16.5799 14.3765 16.4249 14.7498L15.8827 16.0588C15.728 16.4323 15.4312 16.7291 15.0577 16.8838C14.6841 17.0386 14.2644 17.0386 13.8909 16.8838L12.583 16.342C12.2094 16.1877 11.7899 16.188 11.4166 16.3429L10.1077 16.8843C9.73434 17.0387 9.31501 17.0386 8.94178 16.884C8.56854 16.7293 8.27194 16.4329 8.11711 16.0598L7.57479 14.7504C7.42035 14.3769 7.12391 14.08 6.75064 13.925L5.44175 13.3828C5.06838 13.2282 4.77169 12.9316 4.61691 12.5582C4.46213 12.1849 4.46192 11.7654 4.61633 11.3919L5.1581 10.0839C5.31244 9.71035 5.31213 9.29079 5.15722 8.91746L4.61623 7.60759C4.53953 7.42257 4.50003 7.22426 4.5 7.02397C4.49997 6.82369 4.5394 6.62536 4.61604 6.44032C4.69268 6.25529 4.80504 6.08716 4.94668 5.94556C5.08832 5.80396 5.25647 5.69166 5.44152 5.61508L6.74947 5.07329C7.12265 4.91898 7.41936 4.6229 7.57448 4.25004L8.11664 2.94111C8.27136 2.56756 8.56813 2.27078 8.94167 2.11605C9.3152 1.96132 9.7349 1.96132 10.1084 2.11605L11.4164 2.65784C11.7899 2.81218 12.2095 2.81187 12.5828 2.65696L13.8922 2.11689C14.2657 1.96224 14.6853 1.96228 15.0588 2.11697C15.4322 2.27167 15.729 2.56837 15.8837 2.94182L16.426 4.25115L16.4259 4.24888Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="btn-text-desktop">Certs</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="eink-btn"
            title="Toggle E-Ink Theme (Dark/Light)"
            aria-label="Toggle Theme"
          >
            <svg className="eink-btn-icon" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          {/* Manual E-Ink Refresh Flash Trigger */}
          <button
            onClick={handleRefresh}
            className="eink-btn"
            title="Trigger E-Ink Screen Refresh Flash"
            aria-label="Refresh E-Ink Display"
          >
            <svg className="eink-btn-icon" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* E-Ink System Clock & Status */}
          <div className="eink-status">
            <span className="brand-dot"></span>
            <span className="eink-status-time">{clock || '12:00'}</span>
          </div>

          {/* Mobile Navigation Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24">
              <path d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};
