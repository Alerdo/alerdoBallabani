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

// Fetch old location name
$oldNameQuery = "SELECT name FROM location WHERE id = ?";
$oldNameStmt = $conn->prepare($oldNameQuery);
$oldNameStmt->bind_param("i", $data['id']);
$oldNameStmt->execute();
$result = $oldNameStmt->get_result();
$oldLocation = $result->fetch_assoc();
$oldNameStmt->close();

if (!$oldLocation) {
    exit(json_encode(['error' => 'Location not found.']));
}

// Check if the location name already exists
$checkQuery = "SELECT id FROM location WHERE name = ?";
$checkStmt = $conn->prepare($checkQuery);
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
$updateStmt->bind_param("si", $data['name'], $data['id']);
$updateStmt->execute();

if ($updateStmt->affected_rows === 0) {
    exit(json_encode(['error' => 'No rows updated.']));
}

$updateStmt->close();
$conn->close();

exit(json_encode(['success' => 'Location updated successfully from ' . $oldLocation['name'] . ' to ' . $data['name'] . '.']));
?>
