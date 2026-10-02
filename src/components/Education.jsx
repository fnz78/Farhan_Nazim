import React from 'react';

export const Education = () => {
  const educationData = [
    {
      period: '2024 — 2026',
      degree: 'Master of Science (MSc) in Computer Science',
      institution: 'VTB College',
      university: 'Affiliated to Calicut University',
      cgpa: '4.18 / 5.0',
      badge: 'POSTGRADUATE',
    },
    {
      period: '2021 — 2024',
      degree: 'Bachelor of Science (BSc) in Computer Science',
      institution: 'V.V. College',
      university: 'Affiliated to Calicut University',
      cgpa: '7.76 / 10.0',
      badge: 'GRADUATE',

    }
  ];

  return (
    <section id="education" className="portfolio-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-dot"></span>
          <span>ACADEMIC EDUCATION</span>
        </h2>
        <p className="section-subtitle">
          Accredited degree qualifications, institutional affiliations, and academic performance.
        </p>
      </div>

      <div className="education-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {educationData.map((edu, idx) => (
          <div key={idx} className="eink-card" style={{ padding: '1.75rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span className="cert-tag" style={{ background: 'var(--ink)', color: 'var(--paper)', fontWeight: 700, marginRight: '0.5rem' }}>
                  {edu.badge}
                </span>
                <span className="cert-date" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {edu.period}
                </span>
              </div>

              <div className="cert-stat-pill" style={{ background: 'var(--paper)', border: '1.5px solid var(--ink-border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>CGPA: </span>
                <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--ink)', marginLeft: '0.25rem' }}>{edu.cgpa}</strong>
              </div>
            </div>

            <h3 className="project-title" style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>
              {edu.degree}
            </h3>

            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem' }}>
              {edu.institution}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>
              ✦ {edu.university}
            </div>

            <div style={{ borderTop: '1px dashed var(--ink-border)', paddingTop: '1rem' }}>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {edu.highlights.map((item, hIdx) => (
                  <li key={hIdx} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
