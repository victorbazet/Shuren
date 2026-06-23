document.addEventListener('DOMContentLoaded', () => {

  // Navbar transition
  const nav = document.getElementById('nav');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('opaque');
    } else {
      nav.classList.remove('opaque');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Init

  // Scroll reveal animation
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70, // 70px offset for fixed navbar
          behavior: 'smooth'
        });
      }
    });
  });

  // Form handling
  const form = document.getElementById('jardinForm');
  const msgContainer = document.getElementById('jFormErreur');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let hasError = false;
      const inputs = form.querySelectorAll('input, select');
      
      // Reset errors
      inputs.forEach(input => input.classList.remove('erreur'));
      msgContainer.textContent = '';
      msgContainer.style.color = '#EF4444'; // Red for errors

      // Check required
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('erreur');
          hasError = true;
        }
      });

      if (hasError) {
        msgContainer.textContent = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }

      // Simulation of a sent form
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Envoi en cours...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        
        msgContainer.style.color = '#10B981'; // Green for success
        msgContainer.textContent = 'Votre demande a bien été envoyée. Nous vous contacterons rapidement.';
        form.reset();
      }, 1500);
    });
  }

});
