import { restaurants } from "./restaurants.js"

const slider = document.querySelector(".slider")
const deliveryMethod = document.querySelectorAll(".delivery-method")
const cart = document.querySelector(".cart")
const cartOpen = document.querySelector('.cart-open')
const foodFiltersContainer = document.querySelector('.food-filters-container')
const toggleSortPopUp = [document.querySelector(".sort-by"), document.querySelector('.cancel')]
const sortPopUpBox = document.querySelector(".sort")
const freeDeliveryRadio = document.querySelector('.free-delivery')
const stars = document.querySelectorAll('.star-wrapper')
const renderedRestaurants = document.querySelector('.displayed-restaurants')
const restaurantCardTemplate = document.querySelector('.card-template')

let methodOfDelivery = 'delivery-btn';
let currentRating = null;
let isOpenNow = true;
let deliveryFee
let cuisine

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

let matchingRestaurants = []

function slide(index){
  deliveryMethod.forEach( item => item.classList.remove("active"))
  deliveryMethod[index].classList.add('active')
  if (index == 0) {
    slider.classList.remove('slide-right')
    freeDeliveryRadio.removeAttribute('disabled')
    methodOfDelivery = 'delivery-btn'
    document.querySelectorAll('.deliver-info-container').forEach(item => item.classList.remove('hide'))
    document.querySelectorAll('.restaurant-address').forEach(item => item.classList.add('hide'))
  } else {
    slider.classList.add('slide-right')
    freeDeliveryRadio.setAttribute('disabled', true)
    methodOfDelivery = 'pickup-btn'
    document.querySelectorAll('.deliver-info-container').forEach(item => item.classList.add('hide'))
    document.querySelectorAll('.restaurant-address').forEach(item => item.classList.remove('hide'))
  }
}

document.getElementById('delivery-btn').addEventListener('click', () => slide(0))
document.getElementById('pickup-btn').addEventListener('click', () => {
  slide(1)
  freeDeliveryRadio.checked = false
})

function highlightStars(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('filled')
    } else {
      star.classList.remove('filled')
    }
  })
}

stars.forEach((star) => {
  star.addEventListener('mouseover', () => {
    const value = star.getAttribute('data-value')
    highlightStars(value)
  })
  star.addEventListener('click', () => {
    currentRating = star.getAttribute('data-value')
    filterRestaurants(cuisine, isOpenNow, deliveryFee, currentRating)
    displayRestaurants()
  })
  star.addEventListener('mouseout', () => highlightStars(currentRating))
})

cart.addEventListener('click', () => {
  cartOpen.classList.toggle('hide')
})

function makeFoodList() {
  foodFiltersContainer.innerHTML = '';
  foods.forEach((foodType, index) => {
    const foodElement = document.createElement('button');
    foodElement.classList.add('food-type');
    foodElement.setAttribute('data-value', `${foodType.type}`)
    foodElement.innerHTML = `
      <img data-value=${foodType.type} src=${foodType.img} alt=${foodType.type} />
      <span data-value=${foodType.type}>${foodType.type}</span>
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

foodFiltersContainer.addEventListener('click', (e) => {
  cuisine = e.target.getAttribute('data-value') || cuisine
  //matchingRestaurants = restaurants.filter(item => item.cuisines.includes(cuisine))
  filterRestaurants(cuisine, isOpenNow, deliveryFee, currentRating)
  displayRestaurants()
})

makeFoodList()

//move left or right
document.querySelector('.scroll.right').addEventListener('click', () => {
  foodFiltersContainer.scrollLeft += 250;
})

document.querySelector('.scroll.left').addEventListener('click', () => {
  foodFiltersContainer.scrollLeft -= 250;
})


toggleSortPopUp.forEach(element => element.addEventListener('click', () => {
  sortPopUpBox.classList.toggle('hide')
}))

matchingRestaurants = restaurants.filter((restaurant) => restaurant.isOpenNow == isOpenNow)

function displayRestaurants() {
  document.querySelector('.number-opened').textContent = `Order from ${matchingRestaurants.length} restaurants`
  renderedRestaurants.innerHTML = ''
  matchingRestaurants.forEach((restaurant) => {
    const clone = restaurantCardTemplate.content.cloneNode(true);
    clone.querySelector('.card-image').src = restaurant.image;
    clone.querySelector('.restaurant-name').textContent = restaurant.name;
    clone.querySelector('.cuisines').textContent = restaurant.cuisines.join(', ')
    clone.querySelector('.rating').textContent = restaurant.rating;
    clone.querySelector('.reviewers').textContent = `(${restaurant.numReviews}+)`;
    clone.querySelector('.delivery-charge').textContent = restaurant.deliveryFee;
    clone.querySelector('.time').textContent = `${restaurant.minDeliveryTime}-${restaurant.maxDeliveryTime} min`
    clone.querySelector('.restaurant-address').textContent = restaurant.address
    renderedRestaurants.appendChild(clone)
  })
}

displayRestaurants()

function filterRestaurants(cuisineSelected, availability, fee, numStars) {
  matchingRestaurants = restaurants.filter((restaurant) => {
    restaurant.cuisines.includes(cuisineSelected) && 
    restaurant.isOpenNow == availability && 
    typeof restaurant.deliveryFee == typeof fee &&
    numStars - restaurant.rating <= 1
  })
  displayRestaurants()
}