import React, { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', _gotcha: '' });
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formRenderTime] = useState(() => Date.now());

  const SUBMIT_COOLDOWN_MS = 45000;

  const sanitizeInput = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>?/gm, '').trim();
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateName = (name) => {
    const re = /^[a-zA-Z\s\.\-']{2,70}$/;
    return re.test(name);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner('');
    setErrors({});

    // Honeypot check
    if (formData._gotcha !== '') {
      return;
    }

    // Bot load time threshold (< 1.5s)
    if (Date.now() - formRenderTime < 1500) {
      setErrorBanner('Automated submission detected. Please wait a moment and try again.');
      return;
    }

    // Cooldown check
    const lastSubmit = localStorage.getItem('fnz_form_last_sub');
    if (lastSubmit) {
      const timeElapsed = Date.now() - parseInt(lastSubmit, 10);
      if (timeElapsed < SUBMIT_COOLDOWN_MS) {
        const remainingSec = Math.ceil((SUBMIT_COOLDOWN_MS - timeElapsed) / 1000);
        setErrorBanner(`Security Rate Limit: Please wait ${remainingSec} second(s) before sending another message.`);
        return;
      }
    }

    const nameVal = sanitizeInput(formData.name);
    const emailVal = sanitizeInput(formData.email);
    const messageVal = sanitizeInput(formData.message);

    const newErrors = {};
    if (!nameVal) {
      newErrors.name = 'Please enter your name.';
    } else if (nameVal.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    } else if (nameVal.length > 70) {
      newErrors.name = 'Name must not exceed 70 characters.';
    } else if (!validateName(nameVal)) {
      newErrors.name = 'Name contains invalid characters.';
    }

    if (!emailVal) {
      newErrors.email = 'Please enter your email address.';
    } else if (emailVal.length > 100) {
      newErrors.email = 'Email address is too long.';
    } else if (!validateEmail(emailVal)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!messageVal) {
      newErrors.message = 'Please write a message.';
    } else if (messageVal.length < 10) {
      newErrors.message = 'Message should be at least 10 characters long.';
    } else if (messageVal.length > 2000) {
      newErrors.message = 'Message must not exceed 2000 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (typeof window.triggerEInkFlash === 'function') window.triggerEInkFlash();
      return;
    }

    setIsSubmitting(true);

    const cleanFormData = new FormData();
    cleanFormData.append('name', nameVal);
    cleanFormData.append('email', emailVal);
    cleanFormData.append('message', messageVal);
    cleanFormData.append('_subject', 'Portfolio Contact Message from ' + nameVal);

    try {
      const response = await fetch('https://formspree.io/f/mdekbvjj', {
        method: 'POST',
        body: cleanFormData,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        localStorage.setItem('fnz_form_last_sub', Date.now().toString());
        if (typeof window.triggerEInkFlash === 'function') window.triggerEInkFlash();
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '', _gotcha: '' });
      } else {
        const data = await response.json();
        let errText = 'Submission error. Please verify entries and try again.';
        if (data && Array.isArray(data.errors)) {
          errText = data.errors.map(err => sanitizeInput(err.message)).join(', ');
        }
        setErrorBanner(errText);
      }
    } catch (err) {
      setErrorBanner('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="portfolio-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-dot"></span>
          <span>LET'S CONNECT</span>
        </h2>
        <p className="section-subtitle">Open to opportunities, collaborations, and interesting projects.</p>
      </div>

      <div className="eink-card">
        {errorBanner && (
          <div id="formErrorBanner" className="form-error-banner" role="alert" style={{ display: 'block' }}>
            {errorBanner}
          </div>
        )}

        {!isSuccess ? (
          <form id="contactForm" onSubmit={handleSubmit} novalidate>
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              value={formData._gotcha}
              onChange={handleChange}
              style={{ display: 'none' }}
            />

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span>FULL NAME</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'invalid' : ''}`}
                  placeholder="e.g. Farhan Nazim"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <span className="form-error-text" style={{ display: 'block' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span>EMAIL ADDRESS</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'invalid' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="form-error-text" style={{ display: 'block' }}>{errors.email}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="message" className="form-label">
                  <span>YOUR MESSAGE</span>
                  <span className="required-star">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={`form-textarea ${errors.message ? 'invalid' : ''}`}
                  rows={5}
                  placeholder="Share details about your idea or project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                {errors.message && <span className="form-error-text" style={{ display: 'block' }}>{errors.message}</span>}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button type="submit" className="eink-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="btn-dot-pulse"></span>
                    <span>TRANSMITTING...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-dot">●</span>
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div id="formSuccessBanner" className="form-success-banner" style={{ display: 'block' }}>
            <div className="success-icon">✦</div>
            <h3 className="success-title">MESSAGE TRANSMITTED</h3>
            <p className="success-desc">Thank you for reaching out! I have received your note and will get back to you shortly.</p>
            <button
              onClick={() => setIsSuccess(false)}
              className="eink-submit-btn"
              style={{ boxShadow: 'none' }}
            >
              <span>SEND ANOTHER MESSAGE</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Contact Icons */}
      <div className="contact-social-row" aria-label="Direct Contact Icons">
        <a href="mailto:farhannazimfnz@gmail.com" className="social-icon-btn large" aria-label="Direct Email" data-tooltip="farhannazimfnz@gmail.com">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
          </svg>
        </a>
        <a href="tel:+916238688556" className="social-icon-btn large" aria-label="Phone" data-tooltip="+91 6238688556">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <a href="https://github.com/fnz78" target="_blank" rel="noopener noreferrer" className="social-icon-btn large" aria-label="GitHub" data-tooltip="github.com/fnz78">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/k-n-farhan-nazim-402122306/" target="_blank" rel="noopener noreferrer" className="social-icon-btn large" aria-label="LinkedIn" data-tooltip="LinkedIn Profile">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
          </svg>
        </a>
      </div>
    </section>
  );
};
