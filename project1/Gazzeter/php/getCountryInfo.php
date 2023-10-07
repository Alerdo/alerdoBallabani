<?php

header('Content-Type: application/json');

$data = file_get_contents("../countryBorders.geo.json");
$json_data = json_decode($data, true);

// Check if an ISO code is provided 
if (isset($_GET['isoCode'])) {
    $isoCode = $_GET['isoCode'];
    foreach ($json_data['features'] as $feature) {
        if ($feature['properties']['iso_a2'] === $isoCode) {
            echo json_encode($feature);
            exit;
        }
    }
    echo json_encode(["error" => "Country border not found."]);
} else {
    $countries = [];
    foreach ($json_data['features'] as $feature) {
        $isoCode = $feature['properties']['iso_a2'];
        $countryName = $feature['properties']['name'];
        $countries[] = ['isoCode' => $isoCode, 'countryName' => $countryName];
    }
    echo json_encode($countries);
}
?>



