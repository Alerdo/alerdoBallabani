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

$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$departmentName = $_POST['departmentName'];
$email = $_POST['email'];

// Check if email format is valid
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $output = [
        'status' => [
            'code' => "400",
            'name' => "invalid input",
            'description' => "Please provide a correct email format."
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}

// Retrieve department ID from the name
$deptQuery = $conn->prepare('SELECT id FROM department WHERE name = ?');
$deptQuery->bind_param("s", $departmentName);
$deptQuery->execute();
$deptResult = $deptQuery->get_result();
$departmentRow = $deptResult->fetch_assoc();

if (!$departmentRow) {
    $output = [
        'status' => [
            'code' => "404",
            'name' => "not found",
            'description' => "Department doesn't exist. Please add an existing department."
        ],
        'data' => ["$email  is not a valid email format."]
    ];
    echo json_encode($output);
    exit;
}

$departmentID = $departmentRow['id'];

$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, email, departmentID) VALUES(?, ?, ?, ?)');
$query->bind_param("sssi", $firstName, $lastName, $email, $departmentID);

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
    'data' => [
        'message' => "$firstName $lastName was created."
    ]
];

echo json_encode($output);

?>
