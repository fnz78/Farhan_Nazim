import React, { useState } from 'react';

export const Certifications = ({ onBack }) => {
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const certsData = [
    {
      year: '2026',
      month: 'September 2026',
      items: [
        {
          issuer: 'Google Cloud Skills Boost',
          date: 'Sep 2026',
          title: 'Introduction to Generative AI',
          tags: ['Generative AI', 'LLMs', 'Google Cloud']
        },
        {
          issuer: 'HackerRank',
          date: 'Sep 2026',
          title: 'HackerRank Orchestrate September Edition',
          desc: 'Ranked #1,482 out of 3,062 candidates. Demonstrated advanced skills in Autonomous AI Agents and Exploratory Data Analysis (EDA).',
          tags: ['Rank #1482', 'AI Agents', 'EDA']
        }
      ]
    },
    {
      year: '2026',
      month: 'July 2026',
      items: [
        {
          issuer: 'Sreekrishnapuram V. T. Bhattathiripad College',
          date: 'Jul 2026',
          title: 'Resource Person – Evolution of AI: From ML to Autonomous AI Agents',
          desc: 'Invited speaker & resource person delivering academic session on ML architecture and Multi-Agent Orchestration.',
          tags: ['Speaker', 'AI Agents', 'Academic Session'],
          highlight: true
        },
        {
          issuer: 'Anthropic',
          date: 'Jul 2026',
          title: 'AI Capabilities and Limitations',
          tags: ['Anthropic', 'AI Alignment', 'Safety']
        }
      ]
    },
    {
      year: '2025',
      month: 'Year 2025 Milestones',
      items: [
        {
          issuer: 'NTA / UGC-NET',
          date: '2025',
          title: 'UGC-NET Qualified (Computer Science & Applications)',
          desc: 'Qualified National Eligibility Test for Assistant Professor in Computer Science & Applications.',
          tags: ['UGC-NET', 'Assistant Professor', 'Computer Science'],
          prize: 'QUALIFIED'
        },
        {
          issuer: 'National Level Hackathon',
          date: '2025',
          title: 'National Level Web Design & Coding Championship',
          desc: 'Secured top honors for innovative web engineering, interactive fluid physics, and user interface design.',
          tags: ['1st Prize', 'Web Engineering', 'UI Architecture'],
          prize: 'GOLD MEDAL'
        }
      ]
    }
  ];

  const filteredCerts = certsData.map(group => {
    if (selectedYear !== 'ALL' && group.year !== selectedYear) return null;
    const matchingItems = group.items.filter(item => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.issuer.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    });
    if (matchingItems.length === 0) return null;
    return { ...group, items: matchingItems };
  }).filter(Boolean);

  return (
    <div className="main-content">
      {/* Header Bar */}
      <section className="portfolio-section cert-hero-section">
        <div className="cert-hero-container">
          <div className="cert-back-bar">
            <button onClick={onBack} className="cert-back-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Home</span>
            </button>
          </div>

          <h1 className="hero-title cert-page-title">
            <span className="hero-name-primary">LICENSES &</span>
            <span className="hero-name-secondary">CERTIFICATIONS</span>
          </h1>

          <div className="cert-stats-row">
            <div className="cert-stat-pill">
              <span className="stat-bullet">●</span>
              <span>28 Accredited Milestones</span>
            </div>
            <div className="cert-stat-pill">
              <span className="stat-bullet">✦</span>
              <span>UGC-NET Qualified (CS)</span>
            </div>
            <div className="cert-stat-pill">
              <span className="stat-bullet">★</span>
              <span>National Hackathon & Web Design Prizes</span>
            </div>
          </div>

          {/* Jump To Year Filters & Search */}
          <div className="cert-year-filter">
            <span className="filter-label">FILTER BY YEAR:</span>
            {['ALL', '2026', '2025', '2024'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`year-chip ${selectedYear === yr ? 'active' : ''}`}
                style={{
                  background: selectedYear === yr ? 'var(--ink)' : 'var(--paper)',
                  color: selectedYear === yr ? 'var(--paper)' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                {yr}
              </button>
            ))}

            <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search certs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: 200 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="portfolio-section cert-timeline-section">
        <div className="cert-timeline-container">
          {filteredCerts.map((group, gIdx) => (
            <div key={gIdx} className="cert-year-group">
              <div className="year-header-badge">
                <span className="year-number">{group.year}</span>
                <span className="year-line"></span>
              </div>

              <div className="month-block">
                <h3 className="month-title">{group.month}</h3>
                <div className="cert-grid">
                  {group.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className={`cert-card ${item.highlight ? 'highlight-card' : ''} ${item.prize ? 'prize-card' : ''}`}
                    >
                      {item.prize && (
                        <div className="cert-card-badge gold-badge">
                          <span>{item.prize}</span>
                        </div>
                      )}
                      <div className="cert-logo-box" title={item.issuer}>
                        <svg className="provider-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 8v4l3 3" />
                        </svg>
                      </div>

                      <div className="cert-card-body">
                        <div className="cert-card-header">
                          <span className="cert-issuer">{item.issuer}</span>
                          <span className="cert-date">{item.date}</span>
                        </div>
                        <h4 className="cert-title">{item.title}</h4>
                        {item.desc && <p className="cert-desc">{item.desc}</p>}

                        <div className="cert-tags">
                          {item.tags.map((tg, tIdx) => (
                            <span key={tIdx} className="cert-tag">{tg}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
