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