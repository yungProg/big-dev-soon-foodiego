import { restaurants } from "./restaurants.js"

const slider = document.querySelector(".slider")
const deliveryMethod = document.querySelectorAll(".delivery-method")
const cart = document.querySelector(".cart")
const cartOpen = document.querySelector('.cart-open')
const foodFiltersContainer = document.querySelector('.food-filters-container')
const toggleSortPopUp = [document.querySelector(".sort-by"), document.querySelector('.cancel')]
const sortPopUpBox = document.querySelector(".sort")
const openCheck = document.getElementById('open-now')
const deliveryFeeCheck = document.getElementById('free-delivery')
const freeDeliveryRadio = document.querySelector('.free-delivery')
const stars = document.querySelectorAll('.star-wrapper')
//sorting criteria
const sortByRecommendation = document.getElementById('recommend')
const sortByAscending = document.getElementById('a-z')
const sortByDescending = document.getElementById('z-a')
const sortByDistance = document.getElementById('distance')
const renderedRestaurants = document.querySelector('.displayed-restaurants')
const restaurantCardTemplate = document.querySelector('.card-template')
const sortSubmit = document.querySelector('.submit')
//search
const searchBar = document.querySelector('.search-bar')

let methodOfDelivery
let currentRating = null;
let isOpenNow = true;
let deliveryFee = null
let cuisine = null
let sortBy = 'recommend'

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
      type: 'Fast Food',
      img: '/assets/food-icons/fast-food-icon.svg',
    },
    {
      id: 6,
      type: 'Healthy',
      img: '/assets/food-icons/healthy-icon.svg',
    },
    {
      id: 7,
      type: 'Ice Cream',
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

openCheck.addEventListener('change', () => {
  isOpenNow = openCheck.checked
  filterRestaurants(cuisine, isOpenNow, deliveryFee, currentRating)
})

deliveryFeeCheck.addEventListener('change', () => {
  deliveryFee = deliveryFeeCheck.checked ? "Free" : null
  filterRestaurants(cuisine, isOpenNow, deliveryFee, currentRating)
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
    foodElement.setAttribute('data-value', `${foodType.type.replace(/\s/g,'-')}`)
    foodElement.innerHTML = `
      <img data-value=${foodType.type.replace(/\s/g,'-')} src=${foodType.img} alt=${foodType.type} />
      <span data-value=${foodType.type.replace(/\s/g,'-')}>${foodType.type}</span>
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
  cuisine = e.target.getAttribute('data-value').replace(/-/g,' ') || cuisine  
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

  if (availability) {
    matchingRestaurants = restaurants.filter(restaurant => restaurant.isOpenNow === availability);
  } else {
    matchingRestaurants = [...restaurants]
  }
  if (fee) {
    const result = matchingRestaurants.filter(restaurant => restaurant.deliveryFee === fee)
    matchingRestaurants = [...result]
  }
  if (cuisineSelected) {
    const result = matchingRestaurants.filter(restaurant => restaurant.cuisines.includes(cuisineSelected))
    matchingRestaurants = [...result]
  }
  if (numStars) {
    const result = matchingRestaurants.filter(restaurant => (restaurant.rating - numStars < 1 && restaurant.rating - numStars >= 0))
    matchingRestaurants = [...result]
  }
  sortRestaurants()
  displayRestaurants()  
}

sortByRecommendation.addEventListener('click', (e) => {
  sortBy = e.target.getAttribute('data-value')
})
sortByAscending.addEventListener('click', (e) => {
  sortBy = e.target.getAttribute('data-value')
})
sortByDescending.addEventListener('click', (e) => {
  sortBy = e.target.getAttribute('data-value')
})
sortByDistance.addEventListener('click', (e) => {
  sortBy = e.target.getAttribute('data-value')
})

sortSubmit.addEventListener('click', () => {
  sortRestaurants()
  displayRestaurants()
  document.querySelector('.sort-type').textContent = sortBy
  sortPopUpBox.classList.toggle('hide')
})

function sortRestaurants() {
  if (sortBy == 'Recommend') {
    matchingRestaurants.sort((a, b) => (b.rating * b.numReviews) - (a.rating - a.numReviews))
  } else if (sortBy == 'Alphabetical order (A-Z)') {
    matchingRestaurants.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy == 'Alphabetical order (Z-A)') {
    matchingRestaurants.sort((a, b) => b.name.localeCompare(a.name))
  }else if (sortBy == 'Distance') {
    matchingRestaurants.sort()
  }
}

function renderNoResult() {
  const template = document.querySelector('.no-result-temp')
  const cloneTemp = template.content.cloneNode(true)
  const resetSearchBtn = cloneTemp.querySelector('.reset-search-btn')
  resetSearchBtn.addEventListener('click', () => {
  methodOfDelivery = undefined
  currentRating = null;
  isOpenNow = true;
  deliveryFee = null
  cuisine = null
  sortBy = 'recommend'
  renderedRestaurants.classList.remove('no-result')
  renderedRestaurants.innerHTML = ''
  matchingRestaurants = [...restaurants]
  filterRestaurants(cuisine, isOpenNow, deliveryFee, currentRating)
  })
  renderedRestaurants.classList.add('no-result')
  renderedRestaurants.appendChild(cloneTemp)
}

searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  const result = restaurants.filter(restaurant => ['name', 'cuisines'].some(item => {
    if (item == 'cuisines') {
      return restaurant[item].join(' ').toLocaleLowerCase().includes(e.target.value.trim())
    } else {
      return restaurant[item].toLocaleLowerCase().includes(e.target.value.trim())
    }    
  }))
  matchingRestaurants = [...result]
  sortRestaurants()
  displayRestaurants()
  }
  if (matchingRestaurants.length == 0) {
    renderNoResult()
  }
})