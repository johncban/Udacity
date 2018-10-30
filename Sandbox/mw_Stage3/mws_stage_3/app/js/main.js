let restaurants,
  neighborhoods,
  cuisines;
var newMap;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.getNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1Ijoiam9obmNiYW4iLCJhIjoiY2poem11ZHgzMHl3MjNxbzMyb201b2czZSJ9.jINrlTD-_84n8ZfDTJR_VA',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers

  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = restaurant => {
  const li = document.createElement('li');
  li.setAttribute("aria-label", "restaurant details");

  const image = document.createElement('img');
  image.className = 'restaurant-img'; // https://stackoverflow.com/questions/15471688/adding-alt-attribute-to-image-in-javascript
  image.alt = `${restaurant.name}'s restaurant photo`;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  console.log(image.src);
  li.append(image);

  const div = document.createElement('div');
  div.className = 'restaurant-text-area';
  li.append(div);


  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;

  //const isFav = (restaurant["is_fav"] && restaurant["is_fav"].toString() === "true") ? true : false;

  /**
   * Source:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
   */
  const imageFav =document.createElement('img');
  imageFav.setAttribute('alt', 'Bookmark');
  imageFav.classList.add('imageFav');
  imageFav.id = restaurant.id;

  


  if(restaurant.is_fav === true) {
    imageFav.setAttribute('src', '/icons/bookmark-ribbon.png');
    imageFav.classList.add('imageFav');
  } else {
    imageFav.setAttribute('src', '/icons/bookmark-outline.png');
    imageFav.classList.add('imageFav');
  }

  imageFav.onclick = function updateFav() {
    if(this.classList.contains('imageFav')) {
      this. src = '/icons/bookmark-ribbon.png';
      this.classList.remove('imageFav');
      DBHelper.updateFav(restaurant.id, true);
    } else {
      this.src='/icons/bookmark-outline.png';
      this.classList.add('imageFav');
      DBHelper.updateFav(restaurant.id, false);
    }
  };

  div.append(name);
  div.append(imageFav);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  div.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  div.append(address);

  const more = document.createElement('button');
  more.innerHTML = 'View Details';
  more.setAttribute(
    "aria-label",
    restaurant.name + ", " + restaurant.neighborhood
  ); // https://stackoverflow.com/questions/36536528/changing-aria-label-based-on-the-binding-of-css-style
  more.onclick = function () {
    const url = DBHelper.urlForRestaurant(restaurant);
    window.location = url;
  };

  div.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);

    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });
}
