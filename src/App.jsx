import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { InkflowCanvas } from './components/InkflowCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Certifications } from './components/Certifications';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (currentPage !== 'home') return;

    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.getAttribute('id'));
            }
          });
        },
        { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      sections.forEach((sec) => observer.observe(sec));
      return () => observer.disconnect();
    }
  }, [currentPage]);

  const handleNavigate = (targetId) => {
    setCurrentPage('home');
    setTimeout(() => {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <>
      {/* Fullscreen E-Ink Loading Preloader */}
      <Preloader />

      {/* High-Performance Static E-Ink Background */}
      <InkflowCanvas />

      {/* Floating E-Ink Glassmorphism Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        activeSection={activeSection}
      />

      {/* Page Routing */}
      {currentPage === 'home' ? (
        <main className="main-content">
          <Hero onNavigate={handleNavigate} />
          <About />
          <Education />
          <Projects />
          <Contact />
        </main>
      ) : (
        <Certifications onBack={() => setCurrentPage('home')} />
      )}

      {/* Floating E-Ink Footer */}
      <Footer onNavigate={handleNavigate} />
    </>
  );
}

export default App;
