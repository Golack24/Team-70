<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once '../dbh.inc.php';

function jsonInput(){ return json_decode(file_get_contents("php://input"), true) ?? []; }
function respond($d,$s=200){ http_response_code($s); echo json_encode($d); exit;}
function authRole(){ return $_SESSION['role'] ?? null; }

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

try {

    // Create shipping entry
    if ($method === 'POST') {

        if (authRole() !== 'admin') respond(['error'=>'Admin only'], 403);

        $data = jsonInput();
        if (empty($data['order_id']) || empty($data['courier'])) {
            respond(['error'=>'order_id and courier required'], 422);
        }

        $stmt = $pdo->prepare("
            INSERT INTO shipping (order_id, tracking_number, courier, status, estimated_delivery)
            VALUES (:o, :t, :c, :s, :e)
        ");
        $stmt->execute([
            ':o'=>$data['order_id'],
            ':t'=>$data['tracking_number'] ?? null,
            ':c'=>$data['courier'],
            ':s'=>$data['status'] ?? 'pending',
            ':e'=>$data['estimated_delivery'] ?? null
        ]);

        respond(['success'=>true, 'id'=>$pdo->lastInsertId()], 201);
    }


    // Get shipping
    if ($method === 'GET') {

        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM shipping WHERE id=?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) respond(['error'=>'Not found'], 404);
            respond($row);
        }

        respond($pdo->query("SELECT * FROM shipping ORDER BY id DESC")->fetchAll());
    }


    // Update shipping entry
    if ($method === 'PUT') {

        if (authRole() !== 'admin') respond(['error'=>'Admin only'], 403);
        if (!$id) respond(['error'=>'Missing shipping id'], 422);

        $data = jsonInput();

        $fields = ['tracking_number','courier','status','estimated_delivery'];
        $set = [];
        $params = [];

        foreach ($fields as $f) {
            if (array_key_exists($f, $data)) {
                $set[] = "$f = :$f";
                $params[":$f"] = $data[$f];
            }
        }

        if (empty($set)) respond(['error'=>'Nothing to update'], 400);

        $params[':id'] = $id;

        $sql = "UPDATE shipping SET ".implode(",", $set)." WHERE id=:id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        respond(['success'=>true]);
    }


    // Delete shipping entry
    if ($method === 'DELETE') {
        if (authRole() !== 'admin') respond(['error'=>'Admin only'], 403);
        if (!$id) respond(['error'=>'Missing shipping id'], 422);

        $stmt = $pdo->prepare("DELETE FROM shipping WHERE id=?");
        $stmt->execute([$id]);

        respond(['success'=>true]);
    }

} catch (PDOException $e) {
    respond(['error'=>'DB error', 'details'=>$e->getMessage()], 500);
}
?>