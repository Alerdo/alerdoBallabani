// Set initial map view
var map = L.map('map', {
    // center: [51.505, -0.09],
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

// // Add an easy button to your map
// L.easyButton('fa-globe', function(btn, map) {
//     alert("EasyButton clicked!");
// }, 'Button Title', {
//     position: 'topright'  // other options include 'topleft', 'bottomleft', 'bottomright'
// }).addTo(map);

// --------------------------------------------
//Populating the select menu
// 
// EF

$.ajax({
    url: '../Gazzeter/php/getCountryInfo.php',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
        let dropdown = $('#countrySelect');
        dropdown.empty();

        // Sort data alphabetically based on countryName
        data.sort((a, b) => a.countryName.localeCompare(b.countryName));

        // Default option
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
var countryLayer;
var infoLayer;   


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
            console.log(data)

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
                console.log(data)
                console.log(countryDetails)

               let countryInfo  = { //use this to display these information.
                    countryDetails: data.country,
                    countryName : countryDetails.countryName,
                    capital: countryDetails.capital,
                    continent: countryDetails.continent,
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
            
                //This will get data and populate the map with info 
                fetchMapData(countryInfo.iso, currentBoundingBox)

              /*4*/ //Extra Information 
              $(".custom-btn").off('click').click(function() {
                    const dataType = $(this).data("type");  // Get the data-type value from button 
                    switch (dataType) {
                        case "info":
                            // Call your function for the info button here.
                            fetchCountryData("info", countryInfo);  
                            break;
                        case "exchange":
                            // Call your function for the exchange button here.
                            fetchCurrencyInfo(countryInfo.currencyCode);
                            break;
                        case "weather":
                            fetchWeather(countryInfo.capital, countryInfo.countryName)
                            break;
                        case "news":
                            fetchNewsData(countryInfo.iso)
                            break;
                        case "center":
                            navigateToUserLocation()
                            break;
                        case "wikipedia":
                            getWikipediaInfo(countryInfo.countryName)
                    }
                });
                
            //   createButtons(countryInfo);
            
             
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
function fetchMapData(countryCode, currentBoundingBox) {
    // Fetch cities data
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

    // Fetch airports data
    $.ajax({
        url: '../Gazzeter/php/getAirports.php',
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',
        success: function(data) {
            let airports = [];
            $(data).find('geoname').each(function() {
                let airport = {
                    toponymName: $(this).find('toponymName').text(),
                    name: $(this).find('name').text(),
                    lat: parseFloat($(this).find('lat').text()),
                    lng: parseFloat($(this).find('lng').text()),
                };
                airports.push(airport);
            });
            populateMapWithAirports(airports);
        },
        error: function(err) {
            console.error("Error fetching airports:", err);
        }
    });

    // Fetch attractions data
    $.ajax({
        url: '../Gazzeter/php/getAttractions.php',
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',
        success: function(data) {
            let attractions = [];
            $(data).find('geoname').each(function() {
                attractions.push({
                    name: $(this).find('name').text(),
                    lat: parseFloat($(this).find('lat').text()),
                    lng: parseFloat($(this).find('lng').text())
                });
            });
            populateAttractions(attractions);
        },
        error: function(err) {
            console.error("Error fetching attractions:", err);
        }
    });

    //Fetch protected area
    $.ajax({
        url: '../Gazzeter/php/getParks.php',
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',
        success: function(data) {
            let parks = [];
            $(data).find('geoname').each(function() {
                parks.push({
                    name: $(this).find('name').text(),
                    lat: parseFloat($(this).find('lat').text()),
                    lng: parseFloat($(this).find('lng').text())
                });
            });
            populateParks(parks);
        },
        error: function(err) {
            console.error("Error fetching protected areas:", err);
        }
    });
}

// Global marker cluster group declarations
var cityClusterGroup;
var airportClusterGroup;
var attractionsClusterGroup;
var parksClusterGroup;
var countryLayer;

// ...
// Country Select change listener
$('#countrySelect').on('change', function() {
    let isoCode = $(this).val();

    if (countryLayer) {
        map.removeLayer(countryLayer);
    }

    fetchCountryInfo(isoCode);
    fetchCountryBorder(isoCode);
});

// Populating Cities with clustering
function populateMap(cities) {
    var cityIcon = L.ExtraMarkers.icon({
        icon: 'fa-city',
        markerColor: 'blue',
        shape: 'circle',
        prefix: 'fas'
    });

    if (cityClusterGroup) {
        map.removeLayer(cityClusterGroup);
    }

    cityClusterGroup = L.markerClusterGroup();

    cities.forEach(city => {
        let circleMarker = L.marker([city.lat, city.lng], { icon: cityIcon });
        circleMarker.bindTooltip(`${city.name}`, { permanent: true, direction: 'right' }).bindPopup(`Population: ${city.population}`);
        cityClusterGroup.addLayer(circleMarker);
    });

    map.addLayer(cityClusterGroup);
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








//  ------------------------------------------INFO TAB ------------------------------


function fetchCountryData(type, param) {
    $("#loading-spinner").show();

    if(type === 'info') {
            let content = `
            <strong>Country Name:</strong> ${param.countryName}<br>
            <strong>Capital:</strong> ${param.capital}<br>
            <strong>Continent:</strong> ${param.continent}<br>
            <strong>Population:</strong> ${param.population}<br>
            <strong>Area:</strong> ${param.area} sq. km.<br>
            <strong>Currency Code:</strong> ${param.currencyCode}<br>
            <strong>ISO Code:</strong> ${param.iso}<br>
            `;

            // Update modal title
            
            $("#loading-spinner").hide();
            $("#exampleModal .modal-title").html("Info");
            // Update modal content with the generated content string
            $("#exampleModal").modal("show");
            $("#modalContent").html(content);      
    }
}


// ----------------------------------Fetch Currency Info------------------------------


function fetchCurrencyInfo(currencyCode) {
    $("#loading-spinner").show();
    
    $.ajax({
        url: '../Gazzeter/php/exchangeRate.php',
        method: 'GET',
        dataType: 'json',
        data: {
            currencyCode: currencyCode
        },
        success: function(data) {
            if (data && data.rates) {
                $("#loading-spinner").hide();
                $("#exampleModal .modal-title").html("Local Currency Exchange");

                // Create an input field for user to enter a value in the local currency
                const inputField = `
                    <label for="currencyInput">Local Currency (${currencyCode}):</label>
                    <input type="number" id="currencyInput" value="1" style="width:100%; padding: 10px; margin-bottom: 10px;">
                `;
                
                $("#modalContent").html(inputField);
                $("#modalContent").append('<div id="conversionResults"></div>');

                // Event listener to update conversion values when input is changed
                $("#currencyInput").on("keyup change", function() {
                    const amount = parseFloat($(this).val()) || 1;
                    updateConversionValues(data.rates, amount, currencyCode);
                });

                // Initial conversion display
                updateConversionValues(data.rates, 1, currencyCode);
                
                $("#exampleModal").modal("show");
            } else {
                let errorMsg = data.error || "Unexpected data format";
                alert("Error fetching exchange rate: " + errorMsg);
            }
        },
        error: function(err) {
            alert("Error fetching exchange rate. Please try again later.");
        }
    });
}



function updateConversionValues(rates, amount, currencyCode) {
    let usdRate = rates.USD ? (rates.USD * amount).toFixed(2) : "N/A";
    let eurRate = rates.EUR ? (rates.EUR * amount).toFixed(2) : "N/A";
    let gbpRate = rates.GBP ? (rates.GBP * amount).toFixed(2) : "N/A";
    let jpyRate = rates.JPY ? (rates.JPY * amount).toFixed(2) : "N/A";

    let content = `
        <strong>${amount} ${currencyCode} is equivalent to:</strong><br>
        USD: $${usdRate}<br>
        EUR: €${eurRate}<br>
        GBP: £${gbpRate}<br>
        JPY: ¥${jpyRate}
    `;

    $("#conversionResults").html(content);
}






/*-------------------------Fetch Weather Data----------------------------------*/
function fetchWeather(capital, country) {
    $("#loading-spinner").show();

    $.ajax({
        url: '../Gazzeter/php/getWeather.php',  // Change this to the actual path
        type: 'GET',
        data: { capital: capital },
        dataType: 'json',
        success: function(data) {
            if (data.location && data.current) {
                const weatherData = data.current;
                const locationData = data.location;
                // <h4>Weather Information for ${locationData.name}, ${locationData.country}</h4>
                const content = `
                  
                    <p><strong>Temperature:</strong> ${weatherData.temp_c}°C (${weatherData.temp_f}°F)</p>
                    <p><strong>Condition:</strong> ${weatherData.condition.text}</p>
                    <p><img src="${weatherData.condition.icon}" alt="${weatherData.condition.text} icon" ></p>
                    <p><strong>Wind Speed:</strong> ${weatherData.wind_kph} km/h (${weatherData.wind_mph} mph) from ${weatherData.wind_dir}</p>
                    <p><strong>Humidity:</strong> ${weatherData.humidity}%</p>
                    <p><strong>Pressure:</strong> ${weatherData.pressure_mb} mb (${weatherData.pressure_in} in)</p>
                `;
                $("#loading-spinner").hide();
                $("#exampleModal .modal-title").html(`Weather now in ${country}`);
                $("#exampleModal").modal("show");
                $("#modalContent").html(content);
            }
        },
        error: function(error) {
            console.error("Error fetching weather data:", error);
            $("#modalContent").html('<p>Error fetching weather data. Please try again later.</p>');
        }
    });
}




// ---------------------------FETCH NEWS DATA --------------------------------------

function fetchNewsData(countryCode) {
    $("#loading-spinner").show();

    $.ajax({
        url: '../Gazzeter/php/getNewsData.php',
        method: 'GET',
        dataType: 'json',
        data: {
            countryCode: countryCode
        },
        success: function(data) {
            if (data && data.articles) {
                const articles = data.articles;
                let content = '<h5 class="news"></h5>'


                articles.forEach(article => {
                    content += `
                    <div>
                        <strong>${article.title}</strong><br>
                        Author: ${article.author}<br>
                        Source: ${article.source.name}<br>
                        Published At: ${article.publishedAt}<br>
                        <a href="${article.url}" target="_blank">Read more...</a><br>
                        <hr>
                    </div>`;
                });

                $("#loading-spinner").hide();
                $("#exampleModal .modal-title").html(`News`);
                $("#modalContent").html(content);
                $("#exampleModal").modal("show");
            } else {
                console.error("Invalid data returned from API:", data);
            }
        },
        error: function(err) {
            console.error("Error fetching news data:", err);
        }
    });
}

// -----------------------------CENTRE USER TO ITS LOCATION ---------------------------------------
function navigateToUserLocation() {
    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            // Center the map on the user's location
            map.setView([lat, lon], 10); // 13 is the zoom level
            // Add a marker to the user's location
            L.marker([lat, lon]).addTo(map)
                .bindPopup('You are here.').openPopup();
        }, function(error) {
            alert("Error: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}



// ----------------------------- GET WIKIPEDIA INFORMATION ---------------------------------------

function getWikipediaInfo(countryName) {
    console.log("Function called with country:", countryName);

    $.ajax({
        url: "../Gazzeter/php/getWikipediaInfo.php",
        method: "GET",
        dataType: "json",
        data: { countryName: countryName },
        success: function(data) {
            if (data && data.query && data.query.pages) {
                // Extract the Wikipedia content from the response
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                let fullText = pages[pageId].extract;

                // Extract the first non-empty paragraph using regex
                const firstParagraphMatches = fullText.match(/<p>(?!<)(.*?)<\/p>/);

                if (firstParagraphMatches && firstParagraphMatches[1]) {
                    // Generate the link to the full Wikipedia article
                    const articleLink = "https://en.wikipedia.org/wiki/" + encodeURIComponent(pages[pageId].title);
                    
                    // Populate the modal with the first paragraph and the link
                    $("#exampleModal .modal-title").html(`About ${countryName}`);
                    $("#modalContent").html(firstParagraphMatches[1] + `<br><br><a href="${articleLink}" target="_blank">Read full article on Wikipedia</a>`);
                    $("#exampleModal").modal("show");
                } else {
                    console.error("Error parsing the Wikipedia data.");
                    $("#modalContent").html('<p>Error fetching Wikipedia info. Please try again later.</p>');
                }
            } else if (data.error) {
                console.log("Error from server:", data.error);
                $("#modalContent").html('<p>Error fetching Wikipedia info. Please try again later.</p>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX request error:", textStatus, "|", errorThrown);
            $("#modalContent").html('<p>Error fetching Wikipedia info. Please try again later.</p>');
        }
    });
}


// --------------------------SIDE BUTTONS LOGIC FINISH ----------------------------------






//Styling 
$(document).ready(function() {
    // Listener for close button
    $(".btn-close").on("click", () => {
        $("#exampleModal").modal("hide");
    });
    $(".btn-minus").on("click", () =>{
        $("#exampleModal").modal("hide");
    });
});



//Testing extra markers
L.ExtraMarkers.icon({
    icon: 'fa-coffee',
    markerColor: 'blue',
    shape: 'square',
    prefix: 'fa'
});

L.marker([lat, lon], { icon: myIcon }).addTo(map);
