import React from 'react';
import { TechStackMarquee } from './TechStackMarquee';

export const About = () => {
  return (
    <section id="about" className="portfolio-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-dot"></span>
          <span>ABOUT ME</span>
        </h2>
        <p className="section-subtitle">
          Computer Science PostGraduate, Machine Learning Specialist, and Full-Stack Software Systems Engineer.
        </p>
      </div>

      {/* About Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="eink-card" style={{ padding: '1.75rem' }}>
          <h3 className="project-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✦</span>
            <span>BACKGROUND</span>
          </h3>
          <p className="cert-desc" style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            Postgraduate student in Computer Science (MSc) with a strong foundation in computer engineering, algorithmic optimization, and full-stack software systems. Passionate about building robust web applications and data-driven intelligent software.
          </p>
        </div>

        <div className="eink-card" style={{ padding: '1.75rem' }}>
          <h3 className="project-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>★</span>
            <span>EXPERTISE</span>
          </h3>
          <p className="cert-desc" style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            Specializing in Python Data Science (NumPy, Pandas, OpenCV), Machine Learning, React Web Development, and Autonomous AI Systems. Qualified UGC-NET for Assistant Professor in Computer Science.
          </p>
        </div>
      </div>

      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h3 className="section-title" style={{ fontSize: '1.2rem' }}>
          <span className="section-dot"></span>
          <span>TECH STACK & TOOLS</span>
        </h3>
      </div>

      <TechStackMarquee />
    </section>
  );
};
