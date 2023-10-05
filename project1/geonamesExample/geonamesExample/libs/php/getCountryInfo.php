<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$username = "AlerdoBallabani"; 

$action = $_REQUEST['action'];

switch ($action) {
    case 'getCountryInfo':
        $url = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=" . $_REQUEST['lang'] . "&country=" . $_REQUEST['country'] . "&username=" . $username . "&style=full";
        break;

        case 'getNearbyCountries':
            // Include the country code and username in the URL
            $url = "http://api.geonames.org/neighboursJSON?country=" . $_REQUEST['country'] . "&username=" . $username;
            break;
        
    case 'getCitiesInfo':
        $url = "http://api.geonames.org/citiesJSON?north=" . $_REQUEST['north'] . "&south=" . $_REQUEST['south'] . "&east=" . $_REQUEST['east'] . "&west=" . $_REQUEST['west'] . "&lang=" . $_REQUEST['lang'] . "&username=" . $username;
        break;

    default:
        echo json_encode(['status' => ['name' => 'error', 'description' => 'Invalid action']]);
        exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['geonames'];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);

?>
