var cacheID = "mws-restaurant-stage1";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheID).then(cache => {
            return cache.addAll([
                    "./",
                    "/index.html",
                    "/restaurant.html",
                    "/css/styles.css",
                    "/data/restaurants.json",
                    "/js/",
                    "/js/dbhelper.js",
                    "/js/main.js",
                    "/js/restaurant_info.js",
                    "/register.js",
                    "/sw.js",
                    "/img/",
                    "/img/1.webp",
                    "/img/2.webp",
                    "/img/3.webp",
                    "/img/4.webp",
                    "/img/5.webp",
                    "/img/6.webp",
                    "/img/7.webp",
                    "/img/8.webp",
                    "/img/9.webp",
                    "/img/10.webp",
                ]);

        })
    );
});

self.addEventListener("fetch", event => {
    let cacheRequest = event.request;
    let cacheUrlObj = new URL(event.request.url);
    if (event.request.url.indexOf("restaurant.html") > -1) {
        const cacheURL = "restaurant.html";
        cacheRequest = new Request(cacheURL);
    }
    if (cacheUrlObj.hostname !== "localhost") {
        event.request.mode = "no-cors";
    }

    event.respondWith(
        caches.match(cacheRequest).then(response => {
            return (
                response ||
                fetch(event.request)
                .then(fetchResponse => {
                    return caches.open(cacheID).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                })
                .catch(error => {
                    if (event.request.url.indexOf(".webp") > -1) {
                        return caches.match("/img/na.webp");
                    }
                    return new Response("Application is not connected to the internet", {
                        status: 404,
                        statusText: "Application is not connected to the internet"
                    });
                })
            );
        })
    );
});