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
  HIGH_SCHOOL_COL: new L.LayerGroup(),
  COLLEGE: new L.LayerGroup(),
  SUBWAY_STATION: new L.LayerGroup(),
  AIRPORT: new L.LayerGroup(),
  SCHOOL_DISTRICT: new L.LayerGroup(),
  BOROUGH: new L.LayerGroup(),
  NEIGHBORHOOD: new L.LayerGroup(),
  COST_LIVING: new L.LayerGroup(),
  CRIME: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [40.73, -74.0059],
  zoom: 14,
  layers: [streetmap, layers.HIGH_SCHOOL, layers.SCHOOL_DISTRICT]
});

// Create an overlays object to add to the layer control
// https://github.com/ismyrnow/leaflet-groupedlayercontrol

var groupedOverlays = {
  "Education": {
    "Middle Schools": layers.MIDDLE_SCHOOL,
    "Colleges": layers.COLLEGE
  },
  "High Schools": {
  	"High Schools": layers.HIGH_SCHOOL,
    "High Schools, AP Programs": layers.HIGH_SCHOOL_AP,
    "High Schools, College Rate": layers.HIGH_SCHOOL_COL,
  },
  "Transportation": {
    "Subway Stations": layers.SUBWAY_STATION,
    "Airports": layers.AIRPORT
  },
  "Geography": {
    "School Districts": layers.SCHOOL_DISTRICT,
    "Boroughs": layers.BOROUGH,
    "Neighborhoods": layers.NEIGHBORHOOD,
    "Cost of Living": layers.COST_LIVING,
    "Crime": layers.CRIME
  }
};

var options = {
  // Make the "Landmarks" group exclusive (use radio inputs)
  exclusiveGroups: ["High Schools", "Geography"],
  // Show a checkbox next to non-exclusive group labels for toggling all
  groupCheckboxes: false
};

// Create a control for our layers, add our overlay layers to it
var layerControl = L.control.groupedLayers(null, groupedOverlays, options).addTo(map);

// Initialize an object containing icons for each layer group

/*
var collegeIcon = L.icon({
    iconUrl: "../static/img/college-graduation.png",

    iconSize:     [50, 50], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
*/

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
    //icon: collegeIcon,
    icon: "ion-ios-bookmarks",
    //iconUrl: "../static/img/college-graduation.png",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  SUBWAY_STATION: L.ExtraMarkers.icon({
    icon: "ion-android-subway",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  AIRPORT: L.ExtraMarkers.icon({
    icon: 'ion-plane',
    iconColor: "white",
    markerColor: "blue",
    shape: "star"
  })
};

