const iconHamburguer = document.querySelector(".container--iconBars");
const ulHamburguesaMenu = document.querySelector(".menu--hamburguerUl");
const blur = document.querySelector(".onBlur");

const toggleNav = () => {
  ulHamburguesaMenu.classList.toggle("activeHamburguesa");
  blur.classList.toggle("active");
};

const init = () => {
  iconHamburguer.addEventListener("click", toggleNav);
  blur.addEventListener("click", toggleNav);
};
init();
