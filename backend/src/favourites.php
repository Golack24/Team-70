<?php

try {
    if ($method === 'GET') {
        // list user's favourites or all of them
        $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
        if ($userId) {
            $stmt = $pdo->prepare("SELECT f.*, p.name, p.price, p.image FROM favourites f LEFT JOIN products p ON f.product_id = p.id WHERE f.user_id = ? ORDER BY f.id DESC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $pdo->query("SELECT f.*, p.name, p.price, p.image FROM favourites f LEFT JOIN products p ON f.product_id = p.id ORDER BY f.id DESC LIMIT 1000");
        }
        echo json_encode($stmt->fetchAll());
        exit;
    }

    if ($method === 'POST') {
        $currentUser = $_SESSION['user_id'] ?? null;
        if (!$currentUser) { http_response_code(401); echo json_encode(['error'=>'Authentication required']); exit; }

        $product_id = $input['product_id'] ?? null;
        if (!$product_id) { http_response_code(422); echo json_encode(['error'=>'product_id required']); exit; }

        // insert or ignore
        $stmt = $pdo->prepare("INSERT IGNORE INTO favourites (user_id, product_id) VALUES (?, ?)");
        $stmt->execute([$currentUser, $product_id]);
        if ($stmt->rowCount() === 0) { // already existed
            http_response_code(409);
            echo json_encode(['error'=>'Already favourited']);
            exit;
        }
        http_response_code(201);
        echo json_encode(['success'=>true,'id'=>$pdo->lastInsertId()]);
        exit;
    }

    if ($method === 'DELETE') {
        // Deletes by favourite id 
        if ($id) {
            // fetch owner check
            $stmt = $pdo->prepare("SELECT user_id FROM favourites WHERE id = ?");
            $stmt->execute([$id]); $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(['error'=>'Not found']); exit; }
            $currentUser = $_SESSION['user_id'] ?? null;
            $isAdmin = ($_SESSION['role'] ?? '') === 'admin';
            if (!$currentUser || ($currentUser !== (int)$row['user_id'] && !$isAdmin)) { http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit; }
            $pdo->prepare("DELETE FROM favourites WHERE id = ?")->execute([$id]);
            echo json_encode(['success'=>true]);
            exit;
        } else {
            // Deletes by user_id for current user
            $currentUser = $_SESSION['user_id'] ?? null;
            if (!$currentUser) { http_response_code(401); echo json_encode(['error'=>'Authentication required']); exit; }
            $product_id = $input['product_id'] ?? ($_GET['product_id'] ?? null);
            if (!$product_id) { http_response_code(422); echo json_encode(['error'=>'product_id required']); exit; }
            $pdo->prepare("DELETE FROM favourites WHERE user_id = ? AND product_id = ?")->execute([$currentUser, $product_id]);
            echo json_encode(['success'=>true]);
            exit;
        }
    }

    http_response_code(405);
    echo json_encode(['error'=>'Method not allowed']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error'=>'DB error','details'=>$e->getMessage()]);
}
