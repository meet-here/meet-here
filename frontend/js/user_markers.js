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

        //placesService.request(params, {}, showLandmarkInfo, onError);
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
        var icon = new H.map.Icon(user_marker.replace("{FILL}", "#18d"));
        marker.setIcon(icon);
        markers.push(marker);
    });

    var group = new H.map.Group();
    group.addObjects(markers);
    map.addObject(group);
    map.setViewBounds(group.getBounds());
}
