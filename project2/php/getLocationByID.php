<?php
	// example use from browser
	// http://localhost/companydirectory/libs/php/getLocationByID.php?id=<id>

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		$output = ["status" => ["code" => "300", "name" => "failure", "description" => "database unavailable", "returnedIn" => (microtime(true) - $executionStartTime) / 1000 . " ms"], "data" => []];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}	

	$query = $conn->prepare('SELECT `id`, `name` FROM `location` WHERE `id` = ?');
	$query->bind_param("i", $_REQUEST['id']);
	$query->execute();

	if (false === $query) {
		$output = ["status" => ["code" => "400", "name" => "executed", "description" => "query failed"], "data" => []];
		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}
    
	$result = $query->get_result();
   	$location = [];
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($location, $row);
	}

	$output = ["status" => ["code" => "200", "name" => "ok", "description" => "success", "returnedIn" => (microtime(true) - $executionStartTime) / 1000 . " ms"], "data" => ["location" => $location]];
	mysqli_close($conn);
	echo json_encode($output); 
?>
