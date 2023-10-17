// Set initial map view
const map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 12,
    layers: [] // We'll initialize without any default layer, then add it based on user preference or default to one.
});

// Street view tile layer
const streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
});

// Satellite view tile layer
const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
});


// national geoagrphic 
const natGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
});

//Topographic

const esriTopographic = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, (c) OpenStreetMap contributors, and the GIS User Community'
});

// Define base maps for layer control
const baseMaps = {
    "Streets": streets,
    "Satellite": satellite,
    "National Geographic": natGeoWorldMap ,
    "Topographic": esriTopographic
};

// Add control to switch between layers
// var layerControl = L.control.layers(baseMaps, overlays).addTo(map);

// Setting 'streets' as default layer
satellite.addTo(map);








//For every country selected we need borders, and info. This function provides that
function runCountryData(isoCode) {
    fetchCountryBorder(isoCode);
    fetchCountryInfo(isoCode);
}

// Country Select change listener, this is valid when we choose one country using the dropdown menu

$('#countrySelect').on('change', function() {
    let isoCode = $(this).val();

    runCountryData(isoCode) 

    
});

//Populating the select menu 1

$.ajax({
    url: '../Gazzeter/php/getCountryInfo.php',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
        let dropdown = $('#countrySelect');
        dropdown.empty(); //empty the dropdown if country is already selected

        // Sort data alphabetically based on countryName
        data.sort((a, b) => a.countryName.localeCompare(b.countryName));

        // Default option
        dropdown.append('<option selected="true" disabled>Select Country</option>');
        dropdown.prop('selectedIndex', 0);
        
        //for each country append <option> and value="isoCode"
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.isoCode).text(entry.countryName));
        });
    },
    error: function(err) {
        console.error("Error fetching countries:", err);
    }
});



/// GETING THE USER'S LOCATION AND CHANGING THE SELECT MENU 2
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
                    //selecting the country for the menu based on countryCode
                    $('#countrySelect').val(data.countryCode);
                    runCountryData(data.countryCode) 
                }
            },
            error: function(err) {
                console.error("Error fetching country ISO:", err);
            }
        });
    });
}


//2 mapping the area of the selected country

let countryLayer;
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
            console.log(data);

            // Draw the country border using L.geoJSON
            countryLayer = L.geoJSON(data, {
                style: {
                    fillColor: '#3388ff', // Change this color if you have another preference
                    fillOpacity: 0.4,
                    weight: 1, // Stroke weight (border thickness)
                    color: 'white', // Stroke color (border color)
                    opacity: 1  // Stroke opacity
                }
            }).addTo(map);
            map.fitBounds(countryLayer.getBounds());
        },
        error: function(err) {
            console.error("Error fetching country border:", err);
        }
    });
}


let buttons = {
    info: null,
    wikipedia: null,
    currency: null,
    weather: null,
    news: null,
    center: null
};

function clearButtons() {
    for (let key in buttons) {
        if (buttons[key]) {
            buttons[key].remove();
            buttons[key] = null;
        }
    }
}

