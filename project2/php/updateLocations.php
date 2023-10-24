<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');

include("config.php");

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    exit(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

// Check if the location name already exists
$checkQuery = "SELECT id FROM location WHERE name = ?";
$checkStmt = $conn->prepare($checkQuery);
if (!$checkStmt) {
    exit(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
}

$checkStmt->bind_param("s", $data['name']);
$checkStmt->execute();
$result = $checkStmt->get_result();
$checkStmt->close();

if ($result->num_rows > 0) {
    exit(json_encode(['error' => 'Sorry, this location already exists.']));
}

// Update location's name based on ID
$updateQuery = "UPDATE location SET name = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateQuery);
if (!$updateStmt) {
    exit(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
}

$updateStmt->bind_param("si", $data['name'], $data['id']);
$updateStmt->execute();

if ($updateStmt->affected_rows === 0) {
    exit(json_encode(['error' => 'No rows updated.']));
}

$updateStmt->close();
$conn->close();

exit(json_encode(['success' => 'Location updated successfully.']));
?>