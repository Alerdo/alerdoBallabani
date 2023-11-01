<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

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

$departmentName = $_POST['name'];
$locationName = $_POST['location'];

// Retrieve location ID based on the name
$locationQuery = $conn->prepare('SELECT id FROM location WHERE name = ?');
$locationQuery->bind_param("s", $locationName);
$locationQuery->execute();
$locationResult = $locationQuery->get_result();
$locationRow = $locationResult->fetch_assoc();

if (!$locationRow) {
    $output = [
        'status' => [
            'code' => "404",
            'name' => "not found",
            'description' => "Location doesn't exist. Please specify a valid location."
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}

$locationID = $locationRow['id'];

$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?, ?)');
$query->bind_param("si", $departmentName, $locationID);

$query->execute();

if ($query === false) {
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
    'department' => "$departmentName",
    'location' => "$locationName",
    'data' => [
        'message' => "Department '$departmentName' was created in location '$locationName'."
    ]
];

echo json_encode($output);

?>
