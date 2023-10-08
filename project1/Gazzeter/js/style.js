// function createButtons(countryInfo) {
    
//     // Country Info button
//     L.easyButton('<i class="fas fa-info-circle" style="font-size:24px; width: auto; height="auto""></i>', function (btn, map) {
//         fetchAndDisplayCountryInfo(countryInfo); // Assuming this function exists
//     }, 'View Country Info').addTo(map);

//     // Exchange Rate button
//     L.easyButton('<i class="fas fa-money-bill-alt" style="font-size:24px;"></i>', function (btn, map) {
//         fetchAndDisplayExchangeRate(countryInfo.currencyCode);  
//     }, 'View Exchange Rate').addTo(map);

//     // Weather button
//     L.easyButton('<i class="fas fa-cloud-sun" style="font-size:24px;"></i>', function (btn, map) {
//         fetchAndDisplayWeatherInfo(countryInfo.latitude, countryInfo.longitude);  // Assuming these properties exist in countryInfo
//     }, 'View Weather').addTo(map);

//     // News button
//     L.easyButton('<i class="fas fa-newspaper" style="font-size:24px;"></i>', function (btn, map) {
//         fetchAndDisplayNews(countryInfo.countryName);  // Assuming this function exists
//     }, 'View News').addTo(map);

//     // Recenter map to user's location button
//     L.easyButton('<i class="fas fa-crosshairs" style="font-size:24px;"></i>', function (btn, map) {
//         recenterMapToUserLocation();  // This function will use geolocation to recenter the map
//     }, 'Center Map to My Location').addTo(map);
// }

// // Example for recentering function
// function recenterMapToUserLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function (position) {
//             map.setView([position.coords.latitude, position.coords.longitude], 13);  // 13 is the zoom level. Adjust as needed.
//         });
//     } else {
//         alert("Geolocation is not supported by this browser.");
//     }
// }

// You might use this later
const countryDetails = data;
console.log(data);
let currencyCode = Object.keys(countryDetails.currencies)[0]

let countryInfo  = { 
    countryName: countryDetails.name.common,
    flag: countryDetails.flags.png,
    capital: countryDetails.capital[0],
    continent: countryDetails.region,
    population: countryDetails.population,
    area: countryDetails.area,
    currency: Object.keys(countryDetails.currencies)[0],
    currencyName:countryDetails.currencies[currencyCode].name,
    currencySymbol:countryDetails.currencies[currencyCode].symbol ,
    iso: countryDetails.cca2
}




// <?php
// // getCountriesInfo.php
// function getCountryInfo($countryCode, $username) {
//     $url = "https://restcountries.com/v3.1/name/{$countryCode}";

//     $response = file_get_contents($url);
//     $xml = simplexml_load_string($response);
//     return json_encode($xml);
// }

// // Use the function
// $countryCode = $_GET['countryCode'] ?? 'GB'; // default to GB if no countryCode is provided
// $username = "AlerdoBallabani"; 

// echo getCountryInfo($countryCode, $username);
// ?>
