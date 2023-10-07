<?php

// Setting content type to JSON
header('Content-Type: application/json');

// Constants (Make sure to replace 'YOUR_GEONAMES_USERNAME' with your actual username)
$username = "AlerdoBallabani";

// Getting parameters from request
$north = $_GET['north'] ?? '';
$south = $_GET['south'] ?? '';
$east = $_GET['east'] ?? '';
$west = $_GET['west'] ?? '';
$lang = $_GET['lang'] ?? 'en'; // default to English

// Constructing the URL
$url = "http://api.geonames.org/citiesJSON?north={$north}&south={$south}&east={$east}&west={$west}&lang={$lang}&username={$username}";

// Fetching data from Geonames API
$response = file_get_contents($url);

// Error handling in case the API request fails
if ($response === FALSE) {
    echo json_encode([
        'error' => 'Failed to fetch data from Geonames API'
    ]);
    exit;
}

// Forwarding the response from Geonames API
echo $response;

?>
