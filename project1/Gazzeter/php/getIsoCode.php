<?php

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');


$lat = $_GET['lat'];
$lon = $_GET['lon'];

// make env file for this later
$username = "AlerdoBallabani";

// Create the URL for the GeoNames API call
$url = "http://api.geonames.org/countryCode?lat={$lat}&lng={$lon}&username={$username}&type=JSON";

// Initialize the curl session
$ch = curl_init();

// Set curl options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  // Return the result as a string

// Execute the curl session and get the response
$response = curl_exec($ch);

// Check for curl errors
if(curl_errno($ch)){
    // echo json_encode(["error" => "Curl error: " . curl_error($ch)]);
    die(json_encode(["error" => "Curl error: " . curl_error($ch)]));
}


curl_close($ch);

// Return the response
echo $response;

?>
