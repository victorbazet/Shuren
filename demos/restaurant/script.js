/* Nav — opaque au scroll */
const rNav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (rNav) rNav.classList.toggle('opaque', window.scrollY > 50);
}, { passive: true });

/* Scroll reveal */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

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

/* Validation formulaire réservation */
const rForm = document.getElementById('restoForm');
if (rForm) {
  rForm.addEventListener('submit', e => {
    e.preventDefault();
    const erreur = document.getElementById('rFormErreur');
    const champs = ['rDate', 'rHeure', 'rPersonnes', 'rNom', 'rEmail'];
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

    const email = document.getElementById('rEmail');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('erreur');
      valid = false;
    }

    if (!valid) {
      erreur.textContent = 'Merci de remplir tous les champs obligatoires.';
      return;
    }

    erreur.textContent = '';
    erreur.style.color = '#1A2E20';
    erreur.textContent = 'Votre demande de réservation a été envoyée avec succès !';
    rForm.querySelector('.form-submit').textContent = 'Réservation confirmée ✓';
    rForm.querySelector('.form-submit').disabled = true;
    rForm.querySelector('.form-submit').style.opacity = '0.7';
  });

  rForm.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('erreur'));
  });
}
