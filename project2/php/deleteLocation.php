<?php

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$executionStartTime = microtime(true);

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);
    exit;
}

if(!isset($_GET['id']) || empty($_GET['id']) || !is_numeric($_GET['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Invalid ID provided";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    echo json_encode($output);
    exit;
}

$id = $_GET['id'];

// Fetch location name first
$nameSql = "SELECT name FROM location WHERE id=?";
$nameStmt = $conn->prepare($nameSql);
$nameStmt->bind_param('i', $id);
$nameStmt->execute();
$nameResult = $nameStmt->get_result();
$location = $nameResult->fetch_assoc();
$nameStmt->close();

if (!$location) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Location not found";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    echo json_encode($output);
    exit;
}

// Check for dependencies in department table
$checkSql = "SELECT COUNT(*) as count FROM department WHERE locationID=?";

$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param('i', $id);
$checkStmt->execute();
$result = $checkStmt->get_result();
$row = $result->fetch_assoc();
$checkStmt->close();

if ($row['count'] > 0) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Cannot delete location as it has dependencies in departments.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    echo json_encode($output);
    exit;
}

$sql = "DELETE FROM location WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "success";
    $output['status']['description'] = "Successfully deleted location: " . $location['name'];
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data']['locationName'] = $location['name'];
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Error deleting location";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
}

$stmt->close();
$conn->close();

echo json_encode($output);

?>
