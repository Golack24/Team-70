<?php

try {
    // list or get one review
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT r.*, u.username FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(['error'=>'Review not found']); exit; }
            echo json_encode($row);
            exit;
        }
        //optional filter
        $productId = isset($_GET['product_id']) ? (int)$_GET['product_id'] : null;
        if ($productId) {
            $stmt = $pdo->prepare("SELECT r.*, u.username FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.id DESC");
            $stmt->execute([$productId]);
        } else {
            $stmt = $pdo->query("SELECT r.*, u.username FROM reviews r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.id DESC LIMIT 500");
        }
        echo json_encode($stmt->fetchAll());
        exit;
    }

    // Create reviews
    if ($method === 'POST') {
        // must be logged in
        $currentUser = $_SESSION['user_id'] ?? null;
        if (!$currentUser) { http_response_code(401); echo json_encode(['error'=>'Authentication required']); exit; }

        $product_id = $input['product_id'] ?? null;
        $rating = isset($input['rating']) ? (int)$input['rating'] : null;
        $comment = $input['comment'] ?? null;
        if (!$product_id || !$rating) { http_response_code(422); echo json_encode(['error'=>'product_id and rating required']); exit; }
        if ($rating < 1 || $rating > 5) { http_response_code(422); echo json_encode(['error'=>'rating must be 1..5']); exit; }

        $stmt = $pdo->prepare("INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)");
        $stmt->execute([$currentUser, $product_id, $rating, $comment]);
        http_response_code(201);
        echo json_encode(['success'=>true, 'id'=>$pdo->lastInsertId()]);
        exit;
    }

    // Update reviews
    if ($method === 'PUT') {
        if (!$id) { http_response_code(422); echo json_encode(['error'=>'Missing id']); exit; }
        $stmt = $pdo->prepare("SELECT user_id FROM reviews WHERE id = ?");
        $stmt->execute([$id]); $r = $stmt->fetch();
        if (!$r) { http_response_code(404); echo json_encode(['error'=>'Not found']); exit; }

        $currentUser = $_SESSION['user_id'] ?? null;
        $isAdmin = ($_SESSION['role'] ?? '') === 'admin';
        if (!$currentUser || ($currentUser !== (int)$r['user_id'] && !$isAdmin)) { http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit; }

        $fields = []; $params = [];
        if (isset($input['rating'])) { $fields[] = "rating = ?"; $params[] = (int)$input['rating']; }
        if (array_key_exists('comment', $input)) { $fields[] = "comment = ?"; $params[] = $input['comment']; }
        if (empty($fields)) { http_response_code(400); echo json_encode(['error'=>'No fields to update']); exit; }

        $params[] = $id;
        $sql = "UPDATE reviews SET " . implode(', ', $fields) . " WHERE id = ?";
        $pdo->prepare($sql)->execute($params);
        echo json_encode(['success'=>true]);
        exit;
    }

    // Delete reviews
    if ($method === 'DELETE') {
        if (!$id) { http_response_code(422); echo json_encode(['error'=>'Missing id']); exit; }
        $stmt = $pdo->prepare("SELECT user_id FROM reviews WHERE id = ?");
        $stmt->execute([$id]); $r = $stmt->fetch();
        if (!$r) { http_response_code(404); echo json_encode(['error'=>'Not found']); exit; }

        $currentUser = $_SESSION['user_id'] ?? null;
        $isAdmin = ($_SESSION['role'] ?? '') === 'admin';
        if (!$currentUser || ($currentUser !== (int)$r['user_id'] && !$isAdmin)) { http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit; }

        $pdo->prepare("DELETE FROM reviews WHERE id = ?")->execute([$id]);
        echo json_encode(['success'=>true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error'=>'Method not allowed']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error'=>'DB error','details'=>$e->getMessage()]);
}
