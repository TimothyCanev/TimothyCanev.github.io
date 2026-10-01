/* =============================================
   TIMOTHY CANEV — PORTFOLIO
   scripthelper.js
   ============================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      var hasCourses = cert.courses && cert.courses.length;
      var card = el('article', 'cert-card' + (hasCourses ? ' is-track' : ''));

      // The no-break space keeps the "·" separator from starting a wrapped line.
      card.appendChild(el('p', 'cert-meta', cert.issuer + (cert.date ? ' · ' + cert.date : '')));

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
      if (hasCourses) {
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


  // --- THEME (dark by default; the choice is remembered) ---
  var THEME_KEY = 'tc-theme';
  var THEME_COLORS = { dark: '#0C0C0C', light: '#FAFAF9' };
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncThemeUI() {
    var theme = currentTheme();
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (themeMeta) themeMeta.setAttribute('content', THEME_COLORS[theme]);
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
    syncThemeUI();
  }

  syncThemeUI();
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }


  // --- HEADER: border once the page scrolls ---
  var header = document.getElementById('siteHeader');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      updateActive();
      ticking = false;
    });
  }


  // --- MOBILE MENU ---
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function isMenuOpen() {
    return mobileMenu.classList.contains('is-open');
  }

  function setMenu(open, returnFocus) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.classList.toggle('is-open', open);
    if (open) {
      var first = mobileMenu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    } else if (returnFocus) {
      menuToggle.focus();
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      setMenu(!isMenuOpen());
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) setMenu(false, true);
    });
    document.addEventListener('click', function (e) {
      if (isMenuOpen() && !header.contains(e.target)) setMenu(false);
    });
    var desktop = window.matchMedia('(min-width: 900px)');
    var closeOnDesktop = function (e) { if (e.matches && isMenuOpen()) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
    else if (desktop.addListener) desktop.addListener(closeOnDesktop);
  }


  // --- ACTIVE SECTION IN NAV ---
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a, .mobile-link'));
  var sectionIds = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    if (sectionIds.indexOf(id) === -1) sectionIds.push(id);
  });
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  var inView = {};

  function updateActive() {
    if (!sections.length) return;
    // At the very bottom the last section can be too short to reach the
    // middle of the viewport, so it is marked active explicitly.
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    var active = null;
    if (atBottom) {
      active = sections[sections.length - 1].id;
    } else {
      for (var i = 0; i < sections.length; i++) {
        if (inView[sections[i].id]) { active = sections[i].id; break; }
      }
    }
    setActive(active);
  }

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { inView[entry.target.id] = entry.isIntersecting; });
      updateActive();
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // --- SCROLL REVEAL ---
  // Content is only hidden when the "js" class is present (set in <head>),
  // so the page stays fully readable without JavaScript.
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealEls, function (node) { node.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Items that appear together cascade slightly.
        entry.target.style.setProperty('--stagger', String(Math.min(batch++, 5)));
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(revealEls, function (node) { revealObserver.observe(node); });
  }

})();
