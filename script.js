const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal"); // modal
const cartItemsContainer = document.getElementById("cart-items"); // itens carrinho
const cartTotal = document.getElementById("cart-total"); // total
const checkoutBtn = document.getElementById("checkout-btn"); // finalizar pedido
const closemodalBtn = document.getElementById("close-modal-btn"); // fechar modal
const cartCounter = document.getElementById("cart-count"); // quantidade no carrinho
const nome = document.getElementById("name"); // nome
const nomeWarn = document.getElementById("name-warn");

let cart = [];

// Aparecer o modal
cartBtn.addEventListener("click", function () {
  updateCartmodal();
  cartModal.style.display = "flex";
});

// Fechar modal
closemodalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Produtos do menu
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    // Adicionar no carrinho
    addToCart(name, price);
  }
});

// Função add no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
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

// Atualiza o carrinho
function updateCartmodal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Quantidade: ${item.quant}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn bg-red-500 py-2 px-2 rounded" data-name="${
          item.name
        }">
          <p class="font-bold text-white"> Remover </p>
        </button>
      </div>
    `;

    total += item.price * item.quant;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  const button = event.target.closest(".remove-from-cart-btn");
  if (button) {
    const name = button.getAttribute("data-name");
    removeItemCart(name);
  }
});

// função de remover item do carrinho, baseando-se na quantidade
function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];
    if (item.quant > 1) {
      item.quant -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCartmodal();
  }
}

// Atualiza a validação do nome
nome.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue.trim() !== "") {
    nomeWarn.classList.add("hidden");
    nome.classList.remove("border-red-500");
  } else {
    nomeWarn.classList.remove("hidden");
    nome.classList.add("border-red-500");
  }
});

// Finalizar carrinho
// se tentar finalizar o carrinho após o horario
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkOpen();
  if (!isOpen) {
    Toastify({
      text: "O restaurante está fechado no momento. Verifique nosso horário de funcionamento antes de finalizar seu pedido.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  // Verifica se o carrinho está vazio
  // se estiver vazio, o alerta irá aparecer
  if (cart.length === 0) {
    Toastify({
      text: "Seu carrinho está vazio.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  // Verifica se o nome foi preenchido
  // se estiver vazio, ele vai remover a classe hidden e adicionara borda vermelha
  if (nome.value.trim() === "") {
    nomeWarn.classList.remove("hidden");
    nome.classList.add("border-red-500");
    return;
  }

  // Enviar para o zap usando API
  const cartItems = cart
    .map((item) => {
      return ` ${item.name} Quantidade: (${item.quant}) Preço: R$${item.price} |`;
    })
    .join("");

  // variaveis de mensagem e numero
  const message = encodeURIComponent(cartItems);
  const phone = "5585988311261";

  // enviando mensagem e numero
  window.open(
    `https://wa.me/${phone}?text=${message} Nome: ${nome.value}`,
    "_blank"
  );

  // atualiza o carrinho apos o envio
  cart.length = 0;
  updateCartmodal();
});

// Verificar a hora e manipular
function checkOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 7 && hora < 22;
}

// Aviso
const spanItem = document.getElementById("date-span");
const isOpen = checkOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
