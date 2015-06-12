var markers = [];
var landMarkMarkers = [];
var user_marker = '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px"><path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" fill="#000" fill-opacity=".2"/><path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/><path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="{FILL}"/></svg>';


function setUpClickListener(map, behavior, placesService) {
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

var places = new H.places.Here(platform.getPlacesService());

setUpClickListener(map, behavior, places);
