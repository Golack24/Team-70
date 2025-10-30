<?php

//Database Connection Settings
$host = 'localhost';
$dbname = ''; // aston dbname
$user= ''; // Aston user
$pass = ''; //Aston pass



try {
    $pdo = new PDO(); // waiting for the db to be established by aston

    // PDO options for error handling
    $pdo-> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo -> setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch    (PDOException $e) {
    http_response_code(500);
    echo json_encode ({         // if connections fails it will stop the script and show the error message down below
        "error" => "database connection failed"
        "details" => $e->getMessage()
    });
    exit;
}




?>