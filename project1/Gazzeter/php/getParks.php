<?php

$countryCode = $_GET['countryCode'] ?? 'GB'; // Default to 'GB' if no country code is provided

$url = "http://api.geonames.org/search?country={$countryCode}&featureCode=PRK&maxRows=15&username=AlerdoBallabani";

// Initialize the curl session
$ch = curl_init();

// Set curl options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);         // Return the result as a string

// Execute the curl session and get the response
$response = curl_exec($ch);

// Check for curl errors
if(curl_errno($ch)){
    // Optionally handle the error, for example:
    // echo "Curl error: " . curl_error($ch);
    die("Curl error: " . curl_error($ch));
}

// Close the curl session
curl_close($ch);

header('Content-Type: application/xml'); // Set the content type to XML
echo $response;

?>
