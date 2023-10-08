<?php

$countryCode = $_GET['countryCode'];
$username = "AlerdoBallabani";  // Your GeoNames username

$url = "http://api.geonames.org/search?country={$countryCode}&featureCode=MUS&maxRows=20&username={$username}";

$response = file_get_contents($url);
header('Content-Type: application/xml');
echo $response;

?>
