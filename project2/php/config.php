<?php

// connection details local for MySQL database
// $cd_host = "localhost";
// $cd_port = 3306;
// $cd_socket = "";
// $cd_dbname = "companydirectory";
// $cd_user = "companyDirector";
// $cd_password = "Haxhiballabani11";
$cd_host = "213.171.200.32"; // Server IP Address
$cd_port = 3306;             // Default port for MySQL, keep it ,  Fasthost specifies otherwise
$cd_socket = "";             // You can leave this as it is
$cd_dbname = "companydirector";  // Database Name
$cd_user = "companyDirector";    // Username created on fast host that can acces this database.
$cd_password = "Haxhiballabani11"; // Password (Make sure this is correct, if you changed it for Fasthost update it accordingly)


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
