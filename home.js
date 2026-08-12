/* Shuren — Home (V1 minimal premium). Autonome : ne dépend pas de script.js.
   Contrat conservé avec les autres pages : localStorage 'theme' / 'cookie_consent',
   data-theme sur <html>, #cookiePrefs, gtag consent mode. */
(function () {
  'use strict';

  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(pointer: fine)').matches;
  var isEn = document.documentElement.lang === 'en';

  /* ---------- Gérer les cookies — retrait du consentement ---------- */
  var cookiePrefsBtn = document.getElementById('cookiePrefs');
  if (cookiePrefsBtn) {
    cookiePrefsBtn.addEventListener('click', function () {
      localStorage.removeItem('cookie_consent');
      if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'denied' });
      location.reload();
    });
  }

  /* ---------- Bannière cookies ---------- */
  (function () {
    if (localStorage.getItem('cookie_consent')) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';

    var p = document.createElement('p');
    p.textContent = isEn
      ? 'This site uses Google Analytics to measure traffic. No cookies are stored without your consent. '
      : 'Ce site utilise Google Analytics pour mesurer l\'audience. Aucun cookie n\'est déposé sans votre accord. ';
    var link = document.createElement('a');
    link.href = '/mentions-legales';
    link.textContent = isEn ? 'Learn more' : 'En savoir plus';
    p.appendChild(link);

    var btns = document.createElement('div');
    btns.className = 'cookie-btns';
    var btnRefuse = document.createElement('button');
    btnRefuse.className = 'cookie-refuse';
    btnRefuse.textContent = isEn ? 'Decline' : 'Refuser';
    var btnAccept = document.createElement('button');
    btnAccept.className = 'cookie-accept';
    btnAccept.textContent = isEn ? 'Accept' : 'Accepter';
    btns.appendChild(btnRefuse);
    btns.appendChild(btnAccept);

    banner.appendChild(p);
    banner.appendChild(btns);
    document.body.appendChild(banner);

    banner.querySelector('.cookie-accept').addEventListener('click', function () {
      localStorage.setItem('cookie_consent', 'accepted');
      if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' });
      banner.remove();
    });
    banner.querySelector('.cookie-refuse').addEventListener('click', function () {
      localStorage.setItem('cookie_consent', 'refused');
      banner.remove();
    });
  })();

  /* ---------- Entrée du hero ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('loaded');
    });
  });

  /* ---------- Thème ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { }
    });
  }

  /* ---------- Nav : condensation + barre de progression ---------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (nav) nav.classList.toggle('compact', y > 24);
      if (progress) {
        var max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('navHamburger');
  var navMobile = document.getElementById('navMobile');
  if (burger && navMobile && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
      navMobile.inert = !open;
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
        navMobile.inert = true;
      });
    });
  }

  /* ---------- Révélation au scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- Compteurs ---------- */
  function animateCount(el) {
    var target = parseInt(el.dataset.target, 10) || 0;
    if (RM) { el.textContent = target; return; }
    var dur = 1500;
    var t0 = performance.now();
    function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var ioCount = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.js-count').forEach(animateCount);
        ioCount.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counts]').forEach(function (el) { ioCount.observe(el); });

  /* ---------- Rouleau de mots du hero ---------- */
  var roller = document.getElementById('rollerWord');
  if (roller && !RM) {
    /* Les mots viennent du HTML (data-words) pour rester dans la langue de la page. */
    var mots = (roller.dataset.words || '').split('|').filter(Boolean);
    if (!mots.length) mots = ['entreprises', 'restaurants', 'hôtels', 'artisans', 'cabinets', 'commerçants'];
    var i = 0;
    setInterval(function () {
      roller.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % mots.length;
        roller.textContent = mots[i];
        roller.classList.add('prep');
        roller.classList.remove('out');
        void roller.offsetHeight; /* reflow pour rejouer la transition */
        roller.classList.remove('prep');
      }, 480);
    }, 3000);
  }

  /* ---------- Boutons magnétiques ---------- */
  if (FINE && !RM) {
    document.querySelectorAll('.magnet').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = 'translate(' + (x * 9).toFixed(1) + 'px,' + (y * 7).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Kanji : pin desktop (texte fixe, lettres qui défilent) + parallaxe léger mobile ---------- */
  var kanji = document.querySelector('.apropos-kanji');
  var apropos = document.getElementById('apropos');
  var aproposPin = document.querySelector('.apropos-pin');
  if (kanji && apropos && aproposPin && !RM) {
    var pinQuery = matchMedia('(min-width: 901px)');
    var kTicking = false;

    function updateKanji() {
      var shift = 0;
      if (pinQuery.matches) {
        var rect = apropos.getBoundingClientRect();
        var total = rect.height - innerHeight;
        if (total > 0) {
          var progress = Math.max(0, Math.min(1, -rect.top / total));
          var pinHeight = aproposPin.getBoundingClientRect().height || innerHeight;
          var kanjiHeight = kanji.getBoundingClientRect().height;
          var maxTravel = Math.max(0, (pinHeight - kanjiHeight) / 2 - 12);
          var travel = Math.min(150, maxTravel);
          shift = (progress - 0.5) * 2 * travel;
        }
      } else {
        var r = apropos.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          shift = Math.max(-40, Math.min(40, (r.top - innerHeight / 2) * -0.05));
        }
      }
      kanji.style.setProperty('--kanji-shift', shift.toFixed(1) + 'px');
    }

    addEventListener('scroll', function () {
      if (kTicking) return;
      kTicking = true;
      requestAnimationFrame(function () { updateKanji(); kTicking = false; });
    }, { passive: true });
    addEventListener('resize', updateKanji, { passive: true });
    updateKanji();
  }

  /* ---------- Toggle mensuel / annuel ---------- */
  var billBtns = document.querySelectorAll('.bill-btn');
  var montants = document.querySelectorAll('.tarif-montant');
  var cadences = document.querySelectorAll('.tarif-cadence');
  billBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('active')) return;
      billBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      var mode = btn.dataset.bill; /* 'm' ou 'a' */
      montants.forEach(function (el) {
        var val = el.dataset.fixed || el.dataset[mode];
        if (!val) return;
        el.classList.add('swap');
        setTimeout(function () {
          el.textContent = isEn ? '€' + val : val + '€';
          el.classList.remove('swap');
        }, 180);
      });
      cadences.forEach(function (el) {
        var txt = el.dataset[mode];
        if (!txt) return;
        el.classList.add('swap');
        setTimeout(function () {
          el.textContent = txt;
          el.classList.remove('swap');
        }, 180);
      });
    });
  });

})();