var greenIcon = L.icon({
    iconUrl: "../static/img/home.png",

    iconSize:     [75, 75], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// MIDDLE SCHOOLS
d3.json("https://data.cityofnewyork.us/resource/m6d4-riyp.json", function(response) {

  // Loop through the array
  for (var index = 0; index < response.length; index++) {
    var middleSchool = response[index];

    // For each, create a marker and bind a popup with the name
    try {
      var msMarker = L.marker([middleSchool.latitude, middleSchool.longitude],  {icon: icons["MIDDLE_SCHOOL"]})
        .bindPopup("<h2>" + middleSchool.printedschoolname + "</h2>"
          + "<hr>" + middleSchool.overview
          + `<hr><h3>Website: <a href="https://${middleSchool.independentwebsite}">https://${middleSchool.independentwebsite}</a></h3>`);
    }
    catch(err) {
      //console.log("Middle School: " + middleSchool.name_prog1)
    }
    
    // Add the new marker to the appropriate layer
    msMarker.addTo(layers["MIDDLE_SCHOOL"]);
  }
});


// ALL HIGH SCHOOLS
//https://www.schools.nyc.gov/docs/default-source/default-document-library/2019nychsdirectorycitywideenglish
var nyc_grad_rate = 0.74;
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
          .bindPopup("<h2>" + `<a href="/highschool/${highSchool.school_name}">${highSchool.school_name}</a>`
            + "</h2><hr><h3>AP Courses:</h3>" + highSchool.advancedplacement_courses
            + "<br><h3>Grad Rate: " + Math.round(highSchool.graduation_rate*100) + "% " + grad_rate_dif_str
            + "<br>College Rate: " + Math.round(highSchool.college_career_rate*100) + "% " + col_rate_dif_str
            + `<br>Website: <a href="http://${highSchool.website}">http://${highSchool.website}</a>`
            + `<br>Email: <a href = "mailto:${highSchool.school_email}">${highSchool.school_email}</a>`
            + "<br>Phone: " + highSchool.phone_number + "</h3>"
            + "<hr>" + highSchool.overview_paragraph);
          	//+ `<hr><a href="https://www.google.com/">High School</a>`;
          	//+ `<hr><a href="/highschool">${highSchool.school_name}</a>`;
      }
      else {
        var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL"]})
          .bindPopup("<h2>" + `<a href="/highschool/${highSchool.school_name}">${highSchool.school_name}</a>`
            + "</h2><hr><h3>Grad Rate: " + Math.round(highSchool.graduation_rate*100) + "% " + grad_rate_dif_str
            + "<br>College Rate: " + Math.round(highSchool.college_career_rate*100) + "% " + col_rate_dif_str
            + `<br>Website: <a href="http://${highSchool.website}">http://${highSchool.website}</a>`
            + `<br>Email: <a href = "mailto:${highSchool.school_email}">${highSchool.school_email}</a>`
            + "<br>Phone: " + highSchool.phone_number + "</h3>"
            + "<hr>" + highSchool.overview_paragraph);
      }
      // Add the new marker to the appropriate layer
      hsMarker.addTo(layers["HIGH_SCHOOL"]);
    }
    catch(err) {
      //console.log("High School: " + highSchool.school_name)
    }
  }
});

// HIGH SCHOOLS, AP PROGRAMS
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
          .bindPopup("<h2>" + `<a href="/highschool/${highSchool.school_name}">${highSchool.school_name}</a>`
            + "</h2><hr><h3>AP Courses:</h3>" + highSchool.advancedplacement_courses
            + "<br><h3>Grad Rate: " + Math.round(highSchool.graduation_rate*100) + "% " + grad_rate_dif_str
            + "<br>College Rate: " + Math.round(highSchool.college_career_rate*100) + "% " + col_rate_dif_str
            + `<br>Website: <a href="http://${highSchool.website}">http://${highSchool.website}</a>`
            + `<br>Email: <a href = "mailto:${highSchool.school_email}">${highSchool.school_email}</a>`
            + "<br>Phone: " + highSchool.phone_number + "</h3>"
            + "<hr>" + highSchool.overview_paragraph);
          	//+ `<hr><a href="https://www.google.com/">High School</a>`;
          	//+ `<hr><a href="/highschool">${highSchool.school_name}</a>`;
      }
      // Add the new marker to the appropriate layer
      hsMarker.addTo(layers["HIGH_SCHOOL_AP"]);
    }
    catch(err) {
      //console.log("High School: " + highSchool.school_name)
    }
  }
});

