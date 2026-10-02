import React, { useEffect, useState, useRef } from 'react';

export const Preloader = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING SYSTEM...');
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const curveRef = useRef(null);

  useEffect(() => {
    const totalDuration = 1000; // 1s animation
    const startTime = performance.now();
    let pathLength = 380;
    
    if (curveRef.current) {
      try {
        pathLength = curveRef.current.getTotalLength() || 380;
      } catch (e) {
        pathLength = 380;
      }
      curveRef.current.style.strokeDasharray = pathLength;
      curveRef.current.style.strokeDashoffset = pathLength;
    }

    let animId;
    function animatePreloader(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1.0);

      // Smooth cubic easing
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentPercent = Math.floor(easedProgress * 100);
      setPercent(currentPercent);

      if (curveRef.current) {
        const offset = pathLength * (1 - easedProgress);
        curveRef.current.style.strokeDashoffset = offset;
      }

      if (currentPercent > 70) {
        setStatusText('RENDERING INTERFACE...');
      }

      if (progress < 1.0) {
        animId = requestAnimationFrame(animatePreloader);
      } else {
        setPercent(100);
        if (curveRef.current) curveRef.current.style.strokeDashoffset = 0;
        setStatusText('SYSTEM READY');

        setTimeout(() => {
          if (typeof window.triggerEInkFlash === 'function') {
            window.triggerEInkFlash();
          }
          setFadeOut(true);
          setTimeout(() => {
            setHidden(true);
            if (onComplete) onComplete();
          }, 450);
        }, 120);
      }
    }

    animId = requestAnimationFrame(animatePreloader);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      id="einkPreloader"
      className={`eink-preloader ${fadeOut ? 'fade-out' : ''}`}
      aria-label="Loading Website"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div className="preloader-content">
        <div className="preloader-eyebrow">
          <span className="preloader-dot"></span>
          <span>KN FARHAN NAZIM // FNZ78</span>
        </div>

        <div className="preloader-title">
          <span className="preloader-word">PORT-</span>
          <span className="preloader-word">FOLIO</span>
        </div>

        <div className="preloader-slider-container">
          <svg className="preloader-curve-svg" viewBox="0 0 400 60" preserveAspectRatio="none">
            <path
              className="preloader-curve-bg"
              d="M 10 30 Q 100 5, 200 30 T 390 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              opacity="0.25"
            />
            <path
              ref={curveRef}
              id="preloaderCurveProgress"
              className="preloader-curve-fill"
              d="M 10 30 Q 100 5, 200 30 T 390 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          <div className="preloader-counter">
            <span id="preloaderPercent">{percent}</span>
            <span className="percent-symbol">%</span>
          </div>
        </div>

        <div className="preloader-status">
          <span className="status-indicator">●</span>
          <span id="preloaderStatusText">{statusText}</span>
        </div>
      </div>
    </div>
  );
};
