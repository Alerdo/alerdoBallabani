<?php

// connection details for MySQL database
$cd_host = "localhost";
$cd_port = 3306;
$cd_socket = "";
$cd_dbname = "companydirectory";
$cd_user = "companyDirector";
$cd_password = "Haxhiballabani11";

// Create connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// No need to echo "Connected successfully"
// No need to close the connection here. Do it in your main script after all DB operations are completed.

?>
