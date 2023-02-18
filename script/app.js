import { productsArr } from "./dataObjects.js";
const iconHamburguer = document.querySelector(".container--iconBars");
const ulHamburguesaMenu = document.querySelector(".menu--hamburguerUl");
const blur = document.querySelector(".onBlur");
const cartIcon = document.querySelector("#cart--icon__navbar");
const linksNavbar = document.querySelectorAll(".link--navbar");
const containerCart = document.querySelector(".container--cart");
const containerProductsInCart = document.querySelector(".container--all__productsCart");
const buttonsCategory = document.querySelectorAll(".button--category");

const toggleNavLinksForEach = () => {
  linksNavbar.forEach((link) => {
    link.addEventListener("click", function () {
      if (ulHamburguesaMenu.classList.contains("activeHamburguesa")) return toggleNav();
    });
  });
};

const toggleNav = () => {
  ulHamburguesaMenu.classList.toggle("activeHamburguesa");
  blur.classList.toggle("active");
};

const toggleCart = () => {
  containerCart.classList.toggle("activeCart");
  if (ulHamburguesaMenu.classList.contains("activeHamburguesa")) return toggleNav();
};

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
                <span>${nameProduct}</span>
                <span>$${price}</span>
              </div>
              <div>
                <button>+</button>
                <span>${stock}</span>
                <button>-</button>
              </div>
              <button class="button--addToCart">Agregar</button>
            </div>
          </div>
  `;
};

const renderProductsCategory = (btn) => {
  const buttonPressDataset = btn.dataset.category;
  const filterArrCategory = productsArr.filter((elem) => elem.category === buttonPressDataset);
  const btnSibling = btn.nextElementSibling;
  btnSibling.classList.toggle("activeCategory");
  btn.nextElementSibling.innerHTML = filterArrCategory
    .map((product) => renderTemplateCategory(product))
    .join("");
};

const buttonCategorySetListener = () => {
  buttonsCategory.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      renderProductsCategory(btn);
    });
  });
};

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
          <button>+</button>
          <span>${stock}</span>
          <button>-</button>
        </div>
      </div>
      <div><i class="fa-solid fa-trash-can"></i></div>
    </div>
  `;
};

const renderObjectsWithMapCart = () => {
  containerProductsInCart.innerHTML = productsArr
    .map((elem) => templateRenderObjectCart(elem))
    .join("");
};

const init = () => {
  document.addEventListener("DOMContentLoaded", toggleNavLinksForEach);
  document.addEventListener("DOMContentLoaded", buttonCategorySetListener);
  iconHamburguer.addEventListener("click", toggleNav);
  blur.addEventListener("click", toggleNav);
  cartIcon.addEventListener("click", toggleCart);
  cartIcon.addEventListener("click", renderObjectsWithMapCart);
};

init();
