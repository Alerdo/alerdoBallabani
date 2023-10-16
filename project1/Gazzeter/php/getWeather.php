<?php

// Set the content type
header('Content-Type: application/json');

// Check if the capital name is provided
if(isset($_GET['capital'])) {
    $capital = $_GET['capital'];
    $apiKey = 'ecdcd59f19fe416383a220316232607';  
    $url = "https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${capital}&days=7";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);          // Return the result as a string
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);      // Do not verify SSL

    // Execute the curl session and get the response
    $response = curl_exec($ch);

    // Check errors
    if(curl_errno($ch)){
        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } else {
        // Check if we got a valid response
        if($response) {
            $data = json_decode($response, true);
            if(isset($data['error'])) {
                echo json_encode(['error' => $data['error']['message']]);
            } else {
                echo $response;
            }
        } else {
            echo json_encode(['error' => 'Failed to fetch weather data']);
        }
    }

    // Close the curl session
    curl_close($ch);

} else {
    echo json_encode(['error' => 'No capital name provided']);
}

?>
