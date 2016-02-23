var map = L.map('map').setView([40.71, -73.93], 13);

var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(CartoDB_Positron);


var subwayData;
var mtaLines;

// MAP SUBWAY LINES
$.getJSON( "data/subwayLines.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var subwayLines = data;

    var subwayStyle = function(feature) {
    	var line = feature.properties.Line;
    	var fillColor = "#ffce01";
	
		// style for subway lines
		var style = {
		    "weight": 1.5,
		    "opacity": 1,
		    "fillOpacity": 0.75,
		    "color": fillColor 
		};
		return style
    }

    // using L.geojson add subway lines to map
    mtaLines = L.geoJson(subwayLines, {
        style: subwayStyle
    }).addTo(map);

    createLayerControls();
});


// MAP SUBWAY ENTRANCES AND EXITS
$.getJSON("data/subwayData.geojson", function (data) {
    var dataset = data; 

    var entranceToData = function (feature, latlng) {
        var entranceMarker = L.circle(latlng, 70, {
            weight: 0.2,
            opacity: 0.7,
            fillColor: "#ff0000", 
            fillOpacity: 0.3
        });
        return entranceMarker;
    }

    var entranceStyle = {
        "color": "#f11513"
    };

     var entranceClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Station:</strong> " + feature.properties.station_name);
         layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
    }

    subwayEntrance = L.geoJson(dataset, {
        style: entranceStyle, 
        pointToLayer: entranceToData,
        onEachFeature: entranceClick
    }).addTo(map);

    createListForClick(dataset);
});

// function to create a list in the right hand column with links that will launch the pop-ups on the map
function createListForClick(dataset) {
    var ULs = d3.select("#list")
                .append("ul");
   
    ULs.selectAll("li")
        .data(dataset.features)
        .enter()
        .append("li")
        .html(function(d) { 
            return '<a href="#">' + d.properties.station_name + '</a>'; 
        })
        .on('click', function(d, i) {
            console.log(d.properties.station_name);
            // var leafletId = 'entranceID' + i;
            // map._layers[leafletId].fire('click');
        });
}

// LAYER CONTROLS
function createLayerControls(){
	var baseMaps = {
		"CartoDB Basemap": CartoDB_Positron 
	};

	var overlayMaps = {
		"Subway Lines" : mtaLines,
        "Subway Entrance/Exit" : subwayData
	};

	L.control.layers(baseMaps, overlayMaps).addTo(map);
}
