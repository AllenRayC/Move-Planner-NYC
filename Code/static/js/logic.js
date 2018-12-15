// @TODO
// legend (citibike example)
// flask
// cut down chloropleth

// Create the tile layer that will be the background of our map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

/*
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
*/

// Initialize all of the LayerGroups we'll be using
var layers = {
  MIDDLE_SCHOOL: new L.LayerGroup(),
  HIGH_SCHOOL: new L.LayerGroup(),
  HIGH_SCHOOL_AP: new L.LayerGroup(),
  COLLEGE: new L.LayerGroup(),
  SUBWAY_STATION: new L.LayerGroup(),
  AIRPORT: new L.LayerGroup(),
  SCHOOL_DISTRICT: new L.LayerGroup(),
  ES_ZONE: new L.LayerGroup(),
  MS_ZONE: new L.LayerGroup(),
  HS_ZONE: new L.LayerGroup(),
  BOROUGH: new L.LayerGroup(),
  NEIGHBORHOOD: new L.LayerGroup(),
  CENSUS_TRACT: new L.LayerGroup(),
  COST_LIVING: new L.LayerGroup()
};

/*
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
*/

// Create the map with our layers
var map = L.map("map-id", {
  center: [40.73, -74.0059],
  zoom: 14,
  layers: [streetmap, layers.HIGH_SCHOOL_AP, layers.SCHOOL_DISTRICT]
});

// Add our 'lightmap' tile layer to the map
//streetmap.addTo(map);

// Create an overlays object to add to the layer control
// https://github.com/ismyrnow/leaflet-groupedlayercontrol

var groupedOverlays = {
  "Education": {
    "Middle Schools": layers.MIDDLE_SCHOOL,
    "High Schools": layers.HIGH_SCHOOL,
    "High Schools, AP Programs": layers.HIGH_SCHOOL_AP,
    "Colleges": layers.COLLEGE
  },
  "School Zones": {
    "Elementary Schools": layers.ES_ZONE,
    "Middle Schools": layers.MS_ZONE,
    "High Schools": layers.HS_ZONE
  },
  "Transportation": {
    "Subway Stations": layers.SUBWAY_STATION,
    "Airports": layers.AIRPORT
  },
  "Geography": {
    "School Districts": layers.SCHOOL_DISTRICT,
    "Boroughs": layers.BOROUGH,
    "Neighborhoods": layers.NEIGHBORHOOD,
    "Census Tracts": layers.CENSUS_TRACT,
    "Cost of Living": layers.COST_LIVING
  }
};

var options = {
  // Make the "Landmarks" group exclusive (use radio inputs)
  exclusiveGroups: ["Geography"],
  // Show a checkbox next to non-exclusive group labels for toggling all
  groupCheckboxes: true
};

// Create a control for our layers, add our overlay layers to it
var layerControl = L.control.groupedLayers(null, groupedOverlays, options).addTo(map);

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
  }),
  AIRPORT: L.ExtraMarkers.icon({
    icon: "ion-paper-airplane",
    iconColor: "white",
    markerColor: "blue",
    shape: "star"
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
        .bindPopup("<h3>" + middleSchool.printedschoolname + "<h3>"
          + `<br>Website: <a href="https://${middleSchool.independentwebsite}">https://${middleSchool.independentwebsite}</a>`);
    }
    catch(err) {
      //console.log("Middle School: " + middleSchool.name_prog1)
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
      //console.log("High School: " + highSchool.school_name)
    }
    
    // Add the new marker to the appropriate layer
    hsMarker.addTo(layers["HIGH_SCHOOL"]);
  }
});

