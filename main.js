let cart = [];
const cartCount = document.getElementById('cartCount');
const cartDropdown = document.getElementById('cartDropdown');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// ✅ ADD TO CART FUNCTIONALITY
addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const name = card.querySelector('h3').innerText;
    const price = card.querySelector('.price').innerText;
    const image = card.querySelector('img').src;

    // Add item to cart array
    cart.push({ name, price, image });

    // Update cart counter
    cartCount.innerText = cart.length;

    // Update dropdown
    renderCartDropdown();
  });
});

function renderCartDropdown() {
  if (cart.length === 0) {
    cartDropdown.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  cartDropdown.innerHTML = '';
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="40" style="border-radius:5px; margin-right:10px;">
      <span>${item.name}</span> - <span>${item.price}</span>
      <button class="remove-item" data-index="${index}" style="float:right; background:red; color:white; border:none; border-radius:3px; padding:2px 5px; cursor:pointer;">x</button>
    `;
    cartDropdown.appendChild(div);
  });

  // Remove item functionality
  const removeButtons = cartDropdown.querySelectorAll('.remove-item');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      cartCount.innerText = cart.length;
      renderCartDropdown();
    });
  });
}

// ✅ PRODUCT FILTER SYSTEM
document.addEventListener("DOMContentLoaded", () => {
  const products = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const priceValue = document.getElementById('priceValue');

  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const maxPrice = parseFloat(priceFilter.value);

    products.forEach(product => {
      const name = product.querySelector('h3').innerText.toLowerCase();
      const prodCategory = product.dataset.category;
      const price = parseFloat(product.dataset.price);

      if (
        name.includes(searchText) &&
        (category === 'all' || prodCategory === category) &&
        price <= maxPrice
      ) {
        product.style.display = '';
      } else {
        product.style.display = 'none';
      }
    });

    priceValue.innerText = `$${priceFilter.value}`;
  }

  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  priceFilter.addEventListener('input', filterProducts);

  filterProducts(); // initial filter
});

// ✅ HAMBURGER MENU
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu");
  const sideMenu = document.querySelector(".side-menu");
  const closeBtn = document.querySelector(".close-btn");

  // Open menu
  menu.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });

  // Close menu
  closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });

  // Optional: close if clicking outside
  window.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !menu.contains(e.target)) {
      sideMenu.classList.remove("open");
    }
  });
});
