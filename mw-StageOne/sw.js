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
                    "/img/1.png",
                    "/img/2.png",
                    "/img/3.png",
                    "/img/4.png",
                    "/img/5.png",
                    "/img/6.png",
                    "/img/7.png",
                    "/img/8.png",
                    "/img/9.png",
                    "/img/10.png",
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
                    if (event.request.url.indexOf(".png") > -1) {
                        return caches.match("/img/na.png");
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