
<?php
// getCountriesInfo.php
function getCountryInfo($countryCode, $username) {
    $url = "http://api.geonames.org/countryInfo?country={$countryCode}&username={$username}";

    $response = file_get_contents($url);
    $xml = simplexml_load_string($response);
    return json_encode($xml);
}

// Use the function
$countryCode = $_GET['countryCode'] ?? 'GB'; // default to US if no countryCode is provided
$username = "AlerdoBallabani";  // replace this with your username

echo getCountryInfo($countryCode, $username);
?>
