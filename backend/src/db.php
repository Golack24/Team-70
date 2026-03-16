<?php

// Database connection (aston)

    $host = 'localhost';
    $user = 'cs2team70';
    $pass = 'co0dJ2qvmGYs7J9SrkVOjXrdQ';
    $database = 'cs2team70_db';

try {
    $dsn = "mysql:host=$host;dbname=$database;charset=utf8mb4";

    //PDO connection
    $pdo = new PDO($dsn, $user, $pass);

    // PDO options for error handling & fetching
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failed",
        "details" => $e->getMessage()
    ]);

    exit;
}

?>