// HIGH SCHOOLS, FILTER BY COLLEGE RATE
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
      if (Math.round(highSchool.college_career_rate*100) > nyc_college_rate*100) {
	      if (highSchool.hasOwnProperty('advancedplacement_courses')) {
	        var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL_AP"]})
	          .bindPopup("<h2>" + `<a href="/highschool/${highSchool.school_name}">${highSchool.school_name}</a>`
	            + "</h2><hr><h3>AP Courses:</h3>" + highSchool.advancedplacement_courses
	            + "<br><h3>Grad Rate: " + Math.round(highSchool.graduation_rate*100) + "% " + grad_rate_dif_str
	            + "<br>College Rate: " + Math.round(highSchool.college_career_rate*100) + "% " + col_rate_dif_str
	            + `<br>Website: <a href="http://${highSchool.website}">http://${highSchool.website}</a>`
	            + `<br>Email: <a href = "mailto:${highSchool.school_email}">${highSchool.school_email}</a>`
	            + "<br>Phone: " + highSchool.phone_number + "</h3>"
	            + "<hr>" + highSchool.overview_paragraph);
	          	//+ `<hr><a href="https://www.google.com/">High School</a>`;
	          	//+ `<hr><a href="/highschool">${highSchool.school_name}</a>`;
	      }
	      else {
	        var hsMarker = L.marker([highSchool.latitude, highSchool.longitude],  {icon: icons["HIGH_SCHOOL"]})
	          .bindPopup("<h2>" + `<a href="/highschool/${highSchool.school_name}">${highSchool.school_name}</a>`
	            + "</h2><hr><h3>Grad Rate: " + Math.round(highSchool.graduation_rate*100) + "% " + grad_rate_dif_str
	            + "<br>College Rate: " + Math.round(highSchool.college_career_rate*100) + "% " + col_rate_dif_str
	            + `<br>Website: <a href="http://${highSchool.website}">http://${highSchool.website}</a>`
	            + `<br>Email: <a href = "mailto:${highSchool.school_email}">${highSchool.school_email}</a>`
	            + "<br>Phone: " + highSchool.phone_number + "</h3>"
	            + "<hr>" + highSchool.overview_paragraph);
	      }
  	  }
  	  // Add the new marker to the appropriate layer
  	  hsMarker.addTo(layers["HIGH_SCHOOL_COL"]);
    }
    catch(err) {
      //console.log("High School: " + highSchool.school_name)
    }
  }
});

// COLLEGES
// https://www.flaticon.com/free-icon/college-graduation_70035#term=school&page=1&position=13
d3.json("https://data.cityofnewyork.us/resource/8pnn-kkif.json", function(response) {

  // Loop through the array
  for (var index = 0; index < response.length; index++) {
    var college = response[index];

    // For each, create a marker and bind a popup with the name
    try {
      var colMarker = L.marker([college.the_geom.coordinates[1],college.the_geom.coordinates[0]],  {icon: icons["COLLEGE"]})
        .bindPopup("<h3>" + college.name + "</h3>"
          + `<hr><a href="${college.url}">${college.url}</a>`);
    }
    catch(err) {
      //console.log("College: " + college.name)
    }
    
    // Add the new marker to the appropriate layer
    colMarker.addTo(layers["COLLEGE"]);
  }
});

// SUBWAY STATIONS
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


// AIRPORTS
var nyc_airport_urls = ["https://www.laguardiaairport.com/", "https://www.jfkairport.com/"];
d3.json("https://data.cityofnewyork.us/api/views/3q66-h7aj/rows.geojson?", function(response) {
  // Loop through the airports array
  for (var index = 0; index < response.features.length; index++) {
    var airport = response.features[index];

    // For each airport, create a marker and bind a popup with the airport's name
    try {
      var airMarker = L.marker([airport.geometry.coordinates[1], airport.geometry.coordinates[0]],  {icon: icons["AIRPORT"]})
        .bindPopup(`<h1><a href="${nyc_airport_urls[index]}">${airport.properties.name}</a></h1>`);
    }
    catch(err) {
      console.log("Airport Error: " + airport.properties.name)
    }
    
    // Add the new marker to the appropriate layer
    airMarker.addTo(layers["AIRPORT"]);
  }
});


