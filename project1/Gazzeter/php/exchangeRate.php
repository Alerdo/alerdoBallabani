<?php

// Set the content type
header('Content-Type: application/json');

// Your API key from Open Exchange Rates
$apiKey = '3c4764e02d54d4559244b7929208eb5b';
$baseUrl = 'https://open.er-api.com/v6/latest/';

// Check if the currency code is provided
if(isset($_GET['currencyCode'])) {
    $currencyCode = $_GET['currencyCode'];
    
    // Construct the URL for the API request
    // Get conversion rates against USD, EUR, GBP, and JPY
    $url = $baseUrl . $currencyCode . "?apikey=" . $apiKey . "&symbols=USD,EUR,GBP,JPY";
    
    // Use file_get_contents to make the API call
    $response = file_get_contents($url);

    // Check if we got a valid response
    if($response) {
        echo $response;
    } else {
        echo json_encode(['error' => 'Failed to fetch exchange rates']);
    }
} else {
    echo json_encode(['error' => 'No currency code provided']);
}

?>
