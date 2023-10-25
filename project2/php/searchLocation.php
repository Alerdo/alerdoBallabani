<?php
include 'config.php'; // Your database connection settings

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

$searchTerm = $_POST['searchTerm'];

// We're looking to match the search term against location names in the location table.
$query = $conn->prepare("SELECT id, name FROM location WHERE name LIKE ?");

// Binding parameters
$likeTerm = '%' . $searchTerm . '%';
$query->bind_param('s', $likeTerm);

$query->execute();

$result = $query->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$query->close();
$conn->close();
?>
