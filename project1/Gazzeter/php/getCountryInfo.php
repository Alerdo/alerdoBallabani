<?php

//Populating the dropdown menu
header('Content-Type: application/json');  // specify that we're returning JSON

$data = file_get_contents("../countryBorders.geo.json");  // adjust the path if necessary
$json_data = json_decode($data, true);

$countries = [];

// Loop through the 'features' key of the JSON data
foreach($json_data['features'] as $feature) {
    $isoCode = $feature['properties']['iso_a2'];
    $countryName = $feature['properties']['name'];
    $countries[] = ['isoCode' => $isoCode, 'countryName' => $countryName];
}

echo json_encode($countries);
?>
