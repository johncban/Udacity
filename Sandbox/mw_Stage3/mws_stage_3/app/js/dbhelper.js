/**
 *  Open database.
 */

const locDB = idb.open("restaurants", 2, upgradeDB => {
  if (!upgradeDB.objectStoreNames.contains("restaurants")) {
    upgradeDB.createObjectStore("restaurants", {
      keyPath: "id"
    });
  }
  if (!upgradeDB.objectStoreNames.contains("reviews")) {
    const storeReview = upgradeDB.createObjectStore("reviews", {
      keyPath: "id"
    });
    storeReview.createIndex("restaurants", "restaurant_id");
  }
});

class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static get DATABASE_REV_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback, id) {
    let fetchURL;
    if (!id) {
      fetchURL = DBHelper.DATABASE_URL;
    } else {
      fetchURL = DBHelper.DATABASE_URL + "/" + id;
    }

    fetch(fetchURL, {
      method: "GET"
    })
      .then(response => {
        response.json().then(restaurants => {
          console.log("restaurants JSON: ", restaurants);
          callback(null, restaurants);
        });
      })
      .catch(error => {
        callback(`Request failed. Returned ${error}`, null);
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) {
          // Got the restaurant
          callback(null, restaurant);
        } else {
          // Restaurant does not exist in the database
          callback("Restaurant does not exist", null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    callback
  ) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != "all") {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != "all") {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static getNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map(
          (v, i) => restaurants[i].neighborhood
        );
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter(
          (v, i) => neighborhoods.indexOf(v) == i
        );
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter(
          (v, i) => cuisines.indexOf(v) == i
        );
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Save the favorite status in each restaurant.
   */
  static updateFav(id, stat) {
    const linkStat = DBHelper.DATABASE_URL + `/${id}/?is_favorite=${stat}`;

    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      if (error) return;
      restaurant.is_favorite = stat;
      locDB.then(db => {
        const storeName = "restaurants";
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.put(restaurant).then(id => {
          console.log(tx);
          console.log(linkStat);
          console.log(restaurant.is_favorite);
          fetch(linkStat, {
            method: "PUT"
          });
        });
        return tx.complete;
      });
      return restaurant;
    });
  }

  /**
   * Get Restaurant Reviews Per ID
   */

  static getRevsByResID(id, callback) {
    let linkRev = DBHelper.DATABASE_REV_URL + `/reviews/?restaurant_id=${id}`;

    locDB.then(db => {
      const storeName = "reviews";

      fetch(linkRev)
        .then(response => response.json())
        .then(data => callback(null, data))
        //.catch(err => callback(err, null))

        .catch(error => {
          console.warn(error);
          const tx = db.transaction(storeName, "readwrite");
          const store = tx.objectStore(storeName);
          store
            .get(Number(id))
            .then(response => {
              if (response) return callback(null, response);
            })
            .catch(callback);
        });
    });
  }

  /**
   *  Save or Create a Review
   */
  static createRev(review) {
    const linkCreateRev = DBHelper.DATABASE_REV_URL + `/reviews`;

    return fetch(linkCreateRev, {
      method: "POST",
      body: JSON.stringify(review)
    }).catch(error => {
      console.log(error);
      locDB.then(db => {
        const stName = "reviews";
        const tx = db.transaction(stName, "readwrite");
        const st = tx.objectStore(stName);
        st.put(review, stName).then(response => {
          navigator.serviceWorker.ready.then(function(reg) {
            return reg.sync.register("createRev");
          });
        });
      });
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    const imgType = ".webp";
    const id = restaurant.id;
    const resImg = `/img/${id}` + imgType;

    if (id) {
      return resImg;
    } else {
      return `/img/na.webp`;
    }
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker(
      [restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      }
    );
    marker.addTo(newMap);
    return marker;
  }
}
