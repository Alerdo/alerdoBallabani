<?php
// Enable PHP error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');

include("config.php");

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    exit(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

// Function to fetch an ID based on a table and name
function fetchID($conn, $table, $name) {
    $query = "SELECT id FROM $table WHERE name = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        exit(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
    }
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    
    return $row['id'] ?? null;
}

if (empty($data['departmentName'])) {
    exit(json_encode(['error' => 'Please select a department.']));
}

$departmentID = fetchID($conn, 'department', $data['departmentName']);
if (!$departmentID) {
    exit(json_encode(['error' => 'Sorry, ' . $data['departmentName'] . ' department doesn\'t exist.']));
}

// Update the personnel data
$personnelUpdateQuery = "UPDATE personnel SET firstName = ?, lastName = ?, email = ?, departmentID = ? WHERE id = ?";
$personnelUpdateStmt = $conn->prepare($personnelUpdateQuery);
if (!$personnelUpdateStmt) {
    exit(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
}
$personnelUpdateStmt->bind_param("ssssi", $data['firstName'], $data['lastName'], $data['email'], $departmentID, $data['id']);
$personnelUpdateStmt->execute();

if ($personnelUpdateStmt->errno) {
    exit(json_encode(['error' => 'Error updating row: ' . $personnelUpdateStmt->error]));
}

$personnelUpdateStmt->close();
$conn->close();

exit(json_encode([
    'success' => 'Information updated successfully.',
    'name' => $data['firstName'],
    'lastname' => $data['lastName']
]));
?>
