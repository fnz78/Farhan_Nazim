import React from 'react';

export const Projects = () => {
  const projectsData = [
    {
      tag: 'WEB / ANIMATION',
      title: 'E-Ink Fluid Motion Engine',
      desc: 'Interactive canvas-based fluid ink dynamics optimized for monochrome displays and high-efficiency graphics rendering.',
      stack: ['JavaScript', 'HTML5 Canvas', 'CSS System']
    },
    {
      tag: 'SOFTWARE / SYSTEMS',
      title: 'Algorithmic Resource Allocator',
      desc: 'High-performance system service designed for concurrent task execution and low-latency state evaluation.',
      stack: ['Python', 'Data Structures', 'Async IO']
    }
  ];

  return (
    <section id="projects" className="portfolio-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-dot"></span>
          <span>FEATURED PROJECTS</span>
        </h2>
        <p className="section-subtitle">A curated selection of software systems, applications, and experiments.</p>
      </div>

      <div className="projects-grid">
        {projectsData.map((project, idx) => (
          <div key={idx} className="eink-card project-card">
            <div className="project-tag">{project.tag}</div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.desc}</p>
            <div className="project-stack">
              {project.stack.map((tech, tIdx) => (
                <span key={tIdx}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
