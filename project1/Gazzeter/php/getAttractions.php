<?php

$countryCode = $_GET['countryCode'];
$username = "AlerdoBallabani";  //

$url = "http://api.geonames.org/search?country={$countryCode}&featureCode=MUS&maxRows=20&username={$username}";


$ch = curl_init();

// Set curl options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  // Return the result as a string


$response = curl_exec($ch);


if(curl_errno($ch)){
    header('Content-Type: application/json');  // Setting content type to JSON for error message
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    curl_close($ch);  
    exit;
}


curl_close($ch);

header('Content-Type: application/xml');
echo $response;

?>