// High schools with AP
var nyc_grad_rate = 0.74; //https://www.schools.nyc.gov/docs/default-source/default-document-library/2019nychsdirectorycitywideenglish
var nyc_college_rate = 0.57;
d3.json("https://data.cityofnewyork.us/resource/h7rb-945c.json", function(response) {

  // Loop through the array
  for (var index = 0; index < response.length; index++) {
    var highSchool = response[index];
    var grad_rate_dif_str = "";
    var col_rate_dif_str = "";
    var grad_rate_dif =  Math.round(100*(highSchool.graduation_rate - nyc_grad_rate));
    var col_rate_dif = Math.round(100*(highSchool.college_career_rate - nyc_college_rate));

    if (highSchool.graduation_rate > nyc_grad_rate) {
      grad_rate_dif_str = `<font color='green'>(+${grad_rate_dif}%)</font>`;
    }
    else if (highSchool.graduation_rate < nyc_grad_rate) {
      grad_rate_dif_str = `<font color='red'>(${grad_rate_dif}%)</font>`;
    }
    else {
      grad_rate_dif_str = `<font color='yellow'>(${grad_rate_dif}%)</font>`;
    }

    if (highSchool.college_career_rate > nyc_college_rate) {
      col_rate_dif_str = `<font color='green'>(+${col_rate_dif}%)</font>`;
    }
    else if (highSchool.college_career_rate < nyc_college_rate) {
      col_rate_dif_str = `<font color='red'>(${col_rate_dif}%)</font>`;
    }
    else {
      col_rate_dif_str = `<font color='yellow'>(${col_rate_dif}%)</font>`;
    }

    // For each, create a marker and bind a popup with the name
    try {
      if (highSchool.hasOwnProperty('advancedplacement_courses')) {
        var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL_AP"]})
          .bindPopup("<h2>" + highSchool.school_name 
            + "</h2><hr><h3>AP Courses:</h3>" + highSchool.advancedplacement_courses

            //+ `<h3><br><div id="content">${highSchool.advancedplacement_courses}</div>`


            + "<br><h3>Grad Rate: " + Math.round(highSchool.graduation_rate*100) + "% " + grad_rate_dif_str
            + "<br>College Rate: " + Math.round(highSchool.college_career_rate*100) + "% " + col_rate_dif_str
            + `<br>Website: <a href="https://${highSchool.website}">https://${highSchool.website}</a></h3>`
            + "<hr>" + highSchool.overview_paragraph);
      }
      else {
        var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL"]})
          .bindPopup("<h2>" + highSchool.school_name 
            + "</h2><hr><h3>Grad Rate: " + Math.round(highSchool.graduation_rate*100) + "% " + grad_rate_dif_str
            + "<br>College Rate: " + Math.round(highSchool.college_career_rate*100) + "% " + col_rate_dif_str
            + `<br>Website: <a href="https://${highSchool.website}">https://${highSchool.website}</a></h3>`
            + "<hr>" + highSchool.overview_paragraph);
      }
    }
    catch(err) {
      //console.log("High School: " + highSchool.school_name)
    }

 /*   
    console.log(hsMarker._popup.getElementById("content"))
    try {
      hsMarker._popup.getContent().onclick = function() {
        this.style.height = 'auto';
      }
    }
    catch(err) {}
*/
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
        .bindPopup("<h3>" + college.name + "<h3>"
          + `<br>Website: <a href="https://${college.url}">https://${college.url}</a>`);
    }
    catch(err) {
      //console.log("College: " + college.name)
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

// Airports
d3.json("https://data.cityofnewyork.us/api/views/3q66-h7aj/rows.geojson?", function(response) {
  // Loop through the stations array

  for (var index = 0; index < response.features.length; index++) {

  

    var airport = response.features[index];

    // For each station, create a marker and bind a popup with the station's name
    try {
      var airMarker = L.marker([airport.geometry.coordinates[1], airport.geometry.coordinates[0]],  {icon: icons["AIRPORT"]})
        .bindPopup("<h3>" + airport.properties.name + "<h3>");
    }
    catch(err) {
      console.log("Airport Error: " + airport.properties.name)
    }
    
    // Add the new marker to the appropriate layer
    airMarker.addTo(layers["AIRPORT"]);
  }
});




// School Districts
var disctrictGradRate = {
  "1": "60.0%", "2": "74.8%", "3": "77.3%", "4": "84.9%", "5": "67.6%",
  "6": "63.8%", "7": "58.4%", "8": "54.3%", "9": "68.1%", "10": "72.0%",
  "11": "69.1%", "12": "55.6%", "13": "84.2%", "14": "78.0%", "15": "67.5%",
  "16": "52.7%", "17": "72.0%", "18": "63.7%", "19": "63.9%", "20": "72.7%",
  "21": "72.6%", "22": "81.7%", "23": "43.0%", "24": "73.6%", "25": "68.0%",
  "26": "87.2%", "27": "69.2%", "28": "80.3%", "29": "70.7%", "30": "78.3%",
  "31": "79.5%", "32": "65.3%"
};

var link = "http://data.beta.nyc//dataset/98f0be40-6691-4de3-8a74-afdd87c7c5c2/resource/c49af687-77c1-45fd-a5e7-9684a44886fc/download/75d63b603aea4b4d92c5d15a65d4e982schooldistricts.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  var schoolDistrictLayer = L.geoJson(data, {
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
       d3.json("https://data.cityofnewyork.us/resource/hvnc-iy6e.json", function(info) {
        for (var index = 0; index < info.length; index++) {
          var district = info[index];
          layer.bindPopup("<h2>School District: " + feature.properties.schoolDistrict + "</h2>"
            + "<hr><h3>Average Graduation Rate: " + disctrictGradRate[feature.properties.schoolDistrict] 
            + "<br>Average Attendance: " + district.ytd_attendance_avg_ + "%<br>"
            + "Enrollment: " + district.ytd_enrollment_avg_ + "</h3>");
        }
      });
    }

  });
  schoolDistrictLayer.addTo(layers["SCHOOL_DISTRICT"]);
  //layerControl.addOverlay(schoolDistrictLayer, 'School District')
});

