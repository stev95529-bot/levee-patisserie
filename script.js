/**
 * LEVÉE Pâtisserie - Sistema Integrado y Optimizado de Carrito de Compras & Autenticación
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- ESTADO GLOBAL ---
  let cart = [];
  let isLoggedIn = false;

  // --- ELEMENTOS DOM ---
  const elements = {
    // Autenticación
    loginScreen: document.getElementById('loginScreen'),
    loginForm: document.getElementById('loginForm'),
    btnReturn: document.getElementById('btnReturn'),
    openLoginBtn: document.getElementById('openLogin'),
    forgotPass: document.getElementById('forgotPass'),
    welcomeModal: document.getElementById('welcomeModal'),
    closeWelcomeModal: document.getElementById('closeWelcomeModal'),

    // Productos y Modal
    productsModal: document.getElementById('productsModal'),
    closeProductsModal: document.getElementById('closeProductsModal'),
    modalCategoryTitle: document.getElementById('modalCategoryTitle'),
    categoryCards: document.querySelectorAll('.category-card'),
    menuItems: document.querySelectorAll('.menu-item-card'),

    // Carrito
    cartModal: document.getElementById('cartModal'),
    openCartBtn: document.getElementById('openCart'),
    closeCartModal: document.getElementById('closeCartModal'),
    cartBadge: document.getElementById('cartBadge'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTotal: document.getElementById('cartTotal'),
    btnCheckout: document.getElementById('btnCheckout'),

    // Alerta Global Elegante
    customAlertModal: document.getElementById('customAlertModal'),
    customAlertTitle: document.getElementById('customAlertTitle'),
    customAlertText: document.getElementById('customAlertText'),
    closeCustomAlert: document.getElementById('closeCustomAlert'),

    // Modal de Contacto
    contactModal: document.getElementById('contactModal'),
    openContactBtn: document.getElementById('openContact'),
    closeContactModal: document.getElementById('closeContactModal')
  };

  // --- FUNCIÓN GLOBAL DE ALERTA ELEGANTE ---
  const mostrarAlerta = (mensaje, titulo = "LEVÉE PÂTISSERIE") => {
    elements.customAlertTitle.textContent = titulo;
    elements.customAlertText.textContent = mensaje;
    elements.customAlertModal.classList.remove('hidden');
  };

  // Evento para cerrar la alerta elegante
  elements.closeCustomAlert.addEventListener('click', () => {
    elements.customAlertModal.classList.add('hidden');
  });
  elements.customAlertModal.addEventListener('click', (e) => {
    if (e.target === elements.customAlertModal) {
      elements.customAlertModal.classList.add('hidden');
    }
  });

  // --- UTILIDADES ---
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // --- LÓGICA DEL CARRITO ---
  const updateCartUI = () => {
    // 1. Badge total de ítems
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartBadge.textContent = totalQty;

    // 2. Limpiar contenedor
    elements.cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      elements.cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
      elements.cartSubtotal.textContent = formatCOP(0);
      elements.cartTotal.textContent = formatCOP(0);
      return;
    }

    // 3. Renderizar items
    let total = 0;
    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      total += itemSubtotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-unit-price">${formatCOP(item.price)} c/u</div>
          <div class="quantity-control cart-qty-control">
            <button type="button" class="btn-qty btn-cart-minus" data-id="${item.id}">-</button>
            <span class="qty-input">${item.quantity}</span>
            <button type="button" class="btn-qty btn-cart-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-subtotal">${formatCOP(itemSubtotal)}</div>
        <button type="button" class="btn-remove-item" data-id="${item.id}" title="Eliminar">&times;</button>
      `;
      elements.cartItemsContainer.appendChild(itemEl);
    });

    // 4. Totales
    elements.cartSubtotal.textContent = formatCOP(total);
    elements.cartTotal.textContent = formatCOP(total);
  };

  const addToCart = (id, title, price, img, quantity) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id, title, price: Number(price), img, quantity });
    }
    updateCartUI();
  };

  const updateCartItemQty = (id, delta) => {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
  };

  const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  };

  // --- DELEGACIÓN DE EVENTOS PARA CONTROLES DE CANTIDAD ---
  document.addEventListener('click', (e) => {
    // 1. Botones de Incremento / Decremento en Tarjetas
    if (e.target.classList.contains('btn-plus') || e.target.classList.contains('btn-minus')) {
      const container = e.target.closest('.quantity-control');
      const input = container.querySelector('.qty-input');
      let val = parseInt(input.value) || 1;

      if (e.target.classList.contains('btn-plus')) {
        val = Math.min(val + 1, 99);
      } else {
        val = Math.max(val - 1, 1);
      }
      input.value = val;
    }

    // 2. Botón "Añadir al Carrito" en Tarjetas
    if (e.target.classList.contains('btn-add-cart')) {
      const card = e.target.closest('[data-id]');
      if (!card) return;

      const id = card.getAttribute('data-id');
      const title = card.getAttribute('data-title');
      const price = card.getAttribute('data-price');
      const img = card.getAttribute('data-img');
      const qtyInput = card.querySelector('.qty-input');
      const quantity = parseInt(qtyInput ? qtyInput.value : 1) || 1;

      addToCart(id, title, price, img, quantity);

      // Resetear contador a 1 tras añadir
      if (qtyInput) qtyInput.value = 1;

      // Feedback visual en el botón
      const origText = e.target.textContent;
      e.target.textContent = '¡AÑADIDO!';
      e.target.style.background = '#4CAF50';
      e.target.style.color = '#fff';
      setTimeout(() => {
        e.target.textContent = origText;
        e.target.style.background = '';
        e.target.style.color = '';
      }, 1200);
    }

    // 3. Controles dentro del Modal de Carrito (Sumar / Restar / Eliminar)
    if (e.target.classList.contains('btn-cart-plus')) {
      updateCartItemQty(e.target.getAttribute('data-id'), 1);
    }
    if (e.target.classList.contains('btn-cart-minus')) {
      updateCartItemQty(e.target.getAttribute('data-id'), -1);
    }
    if (e.target.classList.contains('btn-remove-item')) {
      removeFromCart(e.target.getAttribute('data-id'));
    }
  });

  // --- LÓGICA DE APERTURA / CIERRE DE MODALES ---
  // Modal Carrito
  elements.openCartBtn.addEventListener('click', () => elements.cartModal.classList.remove('hidden'));
  elements.closeCartModal.addEventListener('click', () => elements.cartModal.classList.add('hidden'));
  elements.cartModal.addEventListener('click', (e) => {
    if (e.target === elements.cartModal) elements.cartModal.classList.add('hidden');
  });

  // Modal de Contacto
  if (elements.openContactBtn && elements.contactModal) {
    elements.openContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      elements.contactModal.classList.remove('hidden');
    });
  }

  if (elements.closeContactModal && elements.contactModal) {
    elements.closeContactModal.addEventListener('click', () => {
      elements.contactModal.classList.add('hidden');
    });

    elements.contactModal.addEventListener('click', (e) => {
      if (e.target === elements.contactModal) {
        elements.contactModal.classList.add('hidden');
      }
    });
  }

  // Modal Productos por Categoría
  const displayCategoryModal = (category) => {
    elements.modalCategoryTitle.textContent = `SELECCIÓN DE ${category.toUpperCase()}`;
    elements.menuItems.forEach(item => {
      if (item.getAttribute('data-cat') === category) {
        item.classList.remove('hidden-item');
      } else {
        item.classList.add('hidden-item');
      }
    });
    elements.productsModal.classList.remove('hidden');
  };

  elements.categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedCat = card.getAttribute('data-category');
      displayCategoryModal(selectedCat);
    });
  });

  elements.closeProductsModal.addEventListener('click', () => elements.productsModal.classList.add('hidden'));
  elements.productsModal.addEventListener('click', (e) => {
    if (e.target === elements.productsModal) elements.productsModal.classList.add('hidden');
  });

  // Finalizar Pedido
  elements.btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
      mostrarAlerta('Tu carrito está vacío. Agrega productos para realizar el pedido.');
      return;
    }
    if (!isLoggedIn) {
      mostrarAlerta('Para finalizar tu pedido, por favor inicia sesión.');
      elements.cartModal.classList.add('hidden');
      elements.loginScreen.classList.remove('hidden');
      return;
    }

    mostrarAlerta('¡Gracias por tu pedido! Nos pondremos en contacto para coordinar la entrega.');
    cart = [];
    updateCartUI();
    elements.cartModal.classList.add('hidden');
  });

  // --- AUTENTICACIÓN ---
  elements.openLoginBtn.addEventListener('click', () => {
    if (isLoggedIn) {
      if (confirm('¿Desea cerrar la sesión actual?')) {
        isLoggedIn = false;
        elements.openLoginBtn.textContent = 'INICIO DE SESIÓN';
      }
    } else {
      elements.loginScreen.classList.remove('hidden');
    }
  });

  elements.btnReturn.addEventListener('click', () => elements.loginScreen.classList.add('hidden'));
  elements.forgotPass.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarAlerta('Se ha enviado un correo con instrucciones para restablecer su contraseña.');
  });

  elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    isLoggedIn = true;
    elements.openLoginBtn.textContent = 'MI CUENTA';
    elements.loginScreen.classList.add('hidden');
    elements.loginForm.reset();
    elements.welcomeModal.classList.remove('hidden');
  });

  elements.closeWelcomeModal.addEventListener('click', () => elements.welcomeModal.classList.add('hidden'));
  elements.welcomeModal.addEventListener('click', (e) => {
    if (e.target === elements.welcomeModal) elements.welcomeModal.classList.add('hidden');
  });

  // Inicializar estado de UI del carrito
  updateCartUI();
});