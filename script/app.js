import { productsArr } from "./dataObjects.js";
const iconHamburguer = document.querySelector(".container--iconBars");
const ulHamburguesaMenu = document.querySelector(".menu--hamburguerUl");
const blur = document.querySelector(".onBlur");
const cartIcon = document.querySelector("#cart--icon__navbar");
const linksNavbar = document.querySelectorAll(".link--navbar");
const containerCart = document.querySelector(".container--cart");
const buttonsCategory = document.querySelectorAll(".button--category");
const overflowBody = document.querySelector("body");
const containerProductsInCart = document.querySelector(".container--all__productsCart");
const containerProductsCategory = document.querySelectorAll(".container--products__inCategory");
const buttonPurchaseCart = document.querySelector(".button--finish__purchase");
const emptyCart = document.querySelector(".empty--cart__button");
const containerProductsCart = document.querySelector(".container--products__cart");
const cartEmptyContainer = document.querySelector(".cart--empty__container");
const subtotalPriceContainer = document.querySelector(".subtotal--price__cart");
const freeShippingContainer = document.querySelector(".free--shipping__cart");
const totalPriceContainer = document.querySelector(".total--price__cart");
const modalPurchase = document.querySelector(".modal--purchase__container");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const saveToLocalStorage = (key) => {
  localStorage.setItem("cart", JSON.stringify(key));
};

/* Intercambio de clases navbar y carrito */
const toggleNav = () => {
  if (!window.location.href.includes("ubicacion")) {
    containerCart.classList.toggle("hideCart");
  }
  ulHamburguesaMenu.classList.toggle("activeHamburguesa");
  blur.classList.toggle("active");
};

/* Intercambio de clases y carrito */
const toggleCart = () => {
  containerCart.classList.toggle("activeCart");
  overflowBody.classList.toggle("activeHiddenOverflow");
  if (ulHamburguesaMenu.classList.contains("activeHamburguesa")) return toggleNav();
};

/* Template categoria productos en main section */
const renderTemplateCategory = (product) => {
  const { id, nameproduct, category, price, stock, imgProduct } = product;
  return `
  
          <div class="container--singleProduct__inCategory" data-id=${id} data-category=${category}>
            <img
              src=${imgProduct}
              ,
              alt="img producto ${nameproduct}"
              class="img--product__cart"
            />
            <div>
              <div>
                <span class="nameproductCategory">${nameproduct}</span>
                <span class="priceCategory">$${price}</span>
              </div>
              <div>
              <button class="minus--button">-</button>
              <span class="quantity--handler">1</span>
              <button class="plus--button" data-id=${id}>+</button>
              </div>
              <button class="button--addToCart" data-idstring=${id} data-nameproduct="${nameproduct}" data-category="${category}" data-pricestring=${price} data-stockstring=${stock} data-imgProduct=${imgProduct}>Agregar</button>
            </div>
          </div>
  `;
};

/* Lógica de renderizado de productos en main section */
const renderProductsCategory = (btn) => {
  const buttonPressDataset = btn.dataset.category;
  const filterArrCategory = productsArr.filter((elem) => elem.category === buttonPressDataset);
  const btnSibling = btn.nextElementSibling;
  btnSibling.classList.toggle("activeCategory");
  btn.nextElementSibling.innerHTML = filterArrCategory
    .map((product) => renderTemplateCategory(product))
    .join("");
};

let handlerQuantity = 1;
/* Funcion que crea el producto en el carrito del localStorage */
const createCartProductToCart = (product) => {
  cart = [...cart, { ...product, quantity: Number(handlerQuantity) }];
  handlerQuantity = 1;
};

/* Agregar una unidad en el carrito si existe el producto */
const addUnitProductInCart = (product) => {
  const productInCartQuantity = () => {
    const quantityProduct = cart.find((prod) => prod.id === product.id);
    return quantityProduct.quantity;
  };
  cart = cart.map((productCart) =>
    productCart.id === product.id
      ? {
          ...productCart,
          quantity: Number(handlerQuantity) + productInCartQuantity(),
        }
      : productCart
  );

  handlerQuantity = 1;
};

/* Handler cantidad de producto */
const addQuantityProduct = (e) => {
  /* Se buscka el id del producto para encontrarlo en el array de productos, para saber su stock y asi poder ponerle un limpite al handler */
  const id = Number(e.target.dataset.id);
  if (!e.target.classList.contains("plus--button")) return;
  const stockProductFind = productsArr.find((product) => product.id === id);
  if (e.target.previousElementSibling.innerHTML >= stockProductFind.stock) return;
  e.target.previousElementSibling.innerHTML++;
  return (handlerQuantity = e.target.previousElementSibling.innerHTML);
};

/* Handler cantidad de producto */
const minusQuantityProduct = (e) => {
  if (!e.target.classList.contains("minus--button")) return;
  if (e.target.nextElementSibling.innerHTML <= 1) return;
  e.target.nextElementSibling.innerHTML--;
  return (handlerQuantity = e.target.nextElementSibling.innerHTML);
};

