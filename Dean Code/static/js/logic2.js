// Creating map object
var myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 11
});

// d3.select("#map").attr("style", "position: inherit")

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var APILink = "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";

var geojson;
var jsonData;

// Grab data with d3
d3.json(APILink, function(data) {

jsonData = data;

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "HOUSINGCOS",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.75
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.LOCALNAME + ", " + feature.properties.State + "<br>Yearly Housing:<br>" +
        "$" + feature.properties.HOUSINGCOS);
    }

  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Yearly Housing</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});

d3.select('#map').on('shown.bs.tab', function (e) {
  //clear map first
  //clearMap();
  //resize the map
  // d3.select("#map").height("600px").width("600px");
//  map.invalidateSize(true);
 //load the map once all layers cleared
 //loadMap();
})
// var mapmargin = 50;
// d3.select('#map').attr("style", "height:" + (window.height - mapmargin) & "px");
// window.addEventListener('resize', resize);
// resize();
// function resize(){

//     if(window.width>=980){
//       d3.select('#map').attr("style", "height:" &  (window.height - mapmargin));    
//       d3.select('#map').attr("style", "margin-top:" & 50);
//       d3.select("#map").height("600px").width("600px");
//       // d3.select("#map").
//     }else{
//       d3.select('#map').attr("style", "height:" &  (window.height - (mapmargin+12)) & "px");    
//       d3.select('#map').attr("style", "margin-top:" & -21 & "px");
//     }

// }

sliderInProgress = false;
// d3.select("#maxRent").on('input', filterMap())
d3.select("#maxRent").on('input', function(){
  d3.select("#maxRentVal").text("$" + this.value);
});

d3.select("#maxRent").on('mouseup', function(){
  var filterLevel = this.value * 12; //Number(d3.select("#maxRent").value);
d3.select("#maxRentVal").text("$" + this.value);
myMap.removeLayer(geojson);

// Grab data with d3
d3.json(APILink, function(data) {

  jsonData = data;
  
    // Create a new choropleth layer
    geojson = L.choropleth(data, {
  
      // Define what  property in the features to use
      valueProperty: "HOUSINGCOS",
  
      // Set color scale
      scale: ["#ffffb2", "#b10026"],
  
      // Number of breaks in step range
      steps: 10,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.75
      },
  
      // Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.LOCALNAME + ", " + feature.properties.State + "<br>Yearly Rent:<br>" +
          "$" + feature.properties.HOUSINGCOS);
      },
  
      filter: function(feature) {if (feature.properties.HOUSINGCOS > filterLevel) {return false;} else {return true;}}
  
    }).addTo(myMap);
  
  });

});

