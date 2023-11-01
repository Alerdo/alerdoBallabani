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
    echo json_encode($output);
    exit;
}

if(!isset($_POST['id']) || empty($_POST['id']) || !is_numeric($_POST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Invalid ID provided";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    echo json_encode($output);
    exit;
}

$id = $_POST['id'];

// Fetch department name before deliting
$sql = "SELECT name FROM department WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($departmentName);
$stmt->fetch();

// Now delete the departmentt
$sql = "DELETE FROM department WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "success";
    $output['status']['description'] = "Successfully deleted department";
    $output['data']['departmentName'] = $departmentName;  // Return department name
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Error deleting department";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
}

$stmt->close();
$conn->close();

echo json_encode($output);

?>
