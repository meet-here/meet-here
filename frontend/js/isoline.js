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