// SCHOOL DISTRICTS
/*
// https://github.com/Gmousse/dataframe-js
var DataFrame = dfjs.DataFrame;

// https://infohub.nyced.org/reports-and-policies/citywide-information-and-data/graduation-results
DataFrame.fromCSV('../Resources/grad_rate.csv').then(df => {
	var disctrictGradRate = df.toArray();
	
	var link = "http://data.beta.nyc//dataset/98f0be40-6691-4de3-8a74-afdd87c7c5c2/resource/c49af687-77c1-45fd-a5e7-9684a44886fc/download/75d63b603aea4b4d92c5d15a65d4e982schooldistricts.geojson";

	// Grabbing our GeoJSON data..
	d3.json(link, function(data) {
		// Creating a geoJSON layer with the retrieved data

		var schoolDistrictLayer = L.geoJson(data, {
			// Style each feature
			style: function(feature) {
				return {
					color: "white",
					fillColor: "blue",
					fillOpacity: 0.5,
					weight: 1.5
				};
			},
			// Called on each feature
			onEachFeature: function(feature, layer) {
				// Set mouse events to change map styling
				layer.on({
					// When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 70% so that it stands out
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
					layer.bindPopup("<h2>School District: " + feature.properties.schoolDistrict + "</h2>"
						+ "<hr><h3>Graduation Rate: " 
						+ parseFloat(disctrictGradRate[parseInt(feature.properties.schoolDistrict)-1][1]).toFixed(2) + "%"
						+ "<br>Attendance: " + info[feature.properties.schoolDistrict-1].ytd_attendance_avg_ + "%"
						+ "<br>Enrollment: " + info[feature.properties.schoolDistrict-1].ytd_enrollment_avg_ + "</h3>");
				});
			}

		});
		schoolDistrictLayer.addTo(layers["SCHOOL_DISTRICT"]);
	});
});
*/
// https://infohub.nyced.org/reports-and-policies/citywide-information-and-data/graduation-results
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
			layer.bindPopup("<h2>School District: " + feature.properties.schoolDistrict + "</h2>"
				+ "<hr><h3>Average Graduation Rate: " + disctrictGradRate[feature.properties.schoolDistrict] 
				+ "<br>Average Attendance: " + info[feature.properties.schoolDistrict-1].ytd_attendance_avg_ + "%"
				+ "<br>Enrollment: " + info[feature.properties.schoolDistrict-1].ytd_enrollment_avg_ + "</h3>");

		});
    }

  });
  schoolDistrictLayer.addTo(layers["SCHOOL_DISTRICT"]);
});


// BOROUGHS
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
});


// NEIGHBORHOODS
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


// COST OF LIVING CHLOROPLETH
// Link to GeoJSON
var APILink = "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";

var geojson;
var jsonData;
var NYCCounties = ["Queens County", "New York County", "Richmond County", "Bronx County", "Kings County"];

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
    },

  
    filter: function(feature) {if (NYCCounties.indexOf(feature.properties.COUNTY) >=0 && feature.properties.HOUSINGCOS != 0) {return true;} else {return false;}}

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

      filter: function(feature) {if (NYCCounties.indexOf(feature.properties.COUNTY) >=0 && feature.properties.HOUSINGCOS < filterLevel && feature.properties.HOUSINGCOS != 0) {return true;} else {return false;}}
      //filter: function(feature) {if (feature.properties.HOUSINGCOS > filterLevel) {return false;} else {return true;}}

      
  
    });
    geojson.addTo(layers["COST_LIVING"]);
  });

});

/*
// CRIME CHLOROPLETH

//Import crime data from CSV file  and add crime stats to the precinct boundary marker geoJson file
//so the Cholorpleth can be based on the crime rate of the precincts
d3.csv("../Resources/Felonies_NYC_2017.csv", function(data) {
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
	    
	  })
	  geojson.addTo(layers["CRIME"]);
	});
});
*/








/*
layerControl.on({

        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          console.log(layerControl._layers[0].layer._map)
		console.log(layerControl._layers[1].layer._map)
		console.log(layerControl._layers[2].layer._map)
		console.log(layerControl._layers[3].layer._map)
        }
      });
      )
      
console.log(layerControl._layers[0].layer._map)
console.log(layerControl._layers[1].layer._map)
console.log(layerControl._layers[2].layer._map)
console.log(layerControl._layers[3].layer._map)
*/

// https://www.flaticon.com/free-icon/home_25694
var moveNYC = new L.marker([40.73, -74.0059],{
    draggable: true,
    autoPan: true,
    icon: greenIcon
}).addTo(map);