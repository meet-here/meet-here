var markers = [];
$(document).ready(function(){

    var platform = new H.service.Platform({
      'app_id': 'SuEOSiTaftUo7MUtmazp',
      'app_code': 'HPLOL-cV-VS4WAC5SvCGBw'
    });

    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();
    

    // Instantiate (and display) a map object:
    var map = new H.Map(
        document.getElementById('map'),
        defaultLayers.normal.map,
        {
          zoom: 10,
          center: { lat: 52.5, lng: 13.4 }
        });
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    setUpClickListener(map, behavior);
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
  });
}

