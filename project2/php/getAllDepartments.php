<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');

include("config.php");

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    echo "Connected successfully";
    exit(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

$query = "
SELECT d.id, d.name as departmentName, l.name as departmentLocation
FROM department d 
JOIN location l ON d.locationID = l.id";

$result = $conn->query($query);

if (!$result) {
    exit(json_encode(['error' => 'Query failed: ' . $conn->error]));
}

$departments = [];
while ($row = $result->fetch_assoc()) {
    $departments[] = $row;
}

echo json_encode($departments);

$conn->close();
?>
