document.addEventListener("DOMContentLoaded", () => {
  // ----------------- CART SETUP -----------------
  let cart = [];
  const cartCount = document.getElementById('cartCount');
  const cartDropdown = document.getElementById('cartDropdown');
  const viewOrderBtn = document.getElementById('viewOrderBtn');

  // ----------------- ADD TO CART -----------------
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const name = card.querySelector('h3').innerText;
      const price = parseFloat(card.querySelector('.price').innerText.replace(/[^0-9.]/g, ''));
      const image = card.querySelector('img').src;

      // Check if item already exists
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, image, qty: 1 });
      }

      renderCartDropdown();
    });
  });

  // ----------------- RENDER CART DROPDOWN -----------------
  function renderCartDropdown() {
    cartDropdown.innerHTML = '';

    if (cart.length === 0) {
      cartDropdown.innerHTML = '<p>Your cart is empty</p>';
    } else {
      cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}" width="40" style="border-radius:5px; margin-right:10px;">
          <span>${item.name}</span> - <span>$${(item.price * item.qty).toFixed(2)}</span>
          <span style="margin-left:5px;">(x${item.qty})</span>
          <button class="remove-item" data-index="${index}" style="float:right; background:red; color:white; border:none; border-radius:3px; padding:2px 5px; cursor:pointer;">x</button>
        `;
        cartDropdown.appendChild(div);
      });
    }

    // ALWAYS append the viewOrderBtn to cartDropdown
    cartDropdown.appendChild(viewOrderBtn);
    cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);

    // Remove item functionality
    cartDropdown.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        renderCartDropdown();
      });
    });
  }

  // ----------------- VIEW ORDER BUTTON EVENT -----------------
  viewOrderBtn.addEventListener('click', () => {
    // Hide main content and show order page
    document.querySelector('main').style.display = 'none';
    document.querySelector('header').style.display = 'none';
    document.getElementById('orderPage').style.display = 'block';
    
    renderOrderPage(); // Render the order page content
  });

  // ----------------- ORDER PAGE RENDERING -----------------
  const orderList = document.getElementById('orderList');
  const totalItemsSpan = document.getElementById('totalItems');
  const totalPriceSpan = document.getElementById('totalPrice');
  const backToIndex = document.getElementById('backToIndex');

  function renderOrderPage() {
    orderList.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
      totalItems += item.qty;
      totalPrice += item.price * item.qty;

      const div = document.createElement('div');
      div.classList.add('order-item');
      div.innerHTML = `
        <img src="${item.image}" width="50" style="margin-right:10px;">
        <span>${item.name}</span>
        <span>Qty: ${item.qty}</span>
        <span>Price: $${(item.price * item.qty).toFixed(2)}</span>
      `;
      orderList.appendChild(div);
    });

    totalItemsSpan.innerText = totalItems;
    totalPriceSpan.innerText = totalPrice.toFixed(2);
  }

  // ----------------- BACK TO MAIN PAGE -----------------
  backToIndex.addEventListener('click', () => {
    document.getElementById('orderPage').style.display = 'none';
    document.querySelector('header').style.display = 'flex';
    document.querySelector('main').style.display = 'block';
  });

  // ----------------- FILTERS FUNCTIONALITY -----------------
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const priceValue = document.getElementById('priceValue');
  const productCards = document.querySelectorAll('.product-card');

  // Update price value display
  if (priceFilter && priceValue) {
    priceValue.textContent = `$${priceFilter.value}`;
    priceFilter.addEventListener('input', () => {
      priceValue.textContent = `$${priceFilter.value}`;
      filterProducts();
    });
  }

  // Search input event listener
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  // Category filter event listener
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterProducts);
  }

  // Main filter function
  function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const maxPrice = priceFilter ? parseFloat(priceFilter.value) : Infinity;

    let hasVisibleProducts = false;

    productCards.forEach(card => {
      const productName = card.querySelector('h3').textContent.toLowerCase();
      const productPrice = parseFloat(card.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
      const productCategory = card.dataset.category || 'all';

      // Check if product matches all criteria
      const matchesSearch = productName.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
      const matchesPrice = productPrice <= maxPrice;

      // Show or hide card based on filters
      if (matchesSearch && matchesCategory && matchesPrice) {
        card.style.display = 'block';
        hasVisibleProducts = true;
      } else {
        card.style.display = 'none';
      }
    });

    // Show no results message if needed
    showNoResultsMessage(!hasVisibleProducts);
  }

  function showNoResultsMessage(show) {
    // Remove existing message if any
    const existingMessage = document.getElementById('noResultsMessage');
    if (existingMessage) {
      existingMessage.remove();
    }

    if (show) {
      const productsGrid = document.querySelector('.products-grid');
      const message = document.createElement('div');
      message.id = 'noResultsMessage';
      message.style.textAlign = 'center';
      message.style.padding = '2rem';
      message.style.gridColumn = '1 / -1';
      message.style.color = '#666';
      message.innerHTML = `
        <h3>No products found</h3>
        <p>Try adjusting your search or filters</p>
        <button onclick="clearAllFilters()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Clear All Filters
        </button>
      `;
      
      // Add the message to the products grid
      if (productsGrid) {
        productsGrid.appendChild(message);
      }
    }
  }

  // Clear all filters function (make it global so it can be called from HTML)
  window.clearAllFilters = function() {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (priceFilter) {
      priceFilter.value = priceFilter.max;
      priceValue.textContent = `$${priceFilter.value}`;
    }
    filterProducts();
  };

  // Initialize cart dropdown and filters
  renderCartDropdown();
  filterProducts(); // Initialize filters on page load
});

// Hamburger Menu Toggle
const menuIcon = document.querySelector('.menu');
const sideMenu = document.querySelector('.side-menu');
const closeBtn = document.querySelector('.close-btn');
const overlay = document.querySelector('.overlay');

// Toggle side menu
menuIcon.addEventListener('click', () => {
    sideMenu.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

// Close side menu
closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
});

// Close menu when clicking outside
overlay.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    document.body.style.overflow = '';
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
        document.body.style.overflow = '';
    }
});