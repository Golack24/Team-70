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

    // Create address
    if ($method === 'POST') {

        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        $data = jsonInput();

        if (empty($data['line1']) || empty($data['city']) || empty($data['postcode']) || empty($data['country'])) {
            respond(['error'=>'Missing required fields'], 422);
        }

        // If this is default then unset old default
        if (!empty($data['is_default'])) {
            $pdo->prepare("UPDATE addresses SET is_default=0 WHERE user_id=?")
                ->execute([$user]);
        }

        $stmt = $pdo->prepare("
            INSERT INTO addresses (user_id, line1, line2, city, postcode, country, is_default)
            VALUES (:u, :l1, :l2, :city, :pc, :country, :d)
        ");
        $stmt->execute([
            ':u' => $user,
            ':l1' => $data['line1'],
            ':l2' => $data['line2'] ?? null,
            ':city' => $data['city'],
            ':pc' => $data['postcode'],
            ':country' => $data['country'],
            ':d' => $data['is_default'] ?? 0
        ]);

        respond(['success'=>true, 'id'=>$pdo->lastInsertId()], 201);
    }

    // Get addresses
    if ($method === 'GET') {
        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM addresses WHERE id=? AND user_id=?");
            $stmt->execute([$id, $user]);
            $row = $stmt->fetch();
            if (!$row) respond(['error'=>'Not found'], 404);
            respond($row);
        }

        $stmt = $pdo->prepare("SELECT * FROM addresses WHERE user_id=? ORDER BY id DESC");
        $stmt->execute([$user]);
        respond($stmt->fetchAll());
    }


    // Update addresses
    if ($method === 'PUT') {

        if (!$id) respond(['error'=>'Missing address id'], 422);

        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        $data = jsonInput();

        $fields = ['line1','line2','city','postcode','country','is_default'];

        $set = [];
        $params = [];

        foreach ($fields as $f) {
            if (array_key_exists($f, $data)) {
                $set[] = "$f = :$f";
                $params[":$f"] = $data[$f];
            }
        }

        if (empty($set)) respond(['error'=>'Nothing to update'], 400);

        // If set default then unset all others
        if (!empty($data['is_default'])) {
            $pdo->prepare("UPDATE addresses SET is_default=0 WHERE user_id=?")
                ->execute([$user]);
        }

        $params[':id'] = $id;
        $params[':u'] = $user;

        $sql = "UPDATE addresses SET ".implode(",", $set)." WHERE id=:id AND user_id=:u";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        respond(['success'=>true]);
    }


    // Delete address
    if ($method === 'DELETE') {
        if (!$id) respond(['error'=>'Missing address id'], 422);

        $user = authUserID();
        if (!$user) respond(['error'=>'Unauthorized'], 403);

        $stmt = $pdo->prepare("DELETE FROM addresses WHERE id=? AND user_id=?");
        $stmt->execute([$id, $user]);

        respond(['success'=>true]);
    }

} catch (PDOException $e) {
    respond(['error'=>'DB error', 'details'=>$e->getMessage()], 500);
}
?>