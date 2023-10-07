// Set initial map view
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 12,
    layers: [] // We'll initialize without any default layer, then add it based on user preference or default to one.
});

// Street view tile layer
var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
});

// Satellite view tile layer
var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
});


// national geoagrphic 
var natGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
});

//Topographic

var esriTopographic = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, (c) OpenStreetMap contributors, and the GIS User Community'
});

// Define base maps for layer control
var baseMaps = {
    "Streets": streets,
    "Satellite": satellite,
    "National Geographic": natGeoWorldMap ,
    "Topographic": esriTopographic
};

// Add control to switch between layers
L.control.layers(baseMaps).addTo(map);

// Setting 'streets' as default layer
satellite.addTo(map);


//INFO BUTTON 


// L.easyButton("fa-info fa-lg", function (btn, map) {
//   $("#exampleModal").modal("show");
// }).addTo(map);



//FINISH INFO BUTTON 


// !IMPORTANT Create a FeatureGroup to hold multiple markers and polylines
var featureGroup = L.featureGroup().addTo(map);

// Example markers
var marker1 = L.marker([51.5, -0.09]);
var marker2 = L.marker([51.6, -0.1]);

// Example polyline
var polyline = L.polyline([
    [51.5, -0.09],
    [51.6, -0.1]
]);

// Add markers and polyline to the feature group
featureGroup.addLayer(marker1);
featureGroup.addLayer(marker2);
featureGroup.addLayer(polyline);

// Automatically fit bounds to feature group
map.fitBounds(featureGroup.getBounds());  //IMPORTANT: You will use this to display info based on the cordinates of the country



// FIT BOUND FINISH ///////////////////////////////////



// Create a cluster group //SO THAT THE ICONS CHANGE SIZE BASED ON ZOOM-IN AND ZOOM-OUT
var markers = L.markerClusterGroup();

// Example markers with adjusted coordinates
var marker1 = L.marker([51.52, -0.09]);
var marker2 = L.marker([51.63, -0.11]);

// Add markers to the cluster group
markers.addLayer(marker1);
markers.addLayer(marker2);

// Add the cluster group to the map
map.addLayer(markers); 

// Add an easy button to your map
L.easyButton('fa-globe', function(btn, map) {
    alert("EasyButton clicked!");
}, 'Button Title', {
    position: 'topright'  // other options include 'topleft', 'bottomleft', 'bottomright'
}).addTo(map);

// Extra marker
var redMarker = L.ExtraMarkers.icon({
    icon: 'fa-number',
    markerColor: 'red',
    shape: 'circle',
    prefix: 'fa'
});

// Using the custom marker
L.marker([51.7, -0.09], {icon: redMarker}).addTo(map);




// --------------------------------------------
//Populating the select menu

$.ajax({
    url: '../Gazzeter/php/getCountryInfo.php',  // Adjusted path
    method: 'GET',
    dataType: 'json',
    success: function(data) {
        let dropdown = $('#countrySelect');
        dropdown.empty();

        // Here I will put  a default option
        dropdown.append('<option selected="true" disabled>Select Country</option>');
        dropdown.prop('selectedIndex', 0);

        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.isoCode).text(entry.countryName));
        });
    },
    error: function(err) {
        console.error("Error fetching countries:", err);
    }
});


//mapping the area of the selected country



$('#countrySelect').on('change', function() {
   let isoCode = $(this).val();

    fetchCountryBorder(isoCode); //calling the function here so we make sure isoCode has an value
});



function fetchCountryBorder(isoCode) {
    $.ajax({
        url: '../Gazzeter/php/getCountryInfo.php',  // relative path 
        data: {
            isoCode: isoCode
        },
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // Clear previous layers
            if (typeof countryLayer !== 'undefined') {
                map.removeLayer(countryLayer);
            }

            // Draw the country border using L.geoJSON
            countryLayer = L.geoJSON(data).addTo(map);
            map.fitBounds(countryLayer.getBounds());
        },
        error: function(err) {
            console.error("Error fetching country border:", err);
        }
    });
}



/// GETING THE USER'S LOCATION 
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        
        // Call the PHP script to get the country ISO based on lat and lon (navigator brings back lat and lon)
        //Using the geonames api becasue I can not get the country code just by geting the coordinates
        $.ajax({
            url: '../Gazzeter/php/getIsoCode.php',
            data: {
                lat: lat,
                lon: lon
            },
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data && data.countryCode) {
                    //selecting the country for hte menu based on countryCode
                    $('#countrySelect').val(data.countryCode);
                     // Fetch country info here after setting isoCode becasue if I call it outsite isoCode its not setup yet
                     fetchCountryInfo(data.countryCode);
                    fetchCountryBorder(data.countryCode);
                }
            },
            error: function(err) {
                console.error("Error fetching country ISO:", err);
            }
        });
    });
}


