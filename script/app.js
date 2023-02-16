import { productsArr } from "./dataObjects";
const list = productsArr;
console.log("list:", list);
const iconHamburguer = document.querySelector(".container--iconBars");
const ulHamburguesaMenu = document.querySelector(".menu--hamburguerUl");
const blur = document.querySelector(".onBlur");
const cartIcon = document.querySelector("#cart--icon__navbar");
const linksNavbar = document.querySelectorAll(".link--navbar");
const containerCart = document.querySelector(".container--cart");
const containerProductsInCart = document.querySelector(".container--all__productsCart");

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

/* const renderObjectsWithMapCart = () => {
  console.log(productsArr);
};
renderObjectsWithMapCart(); */

const init = () => {
  document.addEventListener("DOMContentLoaded", toggleNavLinksForEach);
  iconHamburguer.addEventListener("click", toggleNav);
  blur.addEventListener("click", toggleNav);
  cartIcon.addEventListener("click", toggleCart);
};

init();
