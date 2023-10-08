<?php

// Set the content type
header('Content-Type: application/json');

// Your API key from Open Exchange Rates
$appId = 'I will set it after commit';
$baseUrl = 'https://openexchangerates.org/api/latest.json';

// Check if the currency code is provided
if(isset($_GET['currencyCode'])) {
    $currencyCode = $_GET['currencyCode'];
    
    // Construct the URL for the API request
    $url = $baseUrl . "?app_id=" . $appId . "&symbols=" . $currencyCode;
    
    // Use file_get_contents to make the API call
    $response = file_get_contents($url);

    // Check if we got a valid response
    if($response) {
        echo $response;
    } else {
        echo json_encode(['error' => 'Failed to fetch exchange rate']);
    }
} else {
    echo json_encode(['error' => 'No currency code provided']);
}

?>
