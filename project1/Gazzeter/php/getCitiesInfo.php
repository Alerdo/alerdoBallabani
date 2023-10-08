<?php

// Setting content type to JSON
header('Content-Type: application/json');


$username = "AlerdoBallabani";

// Getting parameters from request
$north = $_GET['north'] ?? '';
$south = $_GET['south'] ?? '';
$east = $_GET['east'] ?? '';
$west = $_GET['west'] ?? '';
$lang = $_GET['lang'] ?? 'en'; // default to English


$url = "http://api.geonames.org/citiesJSON?north={$north}&south={$south}&east={$east}&west={$west}&lang={$lang}&username={$username}";

// Initialize the curl session
$ch = curl_init();

// Set curl options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  // Return the result as a string


$response = curl_exec($ch);

// Check for  errors
if(curl_errno($ch)){
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    curl_close($ch);  // Close the curl session
    exit;
}

// Close the curl session
curl_close($ch);

// Check if the response is empty or not
if (!$response) {
    echo json_encode(['error' => 'Failed to fetch data from Geonames API']);
    exit;
}

echo $response;

?>
