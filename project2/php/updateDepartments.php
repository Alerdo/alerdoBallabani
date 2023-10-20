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

// Fetch location ID based on name
$query = "SELECT id FROM location WHERE name = ?";
$stmt = $conn->prepare($query);
if (!$stmt) {
    exit(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
}
$stmt->bind_param("s", $data['locationName']);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$locationID = $row['id'] ?? null;
$stmt->close();

if (!$locationID) {
    exit(json_encode(['error' => 'Location not found.']));
}

// Update department's name and locationID
$updateQuery = "UPDATE department SET name = ?, locationID = ? WHERE name = ?";
$updateStmt = $conn->prepare($updateQuery);
if (!$updateStmt) {
    exit(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
}
$updateStmt->bind_param("ssi", $data['departmentName'], $locationID, $data['departmentName']);
$updateStmt->execute();

if ($updateStmt->affected_rows === 0) {
    exit(json_encode(['error' => 'No rows updated.']));
}

$updateStmt->close();
$conn->close();

exit(json_encode(['success' => 'Department updated successfully.']));
?>
