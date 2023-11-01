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

// Fetch the current department name
$fetchOldNameQuery = "SELECT name FROM department WHERE id = ?";
$fetchStmt = $conn->prepare($fetchOldNameQuery);
$fetchStmt->bind_param("i", $data['id']);
$fetchStmt->execute();
$fetchResult = $fetchStmt->get_result();
$oldDepartmentName = $fetchResult->fetch_assoc()['name'] ?? null;
$fetchStmt->close();

// Rule 1: Check if the new departmentName already exists in any other department record
$checkDepartmentNameQuery = "SELECT * FROM department WHERE name = ? AND id != ?";
$checkStmt = $conn->prepare($checkDepartmentNameQuery);
$checkStmt->bind_param("si", $data['departmentName'], $data['id']);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    exit(json_encode(['error' => 'A department with this name already exists.']));
}

$checkStmt->close();

// Rule 2: Fetch location ID based on name
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

// Update department's name and locationID based on department ID
$updateQuery = "UPDATE department SET name = ?, locationID = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateQuery);
if (!$updateStmt) {
    exit(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
}
$updateStmt->bind_param("sii", $data['departmentName'], $locationID, $data['id']);
$updateStmt->execute();

if ($updateStmt->affected_rows === 0) {
    exit(json_encode(['error' => 'No department updated. Please provide different data.']));
}

$updateStmt->close();
$conn->close();

exit(json_encode(['success' => 'Department updated successfully.', 'oldName' => $oldDepartmentName, 'newName' => $data['departmentName']]));
?>
