// // Moved AJAX call for cities into its own function
// function fetchMapData(countryCode, currentBoundingBox) {
//     // Fetch cities data
//     $.ajax({
//         url: '../Gazzeter/php/getCitiesInfo.php',
//         data: { 
//             north: currentBoundingBox.north,
//             south: currentBoundingBox.south,
//             east: currentBoundingBox.east,
//             west: currentBoundingBox.west
//         },
//         method: 'GET',
//         dataType: 'json',
//         success: function(data) {
//             populateMap(data.geonames);
//         },
//         error: function(err) {
//             console.error("Error fetching cities:", err);
//         }
//     });

//     // Fetch airports data
//     $.ajax({
//         url: '../Gazzeter/php/getAirports.php',
//         data: { countryCode: countryCode },
//         method: 'GET',
//         dataType: 'xml',
//         success: function(data) {
//             let airports = [];
//             $(data).find('geoname').each(function() {
//                 let airport = {
//                     toponymName: $(this).find('toponymName').text(),
//                     name: $(this).find('name').text(),
//                     lat: parseFloat($(this).find('lat').text()),
//                     lng: parseFloat($(this).find('lng').text()),
//                 };
//                 airports.push(airport);
//             });
//             populateMapWithAirports(airports);
//         },
//         error: function(err) {
//             console.error("Error fetching airports:", err);
//         }
//     });

//     // Fetch attractions data
//     $.ajax({
//         url: '../Gazzeter/php/getAttractions.php',
//         data: { countryCode: countryCode },
//         method: 'GET',
//         dataType: 'xml',
//         success: function(data) {
//             let attractions = [];
//             $(data).find('geoname').each(function() {
//                 attractions.push({
//                     name: $(this).find('name').text(),
//                     lat: parseFloat($(this).find('lat').text()),
//                     lng: parseFloat($(this).find('lng').text())
//                 });
//             });
//             populateAttractions(attractions);
//         },
//         error: function(err) {
//             console.error("Error fetching attractions:", err);
//         }
//     });

//     //Fetch protected area
//     $.ajax({
//         url: '../Gazzeter/php/getParks.php',
//         data: { countryCode: countryCode },
//         method: 'GET',
//         dataType: 'xml',
//         success: function(data) {
//             let parks = [];
//             $(data).find('geoname').each(function() {
//                 parks.push({
//                     name: $(this).find('name').text(),
//                     lat: parseFloat($(this).find('lat').text()),
//                     lng: parseFloat($(this).find('lng').text())
//                 });
//             });
//             populateParks(parks);
//         },
//         error: function(err) {
//             console.error("Error fetching protected areas:", err);
//         }
//     });
// }





// // ------------------------------------------------------2-------------------------------------
// function fetchMapData(countryCode) {

//     // Fetch Cities
//     $.ajax({
//         url: '../Gazzeter/php/getCitiesInfo.php',
//         data: {
//             north: currentBoundingBox.north,
//             south: currentBoundingBox.south,
//             east: currentBoundingBox.east,
//             west: currentBoundingBox.west
//         },
//         method: 'GET',
//         dataType: 'json',
//         success: function(data) {
//             data.geonames.forEach(city => {
//                 L.marker([city.lat, city.lng], { icon: cityIcon })
//                     .bindTooltip(city.name, { permanent: true, direction: 'right' })
//                     .bindPopup(`Population: ${city.population}`)
//                     .addTo(cities);
//             });
//         },
//         error: function(err) {
//             console.error("Error fetching cities:", err);
//         }
//     });

//     // Fetch Airports
//     $.ajax({
//         url: '../Gazzeter/php/getAirportsInfo.php',
//         data: { countryCode: countryCode },
//         method: 'GET',
//         dataType: 'json',
//         success: function(data) {
//             data.geonames.forEach(airport => {
//                 L.marker([airport.lat, airport.lng], { icon: airportIcon })
//                     .bindTooltip(airport.name, { permanent: true, direction: 'right' })
//                     .bindPopup(`Code: ${airport.code}`)
//                     .addTo(airports);
//             });
//         },
//         error: function(err) {
//             console.error("Error fetching airports:", err);
//         }
//     });



    

//     // Fetch Attractions
//     $.ajax({
//         url: '../Gazzeter/php/getAttractionsInfo.php',
//         data: { countryCode: countryCode },
//         method: 'GET',
//         dataType: 'json',
//         success: function(data) {
//             data.geonames.forEach(attraction => {
//                 L.marker([attraction.lat, attraction.lng], { icon: attractionsIcon })
//                     .bindTooltip(attraction.name, { permanent: true, direction: 'right' })
//                     .bindPopup(`Description: ${attraction.description}`)
//                     .addTo(attractions);
//             });
//         },
//         error: function(err) {
//             console.error("Error fetching attractions:", err);
//         }
//     });

//     // Fetch Parks
//     $.ajax({
//         url: '../Gazzeter/php/getParksInfo.php',
//         data: { countryCode: countryCode },
//         method: 'GET',
//         dataType: 'json',
//         success: function(data) {
//             data.geonames.forEach(park => {
//                 L.marker([park.lat, park.lng], { icon: parkIcon })
//                     .bindTooltip(park.name, { permanent: true, direction: 'right' })
//                     .bindPopup(`Description: ${park.description}`)
//                     .addTo(parks);
//             });
//         },
//         error: function(err) {
//             console.error("Error fetching parks:", err);
//         }
//     });
// }
