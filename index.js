const slider = document.querySelector(".slider")
const deliveryMethod = document.querySelectorAll(".delivery-method")
const cart = document.querySelector(".cart")
const cartOpen = document.querySelector('.cart-open')
const foodFiltersContainer = document.querySelector('.food-filters-container')

const foods = [
    {
      id: 1,
      type: 'Asian',
      img: '/assets/food-icons/asian-icon.svg',
    },
    {
      id: 2,
      type: 'Breakfast',
      img: '/assets/food-icons/breakfast-icon.svg',
    },
    {
      id: 3,
      type: 'Burger',
      img: '/assets/food-icons/burger-icon.svg',
    },
    {
      id: 4,
      type: 'Dessert',
      img: '/assets/food-icons/dessert-icon.svg',
    },
    {
      id: 5,
      type: 'Fast food',
      img: '/assets/food-icons/fast-food-icon.svg',
    },
    {
      id: 6,
      type: 'Healthy',
      img: '/assets/food-icons/healthy-icon.svg',
    },
    {
      id: 7,
      type: 'Ice cream',
      img: '/assets/food-icons/ice-cream-icon.svg',
    },
    {
      id: 8,
      type: 'Indian',
      img: '/assets/food-icons/indian-icon.svg',
    },
    {
      id: 9,
      type: 'Italian',
      img: '/assets/food-icons/italian-icon.svg',
    },
    {
      id: 10,
      type: 'Korean',
      img: '/assets/food-icons/korean-icon.svg',
    },
    {
      id: 11,
      type: 'Pizza',
      img: '/assets/food-icons/pizza-icon.svg',
    },
    {
      id: 12,
      type: 'Seafood',
      img: '/assets/food-icons/seafood-icon.svg',
    },
    {
      id: 13,
      type: 'Vegan',
      img: '/assets/food-icons/vegan-icon.svg',
    },
    {
      id: 14,
      type: 'Sushi',
      img: '/assets/food-icons/sushi-icon.svg',
    },
    
  ]

function slide(index){
  deliveryMethod.forEach( item => item.classList.remove("active"))
  deliveryMethod[index].classList.add('active')
  index == 0 ? slider.classList.remove('slide-right') : slider.classList.add('slide-right')
}

cart.addEventListener('click', () => {
  cartOpen.classList.toggle('hide')
})

function makeFoodList() {
  foodFiltersContainer.innerHTML = '';
  foods.forEach((foodType, index) => {
    const foodElement = document.createElement('button');
    foodElement.classList.add('food-type');
    foodElement.innerHTML = `
      <img src=${foodType.img} alt=${foodType.type} />
      <span>${foodType.type}</span>
    `
    foodElement.addEventListener("click", () => selectCategory(index))
    foodFiltersContainer.appendChild(foodElement)
  })
}

function selectCategory(index) {
  const foodTypes = document.querySelectorAll('.food-type')
  foodTypes.forEach((item) => {
    item.classList.remove("active")
  })
  foodTypes[index].classList.add('active')
}

makeFoodList()

function moveLeft() {
  foodFiltersContainer.scrollLeft -= 250;
}

function moveRight() {
  foodFiltersContainer.scrollLeft += 250;
}