/* Funcion que hace la logica de armar el producto hacia el carrito */
const setProductToLocalStorage = (e) => {
  if (!e.target.classList.contains("button--addToCart")) return;
  const { idstring, nameproduct, category, pricestring, stockstring, imgproduct } =
    e.target.dataset;

  const id = Number(idstring);
  const price = Number(pricestring);
  const stock = Number(stockstring);

  const productObj = new Object({ id, nameproduct, category, price, stock, imgproduct });

  const existProductInCart = (product) => {
    return cart.find((obj) => obj.id === product.id);
  };

  existProductInCart(productObj)
    ? addUnitProductInCart(productObj)
    : createCartProductToCart(productObj);

  /* Quantity product, una vez que se da click y se mandan los datos al localStorage, se hace con dom traveling el reseteo de la cantidad de productos*/
  e.target.previousElementSibling.childNodes[3].innerHTML = 1;

  checkStateCart();
};

/* Template productos en carrito */
const templateRenderObjectCart = (product) => {
  const { id, nameproduct, category, price, stock, imgproduct, quantity } = product;

  return `
    <div class="container--product__inCart" data-id=${id} data-category=${category}>
      <img
        src=${imgproduct}
        alt="img producto"
        class="img--product__cart"
      />
      <div class="container--details__productInCart">
        <div>
          <span>${nameproduct}</span>
          <span>$${price} c/u</span>
        </div>
        <div>
          <span class="quantity--cart">Unidades: ${quantity}</span>      
        </div>
      </div>
      <div data-id=${id}><i class="fa-solid fa-trash-can delete--product__inCart"></i></div>
    </div>
  `;
};

/* Renderizado condicional carrito, si no hay productos muestra un template, sino, muestra los productos que hay en localStorage */
const cartRenderConditional = () => {
  if (!cart.length) {
    if (!window.location.href.includes("ubicacion")) {
      cartEmptyContainer.classList.add("activeCartProducts");
      containerProductsCart.classList.remove("activeCartProducts");
    }
  } else {
    cartEmptyContainer.classList.remove("activeCartProducts");
    containerProductsCart.classList.add("activeCartProducts");
    cart.sort((a, b) => (a.price > b.price ? 1 : -1));
    return (containerProductsInCart.innerHTML = cart
      .map((product) => templateRenderObjectCart(product))
      .join(""));
  }
};

const deleteProductCart = (e) => {
  if (!e.target.classList.contains("delete--product__inCart")) return;
  const id = Number(e.target.parentNode.dataset.id);
  const index = cart.findIndex((elem) => elem.id == id);
  cart.splice(index, 1);
  checkStateCart();
};

const subtotalPriceCart = () => {
  const productsCartQuantity = cart.map((prod) => prod.price * prod.quantity);
  return (subtotalPriceContainer.innerHTML = productsCartQuantity.reduce(
    (acc, cur) => acc + cur,
    0
  ));
};

const freeShippingCart = () => {
  if (subtotalPriceContainer.innerHTML >= 10000)
    return (freeShippingContainer.innerHTML = `GRATIS`);
  return (freeShippingContainer.innerHTML = "$" + Math.round(subtotalPriceCart() / 80));
};

const totalPriceCart = () => {
  if (subtotalPriceContainer.innerHTML >= 10000)
    return (totalPriceContainer.innerHTML = subtotalPriceCart());
  return (totalPriceContainer.innerHTML =
    subtotalPriceCart() + Math.round(subtotalPriceCart() / 80));
};

const cleanCart = () => {
  saveToLocalStorage([]);
  cart = [];
  checkStateCart();
};

const checkStateCart = () => {
  cartRenderConditional(cart);
  saveToLocalStorage(cart);
  subtotalPriceCart();
  freeShippingCart();
  totalPriceCart();
};

/* Armado de listeners de navLinks */
const toggleNavLinksForEach = () => {
  linksNavbar.forEach((link) => {
    link.addEventListener("click", function () {
      if (ulHamburguesaMenu.classList.contains("activeHamburguesa")) return toggleNav();
    });
  });
};

/* Listeners de botones de filtrado categorias de productos en main */
const buttonCategorySetListener = () => {
  buttonsCategory.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      renderProductsCategory(btn);
    });
  });
};

/* Listeners para llamar a la funcion que crea el producto en el carrito con los datos del boton presionado */
const categoryListenerForEach = () => {
  containerProductsCategory.forEach((cat) => {
    cat.addEventListener("click", setProductToLocalStorage);
    cat.addEventListener("click", addQuantityProduct);
    cat.addEventListener("click", minusQuantityProduct);
  });
};

const purchaseCart = () => {
  toggleCart();
  modalPurchase.classList.add("modal--active");
  setTimeout(() => {
    modalPurchase.classList.remove("modal--active");
  }, 3000);
  cleanCart();
};

const init = () => {
  window.addEventListener("DOMContentLoaded", toggleNavLinksForEach);
  window.addEventListener("DOMContentLoaded", buttonCategorySetListener);
  window.addEventListener("DOMContentLoaded", cartRenderConditional);
  window.addEventListener("DOMContentLoaded", categoryListenerForEach);
  iconHamburguer.addEventListener("click", toggleNav);
  blur.addEventListener("click", toggleNav);
  cartIcon.addEventListener("click", toggleCart);
  cartIcon.addEventListener("click", checkStateCart);
  emptyCart.addEventListener("click", cleanCart);
  containerProductsCart.addEventListener("click", deleteProductCart);
  buttonPurchaseCart.addEventListener("click", purchaseCart);
};

init();
