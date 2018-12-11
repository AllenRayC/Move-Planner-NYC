// @TODO
// 
// School Districts GeoJson
// http://data.beta.nyc//dataset/98f0be40-6691-4de3-8a74-afdd87c7c5c2/resource/c49af687-77c1-45fd-a5e7-9684a44886fc/download/75d63b603aea4b4d92c5d15a65d4e982schooldistricts.geojson


// Create the tile layer that will be the background of our map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});



// Initialize all of the LayerGroups we'll be using
var layers = {
  MIDDLE_SCHOOL: new L.LayerGroup(),
  HIGH_SCHOOL: new L.LayerGroup(),
  HIGH_SCHOOL_AP: new L.LayerGroup(),
  COLLEGE: new L.LayerGroup(),
  SUBWAY_STATION: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.HIGH_SCHOOL_AP
  ]
});

// Add our 'lightmap' tile layer to the map
streetmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Middle Schools": layers.MIDDLE_SCHOOL,
  "High Schools": layers.HIGH_SCHOOL,
  "High Schools, AP Programs": layers.HIGH_SCHOOL_AP,
  "Colleges": layers.COLLEGE,
  "Subway Stations": layers.SUBWAY_STATION
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  MIDDLE_SCHOOL: L.ExtraMarkers.icon({
    icon: "ion-calculator",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "penta"
  }),
  HIGH_SCHOOL: L.ExtraMarkers.icon({
    icon: "ion-ios-book",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  HIGH_SCHOOL_AP: L.ExtraMarkers.icon({
    icon: "ion-ios-book",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  COLLEGE: L.ExtraMarkers.icon({
    icon: "ion-ios-bookmarks",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  SUBWAY_STATION: L.ExtraMarkers.icon({
    icon: "ion-android-train",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  })
};

// Middle schools
d3.json("https://data.cityofnewyork.us/resource/m6d4-riyp.json", function(response) {

  // Loop through the array
  for (var index = 0; index < response.length; index++) {
    var middleSchool = response[index];

    // For each, create a marker and bind a popup with the name
    try {
      var msMarker = L.marker([middleSchool.latitude, middleSchool.longitude],  {icon: icons["MIDDLE_SCHOOL"]})
        .bindPopup("<h3>" + middleSchool.name_prog1 + "<h3>");
    }
    catch(err) {
      console.log("Middle School: " + middleSchool.name_prog1)
    }
    
    // Add the new marker to the appropriate layer
    msMarker.addTo(layers["MIDDLE_SCHOOL"]);
  }
});

// High schools
d3.json("https://data.cityofnewyork.us/resource/h7rb-945c.json", function(response) {

  // Loop through the array
  for (var index = 0; index < response.length; index++) {
    var highSchool = response[index];

    // For each, create a marker and bind a popup with the name
    try {
      var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL"]})
        .bindPopup("<h3>" + highSchool.school_name + "<h3>");
    }
    catch(err) {
      console.log("High School: " + highSchool.school_name)
    }
    
    // Add the new marker to the appropriate layer
    hsMarker.addTo(layers["HIGH_SCHOOL"]);
  }
});

// High schools with AP
d3.json("https://data.cityofnewyork.us/resource/h7rb-945c.json", function(response) {

  // Loop through the array
  for (var index = 0; index < response.length; index++) {
    var highSchool = response[index];

    // For each, create a marker and bind a popup with the name
    try {
      if (highSchool.hasOwnProperty('advancedplacement_courses')) {
        var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL_AP"]})
          .bindPopup("<h3>" + highSchool.school_name + "<h3><br>" + highSchool.advancedplacement_courses);
      }
      else {
        var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL"]})
          .bindPopup("<h3>" + highSchool.school_name + "<h3>");
      }
    }
    catch(err) {
      console.log("High School: " + highSchool.school_name)
    }
    
    // Add the new marker to the appropriate layer
    hsMarker.addTo(layers["HIGH_SCHOOL_AP"]);
  }
});

// Colleges
d3.json("https://data.cityofnewyork.us/resource/8pnn-kkif.json", function(response) {

  // Loop through the array
  for (var index = 0; index < response.length; index++) {
    var college = response[index];

    // For each, create a marker and bind a popup with the name
    try {
      var colMarker = L.marker([college.the_geom.coordinates[1],college.the_geom.coordinates[0]],  {icon: icons["COLLEGE"]})
        .bindPopup("<h3>" + college.name + "<h3>");
    }
    catch(err) {
      console.log("College: " + college.name)
    }
    
    // Add the new marker to the appropriate layer
    colMarker.addTo(layers["COLLEGE"]);
}
});

// Subway stations
d3.json("https://data.ny.gov/resource/hvwh-qtfg.json", function(response) {

  // Loop through the stations array
  for (var index = 0; index < response.length; index++) {
    var station = response[index];

    // For each station, create a marker and bind a popup with the station's name
    try {
      var msMarker = L.marker([station.station_latitude, station.station_longitude],  {icon: icons["SUBWAY_STATION"]})
        .bindPopup("<h3>" + station.station_name + "<h3>");
    }
    catch(err) {
      console.log("Subway Station: " + station.station_name)
    }
    
    // Add the new marker to the appropriate layer
    msMarker.addTo(layers["SUBWAY_STATION"]);
  }
});

var link = "http://data.beta.nyc//dataset/98f0be40-6691-4de3-8a74-afdd87c7c5c2/resource/c49af687-77c1-45fd-a5e7-9684a44886fc/download/75d63b603aea4b4d92c5d15a65d4e982schooldistricts.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "blue",
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
      layer.bindPopup("<h2>School District: " + feature.properties.schoolDistrict + "</h2>");

    }
  }).addTo(map);
});