// Elementary School Zones
var link = "https://data.cityofnewyork.us/api/views/xehh-f7pi/rows.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  var esZoneLayer = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "green",
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
      layer.bindPopup("<h2>School Zone: " + feature.properties.dbn + "</h2>");

    }

  });
  esZoneLayer.addTo(layers["ES_ZONE"]);
  //layerControl.addOverlay(schoolDistrictLayer, 'School District')
});

// Middle School Zones
var link = "https://data.cityofnewyork.us/api/views/jxpn-gg5q/rows.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  var msZoneLayer = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "orange",
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
      layer.bindPopup("<h2>Middle School Zone: " + feature.properties.dbn + "</h2>");

    }

  });
  msZoneLayer.addTo(layers["MS_ZONE"]);
  //layerControl.addOverlay(schoolDistrictLayer, 'School District')
});

// High School Zones
var link = "https://data.cityofnewyork.us/api/views/9hw3-gi34/rows.geojson?";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  var hsZoneLayer = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "orange",
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
      layer.bindPopup("<h2>High School Zone: " + feature.properties.dbn + "</h2>");

    }

  });
  hsZoneLayer.addTo(layers["HS_ZONE"]);
  //layerControl.addOverlay(schoolDistrictLayer, 'School District')
});

// NYC Boroughs
var link = "http://data.beta.nyc//dataset/68c0332f-c3bb-4a78-a0c1-32af515892d6/resource/7c164faa-4458-4ff2-9ef0-09db00b509ef/download/42c737fd496f4d6683bba25fb0e86e1dnycboroughboundaries.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to

function chooseColor(borough) {
  switch (borough) {
  case "Brooklyn":
    return "green";
  case "Bronx":
    return "blue";
  case "Manhattan":
    return "purple";
  case "Queens":
    return "orange";
  case "Staten Island":
    return "red";
  default:
    return "black";
  }
}

// https://infohub.nyced.org/reports-and-policies/citywide-information-and-data/graduation-results
var boroughGradRate = {
  "Brooklyn": "72.5%",
  "Bronx": "64.6%",
  "Manhattan": "73.4%",
  "Queens": "76.3%",
  "Staten Island": "79.5%"
};

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  var boroughLayer = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.borough),
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
      layer.bindPopup("<h2>" + feature.properties.borough + "</h2>"
        + "<hr><h3>Average Graduation Rate: " + boroughGradRate[feature.properties.borough] + "</h3>");

    }

  });
  boroughLayer.addTo(layers["BOROUGH"]);
  //layerControl.addOverlay(schoolDistrictLayer, 'School District')
});

// Neighborhoods
var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
"35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";

d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  var neighborhoodLayer = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.borough),
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
            fillOpacity: 0.9
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
      layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");

    }
  })
  neighborhoodLayer.addTo(layers["NEIGHBORHOOD"]);
});

// Census Tracts

var link = "https://data.cityofnewyork.us/api/views/ghm7-s8ah/rows.geojson?";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  var censusTractLayer = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "red",
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
      layer.bindPopup("<h2>Census Tract: " + feature.properties.ctlabel + "</h2>");

    }

  });
  censusTractLayer.addTo(layers["CENSUS_TRACT"]);
  //layerControl.addOverlay(schoolDistrictLayer, 'School District')
});

// Chloropleth

// Link to GeoJSON
var APILink = "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";

var geojson;
var jsonData;
var NYCCounties = ["Queens County", "New York County", "Richmond County", "Bronx County", "Kings County"];

// Grab data with d3
d3.json(APILink, function(data) {

  jsonData = data;
  console.log(L);
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
    },

  
    filter: function(feature) {if (NYCCounties.indexOf(feature.properties.COUNTY) >=0) {return true;} else {return false;}}

  });

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
  legend.addTo(map);
  geojson.addTo(layers["COST_LIVING"]);
});

d3.select('#map-id').on('shown.bs.tab', function (e) {
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
map.removeLayer(geojson);

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
  
      filter: function(feature) {if (feature.properties.HOUSINGCOS > filterLevel) {return false;} else {return true;}},

      filter: function(feature) {if (NYCCounties.indexOf(feature.properties.COUNTY) >=0) {return true;} else {return false;}}
  
    });
    geojson.addTo(layers["COST_LIVING"]);
  });

});