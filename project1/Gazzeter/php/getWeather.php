<?php

// Set the content type
header('Content-Type: application/json');

$apiKey = 'ecdcd59f19fe416383a220316232607';  
$baseUrl = 'https://api.weatherapi.com/v1/current.json';

// Check if the country name is provided
if(isset($_GET['capital'])) {
    $capital = $_GET['capital'];

    $url = $baseUrl . "?key=" . $apiKey . "&q=" . $capital;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);          // Return the result as a string
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);      // Do not verify SSL

    // Execute the curl session and get the response
    $response = curl_exec($ch);

    // Chec errors
    if(curl_errno($ch)){
        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } else {
        // Check if we got a valid response
        if($response) {
            echo $response;
        } else {
            echo json_encode(['error' => 'Failed to fetch weather data']);
        }
    }

    // Close the curl session
    curl_close($ch);

} else {
    echo json_encode(['error' => 'No country name provided']);
}

?>