function fetchCountryInfo(countryCode) {
    $.ajax({
        url: '../Gazzeter/php/baseCountryInfo.php',
        method: 'GET',
        dataType: 'json',
        data: { countryCode: countryCode },

        success: function(data) {
            if (data && data.country) {
                const countryDetails = data.country;
                let countryInfo = {
                    countryDetails: data.country,
                    countryName: countryDetails.countryName,
                    capital: countryDetails.capital,
                    continent: countryDetails.continent,
                    population: countryDetails.population,
                    area: countryDetails.areaInSqKm,
                    currencyCode: countryDetails.currencyCode,
                    iso: countryCode
                };

                let currentBoundingBox = {
                    north: countryDetails.north,
                    south: countryDetails.south,
                    east: countryDetails.east,
                    west: countryDetails.west
                };

                clearButtons();
                fetchMapData(countryInfo.iso, currentBoundingBox);

                if (!buttons.info) {
                    buttons.info = L.easyButton('fa-info-circle', function(btn, map) {
                        fetchCountryData("info", countryInfo);
                    }, 'Info').addTo(map);

                    buttons.wikipedia = L.easyButton('fa-book', function(btn, map) {
                        getWikipediaInfo(countryInfo.countryName);
                    }, 'Wikipedia').addTo(map);

                    buttons.currency = L.easyButton('fa-money-bill-alt', function(btn, map) {
                        fetchCurrencyInfo(countryInfo.currencyCode);
                    }, 'Currency').addTo(map);

                    buttons.weather = L.easyButton('fa-cloud-sun', function(btn, map) {
                        fetchWeather(countryInfo.capital, countryInfo.countryName);
                    }, 'Weather').addTo(map);

                    buttons.news = L.easyButton('fa-newspaper', function(btn, map) {
                        fetchNewsData(countryInfo.iso);
                    }, 'News').addTo(map);

                    // buttons.center = L.easyButton('fa-crosshairs', function(btn, map) {
                    //     navigateToUserLocation();
                    // }, 'Center').addTo(map);

                    // Check if buttons are created
                    for (let key in buttons) {
                        if (!buttons[key]) {
                            console.error("Button", key, "was not created!");
                        }
                    }
                } else {
                    // Update event listeners of existing buttons
                    buttons.info.off('click').on('click', function(btn, map) {
                        fetchCountryData("info", countryInfo);
                    });

                    buttons.wikipedia.off('click').on('click', function(btn, map) {
                        getWikipediaInfo(countryInfo.countryName);
                    });

                    buttons.currency.off('click').on('click', function(btn, map) {
                        fetchCurrencyInfo(countryInfo.currencyCode);
                    });

                    buttons.weather.off('click').on('click', function(btn, map) {
                        fetchWeather(countryInfo.capital, countryInfo.countryName);
                    });

                    buttons.news.off('click').on('click', function(btn, map) {
                        fetchNewsData(countryInfo.iso);
                    });

                    buttons.center.off('click').on('click', function(btn, map) {
                        navigateToUserLocation();
                    });
                }
            } else {
                console.error("Invalid data returned from API:", data);
            }
        },
        error: function(err) {
            console.error("Error fetching country info:", err);
        }
    });
}





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

var layerControl = L.control.layers(baseMaps, overlays).addTo(map);

// 3. Define Icon Styles

var airportIcon = L.ExtraMarkers.icon({
    prefix: 'fa',
    icon: 'fa-plane',
    iconColor: 'black',
    markerColor: 'white',
    shape: 'square'
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
            cities.clearLayers();
            data.geonames.forEach(city => {
                L.marker([city.lat, city.lng], { icon: cityIcon })
                    .bindTooltip(city.name, { direction: 'right' }) // No 'permanent: true'
                    .bindPopup(`Population: ${city.population}`)
                    .addTo(cities);
            });
        },
        error: function(err) {
            console.error("Error fetching cities:", err);
        }
    });

    // Fetch Airports
    $.ajax({
        url: '../Gazzeter/php/getAirports.php',
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',
        success: function(data) {
            airports.clearLayers();
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
                    .bindTooltip(airport.name, { direction: 'right' }) // No 'permanent: true'
                    .addTo(airports);
            });
        },
        error: function(err) {
            console.error("Error fetching airports:", err);
        }
    });

    // Fetch Attractions
    $.ajax({
        url: '../Gazzeter/php/getAttractions.php',
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',
        success: function(data) {
            attractions.clearLayers();
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
                    .bindTooltip(attraction.name, { direction: 'right' }) // No 'permanent: true'
                    .addTo(attractions);
            });
        },
        error: function(err) {
            console.error("Error fetching attractions:", err);
        }
    });

    // Fetch Parks
    $.ajax({
        url: '../Gazzeter/php/getParks.php',
        data: { countryCode: countryCode },
        method: 'GET',
        dataType: 'xml',
        success: function(data) {
            parks.clearLayers();
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
                    .bindTooltip(park.name, { direction: 'right' }) // No 'permanent: true'
                    .addTo(parks);
            });
        },
        error: function(err) {
            console.error("Error fetching parks:", err);
        }
    });
}




//  ------------------------------------------INFO TAB ------------------------------

function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

