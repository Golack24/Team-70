<?php

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

header('Content-Type: application/json; charset=utf-8');

// Start session
if (session_status() === PHP_SESSION_NONE) session_start();

// Load DB connection
require_once __DIR__ . '/../src/db.php';

// Common variables used for routing
$method = $_SERVER['REQUEST_METHOD'];
$raw = file_get_contents('php://input');
$input = $raw ? json_decode($raw, true) : [];
$resource = $_GET['resource'] ?? null;
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$action = $_GET['action'] ?? null;

// Router to protect allowed resources
$allowed = ['users','products','reviews','favourites','coupons','tags','addresses','orders','basket'];
if (!$resource) {
    echo json_encode(['api' => 'Metric API', 'resources' => $allowed]);
    exit;
}
if (!in_array($resource, $allowed, true)) {
    http_response_code(404); echo json_encode(['error'=>'Unknown resource']); exit;
}

$endpoint = __DIR__ . "/../src/{$resource}.php";
if (!file_exists($endpoint)) { http_response_code(404); echo json_encode(['error'=>'Not implemented']); exit; }

require $endpoint;
