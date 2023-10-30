<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {	
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}	

	$query = $conn->prepare('SELECT `id`, `name`, `locationID` FROM `department` WHERE `id` = ?');
	$query->bind_param("i", $_REQUEST['id']);
	$query->execute();

	$result = $query->get_result();

   	$department = [];
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($department, $row);
	}

	$query = 'SELECT id, name FROM location ORDER BY name';
	$result = $conn->query($query);

	if (!$result) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}
   
   	$locations = [];
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($locations, $row);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['department'] = $department;
	$output['data']['locations'] = $locations;

	mysqli_close($conn);
	echo json_encode($output); 
?>
