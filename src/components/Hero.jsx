import React from 'react';

export const Hero = ({ onNavigate }) => {
  return (
    <section id="home" className="hero-section portfolio-section">
      <div className="hero-container">
        {/* Left Column: Primary Information */}
        <div className="hero-content">
          <div className="hero-eyebrow" aria-label="Status Label">
            <span className="eyebrow-dot"></span>
            <span className="eyebrow-text">FNZ78 // AVAILABLE FOR WORK</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-name-primary">KN FARHAN</span>
            <span className="hero-name-secondary">NAZIM</span>
          </h1>

          <div className="hero-identity-container">
            <div className="hero-identity">
              <span className="identity-badge">Computer Science PostGraduate</span>
              <span className="identity-role">Software & Systems Engineer</span>
            </div>
          </div>

          <div className="hero-tech-row" aria-label="Technologies Worked With">
            <span className="tech-pill">
              <svg className="tech-pill-icon" viewBox="0 0 24 24">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span>Full-Stack Web</span>
            </span>
            <span className="tech-pill">
              <svg className="tech-pill-icon" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M9 9h6v6H9z" fill="currentColor" />
              </svg>
              <span>Software Systems</span>
            </span>
            <span className="tech-pill">
              <svg className="tech-pill-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>AI & Machine Learning</span>
            </span>
          </div>

          <div className="hero-actions">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#projects');
              }}
              className="hero-btn primary-btn"
            >
              <span>VIEW PROJECTS</span>
              <svg className="btn-arrow" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#contact');
              }}
              className="hero-btn secondary-btn"
            >
              <span className="btn-dot-live"></span>
              <span>CONTACT ME</span>
            </a>
          </div>
        </div>

        {/* Right Column: Profile Avatar */}
        <div className="hero-avatar-column">
          <div className="avatar-card-container">
            <div className="avatar-eink-ring">
              <div className="avatar-img-frame">
                <img
                  src="assets/images/profile-avatar.png"
                  alt="K N Farhan Nazim - Computer Science PostGraduate"
                  className="avatar-eink-img"
                  loading="eager"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div className="avatar-badge">
              <span className="avatar-badge-dot"></span>
              <span>MSc COMPUTER SCIENCE</span>
            </div>

            <div className="avatar-meta-tag">
              <span>REF: FNZ_SYS_2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
