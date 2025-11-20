// main.js - Loading products from JSON file

let productsData = [];
let cart = JSON.parse(localStorage.getItem('hamiMinimarketCart')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    initializeCart();
    setupEventListeners();
    updateCartDisplay();
});

async function loadProducts() {
    try {
        const response = await fetch('./data/products.json');
        productsData = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to hardcoded products if JSON fails
        productsData = getDefaultProducts();
        renderProducts();
    }
}

function getDefaultProducts() {
    return [
        // 6 Vegetables
        {
            "id": 1,
            "name": "Beetroot",
            "category": "vegetables",
            "price": 2.99,
            "image": "https://i.pinimg.com/736x/c6/22/6b/c6226ba1dd99290ad2a2d4a45189306c.jpg",
            "badge": "New",
            "stock": 15
        },
        {
            "id": 2,
            "name": "Carrot",
            "category": "vegetables",
            "price": 1.99,
            "image": "https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg",
            "badge": "Fresh",
            "stock": 20
        },
        {
            "id": 3,
            "name": "Broccoli",
            "category": "vegetables",
            "price": 3.49,
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNo7T2bpDABluiYRWxUgVIa9L_dtoWb-Jd3qst6fAe8vW9rIoXIDdiejnqF4u7GmeCmzs&usqp=CAU",
            "badge": "",
            "stock": 8
        },
        {
            "id": 4,
            "name": "Spinach",
            "category": "vegetables",
            "price": 2.79,
            "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop",
            "badge": "Organic",
            "stock": 12
        },
        {
            "id": 5,
            "name": "Bell Pepper",
            "category": "vegetables",
            "price": 4.99,
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3JAzZgxrJm_AKlOm1me6_u0PdvCi8NOUMqQ&s",
            "badge": "Sale",
            "stock": 18
        },
        {
            "id": 6,
            "name": "Tomato",
            "category": "vegetables",
            "price": 2.49,
            "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop",
            "badge": "",
            "stock": 25
        },
        
        // 6 Fruits
        {
            "id": 7,
            "name": "Apple",
            "category": "fruits",
            "price": 3.99,
            "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&h=500&fit=crop",
            "badge": "Fresh",
            "stock": 30
        },
        {
            "id": 8,
            "name": "Banana",
            "category": "fruits",
            "price": 1.99,
            "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop",
            "badge": "",
            "stock": 22
        },
        {
            "id": 9,
            "name": "Orange",
            "category": "fruits",
            "price": 4.49,
            "image": "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&h=500&fit=crop",
            "badge": "Sweet",
            "stock": 16
        },
        {
            "id": 10,
            "name": "Strawberry",
            "category": "fruits",
            "price": 5.99,
            "image": "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=500&h=500&fit=crop",
            "badge": "New",
            "stock": 5
        },
        {
            "id": 11,
            "name": "Grapes",
            "category": "fruits",
            "price": 6.49,
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH1ONoi48mafLawV6BSfeHrN7hgTBd7RLnEg7i-9v3ZHP_qnHsarq-W2NguqwGILOO0Mw&usqp=CAU",
            "badge": "Premium",
            "stock": 14
        },
        {
            "id": 12,
            "name": "Mango",
            "category": "fruits",
            "price": 7.99,
            "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&h=500&fit=crop",
            "badge": "Seasonal",
            "stock": 9
        }
    ];
}

function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = productsData.map(product => `
        <div class="product-card" data-category="${product.category}" data-price="${product.price}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                ${product.stock < 10 ? `<span class="badge low-stock">Low Stock</span>` : ''}
            </div>
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)} ${getPriceUnit(product)}</p>
            <button class="btn primary-btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `).join('');

    // Re-attach event listeners after rendering
    attachProductEvents();
}

function getPriceUnit(product) {
    if (product.category === 'fruits') return '/lb';
    if (product.name === 'Lettuce') return '/head';
    return '/lb';
}

function attachProductEvents() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const product = productsData.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
            }
        });
    });
}

function initializeCart() {
    // Make cart functions globally available
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.showOrderPage = showOrderPage;
    window.hideOrderPage = hideOrderPage;
    window.confirmOrder = confirmOrder;
}

