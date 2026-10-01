# 🛡️ Portfolio Security Architecture & Protection Suite
**Website**: KN FARHAN NAZIM (FNZ78 Portfolio)  
**Security Standard**: HTTPS Enforcement, HSTS Preloading, Strict CSP, Anti-XSS Defense

---

## 📋 Overview

This directory contains the complete modular security infrastructure for the portfolio website. It protects user data, prevents malicious script execution (XSS), enforces HTTPS encryption, and provides pre-configured deployment rules for all major hosting platforms.

---

## 📂 Security Folder Structure

```
security/
├── SECURITY.md               # Master Security Architecture & Implementation Guide
├── csp/
│   └── csp-policy.json       # Formal Content Security Policy (CSP) Specifications
├── apache/
│   └── .htaccess             # Apache Web Server (cPanel / Shared / VPS) Configuration
├── netlify/
│   ├── netlify.toml          # Netlify Build, Redirects & Security Headers
│   ├── _headers              # Netlify Security Header Directives
│   └── _redirects            # Netlify Force-HTTPS 301 Redirect Rules
├── vercel/
│   └── vercel.json           # Vercel Deployment Redirects & Security Headers
├── cloudflare/
│   ├── _headers              # Cloudflare Pages Security Header Directives
│   └── _redirects            # Cloudflare Pages Force-HTTPS 301 Redirect Rules
└── client/
    └── security-guard.js     # Standalone Client-Side HTTPS & XSS Guard Utility
```

---

## 🚀 Deployment Platform Mapping

Depending on where you host your portfolio, use the corresponding configuration from the `security/` directory:

| Hosting Platform | Security Config Location | Description |
|---|---|---|
| **Apache / cPanel** | [`security/apache/.htaccess`](file:///d:/FINALE/security/apache/.htaccess) | Enables `mod_rewrite` 301 HTTPS redirects, HSTS header, and CSP headers |
| **Netlify** | [`security/netlify/netlify.toml`](file:///d:/FINALE/security/netlify/netlify.toml) | Defines force 301 HTTPS redirects, HSTS, and XSS security headers |
| **Vercel** | [`security/vercel/vercel.json`](file:///d:/FINALE/security/vercel/vercel.json) | Vercel route matching for 301 HTTPS redirects and CSP headers |
| **Cloudflare Pages** | [`security/cloudflare/_headers`](file:///d:/FINALE/security/cloudflare/_headers) & `_redirects` | Cloudflare edge headers and HTTP→HTTPS 301 rule |

---

## 🔒 Security Features Implemented

### 1. Mandatory HTTPS Enforcement
- **Client-side guard**: Auto-redirects `http://` traffic to `https://` on non-localhost hostnames.
- **Server 301 Redirects**: Enforces 301 Permanent Redirection at the web server layer.
- **HSTS (Strict-Transport-Security)**: `max-age=31536000; includeSubDomains; preload` forces browsers to use HTTPS exclusively for at least 1 year.

### 2. Cross-Site Scripting (XSS) Prevention
- **DOM Sanitization**: HTML entity encoding via `escapeHTML()` converts `<, >, &, ", ', ` ` characters before insertion.
- **Safe Element Generation**: Uses `document.createElement()` and `textContent` instead of raw string concatenation.
- **Content Security Policy**: Restricts script execution to same-origin (`'self'`), blocks object tags (`object-src 'none'`), and prevents base URI tampering (`base-uri 'self'`).

### 3. Clickjacking & Frame Protection
- `X-Frame-Options: DENY` & `frame-ancestors 'none'` prevent the portfolio from being embedded inside malicious `<iframe>` tags.

### 4. Secrets & Environment Protection Rule
- **Rule**: Never hardcode backend API keys, private passwords, access tokens, or secret credentials in frontend JavaScript (`const API_KEY = "..."`). All frontend code is publicly exposed and readable in the browser.
- **Environment Isolation**: Keep secrets on backend servers or environment management platforms.
- **Git Safeguards**: `.env`, `.env.*`, `*.pem`, `*.key`, and `secrets/` are strictly excluded via [`.gitignore`](file:///d:/FINALE/.gitignore) to prevent accidental credential leakage. Template variables are maintained in [`.env.example`](file:///d:/FINALE/.env.example).

---

## 🧪 Verification & Audit Command

To test headers locally or on production:

```bash
curl -I https://your-portfolio-domain.com
```

Expected Response Headers:
```http
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self'; ...
x-xss-protection: 1; mode=block
x-content-type-options: nosniff
x-frame-options: DENY
```
