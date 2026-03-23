<?php
header('Content-Type: application/json; charset=utf-8');

function respond($d, $s = 200) {
    http_response_code($s);
    echo json_encode($d);
    exit;
}

function authUserID() {
    return $_SESSION['user_id'] ?? null;
}

function authRole() {
    return $_SESSION['role'] ?? null;
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

try {

    // GET one order or list orders
    if ($method === 'GET') {
        $currentUser = authUserID();
        $isAdmin = authRole() === 'admin';

        if (!$currentUser) {
            respond(['error' => 'Unauthorized'], 403);
        }

        if ($id) {
            if ($isAdmin) {
                $stmt = $pdo->prepare("
                    SELECT o.*
                    FROM orders o
                    WHERE o.id = ?
                ");
                $stmt->execute([$id]);
            } else {
                $stmt = $pdo->prepare("
                    SELECT o.*
                    FROM orders o
                    WHERE o.id = ? AND o.user_id = ?
                ");
                $stmt->execute([$id, $currentUser]);
            }

            $row = $stmt->fetch();
            if (!$row) respond(['error' => 'Order not found'], 404);

            respond($row);
        }

        if ($isAdmin) {
            $stmt = $pdo->query("
                SELECT o.*
                FROM orders o
                ORDER BY o.id DESC
            ");
            respond($stmt->fetchAll());
        } else {
            $stmt = $pdo->prepare("
                SELECT o.*
                FROM orders o
                WHERE o.user_id = ?
                ORDER BY o.id DESC
            ");
            $stmt->execute([$currentUser]);
            respond($stmt->fetchAll());
        }
    }

    // CREATE order
    if ($method === 'POST') {
        $currentUser = authUserID();
        if (!$currentUser) respond(['error' => 'Unauthorized'], 403);

        $userId = $currentUser;
        $total = isset($input['total']) ? (float)$input['total'] : 0.00;
        $status = $input['status'] ?? 'pending';

        $allowedStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($status, $allowedStatuses, true)) {
            respond(['error' => 'Invalid status'], 422);
        }

        $stmt = $pdo->prepare("
            INSERT INTO orders (user_id, total, status)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$userId, $total, $status]);

        respond(['success' => true, 'id' => $pdo->lastInsertId()], 201);
    }

    // UPDATE order
    if ($method === 'PUT') {
        if (!$id) respond(['error' => 'Missing order id'], 422);

        $currentUser = authUserID();
        $isAdmin = authRole() === 'admin';

        if (!$currentUser) respond(['error' => 'Unauthorized'], 403);

        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        if (!$order) respond(['error' => 'Order not found'], 404);

        if (!$isAdmin && (int)$order['user_id'] !== (int)$currentUser) {
            respond(['error' => 'Forbidden'], 403);
        }

        $fields = [];
        $params = [];

        // Admin can update total and status
        if ($isAdmin) {
            if (array_key_exists('total', $input)) {
                $fields[] = "total = ?";
                $params[] = (float)$input['total'];
            }
            if (array_key_exists('status', $input)) {
                $allowedStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
                if (!in_array($input['status'], $allowedStatuses, true)) {
                    respond(['error' => 'Invalid status'], 422);
                }
                $fields[] = "status = ?";
                $params[] = $input['status'];
            }
        } else {
            // Customer can only cancel their own pending order
            if (
                isset($input['status']) &&
                $input['status'] === 'cancelled' &&
                $order['status'] === 'pending'
            ) {
                $fields[] = "status = ?";
                $params[] = 'cancelled';
            } else {
                respond(['error' => 'You can only cancel pending orders'], 403);
            }
        }

        if (empty($fields)) respond(['error' => 'Nothing to update'], 400);

        $params[] = $id;

        $sql = "UPDATE orders SET " . implode(', ', $fields) . " WHERE id = ?";
        $pdo->prepare($sql)->execute($params);

        respond(['success' => true]);
    }

    // DELETE order
    if ($method === 'DELETE') {
        if (!$id) respond(['error' => 'Missing order id'], 422);

        $currentUser = authUserID();
        $isAdmin = authRole() === 'admin';

        if (!$currentUser) respond(['error' => 'Unauthorized'], 403);

        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        if (!$order) respond(['error' => 'Order not found'], 404);

        if (!$isAdmin && (int)$order['user_id'] !== (int)$currentUser) {
            respond(['error' => 'Forbidden'], 403);
        }

        $pdo->prepare("DELETE FROM orders WHERE id = ?")->execute([$id]);

        respond(['success' => true]);
    }

    respond(['error' => 'Method not allowed'], 405);

} catch (PDOException $e) {
    respond(['error' => 'DB error', 'details' => $e->getMessage()], 500);
}