function fetchCountryData(type, param) {
    $("#loading-spinner").show();

    if (type === 'info') {
        // Populate the modal fields directly
        $("#countryName").text(param.countryName);
        $("#capitalCity").text(param.capital);
        $("#continent").text(param.continent);
        const formattedPopulation = formatNumber(param.population);
const formattedArea = formatNumber(param.area);

$("#population").text(formattedPopulation);
$("#areaInSqKm").text(formattedArea);

        $("#currencyCode").text(param.currencyCode);
        $("#isoCode").text(param.iso);

        // Hide the spinner and display the modal
        $("#loading-spinner").hide();
        $("#exampleeModal").modal("show");
    }
}



// ----------------------------------Fetch Currency Info------------------------------

function fetchCurrencyInfo(currencyCode) {
    $("#loading-spinner").show(); // Show pre-loading animation or any indication of loading
    
    $.ajax({
        url: '../Gazzeter/php/exchangeRate.php',
        method: 'GET',
        dataType: 'json',
        data: {
            currencyCode: currencyCode
        },
        success: function(data) {
            if (data && data.rates) {
                // Set modal title
                $("#loading-spinner").hide()
                $("#currencyInfoModal .modal-title").html('<i class="fa-solid fa-coins fa-xl me-2"></i>Local Currency Exchange');

                // Create an input field for user to enter a value in the local currency
                const inputField = `
                    <label for="currencyInput">Local Currency (${currencyCode}):</label>
                    <input type="number" id="currencyInput" value="1" class="form-control mb-3">
                `;
                
                // Set the content of the modal-body
                $("#currencyInfoModal .modal-body").html(inputField);
                $("#currencyInfoModal .modal-body").append('<div id="conversionResults"></div>');

                // Event listener to update conversion values when input is changed
                $("#currencyInput").on("keyup change", function() {
                    const amount = parseFloat($(this).val()) || 1;
                    updateConversionValues(data.rates, amount, currencyCode);
                });

                // Initial conversion display
                updateConversionValues(data.rates, 1, currencyCode);

                // Show the modal
                $("#currencyInfoModal").modal("show");
            } else {
                let errorMsg = data.error || "Unexpected data format";
                alert("Error fetching exchange rate: " + errorMsg);
            }
        },
        error: function(err) {
            alert("Error fetching exchange rate. Please try again later.");
        },
        complete: function() {
            $("#pre-load").hide(); // Hide pre-loading animation or indication once request is complete (either success or error)
        }
    });
}

