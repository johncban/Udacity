# Udacity Project Five - Neighborhood Map (Personal Emergency Map)

This project demonstrates the use of KnockoutJS Framework using Google Map API as the front end map, Google Place API as the backend source of place listings and Dark Sky API for weather information of the map's location.

This project also demonstrate HTML 5's [Geolocation](https://developers.google.com/maps/documentation/javascript/examples/map-geolocation) that detect the user's browser location then Google Map, Dark Sky API and Google Places utilize the geolocation to fetch the required information around the Geolocation's radius.

Under MVVM framework of KnockoutJS, the Model is based in Geolocation that utilize the said API for View Model and Data Model (Google Place API).

## Getting Started

There are two alternative to run the project.

1. Click [here](https://johncban.github.io/Sandbox/) for the live demo.

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
│   ├── jquery
│   │   ├── AUTHORS.txt
│   │   ├── LICENSE.txt
│   │   ├── README.md
│   │   ├── bower.json
│   │   └── dist
│   │       ├── core.js
│   │       ├── jquery.js
│   │       ├── jquery.min.js
│   │       ├── jquery.min.map
│   │       ├── jquery.slim.js
│   │       ├── jquery.slim.min.js
│   │       └── jquery.slim.min.map
│   ├── jquery.min
│   │   └── jquery.min.js
│   ├── knockout
│   │   ├── README.md
│   │   ├── bower.json
│   │   ├── knockout.debug.js
│   │   └── knockout.js
│   ├── material-design-icons
│   │   └── action
│   │       └── drawable-mdpi
│   │           ├── ic_explore_black_18dp.png
│   │           ├── ic_explore_black_24dp.png
│   │           ├── ic_explore_black_36dp.png
│   │           └── ic_explore_black_48dp.png
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
│   ├── google.css
│   └── main.css
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
  "private": true,
  "name": "emergencyresponsemap",
  "description": "",
  "main": "",
  "license": "MIT",
  "homepage": "",
  "private": true,
  "dependencies": {
    "knockout": "knockout.js#^3.1.0",
    "material-design-lite": "^1.3.0",
    "jquery": "^3.3.1",
    "material-design-icons": "^3.0.1"
  }
}
```


## Built With

* [KnockoutJS](http://knockoutjs.com/) - The Javascript Framework used.
* [Bower](https://bower.io/) - Package Manger.
* [Google API](https://developers.google.com/maps/documentation/) - Used to generate the map and listed places.
* [DarkSky API](https://darksky.net/dev) - Generate weather information.
* [Material Design Lite](https://getmdl.io/) - Radio box library.
* [Snazzy Maps](https://snazzymaps.com/) - The map's style theme.


## Reference

* [Learning Material Design Lite: Text Fields](https://webdesign.tutsplus.com/tutorials/learning-material-design-lite-text-fields--cms-24614)
* [KnockoutJS Toggle](http://jsfiddle.net/FgVxY/672/)
* [Show Hide Markers in DOM](https://stackoverflow.com/questions/24844915/google-maps-marker-show-hide)
* [Google Map Places If-Conditional](https://stackoverflow.com/questions/37214504/how-to-test-for-google-maps-place-type-with-if-conditional)
* [Google Map Place Details](https://developers.google.com/maps/documentation/javascript/examples/place-details)
* [Phone number href click to call](https://developers.google.com/web/fundamentals/native-hardware/click-to-call/)
* [Hide Google Map Radius](https://stackoverflow.com/questions/8260029/how-to-remove-circle-from-google-maps-v3)


## Acknowledgments

* Google.com 
* Stack Overflow
* Udacity Forum
