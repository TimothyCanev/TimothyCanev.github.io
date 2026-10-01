/* =============================================
   TIMOTHY CANEV PORTFOLIO
   script.js
   ============================================= */

(function () {
  'use strict';

  // --- CERTIFICATIONS (edit this list to add more) ---
  // Fields: title, issuer, date (optional), detail (optional),
  //         courses (optional list), url (optional link to the credential).
  var CERTIFICATIONS = [
    {
      title: 'CCNA (v7 Full Track)',
      issuer: 'Cisco Networking Academy',
      date: null, // TODO(Timothy): add the year you completed the CCNA track
      detail: '3-course CCNA track',
      courses: [
        'Introduction to Networks',
        'Switching, Routing & Wireless Essentials',
        'Enterprise Networking, Security & Automation'
      ]
    },
    {
      title: 'Photon Fusion: Unity Multiplayer Game Development',
      issuer: 'Udemy',
      date: 'Apr 2024'
    },
    {
      title: 'Instructor (Instruktorkursus)',
      issuer: 'University of Southern Denmark',
      date: 'Sep 2024'
    }
  ];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderCertifications() {
    var list = document.getElementById('certList');
    if (!list) return;
    CERTIFICATIONS.forEach(function (cert) {
      var card = el('article', 'cert-card');
      var meta = el('div', 'cert-meta');
      meta.appendChild(el('span', 'cert-issuer', cert.issuer));
      if (cert.date) meta.appendChild(el('span', 'cert-date', cert.date));
      card.appendChild(meta);

      var title = el('h4', 'cert-title');
      if (cert.url) {
        var link = el('a', null, cert.title);
        link.href = cert.url;
        link.target = '_blank';
        link.rel = 'noopener';
        title.appendChild(link);
      } else {
        title.textContent = cert.title;
      }
      card.appendChild(title);

      if (cert.detail) card.appendChild(el('p', 'cert-detail', cert.detail));
      if (cert.courses && cert.courses.length) {
        var courses = el('ol', 'cert-courses');
        cert.courses.forEach(function (course) {
          courses.appendChild(el('li', null, course));
        });
        card.appendChild(courses);
      }
      list.appendChild(card);
    });
  }

  renderCertifications();

  // --- DARK MODE ---
  const root    = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const STORAGE_KEY = 'tc-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeBtn.addEventListener('click', function () {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  // --- HAMBURGER MENU ---
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const bars = hamburger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    });
  });


  // --- STICKY NAV ---
  const nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });


  // --- ACTIVE NAV LINK ---
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];

  function updateActiveNav() {
    let currentSection = 'home';
    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      if (window.scrollY >= el.offsetTop - 120) {
        currentSection = id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + currentSection
      );
    });
  }


  // --- SCROLL REVEAL ---
  // Gate opacity:0 behind js-loaded so content is always visible if JS hasn't run
  root.classList.add('js-loaded');

  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px 0px 0px'
  });

  revealEls.forEach(function (el) {
    // Immediately make visible anything already in the viewport on load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });


  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(root).getPropertyValue('--nav-h') || '60', 10);
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // --- KEYBOARD ACCESSIBILITY ---
  themeBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeBtn.click();
    }
  });

})();