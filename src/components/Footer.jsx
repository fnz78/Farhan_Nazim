import React from 'react';

export const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="eink-footer" aria-label="Footer Navigation">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#home');
          }}
          className="footer-brand"
          aria-label="FNZ Home"
        >
          <span className="brand-dot"></span>
          <span>FNZ</span>
          <span className="brand-tag">78</span>
        </a>

        <div className="social-links" aria-label="Social Links">
          <a href="https://github.com/fnz78" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub" data-tooltip="GitHub">
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/k-n-farhan-nazim-402122306/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn" data-tooltip="LinkedIn">
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
            </svg>
          </a>
          <a href="mailto:farhannazimfnz@gmail.com" className="social-icon-btn" aria-label="Email" data-tooltip="Email: farhannazimfnz@gmail.com">
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
            </svg>
          </a>
          <a href="tel:+916238688556" className="social-icon-btn" aria-label="Phone" data-tooltip="Phone: +91 6238688556">
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        </div>

        <div className="footer-meta">
          <span>© {currentYear} FNZ</span>
          <button onClick={handleBackToTop} className="eink-btn back-to-top-btn" title="Back to Top" aria-label="Back to Top">
            <svg className="eink-btn-icon" viewBox="0 0 56 56" fill="currentColor">
              <path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 28.0468 40.1875 C 26.8046 40.1875 26.0312 39.4141 26.0546 38.1953 L 26.2890 31.0937 L 19.8671 35.2188 C 19.5155 35.4766 19.1405 35.5937 18.6483 35.5937 C 17.6874 35.5937 16.7733 34.8437 16.7733 33.6250 C 16.7733 32.8750 17.1483 32.3359 17.8983 31.9141 L 24.5780 28.1641 L 17.8749 24.4844 C 17.1483 24.0390 16.7733 23.5234 16.7733 22.7266 C 16.7733 21.5078 17.6874 20.7812 18.6483 20.7812 C 19.1405 20.7812 19.5155 20.8984 19.8671 21.1094 L 26.2890 25.1875 L 26.0546 17.8984 C 26.0312 16.6563 26.8046 15.8594 28.0468 15.8594 C 29.2655 15.8594 29.9687 16.6094 29.9452 17.8984 L 29.7109 25.1875 L 36.1327 21.0859 C 36.4843 20.8750 36.8593 20.7578 37.3514 20.7578 C 38.3124 20.7578 39.2265 21.5078 39.2265 22.7031 C 39.2265 23.4766 38.8514 24.0156 38.1014 24.4609 L 31.3749 28.1641 L 38.1014 31.9141 C 38.8514 32.3594 39.2265 32.8750 39.2265 33.6484 C 39.2265 34.8437 38.3124 35.6172 37.3514 35.6172 C 36.8593 35.6172 36.4843 35.5 36.1327 35.2656 L 29.7109 31.0937 L 29.9452 38.1953 C 29.9687 39.4609 29.2655 40.1875 28.0468 40.1875 Z" />
            </svg>
            <span className="btn-text-desktop">TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
