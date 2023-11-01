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

$sql = "SELECT d.name AS departmentName, COUNT(p.id) as personnelCount FROM department d LEFT JOIN personnel p ON (p.departmentID = d.id) WHERE d.id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();
$stmt->close();
$conn->close();

$output['status']['code'] = "200";
$output['status']['name'] = "success";
$output['status']['description'] = "Success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [$data];

echo json_encode($output);

?>
