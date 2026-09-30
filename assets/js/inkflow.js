/**
 * Ink Flow Animated Background Controller (Ultra-Optimized)
 * Renders an organic e-ink flow wave effect with zero-GC memory pooling & adaptive DPI
 */
(function () {
  let cv, ctx;
  let W, H, dpr, N = 15, P = 65, t = 0, last = 0;
  let reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false, power: 0, kick: 0 };
  let css;

  // Pre-allocated object pool to prevent Garbage Collection stutter
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
    // Cap DPR at 1.5 max for silky smooth rendering on retina/4k displays
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;

    // Adaptive line count and points based on screen width
    const isMobile = W < 768;
    N = isMobile ? 11 : 15;
    P = isMobile ? 45 : 65;

    if (pts.length <= P) {
      initPointPool(P);
    }

    cv.width = Math.floor(W * dpr);
    cv.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = css.getPropertyValue('--paper').trim() || '#dcdcd7';
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

    const paperColor = css.getPropertyValue('--paper').trim() || '#dcdcd7';
    const inkColor = css.getPropertyValue('--ink').trim() || '#1c1c1a';

    // e-ink ghosting effect
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

        pts[j].x = x;
        pts[j].y = y;
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let m = 1; m < P; m++) {
        const mx = (pts[m].x + pts[m + 1].x) * 0.5;
        const my = (pts[m].y + pts[m + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[m].x, pts[m].y, mx, my);
      }
      ctx.lineWidth = 0.7 + (1 - Math.abs(k) * 2) * 0.6 + ptr.power * 0.3;
      ctx.globalAlpha = 0.35 + 0.55 * (1 - Math.abs(k) * 1.6 > 0 ? 1 - Math.abs(k) * 1.6 : 0.05);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  function init() {
    cv = document.getElementById('c');
    if (!cv) return;
    ctx = cv.getContext('2d');
    initPointPool(70);
    updateThemeColors();
    resize();

    window.addEventListener('resize', resize);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      updateThemeColors();
      resize();
    });

    const observer = new MutationObserver(() => {
      updateThemeColors();
      resize();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', (e) => {
      // Don't trigger flash on interactive elements like inputs or buttons
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.closest('a')) {
        return;
      }
      move(e);
      ptr.kick = 1;
      triggerFlash();
    });

    window.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse') leave();
    });
    window.addEventListener('pointercancel', leave);
    window.addEventListener('pointerleave', leave);

    requestAnimationFrame(frame);
  }

  window.triggerEInkFlash = triggerFlash;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
