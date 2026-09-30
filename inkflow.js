/**
 * Ink Flow Animated Background Controller
 * Renders an organic e-ink flow wave effect with pointer displacement
 */
(function () {
  let cv, ctx;
  let W, H, dpr, N = 17, P = 90, t = 0, last = 0;
  let reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false, power: 0, kick: 0 };
  let css;

  function updateThemeColors() {
    css = getComputedStyle(document.documentElement);
  }

  function resize() {
    if (!cv) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
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

  function centre(u, tt, out) {
    // diagonal S sweep, bottom-left to top-right
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

    // smooth pointer + power
    if (ptr.on) {
      ptr.sx += (ptr.x - ptr.sx) * Math.min(1, dt * 9);
      ptr.sy += (ptr.y - ptr.sy) * Math.min(1, dt * 9);
    }
    ptr.power += ((ptr.on ? 1 : 0) - ptr.power) * Math.min(1, dt * 4);
    ptr.kick *= Math.pow(0.02, dt);

    const paperColor = css.getPropertyValue('--paper').trim() || '#dcdcd7';
    const inkColor = css.getPropertyValue('--ink').trim() || '#1c1c1a';

    // e-ink ghosting: partial fade instead of hard clear
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = inkColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const radius = Math.max(120, Math.min(W, H) * 0.24);
    const r2 = radius * radius;
    const pts = new Array(P + 1);
    const c = [0, 0];

    for (let i = 0; i < N; i++) {
      const k = i / (N - 1) - 0.5;
      for (let j = 0; j <= P; j++) {
        const u = j / P;
        centre(u, t, c);
        // ribbon spread pinches and swells along the length
        const spread = H * (0.012 + 0.016 * (0.5 + 0.5 * Math.sin(u * 6.0 - t * 0.3))) * (1 + 0.9 * Math.sin(u * Math.PI));
        let x = c[0] + k * spread * N * 0.35;
        let y = c[1] + k * spread * N * 1.0 + Math.sin(u * 7 + i * 0.35 + t * 0.6) * H * 0.006;

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
        pts[j] = [x, y];
      }

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let m = 1; m < P; m++) {
        const mx = (pts[m][0] + pts[m + 1][0]) / 2;
        const my = (pts[m][1] + pts[m + 1][1]) / 2;
        ctx.quadraticCurveTo(pts[m][0], pts[m][1], mx, my);
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
    updateThemeColors();
    resize();

    window.addEventListener('resize', resize);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      updateThemeColors();
      resize();
    });

    // Observer for manual data-theme changes on <html> tag
    const observer = new MutationObserver(() => {
      updateThemeColors();
      resize();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerdown', (e) => {
      move(e);
      ptr.kick = 1;
      triggerFlash();
    });

    cv.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse') leave();
    });
    cv.addEventListener('pointercancel', leave);
    cv.addEventListener('pointerleave', leave);

    requestAnimationFrame(frame);
  }

  // Expose flash trigger for navbar refresh button
  window.triggerEInkFlash = triggerFlash;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
