<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$apiKey = 'zB8j6Y8tB_vxRFO-9JHffGkoA77hxJCoeHmsYY7WUQywZ_qr';
$baseUrl = 'https://api.currentsapi.services/v1/latest-news';

$language = isset($_GET['language']) ? $_GET['language'] : 'en';  // Default to 'en' if not set.

// Construct the URL for the API request
$url = $baseUrl . "?language=" . $language . "&apiKey=" . $apiKey;

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_USERAGENT, "Gazetter"); // You can replace 'Gazetter' with the name of your application.

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
?>
