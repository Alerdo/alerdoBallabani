<?php

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include the login details
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output = [
        'status' => [
            'code' => "300",
            'name' => "failure",
            'description' => "database unavailable",
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}

// Assuming POST input for production
$locationName = $_POST['locationName'];

// Check if location already exists
$checkQuery = $conn->prepare('SELECT name FROM location WHERE name = ?');
$checkQuery->bind_param("s", $locationName);
$checkQuery->execute();
$result = $checkQuery->get_result();

if ($result->num_rows > 0) {
    $output = [
        'status' => [
            'code' => "409",
            'name' => "conflict",
            'description' => "Location already exists. Please enter a new Location",
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}

$query = $conn->prepare('INSERT INTO location (name) VALUES(?)');
$query->bind_param("s", $locationName);

$query->execute();

if (false === $query) {
    $output = [
        'status' => [
            'code' => "400",
            'name' => "executed",
            'description' => "query failed"
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}

$output = [
    'status' => [
        'code' => "200",
        'name' => "ok",
        'description' => "success",
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ],
    'location' => "$locationName",
    'data' => [
        'message' => "Location '$locationName' was created."
    ]
];

echo json_encode($output);

?>
