function addMarkerToMap(map, position) {
    var marker = new H.map.Marker({'lat': position.latitude, 'lng': position.longitude});
    map.addObject(marker);
}

/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(map, route) {
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  $(routeShape).each(function(index, point) {
    var parts = point.split(',');
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}

// modes are
function calculateAndDisplayRoute(map, router, start, end, mode, onResult, onError) {
	var calculateRouteParams = {
		'waypoint0': start,
		'waypoint1': end,
        'representation': 'display',
        'routeattributes': 'waypoints,summary,shape,legs',
        'maneuverattributes': 'direction',
		'mode': 'fastest;' + mode + ';traffic:enabled'
	},
    onSuccess = function(result) {
        route = result.response.route[0];
        console.log(route);
        // extract it from route
        addMarkerToMap(map, route.waypoint[0].mappedPosition);
        addMarkerToMap(map,      route.waypoint[1].mappedPosition);
        addRouteShapeToMap(map, route);
	},
	onError = function(error) {
		console.log(error);
	}

	router.calculateRoute(calculateRouteParams, onSuccess, onError);
}