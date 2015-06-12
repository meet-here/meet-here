var markers = [];
var landMarkMarkers = [];
var user_marker = '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px"><path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" fill="#000" fill-opacity=".2"/><path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/><path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="{FILL}"/></svg>';



function setUpClickListener(map, behavior) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {
    var target = evt.target;
    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);

    if (target instanceof H.map.Marker) {
        // send a request to get interesting places around
        var params = {
            at: coord.lat + ',' + coord.lng
            //cat: 'coffee-tea'
        }

        placesService.request(params, {}, showLandmarkInfo, onError);
        return;
    }

    
    var icon = new H.map.Icon(user_marker.replace("{FILL}", "red"));
    var marker = new H.map.Marker({lat: coord.lat, lng: coord.lng});
    marker.draggable = true;
    marker.setIcon(icon);

    // disable the default draggability of the underlying map
    // when starting to drag a marker object:
    map.addEventListener('dragstart', function(ev) {
        if (target instanceof H.map.Marker) {
          behavior.disable();
        }
    }, false);


    // re-enable the default draggability of the underlying map
    // when dragging has completed
    map.addEventListener('dragend', function(ev) {
        var target = ev.target;
        if (target instanceof H.map.Marker) {
            behavior.enable();
        }
    }, false);

    // Listen to the drag event and move the position of the marker
    // as necessary
    map.addEventListener('drag', function(ev) {
    var target = ev.target,
        pointer = ev.currentPointer;
    if (target instanceof H.map.Marker) {
        target.setPosition(map.screenToGeo(pointer.viewportX, pointer.viewportY));
    }
    }, false);

    markers.push(marker);
    map.addObject(marker);
    drawIsoline(map, marker.getPosition())

  });
}

function addMarkersToMap(map) {
    var positions = [
        {lat: 52.5411, lng: 13.394},
        {lat: 52.5193, lng: 13.39828},
        {lat: 52.53379, lng: 13.394163},
        {lat: 52.5216785, lng: 13.408497}
    ];

    $(positions).each(function (index, element){        
        var marker = new H.map.Marker(element);
        var icon = new H.map.Icon(user_marker.replace("{FILL}", "red"));
        marker.setIcon(icon);
        markers.push(marker);
    });

    var group = new H.map.Group();
    group.addObjects(markers);
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

function showLandmarkInfoOnMap(landmark) {
    var marker = new H.map.Marker({lat: landmark.position[0], lng:landmark.position[1]});
    var icon = new H.map.Icon(landmark.icon);
    marker.setIcon(icon);
    map.addObject(marker);
    landMarkMarkers.push(marker);
}

function showLandmarkInfo(result) {
    var places = result.results.items;
    var infos = $(".infos");

    // delete old data
    $(landMarkMarkers).each(function (index, element) {
        map.removeObject(element);
    });
    landMarkMarkers.length = 0;
    infos.empty();

    // show new data
    $(places).each(function (index, place) {
        showLandmarkInfoOnMap(place);
        var listitem = $('<li class="list-group-item"/>');
        var title = $('<div/>');
        if (place.hasOwnProperty("contacts")) {
            title = $("<a/>");
            if (place.contacts.hasOwnProperties("website")) {
                $(place.contacts.website).each(function (index, element) {
                    title.attr('href', element.value);    
                });
            }
        }
        title.html(place.title);
        listitem.append(title);
        infos.append(listitem);
    });
}

function onError(error) {
    console.log(error);
}


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

addMarkersToMap(map);

var placesService = new H.places.Here(platform.getPlacesService());

setUpClickListener(map, behavior);
calculateAndDisplayRoute(map, router, 'geo!52.0,13.4', 'geo!52.5,13.4', 'car');

