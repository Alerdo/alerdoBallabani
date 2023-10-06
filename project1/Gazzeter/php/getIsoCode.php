<?php

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Get the latitude and longitude from the request
$lat = $_GET['lat'];
$lon = $_GET['lon'];

// make env file for this later
$username = "AlerdoBallabani";

// Create the URL for the GeoNames API call
$url = "http://api.geonames.org/countryCode?lat={$lat}&lng={$lon}&username={$username}&type=JSON";

// Make the API call and get the response
$response = file_get_contents($url);

// Return the response
echo $response;
?>