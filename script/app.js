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

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const saveToLocalStorage = (key) => {
  localStorage.setItem("cart", JSON.stringify(key));
};

/* Intercambio de clases navbar y carrito */
const toggleNav = () => {
  containerCart.classList.toggle("hideCart");
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

let handlerQuantity;
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
  const { id, nameproduct, category, price, stock, imgproduct } = product;
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
          <span>$${price}</span>
        </div>
        <div>
        <button>-</button>
        <span>${stock}</span>
        <button>+</button>
        </div>
      </div>
      <div><i class="fa-solid fa-trash-can"></i></div>
    </div>
  `;
};

/* Renderizado condicional carrito, si no hay productos muestra un template, sino, muestra los productos que hay en localStorage */
const cartRenderConditional = () => {
  if (!cart.length) {
    cartEmptyContainer.classList.add("activeCartProducts");
    containerProductsCart.classList.remove("activeCartProducts");
  } else {
    cartEmptyContainer.classList.remove("activeCartProducts");
    containerProductsCart.classList.add("activeCartProducts");
    return (containerProductsInCart.innerHTML = cart
      .map((product) => templateRenderObjectCart(product))
      .join(""));
  }
};

const checkStateCart = () => {
  cartRenderConditional(cart);
  saveToLocalStorage(cart);
};

const cleanCart = () => {
  saveToLocalStorage([]);
  cart = [];
  checkStateCart();
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
};

init();
