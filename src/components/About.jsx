import React from 'react';
import { TechStackMarquee } from './TechStackMarquee';

export const About = () => {
  return (
    <section id="about" className="portfolio-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-dot"></span>
          <span>TECH STACK</span>
        </h2>
        <p className="section-subtitle">
          Core technical competencies, tools, frameworks, and database engines.
        </p>
      </div>

      <TechStackMarquee />
    </section>
  );
};
