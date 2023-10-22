<?php
// Enabling error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Specifying the header for the response
header('Content-Type: application/json; charset=UTF-8');

// Including your configuration file to connect to the database
include("config.php");

// Create a connection to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Checking for any connection error
if ($conn->connect_errno) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Query to fetch all locations
$query = "SELECT * FROM location";

// Execute the query
$result = $conn->query($query);

// Check if the result is empty
if ($result->num_rows == 0) {
    echo json_encode(['error' => 'No locations found.']);
    exit();
}

// Fetch all rows as an associative array
$locations = $result->fetch_all(MYSQLI_ASSOC);

// Closing the database connection
$conn->close();

// Outputting the data as JSON
echo json_encode($locations);
?>
