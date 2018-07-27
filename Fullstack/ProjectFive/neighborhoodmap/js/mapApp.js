/* mapApp.js -- stable */

/**
 * Create constant self variable that store function owner or "this".
 */

var self = this;


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

    self.markerCount = ko.observable("");


    /**
     * Declare Global Variables for mp(map), infoWindow, trafficLayer and mpStartUpTimer
     */
    var mp, infoWindow;
    var trafficLayer = new google.maps.TrafficLayer();
    var bikeLayer = new google.maps.BicyclingLayer();

    var mpStartUpTimer = window.setTimeout(mapException, 6000);

    /* Seach Option Show */
    self.fadeTag = function (data, event) {
        self.showMapOptions(!self.showMapOptions());
        self.showWeatherInfo(!self.showWeatherInfo()); /* http://jsfiddle.net/FgVxY/672/ */
        uncheckRadio();
        clearMarker();
    };

    self.uncheckRadio = function () {
        document.getElementById('hospital').parentNode.MaterialRadio.uncheck();
        document.getElementById('police').parentNode.MaterialRadio.uncheck();
        document.getElementById('firestations').parentNode.MaterialRadio.uncheck();
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
        bikeLayer.setMap(mp);

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

    // Initiate google autocomplete text box search
    function searchBar() {
        var input = document.getElementById('search-input');
        var searchTextBox = new google.maps.places.SearchBox(input);

        google.maps.event.addListener(searchTextBox, 'places_changed', function () {
            var places = searchTextBox.getPlaces();
            clearMarker();
            clbckList();
            self.allPlaces.removeAll();

            var bounds = new google.maps.LatLngBounds();

            for (var i = 0, place; i < 10; i++) {
                if (places[i] !== undefined) {
                    place = places[i];

                    getAllPlaces(place);
                    createMarker(place);
                    bounds.extend(place.geometry.location);
                }
            }
            mp.fitBounds(bounds);
            centerMap(mp);
        });
        google.maps.event.addListener(mp, 'bounds_changed', function () {
            var bounds = mp.getBounds();
            searchTextBox.setBounds(bounds);
        });
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

                var origin = new google.maps.Circle({
                    map: mp,
                    radius: Math.sqrt(10) * 100, 
                    fillColor: '#E8453C',
                    fillOpacity: 0.45,
                    center: position,
                    strokeColor: '#801616',
                    strokeOpacity: 0.50
                });

                self.pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Start getPlaces function to gather place of interest in the current browser's location.
                getPlaces();
                listAllPlaces();

                searchBar();

                infoWindow.setPosition(pos);
                infoWindow.setContent(infoLoc);
                infoWindow.open(mp, mk);
                mp.setCenter(pos);


                var mk = new google.maps.Marker({
                    position: pos,
                    map: mp,
                    title: 'Current Location',
                    animation: google.maps.Animation.BOUNCE
                });

                mk.addListener('click', function () {
                    infoWindow.open(mp, mk);
                    mp.setCenter(pos);
                });

                origin.bindTo('center', mk, 'position');
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

        var Hospital = {
            location: pos,
            radius: 2500,
            types: ['hospital']
        };

        var FireStations = {
            location: pos,
            radius: 2500,
            types: ['fire_station']
        };

        var Police = {
            location: pos,
            radius: 2500,
            types: ['police']
        };

        /**
         * Pushes the address and phone number of placeCategory to the list  via getAllPlaces and callback for markers.
         * It also utilize the radio box to filter getAllPlaces through placeType.
         * */
        self.placeCategory = ko.computed(function () {
            if (self.placeType() == "Hospital") {
                service.nearbySearch(Hospital, callback);
            }

            if (self.placeType() == "FireStations") {
                service.nearbySearch(FireStations, callback);
            }

            if (self.placeType() == "Police") {
                service.nearbySearch(Police, callback);
            }
            return [];
        }, this);
    }


    function listAllPlaces() {
        service = new google.maps.places.PlacesService(mp);

        var requestOne = {
            location: pos,
            radius: 2500,
            types: ['hospital']
        };

        var requestTwo = {
            location: pos,
            radius: 2500,
            types: ['fire_station']
        };

        var requestThree = {
            location: pos,
            radius: 2500,
            types: ['police']
        };

        self.placeCategory = ko.computed(function () {
            service.nearbySearch(requestOne, clbckList);
            service.nearbySearch(requestTwo, clbckList);
            service.nearbySearch(requestThree, clbckList);
            return [];
        }, this);
    }

    // Pushes the name of places dictated by place types from google's place API.
    function getAllPlaces(place) {
        var myPlace = {};
        myPlace.name = place.name;
        myPlace.place_id = place.place_id;

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
        var res = results.length;

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            clearMarker();
            self.allPlaces.removeAll();
            bounds = new google.maps.LatLngBounds();

            results.forEach(function (place) {
                place.marker = createMarker(place);
                bounds.extend(new google.maps.LatLng(
                    place.geometry.location.lat(),
                    place.geometry.location.lng()));

                // Reveal number of place type venues in each place type category.
                $(".placepop").html((placeType()) + ": " + res);
            });
            mp.fitBounds(bounds);
            results.forEach(getAllPlaces);
        }
    }


    function clbckList(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            bounds = new google.maps.LatLngBounds();
            results.forEach(function (place) {
                place.marker = createMarker(place);

                // https://stackoverflow.com/questions/24844915/google-maps-marker-show-hide
                $('#hideMrkr').click(function () {
                    if (!place.marker.getVisible()) {
                        place.marker.setVisible(true);
                        if (self.showMapOptions()) {
                            self.allPlaces.removeAll();
                        }
                    } else {
                        place.marker.setVisible(false);
                    }
                });
                bounds.extend(new google.maps.LatLng(
                    place.geometry.location.lat(),
                    place.geometry.location.lng()
                ));
            });

            mp.fitBounds(bounds);
            results.forEach(getAllPlaces);
        }
    }

    // https://stackoverflow.com/questions/37214504/how-to-test-for-google-maps-place-type-with-if-conditional
    function isInArray(a, b) {
        return !!~a.indexOf(b);
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


        var circleHospital = new google.maps.Circle({
            map: mp,
            radius: Math.sqrt(place.rating) * 100,
            fillColor: '#FF0000',
            fillOpacity: 0.5,
            center: place.center,
            strokeColor: '#FFFFFF',
            strokeOpacity: 0.50
        });
        var circlePolice = new google.maps.Circle({
            map: mp,
            radius: Math.sqrt(place.rating) * 100,
            fillColor: '#007ACC',
            fillOpacity: 0.5,
            center: place.center,
            strokeColor: '#FFFFFF',
            strokeOpacity: 0.50
        });
        var circleFire = new google.maps.Circle({
            map: mp,
            radius: Math.sqrt(place.rating) * 100,
            fillColor: '#FC532A',
            fillOpacity: 0.5,
            center: place.center,
            strokeColor: '#FFFFFF',
            strokeOpacity: 0.50
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

                // Address logic for the specific marker if the marker is registered to Google details. Otherwise use place.vicinity.
                var adrs;
                if (place.vicinity == undefined) {
                    adrs = place.vicinity;
                } else if (place.formatted_address !== undefined) {
                    adrs = place.formatted_address;
                }
                // Rating if else conditional error handling.
                var rate;
                if (place.rating == undefined) {
                    rate = "Not Available";
                    alert("Radius and Location Rating Not Available");
                } else if (place.rating !== undefined) {
                    rate = place.rating;
                }
                // Phone number if else conditional error handling.
                var phne;
                if (place.formatted_phone_number == undefined) {
                    phne = "Not Available";
                    alert("Phone Not Available for this Place");
                } else if (place.formatted_phone_number !== undefined) {
                    phne = place.formatted_phone_number;
                }
                // Infowindow that provide place name, place's rate and place's address.
                infowindow.setContent('<div><strong class="infobox-address-head">' + place.name + '</strong><br>' + '<strong class="infobox-address">' +
                    adrs + '</strong>' + '<br>' + '<strong class="infobox-address-phone">' + '<hr>' + 'Phone: ' + '<a href="tel:+1-' +
                    phne + '">' + phne + '</a>' + '</strong>' + '<b>' + '<p class="infobox-rating">'+"Location Rating: "+rate+'</p>'+'</div>');
            });

            infowindow.open(mp, this);
            mp.panTo(marker.position);
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // Radius array filter
            if(isInArray(place.types, "hospital")) {
                circleHospital.bindTo('center', marker, 'position');
            }

            if(isInArray(place.types, "police")) {
                circlePolice.bindTo('center', marker, 'position');
            }

            if(isInArray(place.types, "fire_station")) {
                circleFire.bindTo('center', marker, 'position');
            }

            $('#hideMrkr').click(function () {
                // https://stackoverflow.com/questions/8260029/how-to-remove-circle-from-google-maps-v3
                circleHospital.setMap(null);
                circlePolice.setMap(null);
                circleFire.setMap(null);
            });

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