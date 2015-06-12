isolines = []
isolineObjects = []

function makeIsoline(map, point, timeframe) {
  $.ajax({
    url: 'https://route.st.nlp.nokia.com/routing/6.2/calculateisoline.json',
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      mode: 'fastest;car',
      start: point.lat.toString()+","+point.lng.toString(),
      time: 'PT0H'+timeframe.toString()+'M',
      app_id: 'DemoAppId01082013GAL',
      app_code: 'AJKnXv84fjrb0KIHawS0Tg'
    },
    success: function (data) {
      isolines.push(data.Response.isolines[0].value);
      // redrawIsolines(map)
      addPolygonToMap(map, data.Response.isolines[0].value);
    }
  });
}

function deleteAllPolygons(map) {
  $(isolineObjects).each( function ( index, elem ) {
    map.removeObject(elem);
  });
  isolineObjects.length = 0;
}

function Point(x,y) {
this.x=x;
this.y=y;
}

function intersectPolygons(polygons) {
//intersect polygons, return a geostrip for result
	polygons_converted = polygons.map(function (polygon) {
		var p_polygon = [];
		for (i = 0; i < polygon.length; ++i) {
			var coords = polygon[i].split(',');
			var point = new Point(parseFloat(coords[0]), parseFloat(coords[1]));
			p_polygon.push(point)
		}
		return p_polygon;}
		)
	polygon = polygons_converted[0];
	
	for (i = 1; i < polygons_converted.length; ++i) {
		if (typeof polygon == 'undefined') return polygon;
		if (polygon.length == 0) return undefined;
		polygon=intersectionPolygons(polygon,polygons_converted[i]);
	}
	
	if (typeof polygon == 'undefined') return polygon;
		if (polygon.length == 0) return undefined;
  
  geoStrip = new H.geo.Strip();
  for (i = 0; i < polygon.length; ++i) {
    var point_ = new H.geo.Point(polygon[i].x,polygon[i].y);
    geoStrip.pushPoint(point_);
  };
  var polygonObj = new H.map.Polygon(geoStrip, {
    style: {
      strokeColor: '#829',
      lineWidth: 2
    }
  })
  explorePolygon(polygonObj);
  return polygonObj;
  
}





function redrawIsolines(map) {
  deleteAllPolygons(map);
  isolines.length = 0;
  $(markers).each( function (index, elem ) {
    makeIsoline(map,elem.getPosition(),isochromeRadius);
  });
  $(isolines).each (function (index, elem) {
    addPolygonToMap(map,elem);
  });
}

function addPolygonToMap(map, polygon) {
  var geoStrip = new H.geo.Strip();
  for (i = 0; i < polygon.length; ++i) {
    var coords = polygon[i].split(',');
    var point = new H.geo.Point(parseFloat(coords[0]), parseFloat(coords[1]));
    geoStrip.pushPoint(point);
  };
  var polygonObj = new H.map.Polygon(geoStrip, {
    style: {
      strokeColor: '#829',
      lineWidth: 2
    }
  })
  // map.addObject(polygonObj);
  isolineObjects.push(map.addObject(polygonObj));
  explorePolygon(polygonObj);
}