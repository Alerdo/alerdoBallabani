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

// Fetch the first name and last name before deleting
$fetchSql = "SELECT firstName, lastName FROM personnel WHERE id=?";
$fetchStmt = $conn->prepare($fetchSql);
$fetchStmt->bind_param('i', $id);
$fetchStmt->execute();

$result = $fetchStmt->get_result();
$person = $result->fetch_assoc();
$fetchStmt->close();

if (!$person) {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "No personnel found with the provided ID";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    echo json_encode($output);
    exit;
}

$firstName = $person['firstName'];
$lastName = $person['lastName'];

// Now proceed to delete
$sql = "DELETE FROM personnel WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "success";
    $output['status']['description'] = "Successfully deleted personnel: $firstName $lastName";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data']['firstName'] = $firstName;  // Added
    $output['data']['lastName'] = $lastName;    // Added
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Error deleting personnel";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
}

$stmt->close();
$conn->close();

echo json_encode($output);
?>
