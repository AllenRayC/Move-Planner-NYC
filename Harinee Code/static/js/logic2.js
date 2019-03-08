
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiaGFyaW5lZW0iLCJhIjoiY2pwNHV0aWVoMDFxcDNwbGFranE5bW9ydSJ9.bkr_PzcM1cdLUf63x7C5UA"
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  SUBWAY_STATION: new L.LayerGroup(),
  NYC_BUS_STOPS: new L.LayerGroup()
};
// Create the map with our layers
var map = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.SUBWAY_STATION,
    layers.NYC_BUS_STOPS
  ]
});

streetmap.addTo(map);
var overlays = {
  "Subway Stations": layers.SUBWAY_STATION,
  "NYC Bus Stops": layers.NYC_BUS_STOPS
};

L.control.layers(null, overlays).addTo(map);


var LeafIcon = L.Icon.extend({
    options: {
       iconSize:     [20, 15]
    }
});

var greenIcon = new LeafIcon({
    iconUrl: 'static/img/train.png'
})
//console.log("Doing")

d3.json("https://data.cityofnewyork.us/api/geospatial/arq3-7z49?method=export&format=GeoJSON", function(response) {
      // Loop through the stations array
      console.log(response.features)

 for (var index = 0; index < response.features.length; index++) {
    var station = response.features[index];

    // For each station, create a marker and bind a popup with the station's name
    try {
      var msMarker = L.marker([station.geometry.coordinates[1],station.geometry.coordinates[0]],{icon: greenIcon})
          .bindPopup("<h3>" + station.properties.name + "<h3>");  
console.log("Subway Station: " + station.properties.name)		  
    }
    catch(err) {
      console.log("Subway Station: " + station.properties.name)
    }
    
    // Add the new marker to the appropriate layer
    msMarker.addTo(layers["SUBWAY_STATION"]);
  }
});


var busIcon = new LeafIcon({
  iconUrl: 'static/img/bus.png'
})
//console.log("Doing")
 // url = "https://data.cityofnewyork.us/Transportation/Bus-Stop-Shelters/qafz-7myz"
d3.json("https://data.cityofnewyork.us/api/geospatial/qafz-7myz?method=export&format=GeoJSON", function(response) {
      // Loop through the stations array
      console.log(response.features)

 for (var index = 0; index < response.features.length; index++) {
    var bus = response.features[index];

    // For each station, create a marker and bind a popup with the station's name
    try {
      var msMarker = L.marker([bus.geometry.coordinates[1],bus.geometry.coordinates[0]],{icon: busIcon})
          .bindPopup("<h3>" + bus.properties.street + "<h3>");  
console.log("Bus Station: " + bus.properties.street)		  
    }
    catch(err) {
      console.log("Bus Station: " + bus.properties.street)
    }
    
    // Add the new marker to the appropriate layer
    msMarker.addTo(layers["NYC_BUS_STOPS"]);
  }
});


var link = "https://data.cityofnewyork.us/api/geospatial/yfnk-k7r4?method=export&format=GeoJSON";
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "lightblue",
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
         layer.setStyle({
            fillOpacity: 0.7
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
           fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
         map.fitBounds(event.target.getBounds());
        }
      });
	        // Giving each feature a pop-up with information pertinent to it
   //   layer.bindPopup("<h2>School District: " + feature.properties.schoolDistrict + "</h2>");

    }
  }).addTo(map);
});


var LeafIcon = L.Icon.extend({
    options: {
       iconSize:     [20, 15]
    }
});


