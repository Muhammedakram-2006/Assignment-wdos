// Get references to toggle button and navbar elements
const toggleBtn = document.getElementById('toggle-btn');
const navbar = document.getElementById('navbar');

// Toggle the visibility of the navbar when the button is clicked
toggleBtn.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Function to add an item to the cart
function addToCart(name, price, btnElement) {
  const input = btnElement.previousElementSibling;
  const quantity = parseInt(input.value);
  
  // Validate quantity
  if (!quantity || quantity < 1) {
    alert("Please enter a valid quantity.");
    return;
  }

  const tbody = document.querySelector('#summaryTable tbody');
  let found = false;

  // Check if the item already exists in the cart
  for (const row of tbody.rows) {
    const itemName = row.cells[0].innerText;
    if (itemName === name) {
      // Update existing row quantity and total price
      const currentQty = parseInt(row.cells[2].innerText);
      const newQty = currentQty + quantity;
      row.cells[2].innerText = newQty;
      row.cells[3].innerText = `$${(newQty * price).toFixed(2)}`;
      found = true;
      break;
    }
  }

  // If item not found in cart, add a new row
  if (!found) {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${name}</td>
      <td>$${parseFloat(price).toFixed(2)}</td>
      <td>${quantity}</td>
      <td>$${(price * quantity).toFixed(2)}</td>
      <td><button onclick="removeItem(this)">Remove</button></td>
    `;
  }

  // Update the total cost after changes
  updateCartTotal();
}

// Function to update the total price in the cart
function updateCartTotal() {
  const tbody = document.querySelector('#summaryTable tbody');
  let total = 0;

  // Sum all row totals
  for (const row of tbody.rows) {
    const totalCell = row.cells[3];
    if (totalCell) {
      const amount = parseFloat(totalCell.innerText.replace('$', '')) || 0;
      total += amount;
    }
  }

  // Update total price display or warn if element is missing
  const totalPriceElement = document.getElementById('totalPrice');
  if (totalPriceElement) {
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
  } else {
    console.warn("Total price element not found!");
  }
}

// Function to remove a cart item
function removeItem(btn) {
  const row = btn.closest('tr');
  row.remove(); // Remove row from table
  updateCartTotal(); // Recalculate total
}

// Function to save the current cart as favourite
function saveFavourite() {
  const tbody = document.querySelector('#summaryTable tbody');
  const favourite = [];

  // Collect data from each row into an array
  for (const row of tbody.rows) {
    const name = row.cells[0].innerText;
    const price = parseFloat(row.cells[1].innerText.replace('$', ''));
    const quantity = parseInt(row.cells[2].innerText);
    favourite.push({ name, price, quantity });
  }

  if (favourite.length === 0) {
    alert("Cart is empty, cannot save.");
    return;
  }

  // Save data to localStorage
  localStorage.setItem('favouriteOrder', JSON.stringify(favourite));
  alert("Favourite order saved!");
}

// Function to apply a saved favourite order to the cart
function applyFavourite() {
  const favourite = JSON.parse(localStorage.getItem('favouriteOrder'));

  // Check if data exists
  if (!favourite || favourite.length === 0) {
    alert("No favourite order saved.");
    return;
  }

  const tbody = document.querySelector('#summaryTable tbody');
  tbody.innerHTML = ''; // Clear current cart

  // Add each item from the saved favourites to the cart
  favourite.forEach(item => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td><button onclick="removeItem(this)">Remove</button></td>
    `;
  });

  updateCartTotal(); // Update total after loading
}

// Function to finalize the order and redirect to checkout
function buyNow() {
  const tbody = document.querySelector('#summaryTable tbody');
  const orderData = [];

  // Collect order information
  for (const row of tbody.rows) {
    orderData.push({
      name: row.cells[0].innerText,
      price: parseFloat(row.cells[1].innerText.replace('$', '')),
      quantity: parseInt(row.cells[2].innerText)
    });
  }

  if (orderData.length === 0) {
    alert("Cart is empty.");
    return;
  }

  // Save current order and redirect
  localStorage.setItem('currentOrder', JSON.stringify(orderData));
  window.location.href = 'checkout.html';
}
