var markers = [];

var user_marker = '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px"><path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" fill="#000" fill-opacity=".2"/><path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/><path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="{FILL}"/></svg>';


var platform = new H.service.Platform({
  'app_id': APP_ID,
  'app_code': APP_CODE
});

router = platform.getRoutingService();

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
    document.getElementById('map'),
    defaultLayers.normal.map,
    {
      zoom: 14,
      center: { lat: 52.5, lng: 13.4 }
    });
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);

var landMarkMarkerGroup = new H.map.Group();

addMarkersToMap(map);

var placesService = new H.places.Here(platform.getPlacesService());
var exploreService = new H.places.Explore(platform.getPlacesService());

setUpClickListener(map, behavior);
//calculateAndDisplayRoute(map, router, 'geo!52.0,13.4', 'geo!52.5,13.4', 'car');

