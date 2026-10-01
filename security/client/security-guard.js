/**
 * Standalone Client-Side Security Guard Module
 * Enforces HTTPS redirection and XSS HTML sanitization
 * Path: security/client/security-guard.js
 */

(function (global) {
  'use strict';

  // --- 1. HTTPS Enforcement ---
  function enforceHTTPS() {
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.protocol === 'http:' &&
      !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) &&
      !window.location.hostname.endsWith('.local')
    ) {
      window.location.replace(
        'https://' +
          window.location.host +
          window.location.pathname +
          window.location.search +
          window.location.hash
      );
    }
  }

  // --- 2. XSS HTML Entity Escaper ---
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, '&#96;');
  }

  // Auto-execute HTTPS check immediately
  enforceHTTPS();

  // Export module API
  const SecurityGuard = {
    enforceHTTPS: enforceHTTPS,
    escapeHTML: escapeHTML
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityGuard;
  } else {
    global.SecurityGuard = SecurityGuard;
  }
})(typeof window !== 'undefined' ? window : this);
