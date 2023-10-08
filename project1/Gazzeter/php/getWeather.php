<?php

// Set the content type
header('Content-Type: application/json');

$apiKey = 'I will set it after commit';  // Your API key from Weather API
$baseUrl = 'https://api.weatherapi.com/v1/current.json';

// Check if the country name is provided
if(isset($_GET['country'])) {
    $countryName = $_GET['country'];

    // Construct the URL for the API request
    $url = $baseUrl . "?key=" . $apiKey . "&q=" . $countryName;

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
