const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal"); // modal
const cartItemsContainer = document.getElementById("cart-items"); // itens carrinho
const cartTotal = document.getElementById("cart-total"); // total
const checkoutBtn = document.getElementById("checkout-btn"); // finalizar pedido
const closemodalBtn = document.getElementById("close-modal-btn"); // fechar modal
const closeCounter = document.getElementById("cart-count"); // quantidade no carrinho
const name = document.getElementById("name"); //nome

let cart = [];

// aparecer o modal
cartBtn.addEventListener("click", function () {
  updateCartmodal();
  cartModal.style.display = "flex";
});

//fechar modal
closemodalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// produtos do menu
// event: mostra o elemento html q vc clicou
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  // clicou no botao de adicionar
  // se clicar fora do botao ele nao mostra o preço nem o nome, ele so apareça quando vc clicar no botao de carriinho verde
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    // adicionar no carrinho
    addToCart(name, price);
  }
});

// função add no carrinho
function addToCart(name, price) {
  // vai verificar se o item ja existe na nossa lista(dentro do cart)
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    //se o item existir ele aumenta a quantidade mais um
    existingItem.quant += 1;
  } else {
    cart.push({
      name,
      price,
      quant: 1,
    });
  }
  updateCartmodal();
}

//  atualiza o carrinho
function updateCartmodal() {
  // zera tudo que tem na div
  cartItemsContainer.innerHTML = "";
  // começa o total em 0
  let total = 0;

  // percorrendo alista do carrinho
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");

    //   montando a div
    cartItemElement.innerHTML = `
     <div>
  <div>
    <p>${item.name}</p>
    <p>${item.quant}</p>
    <p>${item.price}</p>
  </div>
  
  <div>
    <button>
      Remover
    </button>
  </div>
</div>
      `;

    cartItemsContainer.appendChild(cartItemElement);
  });
}

// array: lista de items
