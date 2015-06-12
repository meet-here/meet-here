var markers = [];

$(document).ready(function(){

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

    setUpClickListener(map, behavior);
    //addMarkersToMap(map);
	calculateAndDisplayRoute(map, router, 'geo!52.0,13.4', 'geo!52.5,13.4', 'car');

});

function setUpClickListener(map, behavior) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);

    var marker = new H.map.Marker({lat: coord.lat, lng: coord.lng});
    marker.draggable = true;

    // disable the default draggability of the underlying map
    // when starting to drag a marker object:
    map.addEventListener('dragstart', function(ev) {
    var target = ev.target;
    if (target instanceof H.map.Marker) {
      behavior.disable();
    }
    }, false);


    // re-enable the default draggability of the underlying map
    // when dragging has completed
    map.addEventListener('dragend', function(ev) {
    var target = ev.target;
    if (target instanceof mapsjs.map.Marker) {
        behavior.enable();
    }
    }, false);

    // Listen to the drag event and move the position of the marker
    // as necessary
    map.addEventListener('drag', function(ev) {
    var target = ev.target,
        pointer = ev.currentPointer;
    if (target instanceof mapsjs.map.Marker) {
        target.setPosition(map.screenToGeo(pointer.viewportX, pointer.viewportY));
    }
    }, false);

    markers.push(marker);
    map.addObject(marker);
    drawIsoline(map, marker.getPosition())

  });
}

function addMarkersToMap(map) {
    var marker1 = new H.map.Marker({lat: 52.5411, lng: 13.394});
    var marker2 = new H.map.Marker({lat: 52.5193, lng: 13.39828});
    var marker3 = new H.map.Marker({lat: 52.53379, lng: 13.394163});
    var marker4 = new H.map.Marker({lat: 52.5216785, lng: 13.408497});

    var group = new H.map.Group();
    group.addObjects([marker1, marker2, marker3, marker4]);
    map.addObject(group);
    map.setViewBounds(group.getBounds());
}

function drawIsoline(map, point) {
  $.ajax({
    url: 'https://route.st.nlp.nokia.com/routing/6.2/calculateisoline.json',
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      mode: 'fastest;car',
      start: point.lat.toString()+","+point.lng.toString(),
      time: 'PT0H05M',
      app_id: 'DemoAppId01082013GAL',
      app_code: 'AJKnXv84fjrb0KIHawS0Tg'
    },
    success: function (data) {
      addPolygonToMap(map,data.Response.isolines[0].value);
    }
  });
}

function addPolygonToMap(map, polygon) {
  var geoStrip = new H.geo.Strip();
  for (i = 0; i < polygon.length; ++i) {
    var coords = polygon[i].split(',');
    var point = new H.geo.Point(parseFloat(coords[0]), parseFloat(coords[1]));
    geoStrip.pushPoint(point);
  };
  map.addObject(
    new H.map.Polygon(geoStrip, {
      style: {
        fillColor: '#FFFFCC',
        strokeColor: '#829',
        lineWidth: 8
      }
    })
  );
}

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
