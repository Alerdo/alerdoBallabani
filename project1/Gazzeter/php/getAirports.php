<?php

header('Content-Type: text/xml');

$countryCode = $_GET['countryCode'];
$baseUrl = 'http://api.geonames.org/search?type=xml&maxRows=10&featureCode=AIRP&username=AlerdoBallabani';

$url = $baseUrl . "&country=" . $countryCode;

$response = file_get_contents($url);

if ($response) {
    echo $response;
} else {
    echo '<error>Failed to fetch airport data</error>';
}

?>
