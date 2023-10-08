<?php

header('Content-Type: text/xml');

$countryCode = $_GET['countryCode'];
$baseUrl = 'http://api.geonames.org/search?type=xml&maxRows=10&featureCode=AIRP&username=AlerdoBallabani';

$url = $baseUrl . "&country=" . $countryCode;


$ch = curl_init();


curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  // Return the result as a string

e
$response = curl_exec($ch);

// Check for curl errors
if(curl_errno($ch)){
    echo '<error>Curl error: ' . curl_error($ch) . '</error>';
    curl_close($ch);  
    exit;
}


curl_close($ch);

if ($response) {
    echo $response;
} else {
    echo '<error>Failed to fetch airport data</error>';
}

?>
