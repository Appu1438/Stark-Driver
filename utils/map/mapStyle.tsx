// utils/mapStyle.js

export const customMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      { "color": "#2E2E2E" } // slightly lighter than #1E1E1E
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#c0d0ff" }  // slightly lighter than #b0c7ff
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#2E2E2E" } // match lighter background
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      { "color": "#888888" } // lighter than #757575
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#c0d0ff" }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#c0d0ff" }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#b0c0e0" } // slightly lighter
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#202020" } // lighter than #181818
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#3a3a3a" } // lighter than #2c2c2c
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#a0b6ff" }  // slightly lighter
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "color": "#4a4a4a" } // lighter
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#a0b6ff" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#101010" } // lighter than pure black
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#85a0d1" } // lighter
    ]
  }
];
