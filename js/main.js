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

  // ── Mobile nav book button (injected so we only need it in one place) ────
  const navInner = document.querySelector('.nav__inner');
  if (navInner) {
    const mobileBook = document.createElement('a');
    // Build absolute booking URL regardless of page depth
    mobileBook.href = 'https://fuelclinic.janeapp.com/';
    mobileBook.target = '_blank';
    mobileBook.rel = 'noopener';
    mobileBook.className = 'btn btn-primary nav__mobile-book';
    mobileBook.textContent = 'Book Now';
    const burger = navInner.querySelector('.nav__hamburger');
    if (burger) navInner.insertBefore(mobileBook, burger);
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

  // ── Dropdown — click/touch support (belt-and-suspenders) ─
  document.querySelectorAll('.nav__item').forEach(item => {
    const dropdown = item.querySelector('.nav__dropdown');
    if (!dropdown) return;
    const link = item.querySelector('.nav__link');

    // On desktop: click toggles; CSS :hover still works
    link && link.addEventListener('click', e => {
      if (window.innerWidth <= 768) return; // mobile uses overlay
      const isOpen = item.classList.contains('dd-open');
      // Close all others
      document.querySelectorAll('.nav__item.dd-open').forEach(el => el.classList.remove('dd-open'));
      if (!isOpen) {
        e.preventDefault();
        item.classList.add('dd-open');
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav__item')) {
      document.querySelectorAll('.nav__item.dd-open').forEach(el => el.classList.remove('dd-open'));
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.nav__item.dd-open').forEach(el => el.classList.remove('dd-open'));
  });

  // ── Animated counters ─────────────────────────────────────
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.dataset.count.includes('.');
        const duration = 1600;
        const start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3); // ease-out-cubic
          const val = ease * target;
          el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = isDecimal ? target.toFixed(1) : target;
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => cio.observe(el));
  }

})();
