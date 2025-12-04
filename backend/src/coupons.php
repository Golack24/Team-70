<?php

try {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM coupons WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(['error'=>'Coupon not found']); exit; }
            echo json_encode($row);
            exit;
        }
        // support ?code=XYZ
        if (isset($_GET['code'])) {
            $stmt = $pdo->prepare("SELECT * FROM coupons WHERE code = ? LIMIT 1");
            $stmt->execute([$_GET['code']]);
            echo json_encode($stmt->fetch());
            exit;
        }
        $stmt = $pdo->query("SELECT * FROM coupons ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }

    // Only the admin should create or update coupons
    $currentRole = $_SESSION['role'] ?? '';
    $isAdmin = $currentRole === 'admin';

    if ($method === 'POST') {
        if (!$isAdmin) { http_response_code(403); echo json_encode(['error'=>'Admin only']); exit; }
        $code = $input['code'] ?? $input['CODE'] ?? null;
        $type = $input['discount_type'] ?? null;
        $value = isset($input['discount_value']) ? (float)$input['discount_value'] : null;
        if (!$code || !$type || $value === null) { http_response_code(422); echo json_encode(['error'=>'code, discount_type and discount_value required']); exit; }

        $stmt = $pdo->prepare("INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, usage_limit, times_used, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $code,
            $input['description'] ?? null,
            $type,
            $value,
            $input['min_order_value'] ?? 0.00,
            $input['usage_limit'] ?? null,
            $input['times_used'] ?? 0,
            isset($input['is_active']) ? (int)$input['is_active'] : 1
        ]);
        http_response_code(201);
        echo json_encode(['success'=>true,'id'=>$pdo->lastInsertId()]);
        exit;
    }

    if ($method === 'PUT') {
        if (!$isAdmin) { http_response_code(403); echo json_encode(['error'=>'Admin only']); exit; }
        if (!$id) { http_response_code(422); echo json_encode(['error'=>'Missing id']); exit; }
        $fields = []; $params = [];
        $allowed = ['code','description','discount_type','discount_value','min_order_value','usage_limit','times_used','is_active'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $input)) {
                $fields[] = "$f = ?";
                $params[] = $input[$f];
            }
        }
        if (empty($fields)) { http_response_code(400); echo json_encode(['error'=>'No fields to update']); exit; }
        $params[] = $id;
        $sql = "UPDATE coupons SET " . implode(', ', $fields) . " WHERE id = ?";
        $pdo->prepare($sql)->execute($params);
        echo json_encode(['success'=>true]);
        exit;
    }
    
    if ($method === 'DELETE') {
        if (!$isAdmin) { http_response_code(403); echo json_encode(['error'=>'Admin only']); exit; }
        if (!$id) { http_response_code(422); echo json_encode(['error'=>'Missing id']); exit; }
        $pdo->prepare("DELETE FROM coupons WHERE id = ?")->execute([$id]);
        echo json_encode(['success'=>true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error'=>'Method not allowed']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error'=>'DB error','details'=>$e->getMessage()]);
}
