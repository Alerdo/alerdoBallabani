<?php

header('Content-Type: application/json');

$apiKey = 'ac77ed5449ec4e6db6d5c234e9ac2ab2';
$baseUrl = 'http://newsapi.org/v2/top-headlines';

if(isset($_GET['countryCode'])) {
    $countryCode = $_GET['countryCode'];
    
    // Construct the URL for the API request
    $url = $baseUrl . "?country=" . $countryCode . "&apiKey=" . $apiKey;
    
    // Use file_get_contents to make the API call
    $response = file_get_contents($url);

    // Return the response
    echo $response;
} else {
    echo json_encode(['error' => 'No country code provided']);
}

?>
