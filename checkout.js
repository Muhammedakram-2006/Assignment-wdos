function loadOrder() {
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    if (!order) return;
  
    const tbody = document.querySelector('#orderSummary tbody');
    let total = 0;
    order.forEach(item => {
      if (parseInt(item.quantity) > 0) {
        const cost = item.quantity * item.price;
        total += cost;
        tbody.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${cost.toFixed(2)}</td></tr>`;
      }
    });
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
  }
  
  function pay() {
    const requiredFields = ['name', 'email', 'address', 'city', 'postcode', 'cardNumber', 'expiry', 'cvv'];
    let valid = true;
  
    requiredFields.forEach(id => {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        input.style.border = '2px solid red';
        valid = false;
      } else {
        input.style.border = '';
      }
    });
  
    if (!valid) {
      alert('Please fill out all fields correctly!');
      return;
    }
  
    const confirmation = document.getElementById('confirmation');
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days delivery estimate
  
    confirmation.innerHTML = `<h3>Thank you for your purchase!</h3>
      <p>Your order will be delivered by <strong>${deliveryDate.toDateString()}</strong>.</p>`;
    confirmation.style.display = 'block';
  
    document.getElementById('checkoutForm').style.display = 'none';
  }
  
  window.onload = loadOrder;
  