<?php
$username = "AlerdoBallabani"; // Put your GeoNames username here.
$country = $_GET["countryCode"]; // Assuming you're passing in a countryCode.

$api_url = "http://api.geonames.org/citiesJSON?country={$country}&maxRows=10&username={$username}";

$response = file_get_contents($api_url);
echo $response;
?>


