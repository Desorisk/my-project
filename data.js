let cart = []     
let cartItem = []   

// Display products function
const Displayproducts = (products = cart) => {
  let show = ``
  products.forEach(item => {
    show += `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card pb-4 shadow-sm">
          <img style="height: 230px;" class="object-fit-cover" src="${item.img}" alt="">
          <div class="w-100 px-2 py-2">
            <h5 class="card-title fs-6 fw-bold mt-2">${item.title}</h5>
            <p class="card-text flex-grow-1">${item.location}</p>
            <p class="text-success fw-semibold fs-5">${item.price} $</p>
          </div>
          <div class="w-100 px-2">
            <button type="button" onclick="AddtoCart(${item.id})" class="btn btn-success mt-auto w-100">Add to Cart</button>
          </div>
        </div>
      </div>`
  })
  document.getElementById("show-products").innerHTML = show
}

// Fetch products from JSON
fetch("https://desorisk.github.io/Pre-Wedding_photo.json/Photo_data.json")
  .then(res => res.json())
  .then(data => {
    cart = data
    Displayproducts()
  })
  .catch(err => console.log(err))

// Search products by location
document.getElementById("search-input").addEventListener("input", (e) => {
  const valuesearch = e.target.value.toLowerCase();
  const finds = cart.filter(pro => pro.location.toLowerCase().includes(valuesearch))
  if (finds.length > 0) {
    Displayproducts(finds)
  } else {
    document.getElementById("show-products").innerHTML = `
      <div class="w-100">
        <h2 class="text-center text-danger">Search Products Is Not Found....!</h2>
      </div>`
  }
})

// Add to Cart
function AddtoCart(id) {
  var product = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      product = cart[i];
      break;
    }
  }
  if (product == null) {
    return;
  }

  var existing = null;
  for (var i = 0; i < cartItem.length; i++) {
    if (cartItem[i].id === id) {
      existing = cartItem[i];
      break;
    }
  }

  if (existing) {
    existing.quantity += 1;
  } else {
    cartItem.push({
      id: product.id,
      name: product.title,
      price: product.price,
      img: product.img,    
      quantity: 1
    });
  }

  renderCart();
}

// Remove from Cart
function removeItem(index) {
  cartItem.splice(index, 1);
  renderCart();
}

// Render Cart with + and - buttons
function renderCart() {
  var cartItems = document.getElementById('cart-items');
  var cartTotal = document.getElementById('cart-total');
  var cartCount = document.getElementById('cart-count');

  cartItems.innerHTML = '';
  var total = 0;
  var count = 0;

  for (var i = 0; i < cartItem.length; i++) {
    var item = cartItem[i];
    total += item.price * item.quantity;
    count += item.quantity;

    var div = document.createElement('div');
    div.className = 'd-flex align-items-center mb-3';
    div.innerHTML = 
      '<img src="' + item.img + '" style="width:50px;height:50px;object-fit:cover;margin-right:10px;">' +
      '<div class="flex-grow-1">' +
        '<strong>' + item.name + '</strong><br>' +
        '<span class="text-success">' + item.price + ' $</span>' +
      '</div>' +
      '<div class="d-flex align-items-center gap-1">' +
        '<button class="btn btn-sm btn-secondary" onclick="decreaseQuantity(' + i + ')">-</button>' +
        '<span>' + item.quantity + '</span>' +
        '<button class="btn btn-sm btn-secondary" onclick="increaseQuantity(' + i + ')">+</button>' +
      '</div>' +
      '<button class="btn btn-sm btn-danger ms-2" onclick="removeItem(' + i + ')"><i class="bi bi-trash"></i></button>';

    cartItems.appendChild(div);
  }

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

// Increase quantity in cart
function increaseQuantity(index) {
  cartItem[index].quantity += 1;
  renderCart();
}

// Decrease quantity in cart
function decreaseQuantity(index) {
  if (cartItem[index].quantity > 1) {
    cartItem[index].quantity -= 1;
  } else {
    cartItem.splice(index, 1);
  }
  renderCart();
}


// Checkout
document.getElementById('checkout-btn').addEventListener('click', function() {
  if (cartItem.length === 0) {
    Swal.fire('Your cart is empty!');
  } else {
    Swal.fire({
      title: 'Thank you!',
      text: 'Total: $' + document.getElementById('cart-total').textContent,
      icon: 'success'
    });
    cartItem = [];
    renderCart();
  }
});
