<?php

$countryCode = $_GET['countryCode'] ?? 'GB'; // Default to 'GB' if no country code is provided

$url = "http://api.geonames.org/search?country={$countryCode}&featureCode=PRK&maxRows=30&username=AlerdoBallabani";

$response = file_get_contents($url);

header('Content-Type: application/xml'); // Set the content type to XML
echo $response;

?>
