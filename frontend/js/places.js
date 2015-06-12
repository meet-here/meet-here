function showLandmarkInfoOnMap(landmark) {
    var marker = new H.map.Marker({lat: landmark.position[0], lng:landmark.position[1]});
    var icon = new H.map.Icon(landmark.icon);
    marker.setIcon(icon);
    marker.landmark = landmark;
    landMarkMarkerGroup.addObject(marker);
}

function showLandmarkInfo(result) {
    var places = result.results.items;
    var infos = $(".infos");

    // delete old data
    if (landMarkMarkerGroup.getObjects().length > 0) {
        map.removeObject(landMarkMarkerGroup);
    }
    landMarkMarkerGroup = new H.map.Group();
    infos.empty();

    // show new data
    $(places).each(function (index, place) {
        showLandmarkInfoOnMap(place);
        // if you want to show it in the sidebar uncomment the code
        //var listitem = $('<li class="list-group-item"/>');
        //var title = $('<div/>');
        //if (place.hasOwnProperty("contacts")) {
        //     title = $("<a/>");
        //     if (place.contacts.hasOwnProperties("website")) {
        //         $(place.contacts.website).each(function (index, element) {
        //             title.attr('href', element.value);    
        //         });
        //     }
        // }
        // title.html(place.title);
        // listitem.append(title);
        // infos.append(listitem);
    });

    landMarkMarkerGroup.addEventListener("tap", function (event) {
        var target = event.target;
        // calculate route from every user to this landmark
        var endPosition = target.getPosition();
        var end = 'geo!' + endPosition.lat + ',' + endPosition.lng;
				
				deleteCurrentRoutes();
       	
				$(markers).each(function (index, element) {
            var position = element.getPosition();
            var start = 'geo!' + position.lat + ',' + position.lng;
            calculateAndDisplayRoute(map, router, start, end, 'car');
        });

        // show info about this place
        var landmark = target.landmark;
        var listitem = $('<li class="list-group-item"/>');
        var title = $('<div/>');
        if (landmark.hasOwnProperty("contacts")) {
            title = $("<a/>");
            if (landmark.contacts.hasOwnProperties("website")) {
                $(landmark.contacts.website).each(function (index, element) {
                    title.attr('href', element.value);    
                });
            }
        }
        title.html(landmark.title);
        listitem.append(title);
        infos.append(listitem);

    });

    map.addObject(landMarkMarkerGroup);
}

function onError(error) {
    console.log(error);
}

function explorePolygon(polygon) {
    var params = {
        "in": polygon,
        "cat": "coffee-tea"
    };

    exploreService.request(params, {}, showLandmarkInfo, onError);
}
