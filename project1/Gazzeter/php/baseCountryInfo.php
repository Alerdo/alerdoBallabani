<?php
$countryCode = $_GET['countryCode'] ?? 'GB'; // default to GB if no countryCode is provided
$username = "AlerdoBallabani"; 


function getCountryInfo($countryCode, $username) {
    $url = "http://api.geonames.org/countryInfo?country={$countryCode}&username={$username}";

    // Initialize curl
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Getresponse
    $response = curl_exec($ch);

    // Close curl
    curl_close($ch);

    $xml = simplexml_load_string($response);
    return json_encode($xml);
}




echo getCountryInfo($countryCode, $username);

?>
