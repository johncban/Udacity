# Udacity Project Five - Neighborhood Map (Personal Emergency Map)

This project demonstrates the use of KnockoutJS Framework using Google Map API as the front end map, Google Place API as the backend source of place listings and Dark Sky API for weather information of the map's location.

This project also demonstrate HTML 5's [Geolocation](https://developers.google.com/maps/documentation/javascript/examples/map-geolocation) that detect the user's browser location then Google Map, Dark Sky API and Google Places utilize the geolocation to fetch the required information around the Geolocation's radius.

Under MVVM framework of KnockoutJS, the Model is Geolocation that utilize the said API for View.

## Getting Started

There are two alternative to run the project.

1. Click [here](https://johncban.github.io/neighborhoodmap/) for the live demo. (NOTE: svg icon file requires a server to be visible.)

2. Run Python simpleHTTP Server or ```localserv.py``` in your command line or terminal.

### Prerequisites

In order to run the neighborhood map project gracefully, it wil require the following:


1. [Bower](https://bower.io/) Package Manager
2. Python 2 or 3 (Optional)


### Project Directory Preview

Here are the Project Files Preview that require to run Neighborhood map.

```
.
├── LICENSE
├── README.md
├── bower.json
├── bower_components
│   ├── ic_explore_black_48dp
│   │   └── ic_explore_black_48dp.png
│   ├── jquery.min
│   │   └── jquery.min.js
│   ├── knockout
│   │   └── knockout.js
│   └── material-design-lite
│       ├── LICENSE
│       ├── README.md
│       ├── bower.json
│       ├── gulpfile.babel.js
│       ├── material.css
│       ├── material.js
│       ├── material.min.css
│       ├── material.min.css.map
│       ├── material.min.js
│       ├── material.min.js.map
│       └── package.json
├── css
│   └── main.css
├── img
│   └── icons
│       └── curloc.svg
├── index.html
├── js
│   └── mapApp.js
└── localserv.py
```




## Installing Required Packages

To install the required packages (such as the following), the ```bower.json``` file have to be execute or run.
```
{
  "name": "neighborhoodmap",
  "description": "4th Project for Udacity requirements.",
  "main": "index.html",
  "keywords": [
    "neighborhoodmap",
    "google",
    "map",
    "darksky",
    "knockoutjs"
  ],
  "authors": [
    "Juan Carlo A. Banayo"
  ],
  "license": "MIT",
  "homepage": "",
  "private": true
}
```


## Built With

* [KnockoutJS](http://knockoutjs.com/) - The Javascript Framework used.
* [Bower](https://bower.io/) - Package Manger.
* [Google API](https://developers.google.com/maps/documentation/) - Used to generate the map and listed places.
* [DarkSky API](https://darksky.net/dev) - Generate weather information.
* [Material Design Lite](https://getmdl.io/) - Radio box library.
* [Snazzy Maps](https://snazzymaps.com/) - The map's style theme.


## Acknowledgments

* Google.com 
* Stack Overflow
* Udacity Forum
