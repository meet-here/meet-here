var markers = [];

$(document).ready(function(){

    var platform = new H.service.Platform({
      'app_id': APP_ID,
      'app_code': APP_CODE
    });

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
    addMarkersToMap(map);
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
      start: '52.5160,13.3778',
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
