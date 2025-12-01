<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once '../dbh.inc.php';

function jsonInput(){ return json_decode(file_get_contents("php://input"), true) ?? []; }
function respond($d,$s=200){ http_response_code($s); echo json_encode($d); exit;}
function authUserID(){ return $_SESSION['user_id'] ?? null; }

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

try {

    // add item to basket
    if ($method === 'POST') {

        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        $data = jsonInput();
        if (empty($data['product_id']) || empty($data['quantity'])) {
            respond(['error'=>'product_id and quantity required'], 422);
        }

        // If item already exists then increment quantity
        $check = $pdo->prepare("SELECT id FROM basket WHERE user_id=? AND product_id=?");
        $check->execute([$user, $data['product_id']]);
        $existing = $check->fetch();

        if ($existing) {
            $update = $pdo->prepare("UPDATE basket SET quantity = quantity + ? WHERE id=?");
            $update->execute([$data['quantity'], $existing['id']]);
            respond(['success'=>true, 'updated'=>true]);
        }

        $stmt = $pdo->prepare("
            INSERT INTO basket (user_id, product_id, quantity)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$user, $data['product_id'], $data['quantity']]);

        respond(['success'=>true, 'id'=>$pdo->lastInsertId()], 201);
    }


    // get users basket
    if ($method === 'GET') {
        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        $stmt = $pdo->prepare("
            SELECT b.id, b.product_id, b.quantity
            FROM basket b
            WHERE b.user_id = ?
        ");
        $stmt->execute([$user]);

        respond($stmt->fetchAll());
    }


    // update quantity
    if ($method === 'PUT') {
        if (!$id) respond(['error'=>'Missing basket id'], 422);

        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        $data = jsonInput();
        if (!isset($data['quantity'])) respond(['error'=>'quantity required'], 422);

        $stmt = $pdo->prepare("UPDATE basket SET quantity=? WHERE id=? AND user_id=?");
        $stmt->execute([$data['quantity'], $id, $user]);

        respond(['success'=>true]);
    }


    // delete item from basket or clear basket
    if ($method === 'DELETE') {

        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM basket WHERE id=? AND user_id=?");
            $stmt->execute([$id, $user]);
            respond(['success'=>true]);
        }

        // Clear basket
        $stmt = $pdo->prepare("DELETE FROM basket WHERE user_id=?");
        $stmt->execute([$user]);

        respond(['success'=>true, 'cleared'=>true]);
    }

} catch (PDOException $e) {
    respond(['error'=>'Database error', 'details'=>$e->getMessage()], 500);
}
?>