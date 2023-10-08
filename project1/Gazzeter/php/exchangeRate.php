<?php

// Set ontent type
header('Content-Type: application/json');


$apiKey = '3c4764e02d54d4559244b7929208eb5b';
$baseUrl = 'https://open.er-api.com/v6/latest/';

// Check if e currency code is provided
if(isset($_GET['currencyCode'])) {
    $currencyCode = $_GET['currencyCode'];
    
   
    // Get conversion rates against USD, EUR, GBP, and JPY
    $url = $baseUrl . $currencyCode . "?apikey=" . $apiKey . "&symbols=USD,EUR,GBP,JPY";

    // Initialize curl
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Get the response
    $response = curl_exec($ch);

    // close curl
    curl_close($ch);

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
