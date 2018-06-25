/* mapApp.js -- stable */

/**
 * Create constant self variable that store function owner or "this".
 */

const self = this;


/**
 *  Declare Map View Model.
 */
function appViewModel() {

    /**
     * Create KO observables for the following:
     * service, icons, placeType, placeCategory, lat/lng, Weather API div, localLocation, placeArray(markers)
     */
    self.service = ko.observable();
    self.icons = ko.observable();
    self.placeType = ko.observable("");
    self.placeCategory = ko.observable();
    self.allPlaces = ko.observableArray([]);

    self.lat = ko.observable('');
    self.lng = ko.observable('');

    self.showWeatherInfo = ko.observable(true);
    self.showMapOptions = ko.observable(false);


    self.localLocation = new google.maps.LatLng(40.7058683, -74.0135793);
    self.placeArray = ko.observableArray([]);


    /**
     * Declare Global Variables for mp(map), infoWindow, trafficLayer and mpStartUpTimer
     */
    var mp, infoWindow;
    var trafficLayer = new google.maps.TrafficLayer();
    var mpStartUpTimer = window.setTimeout(mapException, 6000);


    /* Seach Option Show */
    self.fadeTag = function (data, event) {
        self.showMapOptions(!self.showMapOptions());
        self.showWeatherInfo(!self.showWeatherInfo()); /* http://jsfiddle.net/FgVxY/672/ */
        clearMarker();
    };


    /**
     * Start Map App
     */
    self.initMp = function () {
        weather(); // Call Weather API inside the init function.

        /**
         * Google Map's Style Theme: Aquamarine
         */
        var styleTheme = [{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#606060"
                }]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                    "color": "#f2f2f2"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    },
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{
                        "hue": "#ff0000"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text",
                "stylers": [{
                        "hue": "#ff0000"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "visibility": "on"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.stroke",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "all",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#a9c7db"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#1e7393"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "on"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.text",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.text.fill",
                "stylers": [{
                        "visibility": "on"
                    },
                    {
                        "color": "#1b5d51"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "on"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [{
                        "hue": "#ff0000"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "on"
                }]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{
                        "color": "#1e6d78"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ];

        // Map Declaration Call
        mp = new google.maps.Map(document.getElementById('mp-c'), {
            zoom: 15,
            styles: styleTheme,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // Map Traffic Feature
        trafficLayer.setMap(mp);

        // Declare infoWindow for user's geolocation.
        infoWindow = new google.maps.InfoWindow();

        setCurrentLocation();
        centerMap(localLocation);

        // Timer to determine the startup quality of Google Map API
        google.maps.event.addListener(mp, 'tilesloaded', function () {
            window.clearTimeout(mpStartUpTimer);
        });
    };

    // If Google Map failed to load it will load mapException.
    function mapException() {
        alert("Google Maps Fails to Load. Please Check your Internet Connection");
    }

    // Calling initMp to initialize
    self.initMp();

    /**
     * Dark Sky API declaration under weather function.
     */
    function weather() {
        var location = document.getElementById("location");
        var apiKey = '2e3f338bc2f1aca78c89eed53e8c1358';
        var url = 'https://api.forecast.io/forecast/';

        // Utilize current location of the user's browser
        navigator.geolocation.getCurrentPosition(success, error);

        // If location and apiKey is sound it will perform weather data gathering.
        function success(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            location.innerHTML = 'Latitude is ' + latitude + '° Longitude is ' + longitude + '°';

            $.getJSON(url + apiKey + "/" + latitude + "," + longitude + "?callback=?", function (data) {
                var icons = new Skycons({
                    "color": "#1BA5DF"
                });
                var icon = data.currently.icon;


                $('#temp').html(data.currently.temperature + '°F');
                $('#minutely').html(data.currently.summary);
                $('#tmz').html(data.daily.summary);
                $('#alrt').html(data.currently.alert);

                //add to skyicons the weather information
                icons.add(document.getElementById("iconW"), icon);
                //start animation
                icons.play();
            });
        }

        // If location cannot be detected, API key is invalid and other erroneous factors happen it will inform the user that it failed to load the API.
        function error() {
            alert("Unable to retrieve your location. Please check your web browser or your internet connection");
            console.log(location.innerHTML);
        }
        // Location loader
        location.innerHTML = "Finding Your Current Location...";
    }

    /**
     * A function that adjust the map's location and resize event.
     */
    function centerMap(location) {
        mp.setCenter(location);
        google.maps.event.trigger(mp, 'resize');
    }

    /**
     * A geolocation loader for Google Map and Google Place.
     */
    function setCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var infoLoc = '<b>' + 'Your Location' + '</b>';

                self.pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Start getPlaces function to gather place of interest in the current browser's location.
                getPlaces();

                infoWindow.setPosition(pos);
                infoWindow.setContent(infoLoc);
                infoWindow.open(mp, mk);
                mp.setCenter(pos);

                // https://stackoverflow.com/questions/15096461/resize-google-maps-marker-icon-image
                var icons = {
                    url: "/img/icons/curloc.svg",
                    size: new google.maps.Size(20, 32),
                    origin: new google.maps.Point(0, 0),
                    scaledSize: new google.maps.Size(25, 25)
                };

                var mk = new google.maps.Marker({
                    icon: icons,
                    position: pos,
                    map: mp,
                    title: 'Current Location',
                    animation: google.maps.Animation.BOUNCE
                });

                mk.addListener('click', function () {
                    infoWindow.open(mp, mk);
                    mp.setCenter(pos);
                });
            }, function () {
                handleLocationError(true, infoWindow, mp.getCenter());
            });
        } else {
            handleLocationError(false, infoWindow, mp.getCenter());
        }
    }

    /**
     * Geolocation error handler.
     */
    var handleLocationError = function (browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(mp);
    };

    /**
     * A function that gathers places of interest (police, hospital and fire stations) in regards to radius of the user's current location.
     */
    function getPlaces() {
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(mp);

        var Police = {
            location: pos,
            radius: 2500,
            types: ['police']
        };

        var Hospital = {
            location: pos,
            radius: 2000,
            types: ['hospital']
        };

        var FireStations = {
            location: pos,
            radius: 2000,
            types: ['fire_station']
        };

        /**
         * Pushes the address and phone number of placeCategory to the list  via getAllPlaces and callback for markers.
         * It also utilize the radio box to filter getAllPlaces through placeType.
         * */
        self.placeCategory = ko.computed(function (place) {
            if (self.placeType() == "Hospital") {
                service.nearbySearch(Hospital, callback);
                console.log("hospital");
            }

            if (self.placeType() == "Police") {
                service.nearbySearch(Police, callback);
                console.log("police");
            }

            if (self.placeType() == "FireStations") {
                service.nearbySearch(FireStations, callback);
                console.log("fire_station");
            }
            return [];
        }, this);
    }

    // Pushes the name of places dictated by place types from google's place API.
    function getAllPlaces(place) {
        var myPlace = {};
        myPlace.name = place.name;
        myPlace.place_id = place.place_id;

        console.log(myPlace);
        allPlaces.push(myPlace);
    }

    // Creates all list a link to open the marker defined from allPlaces (see getAllPlaces function).
    self.listClick = function (place) {
        var marker;
        var streetVS = new google.maps.StreetViewService();
        var radius = 50;

        for (var e = 0; e < placeArray.length; e++) {
            if (place.place_id === placeArray[e].place_id) {
                marker = placeArray[e];
                break;
            }
        }

        // Initiates the panoramic street view for the infowindow in each list.
        var getStreetView = function (data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                var contentView = '<div class="pano-info-box">' + '<b class="pano-header">' + place.name + '</b>' + '<br>' + '<div id="pano"></div>' + '</div>';
                infowindow.setContent(contentView);
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: 34,
                        pitch: 10
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + '<p><b>' + place.name + '</b></p>' + '</div>' + '<div><b><i>Street View Not Available!</i></b></div>');
                alert("Street View Not Available for " + place.name);
            }
        };

        // Use Street View Service API to obtain marker position, pano radius and getStreetView instances.
        streetVS.getPanoramaByLocation(marker.position, radius, getStreetView);

        // Open infowindow in per place list click.
        infowindow.open(mp, marker);

        // Move or center the map into the marker's position at the same time run marker animation.
        mp.panTo(marker.position);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1450);
    };

    /**
     * Its a function that supports getAllPlaces function in regards 
     * to the location attributes of each listed place and markers.
     */
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            clearMarker();
            self.allPlaces.removeAll();
            bounds = new google.maps.LatLngBounds();

            results.forEach(function (place) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    bounds.extend(new google.maps.LatLng(
                        place.geometry.location.lat(),
                        place.geometry.location.lng()));
                }
            });
            mp.fitBounds(bounds);
            results.forEach(getAllPlaces);
        }
    }

    /**
     * A function that clearMarkers in the Google Map.
     */
    function clearMarker() {
        for (var i = 0; i < placeArray.length; i++) {
            placeArray[i].setMap(null);
        }
        self.placeArray = [];
    }

    /**
     * A funciton to generate markers that open infowindow details view 
     * (i.e. phone number and exact address).
     */
    function createMarker(place) {
        var icons = {
            url: place.icon,
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        var marker = new google.maps.Marker({
            map: mp,
            position: place.geometry.location,
            icon: icons,
            place_id: place.place_id,
            animation: google.maps.Animation.DROP
        });

        // Declare variable to initiate Google Place Service.
        var detailsService = new google.maps.places.PlacesService(mp);

        google.maps.event.addListener(marker, 'click', function () {
            /* https://developers.google.com/maps/documentation/javascript/examples/place-details */
            /* https://developers.google.com/web/fundamentals/native-hardware/click-to-call/ */
            detailsService.getDetails({
                placeId: place.place_id
            }, function (place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    google.maps.event.addListener(marker, 'click', function () {
                        console.error(status);
                        return;
                    });
                }

                // Address logic for the specific marker if the marker is registered to Google details. Otherwise use place.vicinity
                var adrs;
                if (place.vicinity !== undefined) {
                    adrs = place.vicinity;
                } else if (place.formatted_address !== undefined) {
                    adrs = place.formatted_address;
                }

                infowindow.setContent('<div><strong class="infobox-address-head">' + place.name + '</strong><br>' + '<strong class="infobox-address">' +
                    adrs + '</strong>' + '<br>' + '<strong class="infobox-address-phone">' + '<hr>' +'Phone: ' + '<a href="tel:+1-' +
                    place.formatted_phone_number + '">' + place.formatted_phone_number + '</a>' + '</strong>' +'</div>');
            });
            infowindow.open(mp, this);
            mp.panTo(marker.position);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1450);
        });

        // Push all markers to placeArray observable.
        placeArray.push(marker);
        return marker;
    }

}


/**
 * Start  appStart in the beginning of the app including the view model.
 */
function appStart() {
    ko.applyBindings(new appViewModel());
}