const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const totalDisplay = document.getElementById('total');
let cart = {};

async function loadProducts() {
  const response = await fetch('./data.json');
  const products = await response.json();

  products.forEach((product, index) => {
    const div = document.createElement('div');
    div.className = 'product';

    div.innerHTML = `
      <img src="${product.image.thumbnail}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>R$ ${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${index})">Adicionar</button>
    `;

    productsContainer.appendChild(div);
  });

  window.allProducts = products;
}

function addToCart(index) {
  const product = allProducts[index];

  if (!cart[index]) {
    cart[index] = { ...product, quantity: 1 };
  } else {
    cart[index].quantity++;
  }

  renderCart();
}

function removeFromCart(index) {
  delete cart[index];
  renderCart();
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    renderCart();
  }
}

function renderCart() {
  cartContainer.innerHTML = '';
  let total = 0;

  Object.entries(cart).forEach(([index, item]) => {
    const div = document.createElement('div');
    div.className = 'cart-item';

    const subtotal = item.price * item.quantity;
    total += subtotal;

    div.innerHTML = `
      <strong>${item.name}</strong>
      <p>Quantidade: ${item.quantity}</p>
      <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
      <button onclick="changeQuantity(${index}, 1)">+</button>
      <button onclick="changeQuantity(${index}, -1)">-</button>
      <button onclick="removeFromCart(${index})">Remover</button>
    `;

    cartContainer.appendChild(div);
  });

  totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
}

loadProducts();
