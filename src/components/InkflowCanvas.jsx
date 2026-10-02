import React, { useEffect, useRef } from 'react';

export const InkflowCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext('2d');
    let W, H, dpr;
    let N = 15;
    let P = 65;
    let t = 0;
    let last = 0;
    let animId;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false, power: 0, kick: 0 };
    let css;

    let pts = [];
    function initPointPool(maxP) {
      pts = new Array(maxP + 1);
      for (let i = 0; i <= maxP; i++) {
        pts[i] = { x: 0, y: 0 };
      }
    }

    function updateThemeColors() {
      css = getComputedStyle(document.documentElement);
    }

    function resize() {
      if (!cv) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;

      const isMobile = W < 768;
      N = isMobile ? 11 : 15;
      P = isMobile ? 45 : 65;

      if (pts.length <= P) {
        initPointPool(P);
      }

      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const paperColor = css.getPropertyValue('--paper').trim() || '#dcdcd7';
      ctx.fillStyle = paperColor;
      ctx.fillRect(0, 0, W, H);
    }

    function move(e) {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      if (ptr.sx < -999) {
        ptr.sx = ptr.x;
        ptr.sy = ptr.y;
      }
      ptr.on = true;
    }

    function triggerFlash() {
      document.body.classList.add('flash');
      setTimeout(() => {
        document.body.classList.remove('flash');
      }, 110);
    }

    function leave() {
      ptr.on = false;
    }

    const tempC = [0, 0];
    function centre(u, tt, out) {
      const x = -0.05 * W + u * 1.1 * W;
      const base = H * (0.72 - 0.46 * u);
      const amp = H * 0.09;
      const y = base
        + Math.sin(u * 5.2 + tt * 0.35) * amp * (1 - u * 0.5)
        + Math.sin(u * 9.5 - tt * 0.22) * amp * 0.28;
      out[0] = x;
      out[1] = y;
    }

    function frame(ts) {
      const dt = Math.min((ts - last) / 1000 || 0.016, 0.05);
      last = ts;
      t += dt * (reduce ? 0.15 : 1);

      if (ptr.on) {
        ptr.sx += (ptr.x - ptr.sx) * Math.min(1, dt * 9);
        ptr.sy += (ptr.y - ptr.sy) * Math.min(1, dt * 9);
      }
      ptr.power += ((ptr.on ? 1 : 0) - ptr.power) * Math.min(1, dt * 4);
      ptr.kick *= Math.pow(0.02, dt);

      const paperColor = css ? (css.getPropertyValue('--paper').trim() || '#dcdcd7') : '#dcdcd7';
      const inkColor = css ? (css.getPropertyValue('--ink').trim() || '#1c1c1a') : '#1c1c1a';

      ctx.globalAlpha = 0.24;
      ctx.fillStyle = paperColor;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = inkColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const radius = Math.max(120, Math.min(W, H) * 0.24);
      const r2 = radius * radius;

      for (let i = 0; i < N; i++) {
        const k = i / (N - 1) - 0.5;
        for (let j = 0; j <= P; j++) {
          const u = j / P;
          centre(u, t, tempC);
          const spread = H * (0.012 + 0.016 * (0.5 + 0.5 * Math.sin(u * 6.0 - t * 0.3))) * (1 + 0.9 * Math.sin(u * Math.PI));
          let x = tempC[0] + k * spread * N * 0.35;
          let y = tempC[1] + k * spread * N * 1.0 + Math.sin(u * 7 + i * 0.35 + t * 0.6) * H * 0.006;

          if (ptr.power > 0.01) {
            const dx = x - ptr.sx;
            const dy = y - ptr.sy;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2 * 4) {
              const f = Math.exp(-d2 / r2) * ptr.power;
              const d = Math.sqrt(d2) || 1;
              const push = f * radius * (0.55 + ptr.kick * 0.9);
              x += dx / d * push;
              y += dy / d * push;
            }
          }

          if (pts[j]) {
            pts[j].x = x;
            pts[j].y = y;
          }
        }

        if (pts[0]) {
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let m = 1; m < P; m++) {
            if (pts[m] && pts[m + 1]) {
              const mx = (pts[m].x + pts[m + 1].x) * 0.5;
              const my = (pts[m].y + pts[m + 1].y) * 0.5;
              ctx.quadraticCurveTo(pts[m].x, pts[m].y, mx, my);
            }
          }
          ctx.lineWidth = 0.7 + (1 - Math.abs(k) * 2) * 0.6 + ptr.power * 0.3;
          ctx.globalAlpha = 0.35 + 0.55 * (1 - Math.abs(k) * 1.6 > 0 ? 1 - Math.abs(k) * 1.6 : 0.05);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(frame);
    }

    initPointPool(70);
    updateThemeColors();
    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    
    const handlePointerDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.closest('a')) {
        return;
      }
      move(e);
      ptr.kick = 1;
      triggerFlash();
    };
    window.addEventListener('pointerdown', handlePointerDown);

    const handlePointerUp = (e) => {
      if (e.pointerType !== 'mouse') leave();
    };
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', leave);
    window.addEventListener('pointerleave', leave);

    const observer = new MutationObserver(() => {
      updateThemeColors();
      resize();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.triggerEInkFlash = triggerFlash;
    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', leave);
      window.removeEventListener('pointerleave', leave);
      observer.disconnect();
    };
  }, []);

  return <canvas id="c" ref={canvasRef} />;
};