function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartDisplay();
    showAddToCartMessage(product.name, quantity);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('hamiMinimarketCart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartDropdown = document.getElementById('cartDropdown');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartDropdown) {
        if (cart.length === 0) {
            cartDropdown.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cartDropdown.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" width="40">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
                </div>
            `).join('') + `
                <button id="viewOrderBtn" class="cart-btn">View Order</button>
                <button id="confirmOrderBtn" class="cart-btn confirm-button">Confirm Order</button>
            `;

            // Re-attach event listeners
            const viewOrderBtn = document.getElementById('viewOrderBtn');
            const confirmOrderBtn = document.getElementById('confirmOrderBtn');
            
            if (viewOrderBtn) {
                viewOrderBtn.addEventListener('click', showOrderPage);
            }
            if (confirmOrderBtn) {
                confirmOrderBtn.addEventListener('click', showOrderPage);
            }
        }
    }
}

function showAddToCartMessage(productName, quantity) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2a9d8f;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = `Added ${quantity} ${productName} to cart!`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function showOrderPage() {
    document.querySelector('main').style.display = 'none';
    document.querySelector('header').style.display = 'none';
    document.getElementById('orderPage').style.display = 'block';
    renderOrderPage();
}

function hideOrderPage() {
    document.getElementById('orderPage').style.display = 'none';
    document.querySelector('header').style.display = 'flex';
    document.querySelector('main').style.display = 'block';
}

function renderOrderPage() {
    const orderList = document.getElementById('orderList');
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const discount = subtotal > 50 ? subtotal * 0.10 : 0;
    const total = subtotal + tax - discount;

    if (!orderList) return;

    if (cart.length === 0) {
        orderList.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Your cart is empty</p>';
    } else {
        orderList.innerHTML = cart.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <span class="order-item-quantity">Qty: ${item.quantity}</span>
                <span style="font-weight: 600; color: #059669; margin-left: 15px;">
                    $${(item.price * item.quantity).toFixed(2)}
                </span>
            </div>
        `).join('');
    }

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('discount').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

function confirmOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    document.getElementById('orderSuccess').style.display = 'flex';
    cart = [];
    saveCart();
    updateCartDisplay();
    
    // Hide order page and show success message
    document.getElementById('orderPage').style.display = 'none';
}

function setupEventListeners() {
    // Order page buttons
    const finalConfirmOrder = document.getElementById('finalConfirmOrder');
    const backToIndex = document.getElementById('backToIndex');
    const continueShopping = document.getElementById('continueShopping');

    if (finalConfirmOrder) {
        finalConfirmOrder.addEventListener('click', confirmOrder);
    }
    
    if (backToIndex) {
        backToIndex.addEventListener('click', hideOrderPage);
    }
    
    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            document.getElementById('orderSuccess').style.display = 'none';
            document.querySelector('header').style.display = 'flex';
            document.querySelector('main').style.display = 'block';
        });
    }

    setupFilters();
    setupMobileMenu();
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const priceValue = document.getElementById('priceValue');
    const clearFiltersBtn = document.getElementById('clearFilters');

    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter && priceValue) {
        priceValue.textContent = `$${priceFilter.value}`;
        priceFilter.addEventListener('input', () => {
            priceValue.textContent = `$${priceFilter.value}`;
            filterProducts();
        });
    }
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearAllFilters);
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;
    const maxPrice = parseFloat(document.getElementById('priceFilter').value);
    
    const productCards = document.querySelectorAll('.product-card');
    let hasVisibleProducts = false;

    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productPrice = parseFloat(card.dataset.price);
        const productCategory = card.dataset.category;

        const matchesSearch = productName.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
        const matchesPrice = productPrice <= maxPrice;

        if (matchesSearch && matchesCategory && matchesPrice) {
            card.style.display = 'block';
            hasVisibleProducts = true;
        } else {
            card.style.display = 'none';
        }
    });

    const noResultsMessage = document.getElementById('noResultsMessage');
    if (noResultsMessage) {
        noResultsMessage.style.display = hasVisibleProducts ? 'none' : 'block';
    }
}

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priceFilter').value = 10;
    document.getElementById('priceValue').textContent = '$10';
    filterProducts();
}

function setupMobileMenu() {
    const menuIcon = document.querySelector('.menu');
    const sideMenu = document.querySelector('.side-menu');
    const closeBtn = document.querySelector('.close-btn');

    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            sideMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('click', (e) => {
        if (sideMenu.classList.contains('open') && 
            !sideMenu.contains(e.target) && 
            !menuIcon.contains(e.target)) {
            sideMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);