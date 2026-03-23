<?php
header('Content-Type: application/json; charset=utf-8');

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function authUserID() {
    return $_SESSION['user_id'] ?? null;
}

function authRole() {
    return $_SESSION['role'] ?? null;
}

try {


    if ($method === 'POST') {

        // REGISTER
        if ($action === 'register') {

            if (empty($input['email']) || empty($input['password'])) {
                respond(['error' => 'Email and password required'], 422);
            }

            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$input['email']]);

            if ($stmt->fetch()) {
                respond(['error' => 'Email already in use'], 409);
            }

            $hash = password_hash($input['password'], PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("
                INSERT INTO users
                (username, first_name, last_name, email, password_hash, phone, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $input['username'] ?? null,
                $input['first_name'] ?? null,
                $input['last_name'] ?? null,
                $input['email'],
                $hash,
                $input['phone'] ?? null,
                $input['role'] ?? 'customer'
            ]);

            respond(['success' => true, 'id' => $pdo->lastInsertId()], 201);

        }


                    // RESET PASSWORD
            if ($action === 'reset_password') {

            if (empty($input['email']) || empty($input['password'])) {
                respond(['error' => 'Email and password required'], 422);
            }

            if (strlen($input['password']) < 6) {
                respond(['error' => 'Password must be at least 6 characters'], 422);
            }

            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$input['email']]);
            $user = $stmt->fetch();

            if (!$user) {
                respond(['error' => 'User not found'], 404);
            }

            $hash = password_hash($input['password'], PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("
                UPDATE users
                SET password_hash = ?
                WHERE email = ?
            ");

            $stmt->execute([$hash, $input['email']]);

            respond([
                'success' => true,
                'message' => 'Password updated successfully'
            ]);
        }



        // LOGIN
        if ($action === 'login') {

            if (empty($input['email']) || empty($input['password'])) {
                respond(['error' => 'Email and password required'], 422);
            }

            $stmt = $pdo->prepare("
                SELECT id, email, username, role, password_hash
                FROM users
                WHERE email = ?
            ");

            $stmt->execute([$input['email']]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($input['password'], $user['password_hash'])) {
                respond(['error' => 'Invalid credentials'], 401);
            }

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            respond([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'username' => $user['username'],
                    'role' => $user['role']
                ]
            ]);
        }

        // LOGOUT
        if ($action === 'logout') {

            session_unset();
            session_destroy();

            respond(['success' => true]);
        }

        respond(['error' => 'Unknown POST action'], 400);
    }

    /* =============================
       GET USERS
    ============================== */

    if ($method === 'GET') {

        if ($id) {

            $stmt = $pdo->prepare("
                SELECT id, username, first_name, last_name, email, phone, role
                FROM users
                WHERE id = ?
            ");

            $stmt->execute([$id]);
            $user = $stmt->fetch();

            if (!$user) respond(['error' => 'User not found'], 404);

            respond($user);
        }

        $stmt = $pdo->query("
            SELECT id, username, first_name, last_name, email, phone, role
            FROM users
            ORDER BY id DESC
        ");

        respond($stmt->fetchAll());
    }

    /* =============================
       UPDATE USER
    ============================== */

    if ($method === 'PUT') {

        if (!$id) respond(['error' => 'Missing user id'], 422);

        $currentUser = authUserID();
        $isAdmin = authRole() === 'admin';

        if (!$currentUser || ($currentUser !== $id && !$isAdmin)) {
            respond(['error' => 'Unauthorized'], 403);
        }

        $fields = ['username','first_name','last_name','phone','role'];
        $sets = [];
        $params = [];

        foreach ($fields as $field) {

            if (array_key_exists($field, $input)) {

                if ($field === 'role' && !$isAdmin) continue;

                $sets[] = "$field = ?";
                $params[] = $input[$field];
            }
        }

        if (!empty($input['password'])) {

            $sets[] = "password_hash = ?";
            $params[] = password_hash($input['password'], PASSWORD_BCRYPT);
        }

        if (empty($sets)) respond(['error' => 'No fields to update'], 400);

        $params[] = $id;

        $sql = "UPDATE users SET " . implode(', ', $sets) . " WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        respond(['success' => true]);
    }

    /* =============================
       DELETE USER
    ============================== */

    if ($method === 'DELETE') {

        if (!$id) respond(['error' => 'Missing user id'], 422);

        $currentUser = authUserID();
        $isAdmin = authRole() === 'admin';

        if (!$currentUser || ($currentUser !== $id && !$isAdmin)) {
            respond(['error' => 'Unauthorized'], 403);
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        respond(['success' => true]);
    }

    respond(['error' => 'Method not allowed'], 405);

} catch (PDOException $e) {

    respond([
        'error' => 'Database error',
        'details' => $e->getMessage()
    ], 500);
}
