/* Nav — opaque au scroll */
const vNav = document.getElementById('v-nav');
window.addEventListener('scroll', () => {
  if (vNav) vNav.classList.toggle('opaque', window.scrollY > 50);
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

/* Tabs Delivery */
const tabBtns = document.querySelectorAll('.v-tab-btn');
const tabContents = document.querySelectorAll('.v-tab-content');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

/* Panier (Cart JS) */
const cartBtn = document.getElementById('cartBtn');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const addBtns = document.querySelectorAll('.v-btn-add');

let cart = [];

function toggleCart() {
  cartOverlay.classList.toggle('active');
  cartDrawer.classList.toggle('active');
}

cartBtn.addEventListener('click', toggleCart);
cartClose.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

function updateCartUI() {
  cartCount.textContent = cart.length;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="v-cart-empty">Votre panier est vide.</p>';
    cartTotal.textContent = '0€';
    return;
  }
  
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.className = 'v-cart-item';
    div.innerHTML = `
      <div class="v-item-info">
        <span class="v-item-name">${item.name}</span>
        <span class="v-item-price">${item.price}€</span>
        <button class="v-item-remove" data-index="${index}">Retirer</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });
  
  cartTotal.textContent = total + '€';
  
  // Attach remove events
  document.querySelectorAll('.v-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.dataset.index;
      cart.splice(idx, 1);
      updateCartUI();
    });
  });
}

addBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const item = {
      id: e.target.dataset.id,
      name: e.target.dataset.name,
      price: parseInt(e.target.dataset.price)
    };
    cart.push(item);
    updateCartUI();
    toggleCart(); // Show cart when adding
  });
});

/* Checkout demo */
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    alert('Ceci est une démo. Redirection vers la plateforme de paiement fictive.');
  });
}
