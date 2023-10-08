<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$apiKey = 'ac77ed5449ec4e6db6d5c234e9ac2ab2';
$baseUrl = 'http://newsapi.org/v2/top-headlines';

if (isset($_GET['countryCode'])) {
    $countryCode = $_GET['countryCode'];
    
    // Construct the URL for the API request
    $url = $baseUrl . "?country=" . $countryCode;

    // Initialize cURL session
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "X-Api-Key: " . $apiKey,
        "User-Agent: Gazetter"  // You can replace 'MyApplicationName' with the name of your application.
    ));

    // Execute cURL session and get the response
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        echo 'Curl error: ' . curl_error($ch);
    } else {
        echo $response;
    }

    // Close the cURL session
    curl_close($ch);
}
?>
