<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

if(isset($_GET['countryName'])) {
    
    $countryName = $_GET['countryName'];
    
    // Endpoint to fetch Wikipedia info for a given country
    $url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=' . urlencode($countryName);

    // Set user agent to avoid being flagged or blocked
    $userAgent = 'YourAppName/1.0 (YourEmailOrContactPage)';
    
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification. Suitable for debugging, reconsider for production.

    $response = curl_exec($ch);
    
    // Check for cURL errors
    if(curl_errno($ch)) {
        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } else {
        // Output the response 
        echo $response;
    }

    curl_close($ch);

} else {
    echo json_encode(['error' => 'No country name provided']);
}
?>
