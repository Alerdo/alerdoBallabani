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


L.easyButton("fa-info fa-lg", function (btn, map) {
  $("#exampleModal").modal("show");
}).addTo(map);



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



// Create a cluster group
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
$.ajax({
    url: '../Gazzeter/php/getCountryInfo.php',  // Adjusted path
    method: 'GET',
    dataType: 'json',
    success: function(data) {
        let dropdown = $('#countrySelect');
        dropdown.empty();

        // If you want a default option
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

