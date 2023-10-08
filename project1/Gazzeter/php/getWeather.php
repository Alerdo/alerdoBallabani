<?php

// Set the content type
header('Content-Type: application/json');

$apiKey = 'ecdcd59f19fe416383a220316232607';  
$baseUrl = 'https://api.weatherapi.com/v1/current.json';

// Check if the country name is provided
if(isset($_GET['capital'])) {
    $capital = $_GET['capital'];

    // Construct the URL for the API request
    $url = $baseUrl . "?key=" . $apiKey . "&q=" . $capital;

    // Use file_get_contents to make the API call
    $response = file_get_contents($url);

    // Check if we got a valid response
    if($response) {
        echo $response;
    } else {
        echo json_encode(['error' => 'Failed to fetch weather data']);
    }
} else {
    echo json_encode(['error' => 'No country name provided']);
}

?>