function updateConversionValues(rates, amount, currencyCode) {
    let usdRate = rates.USD ? formatNumber((rates.USD * amount).toFixed(2)) : "N/A";
    let eurRate = rates.EUR ? formatNumber((rates.EUR * amount).toFixed(2)) : "N/A";
    let gbpRate = rates.GBP ? formatNumber((rates.GBP * amount).toFixed(2)) : "N/A";
    let jpyRate = rates.JPY ? formatNumber((rates.JPY * amount).toFixed(2)) : "N/A";

    let content = `
        <strong>${formatNumber(amount)} ${currencyCode} is equivalent to:</strong><br>
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
        url: '../Gazzeter/php/getWeather.php',
        type: 'GET',
        data: { capital: capital },
        dataType: 'json',
        success: function(data) {
            if (data.location && data.current && data.forecast) {
                // Add the capital's name to the span
                $(".Capital").text(capital);

                const forecastDays = data.forecast.forecastday;

                function getDayOfWeek(dateString) {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const date = new Date(dateString);
                    return days[date.getDay()];
                }
                
                // Populate the "Today" section
                $("#todayDescription").text(forecastDays[0].day.condition.text);
                $("#todayIcon").attr("src", forecastDays[0].day.condition.icon);
                $("#todayMaxTemp").text(`${Math.round(forecastDays[0].day.maxtemp_c)}°C`);
                $("#todayMinTemp").text(`${Math.round(forecastDays[0].day.mintemp_c)}°C`);

                // Populate Day 2
                $("#day2Date").text(getDayOfWeek(forecastDays[1].date));
                $("#day2Description").text(forecastDays[1].day.condition.text);
                $("#day2Icon").attr("src", forecastDays[1].day.condition.icon);
                $("#day2MaxTemp").text(`${Math.round(forecastDays[1].day.maxtemp_c)}°C`);
                $("#day2MinTemp").text(`${Math.round(forecastDays[1].day.mintemp_c)}°C`);

                // Populate Day 3
                $("#day3Date").text(getDayOfWeek(forecastDays[2].date));
                $("#day3Description").text(forecastDays[2].day.condition.text);
                $("#day3Icon").attr("src", forecastDays[2].day.condition.icon);
                $("#day3MaxTemp").text(`${Math.round(forecastDays[2].day.maxtemp_c)}°C`);
                $("#day3MinTemp").text(`${Math.round(forecastDays[2].day.mintemp_c)}°C`);

                $("#loading-spinner").hide();
                $("#weatherModal").modal("show");
            } else {
                $("#modalContent").html('<p>Error fetching weather data. Please try again later.</p>');
            }
        },
        error: function(error) {
            console.error("Error fetching weather data:", error);
            $("#modalContent").html('<p>Error fetching weather data. Please try again later.</p>');
        }
    });
}



// ---------------------------FETCH NEWS DATA --------------------------------------
function fetchNewsData() {
    $("#loading-spinner").show();

    $.ajax({
        url: '../Gazzeter/php/getNewsData.php',
        method: 'GET',
        dataType: 'json',
        data: {
            language: 'en'
        },
        success: function(data) {
            console.log(data);
            if (data && data.news) {
                const articles = data.news;
                let content = '';
                articles.forEach(article => {
                    if (article.image) {
                        content += `
                        <div class="news-item">
                            <img src="${article.image}" alt="News Image" class="news-image">
                            <div>
                                <a href="${article.url}" target="_blank" class="news-title">${article.title}</a><br>
                                <span class="news-author">Source: ${article.author}</span>
                            </div>
                        </div>
                        <hr>`;
                    }
                });
                $("#loading-spinner").hide();
                $("#newsContent").html(content);
                $("#newsModal").modal("show");
            } else {
                console.error("Invalid data returned from API:", data);
            }
        },
        error: function(err) {
            console.error("Error fetching news data:", err);
        }
    });
}


{/* <div class="news-item d-flex">
        <div class="news-image-container">
            <img src="${article.image}" alt="News Image" class="news-image">
        </div>
        <div class="news-info">
            <a href="${article.url}" target="_blank" class="news-link">
                <strong>${article.title}</strong>
            </a>
            <small class="news-author">${article.author}</small>
        </div>
    </div>
    <hr>`; */}
// -----------------------------CENTRE USER TO ITS LOCATION ---------------------------------------
// function navigateToUserLocation() {
//     if (navigator.geolocation) { 
//         navigator.geolocation.getCurrentPosition(function(position) {
//             var lat = position.coords.latitude;
//             var lon = position.coords.longitude;
//             // Center the map on the user's location
//             map.setView([lat, lon], 10); // 13 is the zoom level
//             // Add a marker to the user's location
//             L.marker([lat, lon]).addTo(map)
//                 .bindPopup('You are here.').openPopup();
//         }, function(error) {
//             alert("Error: " + error.message);
//         });
//     } else {
//         alert("Geolocation is not supported by this browser.");
//     }
// }



// ----------------------------- GET WIKIPEDIA INFORMATION ---------------------------------------
function getWikipediaInfo(countryName) {
    $("#loading-spinner").show(); // Show pre-loading animation

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
                    $("#loading-spinner").hide();
                    $("#wikipediaInfoModal .modal-title").html(`<i class="fa-solid fa-book fa-xl me-2"></i>About ${countryName}`);
                    $("#wikipediaContent").html(firstParagraphMatches[1] + `<br><br><a href="${articleLink}" target="_blank">Read full article on Wikipedia</a>`);
                    $("#wikipediaInfoModal").modal("show");
                } else {
                    console.error("Error parsing the Wikipedia data.");
                    $("#wikipediaContent").html('<p>Error fetching Wikipedia info. Please try again later.</p>');
                }
            } else if (data.error) {
                console.log("Error from server:", data.error);
                $("#wikipediaContent").html('<p>Error fetching Wikipedia info. Please try again later.</p>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX request error:", textStatus, "|", errorThrown);
            $("#wikipediaContent").html('<p>Error fetching Wikipedia info. Please try again later.</p>');
        },
        complete: function() {
            $("#pre-load-wikipedia").hide(); // Hide pre-loading animation once the request is complete
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



