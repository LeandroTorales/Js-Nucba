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

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const saveToLocalStorage = (key) => {
  localStorage.setItem("cart", JSON.stringify(key));
};

/* Armado de listeners de navLinks */
const toggleNavLinksForEach = () => {
  linksNavbar.forEach((link) => {
    link.addEventListener("click", function () {
      if (ulHamburguesaMenu.classList.contains("activeHamburguesa")) return toggleNav();
    });
  });
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
  const { id, nameProduct, category, price, stock, imgProduct } = product;
  return `
  
          <div class="container--singleProduct__inCategory" data-id=${id} data-category=${category}>
            <img
              src=${imgProduct}
              ,
              alt="img producto ${nameProduct}"
              class="img--product__cart"
            />
            <div>
              <div>
                <span class="nameProductCategory">${nameProduct}</span>
                <span class="priceCategory">$${price}</span>
              </div>
              <div>
              <button>-</button>
              <span>${stock}</span>
              <button>+</button>
              </div>
              <button class="button--addToCart" data-id=${id} data-nameProduct="${nameProduct}" data-category=${category} data-price=${price} data-stock=${stock} data-imgProduct=${imgProduct}>Agregar</button>
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

/* Listeners de botones de filtrado categorias de productos en main */
const buttonCategorySetListener = () => {
  buttonsCategory.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      renderProductsCategory(btn);
    });
  });
};

/* DEMOSTREACION BORRAR */
saveToLocalStorage([productsArr[0], productsArr[1]]);

/* Funcion que crea el producto en el carrito del localStorage */
const createCartProduct = (product) => {
  cart = [...cart, { ...product, cantidad: 1 }];
};

const setProductToLocalStorage = (e) => {
  if (!e.target.classList.contains("button--addToCart")) return console.log("hola");
  console.log(e.target);
};

/* Listeners para llamar a la funcion que crea el producto en el carrito con los datos del boton presionado */
const categoryListenerForEach = () => {
  containerProductsCategory.forEach((cat) => {
    cat.addEventListener("click", setProductToLocalStorage);
  });
};

/* Template productos en carrito */
const templateRenderObjectCart = (product) => {
  const { id, nameProduct, category, price, stock, imgProduct } = product;
  return `
    <div class="container--product__inCart" data-id=${id} data-category=${category}>
      <img
        src=${imgProduct}
        alt="img producto"
        class="img--product__cart"
      />
      <div class="container--details__productInCart">
        <div>
          <span>${nameProduct}</span>
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
    containerCart.classList.add("cartEmptyClass");
    return (containerCart.innerHTML = `
    <div class="text--emptyCart">
    <p>Ups!, parece que no tienes productos en el carrito, cuando agregues nuestros productos al
    carrito, los verás aquí.</p>
    </div>
    <a href="/index.html" class="redirection__toProducts">
    Ver Productos
    </a>
    `);
  } else {
    containerCart.classList.remove("cartEmptyClass");
    return (containerProductsInCart.innerHTML = cart
      .map((product) => templateRenderObjectCart(product))
      .join(""));
  }
};

const checkStateCart = () => {
  cartRenderConditional();
  saveToLocalStorage(cart);
};

const init = () => {
  window.addEventListener("DOMContentLoaded", toggleNavLinksForEach);
  window.addEventListener("DOMContentLoaded", buttonCategorySetListener);
  window.addEventListener("DOMContentLoaded", cartRenderConditional);
  window.addEventListener("DOMContentLoaded", categoryListenerForEach);
  iconHamburguer.addEventListener("click", toggleNav);
  blur.addEventListener("click", toggleNav);
  cartIcon.addEventListener("click", toggleCart);
  /* cartIcon.addEventListener("click", renderObjectsWithMapCart); */
};

init();
