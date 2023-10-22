<?php
    header('Content-Type: application/json; charset=UTF-8');

    include("config.php");
    
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
    
    if ($conn->connect_errno) {
        echo json_encode(['error' => 'Database connection failed.']);
        exit;
    } 

    $query = "
    SELECT 
        personnel.id, 
        personnel.firstName, 
        personnel.lastName, 
        personnel.email, 
        department.name as departmentName,
        location.name as locationName
    FROM 
        personnel
    JOIN 
        department ON personnel.departmentID = department.id
    JOIN 
        location ON department.locationID = location.id
    ORDER BY 
        personnel.firstName ASC
";

    $result = $conn->query($query);

    $data = [];
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
    } else {
        echo json_encode(['error' => 'Database query failed.']);
        exit;
    }
    
    $conn->close();

    echo json_encode($data);
?>
