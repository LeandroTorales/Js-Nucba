const iconHamburguer = document.querySelector(".container--iconBars");
const ulHamburguesaMenu = document.querySelector(".menu--hamburguerUl");
const blur = document.querySelector(".onBlur");
const cartIcon = document.querySelector("#cart--icon__navbar");
const linksNavbar = document.querySelectorAll(".link--navbar");
const containerCart = document.querySelector(".container--cart");

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

const init = () => {
  document.addEventListener("DOMContentLoaded", toggleNavLinksForEach);
  iconHamburguer.addEventListener("click", toggleNav);
  blur.addEventListener("click", toggleNav);
  cartIcon.addEventListener("click", toggleCart);
};

init();
