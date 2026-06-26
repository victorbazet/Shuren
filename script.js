/* Gérer les cookies — retrait du consentement */
const cookiePrefsBtn = document.getElementById('cookiePrefs');
if (cookiePrefsBtn) {
  cookiePrefsBtn.addEventListener('click', function () {
    localStorage.removeItem('cookie_consent');
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'denied' });
    location.reload();
  });
}

/* Cookie Consent Banner */
(function () {
  if (localStorage.getItem('cookie_consent')) return;

  var isEn = document.documentElement.lang === 'en';
  var banner = document.createElement('div');
  banner.id = 'cookie-banner';

  var p = document.createElement('p');
  p.textContent = isEn
    ? 'This site uses Google Analytics to measure traffic. No data is collected without your consent. '
    : 'Ce site utilise Google Analytics pour mesurer l\'audience. Aucune donnée n\'est collectée sans votre accord. ';
  var link = document.createElement('a');
  link.href = isEn ? '../mentions-legales.html' : 'mentions-legales.html';
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

/* Typewriter hero */
(function () {
  const tw = document.getElementById('typewriter');
  const cursor = document.querySelector('.tw-cursor');
  if (!tw || !cursor) return;

  const isEn = document.documentElement.lang === 'en';
  const mots = isEn
    ? ['restaurants', 'craftsmen', 'law firms', 'retailers', 'businesses']
    : ['restaurants', 'artisans', 'cabinets', 'commerçants', 'entreprises'];

  let motIndex = 0;
  let charIndex = 0;
  let effacement = false;

  function tick() {
    const mot = mots[motIndex];

    if (!effacement) {
      cursor.classList.remove('hidden');
      charIndex++;
      tw.textContent = mot.slice(0, charIndex);

      if (charIndex === mot.length) {
        setTimeout(() => {
          effacement = true;
          cursor.classList.add('hidden');
          tick();
        }, 1800);
        return;
      }
      setTimeout(tick, 80);
    } else {
      charIndex--;
      tw.textContent = mot.slice(0, charIndex);

      if (charIndex === 0) {
        effacement = false;
        motIndex = (motIndex + 1) % mots.length;
        setTimeout(tick, 80);
        return;
      }
      setTimeout(tick, 50);
    }
  }

  tick();
})();

/* Theme toggle */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* Nav — opaque au scroll */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('opaque', window.scrollY > 20);
  }, { passive: true });
}

/* Hamburger menu mobile */
const navHamburger = document.getElementById('navHamburger');
const navMobile = document.getElementById('navMobile');
if (navHamburger && navMobile && nav) {
  navHamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    navHamburger.setAttribute('aria-expanded', String(isOpen));
    navMobile.inert = !isOpen;
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      navHamburger.setAttribute('aria-expanded', 'false');
      navMobile.inert = true;
    });
  });
}