// --------------Adding information and pins about diffrent developments on the selected country ---------------------


 //Make a call to get basic info so I can use it for subsequent calls.

 function fetchCountryInfo(countryCode) {
    $.ajax({
        url: '../Gazzeter/php/baseCountryInfo.php',
        method: 'GET',
        dataType: 'json',
        data: {
            countryCode: countryCode
        },
        success: function(data) {
            if (data && data.country) {
                const   countryDetails = data.country;

               let countryInfo  = { //use this to display these information.
                    countryDetails: data.country,
                    countryName : countryDetails.countryName,
                    population: countryDetails.population,
                    area: countryDetails.areaInSqKm,
                    currencyCode: countryDetails.currencyCode,
                    iso: countryCode,
             }
                // Updating the currentBoundingBox object
               let currentBoundingBox = {
                    north: countryDetails.north,
                    south: countryDetails.south,
                    east: countryDetails.east,
                    west: countryDetails.west
                };
              
               // 1-  Fetch cities now after updating the bounding box
                fetchCitiesWithinBoundingBox(currentBoundingBox);

              // 2- Fetch data about the country 
              L.easyButton("fa-info fa-lg", function (btn, map) {
                fetchAndDisplayExchangeRate(countryInfo.currencyCode);  
                 }).addTo(map);

              // 3- FetchAndDisplayExchangeRate(countryInfo.currencyCode)
                L.easyButton("fa-info fa-lg", function (btn, map) {
                    fetchAndDisplayExchangeRate(countryInfo.currencyCode);
                }).addTo(map);

              // 4- Fetch and display other data about weather
              createButtons(countryInfo);
              // 5- Fetch and display other data about flags
            } else {
                console.error("Invalid data returned from API:", data);
            }
        },
        error: function(err) {
            console.error("Error fetching country info:", err);
        }
    });
}



// Moved AJAX call for cities into its own function
function fetchCitiesWithinBoundingBox(currentBoundingBox) {
    $.ajax({
        url: '../Gazzeter/php/getCitiesInfo.php',
        data: { 
            north: currentBoundingBox.north,
            south: currentBoundingBox.south,
            east: currentBoundingBox.east,
            west: currentBoundingBox.west
        },
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            populateMap(data.geonames);
        },
        error: function(err) {
            console.error("Error fetching cities:", err);
        }
    });
}


function populateMap(cities) {
    // If you have previously added markers or layers to the map, clear them
    if (typeof markers !== 'undefined') { map.removeLayer(markers);}
    var markers = L.markerClusterGroup();  // Create a marker cluster group
    cities.forEach(city => {
        let circleMarker = L.circleMarker([city.lat, city.lng], {
            radius: 3,  // Adjust the size if necessary
            color: 'blue',  // Circle color
            fillOpacity: 1  // Fill the circle
        });
        circleMarker.bindTooltip(`
            <strong>${city.name}</strong>
            <br>
            Population: ${city.population}
        `, {
            permanent: false,  // This means the tooltip will only show on hover
            direction: 'right'
        });
        markers.addLayer(circleMarker);  // Add each marker to the cluster group
    });
    map.addLayer(markers);  // Add the marker cluster group to the map
}



//Currency Info 

// Function to fetch exchange rate and display in modal
function fetchAndDisplayExchangeRate(currencyCode) {
    $.ajax({
        url: '../Gazzeter/php/exchangeRate.php',
        method: 'GET',
        dataType: 'json',
        data: {
            currencyCode:  currencyCode // For example: 'USD'
        },
        success: function(data) {
            if (data.rates && data.rates[currencyCode]) {
                let rate = data.rates[currencyCode];
                let content = `<strong>Exchange Rate for ${currencyCode}:</strong> ${rate}`;
                console.log(rate)
                
                // Assuming your modal has a content div with id="modalContent"
                $("#modalContent").html(content);

                // Show the modal
                $("#exampleModal").modal("show");
            } else {
                // Handle any error message from the API or unexpected response structure
                let errorMsg = data.error || "Unexpected data format";
                alert("Error fetching exchange rate: " + errorMsg);
            }
        },
        error: function(err) {
            alert("Error fetching exchange rate. Please try again later.");
        }
    });
}





//This function will create all the buttons on the left of the mapp , and will require to be called inside a function 
// where it can get it nesecary parameters 
function createButtons(countryInfo) {
    
    // Example: creating button for displaying exchange rate
    L.easyButton('fa-money-bill-alt', function (btn, map) {
        fetchAndDisplayExchangeRate(countryInfo.currencyCode);  
    }, 'View Exchange Rate').addTo(map);

   
    L.easyButton('fa-info-circle', function (btn, map) {
       
        fetchAndDisplayCountryInfo(countryInfo, someOtherData, anotherPieceOfData);
    }, 'View Country Info').addTo(map);

    // And so on for other buttons...
}