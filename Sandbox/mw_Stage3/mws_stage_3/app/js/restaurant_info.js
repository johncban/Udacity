let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map("map", {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}", {
          mapboxToken: "pk.eyJ1Ijoiam9obmNiYW4iLCJhIjoiY2poem11ZHgzMHl3MjNxbzMyb201b2czZSJ9.jINrlTD-_84n8ZfDTJR_VA",
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox.streets"
        }
      ).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = callback => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName("id");
  if (!id) {
    // no id found in URL
    error = "No restaurant id in URL";
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.log(error);
        return;
      }
      fillRestaurantHTML();
      getRevFromURL(fillReviewsHTML);
      callback(null, restaurant);
    });
  }
};


/**
 * Get all Reviews
 */
const getRevFromURL = (callback, rev = false) => {
  if (self.restaurant.reviews && !rev) { // restaurant already fetched!
    return callback();
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    console.error(error);
    callback(error, null);
  } else {
    DBHelper.getRevsByResID(id, (error, reviews) => {
      if (error) return;
      self.restaurant.reviews = reviews;
      // fill reviews
      callback(reviews);
    });
  }
}


/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (res = self.restaurant) => {
  const name = document.getElementById("restaurant-name");
  name.innerHTML = res.name;
  name.style.color = "#333"; //https://www.w3schools.com/js/js_htmldom_css.asp
  name.style.margin = "25px 0px 25px 5px";
  name.style.fontSize = "24px";

  const address = document.getElementById("restaurant-address");
  address.innerHTML = res.address;

  const image = document.getElementById("restaurant-img");
  image.className = "restaurant-img";
  image.alt = `${res.name}'s restaurant photo`;
  image.src = DBHelper.imageUrlForRestaurant(res);

  const cuisine = document.getElementById("restaurant-cuisine");
  cuisine.innerHTML = res.cuisine_type;

  // fill operating hours
  if (res.operating_hours) {
    fillRestaurantHoursHTML();
  }
};


/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (
  operatingHours = self.restaurant.operating_hours
) => {
  const hours = document.getElementById("restaurant-hours");
  for (let key in operatingHours) {
    const row = document.createElement("tr");

    const day = document.createElement("td");
    day.innerHTML = key.trim();
    row.appendChild(day);

    const time = document.createElement("td");
    time.innerHTML = operatingHours[key].trim();
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
//const fillReviewsHTML = (error, reviews = self.restaurant.reviews) => {
  const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    //reviews = self.restaurant.reviews, restaurantId = self.restaurant.id;
    //self.restaurant.reviews = reviews;

  /**
   * Modal
   * Source: https://sabe.io/tutorials/how-to-create-modal-popup-box
   */

  const modal = document.querySelector(".modal");
  const trigger = document.querySelector(".trigger");
  const closeButton = document.querySelector(".close-button");

  function toggleModal() {
    modal.classList.toggle("show-modal");
  }

  function windowOnClick(event) {
    if (event.target === modal) {
      toggleModal();
    }
  }

  trigger.addEventListener("click", toggleModal);
  closeButton.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);

  const container = document.getElementById('reviews-container');
  container.innerHTML = '';
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.style.color = "#FDA428"; //https://www.w3schools.com/js/js_htmldom_css.asp
  container.appendChild(title);

  const mod = document.getElementById('rev-form');
  mod.innerHTML = '';

  //container.append(createReviewCreator(self.restaurant.id));
  mod.append(createReviewCreator(self.restaurant.id));

  //debugger;

  /*
  if (error) {
    console.log('Error retrieving reviews', error);
  }
  */


  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  
  const ul = document.createElement('ul')
  ul.id = 'reviews-list';

  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.append(ul);
};
/**
 * Get current reviews from page URL.
 */
fetchReviewsFromURL = (callback, force = false) => {
  const id = getParameterByName('id');

  if (self.restaurant.reviews && !force) { // restaurant already fetched!
    return callback();
  }

  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    console.error(error);
    callback(error, null);
  } else {
    DBHelper.getRevsByResID(id, (error, reviews) => {
      if (error) return;
      self.restaurant.reviews = reviews;
      // fill reviews
      callback(reviews);
    });
  }
}






/**
 * Create review writer form
 * CHECK ISSUE
 */
const createReviewCreator = (id) => {
  /**
   * Modal
   * Source: https://sabe.io/tutorials/how-to-create-modal-popup-box
   */
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close-button");
  const trigger = document.querySelector(".trigger");

  function toggleModal() {
    modal.classList.toggle("show-modal");
  }

  function windowOnClick(event) {
    if (event.target === modal) {
      toggleModal();
    }
  }


  const container = document.createElement('div');
  container.id = 'review_creator'

  const form = document.createElement('div');
  form.id = 'review_form'

  const nameInput = document.createElement('input');
  form.append(wrapInLabel(nameInput, 'Name: '));

  const ratingInput = document.createElement('select');
  const ratingOptions = [1, 2, 3, 4, 5].map(n => {
    const ratingOption = document.createElement('option');
    ratingOption.textContent = n;
    return ratingOption;
  });

  ratingInput.append(...ratingOptions)
  form.append(wrapInLabel(ratingInput, 'Rating: '));

  const reviewInput = document.createElement('textarea');
  reviewInput.rows = 8;
  form.append(wrapInLabel(reviewInput, 'Review: '));

  const reviewSubmit = document.createElement('button');
  reviewSubmit.id = 'review_submit'
  reviewSubmit.textContent = 'Submit'

  reviewSubmit.addEventListener('click', e => {
    const result = {
      restaurant_id: id,
      name: nameInput.value,
      rating: ratingInput.value,
      comments: reviewInput.value
    }
    if (!result.name) {
      alert('The name is missing from the form')
      return;
    }

    console.log("Review Name: ", nameInput.value);

    console.log(result);

    DBHelper.createRev(result)
      .then(result => {
        fetchReviewsFromURL(fillReviewsHTML, true)
      })
      .then(error => {
        if(error) {
          console.log(error);
        }
      })

    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
    trigger.addEventListener("click", toggleModal);
  })
  form.append(reviewSubmit);

  container.append(form);
  return container
}

/**
 * Wrap Input in Label
 */
wrapInLabel = (input, text) => {
  const label = document.createElement('label');
  const span = document.createElement('span');
  span.textContent = text;
  label.append(span);
  label.append(input);
  return label;
}






/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
  const li = document.createElement("li");
  const name = document.createElement("p");
  name.innerHTML = review.name;
  name.className = "restaurant-review-user";
  li.appendChild(name);

  const date = document.createElement("p");
  const create = review.createdAt;
  date.innerHTML = new Date(create).toLocaleString();
  li.appendChild(date);

  const rating = document.createElement("p");
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement("p");
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = window.location;
  a.innerHTML = restaurant.name;
  a.setAttribute("aria-current", "page");
  li.appendChild(a);
  //li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};