/* Scroll reveal */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* Custom select formule */
const formuleSelect = document.getElementById('formuleSelect');
if (formuleSelect) {
  const trigger = formuleSelect.querySelector('.select-trigger');
  const label = formuleSelect.querySelector('.select-label');
  const options = formuleSelect.querySelectorAll('.select-dropdown li');
  const hiddenInput = document.getElementById('formuleValue');

  trigger.addEventListener('click', () => {
    const isOpen = formuleSelect.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const val = opt.dataset.value;
      hiddenInput.value = val;
      label.textContent = val;
      trigger.classList.add('has-value');
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      formuleSelect.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!formuleSelect.contains(e.target)) {
      formuleSelect.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Validation formulaire */
const form = document.getElementById('contactForm');
if (form) {
  // Initialisation du timestamp anti-bot
  const formStartEl = document.getElementById('formStart');
  if (formStartEl) formStartEl.value = Date.now();

  form.addEventListener('submit', e => {
    e.preventDefault();
    // Honeypot — si rempli, c'est un bot : on abandonne silencieusement
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) return;
    // Timing — rejet si soumis en moins de 3 secondes
    const startVal = document.getElementById('formStart');
    if (startVal && Date.now() - parseInt(startVal.value, 10) < 3000) return;
    const erreur = document.getElementById('formErreur');
    const champs = ['nom', 'email', 'message'];
    let valid = true;

    champs.forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.classList.add('erreur');
        valid = false;
      } else {
        el.classList.remove('erreur');
      }
    });

    const formuleHidden = document.getElementById('formuleValue');
    if (formuleHidden !== null) {
      const trigger = formuleSelect.querySelector('.select-trigger');
      if (!formuleHidden.value) {
        trigger.classList.add('erreur');
        valid = false;
      } else {
        trigger.classList.remove('erreur');
      }
    }

    const email = document.getElementById('email');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('erreur');
      valid = false;
    }

    if (!valid) {
      erreur.textContent = 'Merci de remplir tous les champs obligatoires.';
      return;
    }

    erreur.textContent = '';
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(r => { if (!r.ok) throw new Error(); })
      .then(() => {
        btn.textContent = 'Message envoyé ✓';
        setTimeout(() => {
          form.reset();
          if (formuleSelect) {
            const lbl = formuleSelect.querySelector('.select-label');
            const trg = formuleSelect.querySelector('.select-trigger');
            const opts = formuleSelect.querySelectorAll('.select-dropdown li');
            if (lbl) lbl.textContent = 'Choisir une formule';
            if (trg) trg.classList.remove('has-value');
            if (opts) opts.forEach(o => o.classList.remove('selected'));
          }
          btn.textContent = 'Envoyer le message';
          btn.disabled = false;
        }, 2000);
      })
      .catch(() => {
        btn.textContent = 'Envoyer le message';
        btn.disabled = false;
        erreur.textContent = "Une erreur est survenue, réessayez ou écrivez à contact@shuren.fr";
      });
  });

  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('erreur'));
  });
}

/* FAQ accordion */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (!question) return;
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(i => {
      i.classList.remove('open');
      const q = i.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

/* Curseur Caméléon */

/* Slider Avant/Après */
const slider = document.querySelector('.ba-slider');
if (slider) {
  const imageAfter = slider.querySelector('.ba-image-after');
  const handle = slider.querySelector('.ba-handle');
  const labelAvant = slider.querySelector('.ba-label-avant');
  const labelApres = slider.querySelector('.ba-label-apres');
  let isDragging = false;
  let animFrame = null;

  const updateSplit = (percent) => {
    imageAfter.style.setProperty('--split-pos', percent + '%');
    handle.style.setProperty('--split-pos', percent + '%');
  };

  const getCurrentPercent = () => {
    const val = imageAfter.style.getPropertyValue('--split-pos');
    return val ? parseFloat(val) : 50;
  };

  const animateTo = (targetPercent, duration) => {
    duration = duration || 600;
    if (animFrame) cancelAnimationFrame(animFrame);
    const startPercent = getCurrentPercent();
    const startTime = performance.now();
    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      updateSplit(startPercent + (targetPercent - startPercent) * ease(t));
      if (t < 1) animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
  };

  const percentFromClientX = (clientX) => {
    const rect = slider.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  };

  handle.addEventListener('mousedown', () => {
    if (animFrame) cancelAnimationFrame(animFrame);
    isDragging = true;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) updateSplit(percentFromClientX(e.clientX));
  });

  handle.addEventListener('touchstart', (e) => {
    if (animFrame) cancelAnimationFrame(animFrame);
    isDragging = true;
    updateSplit(percentFromClientX(e.touches[0].clientX));
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      if (e.cancelable) e.preventDefault();
      updateSplit(percentFromClientX(e.touches[0].clientX));
    }
  }, { passive: false });

  if (labelAvant) labelAvant.addEventListener('click', () => animateTo(0));
  if (labelApres) labelApres.addEventListener('click', () => animateTo(100));
}
