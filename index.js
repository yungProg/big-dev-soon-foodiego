const slider = document.querySelector(".slider")
const deliveryMethod = document.querySelectorAll(".delivery-method")
const cart = document.querySelector(".cart")
const cartOpen = document.querySelector('.cart-open')

function slide(index){
  deliveryMethod.forEach( item => item.classList.remove("active"))
  deliveryMethod[index].classList.add('active')
  index == 0 ? slider.classList.remove('slide-right') : slider.classList.add('slide-right')
}

cart.addEventListener('click', () => {
  cartOpen.classList.toggle('hide')
})