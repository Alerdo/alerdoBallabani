
var airports = L.markerClusterGroup().addTo(map);
var cities = L.markerClusterGroup().addTo(map);
var attractions = L.markerClusterGroup().addTo(map);
var parks = L.markerClusterGroup().addTo(map);

var overlays = {
    "Airports": airports,
    "Cities": cities,
    "Attractions": attractions,
    "Parks": parks
};

var layerControl = L.control.layers(null, overlays).addTo(map);

// 3. Define Icon Styles

var airportIcon = L.ExtraMarkers.icon({
    prefix: 'fa',
    icon: 'fa-plane',
    markerColor: 'red',
    shape: 'circle'
});

var cityIcon = L.ExtraMarkers.icon({
    prefix: 'fa',
    icon: 'fa-city',
    markerColor: 'blue',
    shape: 'circle'
});

var attractionsIcon = L.ExtraMarkers.icon({
    prefix: 'fa',
    icon: 'fa-landmark',
    markerColor: 'orange',
    shape: 'circle'
});

var parkIcon = L.ExtraMarkers.icon({
    prefix: 'fa',
    icon: 'fa-tree',
    markerColor: 'green',
    shape: 'circle'
});

function fetchMapData(countryCode, currentBoundingBox) {

    // Fetch Cities
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
            data.geonames.forEach(city => {
                L.marker([city.lat, city.lng], { icon: cityIcon })
                    .bindTooltip(city.name, { permanent: true, direction: 'right' })
                    .bindPopup(`Population: ${city.population}`)
                    .addTo(cities);
            });
        },
        error: function(err) {
            console.error("Error fetching cities:", err);
        }
    });

   
    $.ajax({
        url: '../Gazzeter/php/getAirports.php',
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',
        success: function(data) {
            let airportData = [];
    
            // Parse the XML data
            $(data).find('geoname').each(function() {
                airportData.push({
                    name: $(this).find('name').text(),
                    lat: parseFloat($(this).find('lat').text()),
                    lng: parseFloat($(this).find('lng').text())
                });
            });
    
            airportData.forEach(function(airport) {
                L.marker([airport.lat, airport.lng], { icon: airportIcon })
                    .bindTooltip(airport.name, { permanent: true, direction: 'right' })
                    .addTo(airports);
            });
        },
        error: function(err) {
            console.error("Error fetching airports:", err);
        }
    });
    
    


    // Fetch Attractions
    $.ajax({
        url: '../Gazzeter/php/getAttractions.php',  // Fixed the URL
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',  // Assuming the data is XML
        success: function(data) {
           let attractionsList = [];
            $(data).find('geoname').each(function() {
                attractionsList.push({
                    name: $(this).find('name').text(),
                    lat: parseFloat($(this).find('lat').text()),
                    lng: parseFloat($(this).find('lng').text())
                });
            });

            attractionsList.forEach(attraction => {
                L.marker([attraction.lat, attraction.lng], { icon: attractionsIcon })
                    .bindTooltip(attraction.name, { permanent: true, direction: 'right' })
                    .addTo(attractions);  // Assuming 'attractions' is a Leaflet layer/group
            });
        },
        error: function(err) {
            console.error("Error fetching attractions:", err);
        }
    });

    // Fetch Parks
    $.ajax({
        url: '../Gazzeter/php/getParks.php',  // Fixed the URL
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',  // Assuming the data is XML
        success: function(data) {
          let parksList = [];
            $(data).find('geoname').each(function() {
                parksList.push({
                    name: $(this).find('name').text(),
                    lat: parseFloat($(this).find('lat').text()),
                    lng: parseFloat($(this).find('lng').text())
                });
            });

            parksList.forEach(park => {
                L.marker([park.lat, park.lng], { icon: parkIcon })
                    .bindTooltip(park.name, { permanent: true, direction: 'right' })
                    .addTo(parks);  // Assuming 'parks' is a Leaflet layer/group
            });
        },
        error: function(err) {
            console.error("Error fetching parks:", err);
        }
    });
}


// ---------------Populate map functions --------------


  
// Populating Cities with clustering
function populateMap(cities) {
    var cityIcon = L.ExtraMarkers.icon({
        icon: 'fa-city',
        markerColor: 'blue',
        shape: 'circle',
        prefix: 'fas'
    });

    if (cityClusterGroup) {
        cityClusterGroup.clearLayers();
    } else {
        cityClusterGroup = L.markerClusterGroup();
    }

    cities.forEach(city => {
        let circleMarker = L.marker([city.lat, city.lng], { icon: cityIcon });
        circleMarker.bindTooltip(`${city.name}`, { permanent: true, direction: 'right' }).bindPopup(`Population: ${city.population}`);
        cityClusterGroup.addLayer(circleMarker);
    });

    if (!map.hasLayer(cityClusterGroup)) {
        map.addLayer(cityClusterGroup);
    }
}



// Populating Airports with clustering
function populateMapWithAirports(airports) {
    var airplaneIcon = L.ExtraMarkers.icon({
        icon: 'fa-plane',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fas'
    });

    if (airportClusterGroup) {
        map.removeLayer(airportClusterGroup);
    }

    airportClusterGroup = L.markerClusterGroup();

    airports.forEach(airport => {
        let marker = L.marker([airport.lat, airport.lng], { icon: airplaneIcon });
        marker.bindTooltip(`<strong>${airport.name}</strong>`);
        airportClusterGroup.addLayer(marker);
    });

    map.addLayer(airportClusterGroup);
}

// Populating Attractions with clustering
function populateAttractions(attractions) {
    const attractionsIcon = L.ExtraMarkers.icon({
        icon: 'fa-landmark',
        markerColor: 'orange',
        shape: 'circle',
        prefix: 'fas'
    });

    if (attractionsClusterGroup) {
        map.removeLayer(attractionsClusterGroup);
    }

    attractionsClusterGroup = L.markerClusterGroup();

    attractions.forEach(loc => {
        let marker = L.marker([loc.lat, loc.lng], { icon: attractionsIcon });
        marker.bindTooltip(loc.name);
        attractionsClusterGroup.addLayer(marker);
    });

    map.addLayer(attractionsClusterGroup);
}

// Populating Parks with clustering
function populateParks(parks) {
    const parkIcon = L.ExtraMarkers.icon({
        icon: 'fa-tree',
        markerColor: 'green',
        shape: 'circle',
        prefix: 'fas'
    });

    if (parksClusterGroup) {
        map.removeLayer(parksClusterGroup);
    }

    parksClusterGroup = L.markerClusterGroup();

    parks.forEach(loc => {
        let marker = L.marker([loc.lat, loc.lng], { icon: parkIcon });
        marker.bindTooltip(loc.name);
        parksClusterGroup.addLayer(marker);
    });

    map.addLayer(parksClusterGroup);
}