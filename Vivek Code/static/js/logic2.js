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

//Import crime data from CSV file  and add crime stats to the precinct boundary marker geoJson file
//so the Cholorpleth can be based on the crime rate of the precincts
d3.csv("http://localhost:8000/Felonies_NYC_2017.csv", function(data) { 
// Grabbing our GeoJSON data.. 
d3.json("https://data.cityofnewyork.us/resource/kmub-vria.geojson", function(json) {

          //Merge the precinct crime data and precinct boundary marker GeoJSON        
          //Loop through once for each precinct value        
          for (var i = 0; i < data.length; i++) {
            //Grab Precinct Name            
            var dataPrecinct = data[i].precinct;
            //Grab crime stats, and convert from string to float            
            var dataTotFel = parseFloat(data[i].total_felonies);
            var dataMurder = parseFloat(data[i].murder);
            var dataRape = parseFloat(data[i].rape);
            var dataRobbery = parseFloat(data[i].robbery);
            var dataFelAss = parseFloat(data[i].felony_assault);
            var dataBurglary = parseFloat(data[i].burglary);
            var dataGrLarc = parseFloat(data[i].grand_larceny);
            var dataGrLarcMV = parseFloat(data[i].grand_larceny_of_motor_vehicle);
            var dataPop = parseFloat(data[i].population);
            var dataPer1000 = parseFloat(data[i].per1000);
            //Find the corresponding precinct inside the GeoJSON            
            for (var j = 0; j < json.features.length; j++) {
              var jsonPrecinct = json.features[j].properties.precinct;

              if (parseFloat(dataPrecinct) == parseFloat(jsonPrecinct)) {
                //Copy the data value into the JSON                
                json.features[j].properties.totfel = dataTotFel;
                json.features[j].properties.murder = dataMurder;
                json.features[j].properties.rape = dataRape;
                json.features[j].properties.felass = dataFelAss;
                json.features[j].properties.burglary = dataBurglary;
                json.features[j].properties.grlarc = dataGrLarc;
                json.features[j].properties.grlarcmv = dataGrLarcMV;
                json.features[j].properties.robbery = dataRobbery;
                json.features[j].properties.pop = dataPop;
                json.features[j].properties.per1000 = dataPer1000;
                json.features[j].properties.precstr = "Precinct" + " "+ jsonPrecinct.toString();
                //Stop looking through the JSON                
                break;
              }    
            } 
          }

  // Creating a chorpleth map layer
  geojson = L.choropleth(json, {

    // Define what  property in the features to use
    valueProperty: "per1000",

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
      fillOpacity: 0.8
    },

    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 50% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 80%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.8
          });
        },
        // When a feature (precinct) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }

      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" +  feature.properties.precstr + "</h1>" + 
                      "<br>Total Felonies/1000 residents:" + feature.properties.per1000 +
                      "<br>Population:" + feature.properties.pop +
                      "<br>Total Felonies:" + feature.properties.totfel +
                      "<br>Murders:" + feature.properties.murder +
                      "<br>Rapes:" + feature.properties.rape +
                      "<br>Felony Assaults:" + feature.properties.felass +
                      "<br>Burglaries:" + feature.properties.burglary +
                      "<br>Grand Larceny:" + feature.properties.grlarc +
                      "<br>Grand Larceny (Motor Vehicle):" + feature.properties.grlarcmv +
                      "<br>Robberies:" + feature.properties.robbery
                      );

    }
  }).addTo(myMap);
});
});
