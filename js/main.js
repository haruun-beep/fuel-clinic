/* FUEL Clinic — main.js */

(function () {
  'use strict';

  // ── Nav scroll behaviour ──────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile hamburger ──────────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileOverlay = document.querySelector('.nav__mobile-overlay');
  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    mobileOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── FAQ accordion ─────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item.active').forEach(el => el.classList.remove('active'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('active');
    });
  });

  // ── Scroll reveal (progressive enhancement) ───────────────
  const revealEls = document.querySelectorAll('.reveal');
  // Add hidden state via JS only — content visible without JS
  revealEls.forEach(el => el.classList.add('reveal-init'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── Contact form (basic) ───────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Simulate — replace with real endpoint or Formspree
      await new Promise(r => setTimeout(r, 1000));
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#0fa349';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    });
  }

  // ── Landing page form ─────────────────────────────────────
  const lpForm = document.getElementById('lp-form');
  if (lpForm) {
    lpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = lpForm.querySelector('[type="submit"]');
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 900));
      lpForm.innerHTML = `
        <div style="text-align:center;padding:2rem 1rem">
          <div style="font-size:2.5rem;margin-bottom:1rem">✓</div>
          <h3 style="font-family:var(--font-h);color:var(--green);margin-bottom:.75rem">Request Received!</h3>
          <p style="color:rgba(255,255,255,.7);font-size:.9rem;line-height:1.65">
            Our team will contact you within 1 business day to confirm your appointment.
            <br><br>Questions? Call us at <a href="tel:7807055452" style="color:var(--green)">(780) 705-5452</a>
          </p>
        </div>`;
    });
  }

  // ── Active nav link highlight ─────────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__dropdown-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.endsWith(href) && href !== '/') a.classList.add('active');
  });

})();
