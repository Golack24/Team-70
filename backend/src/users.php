<?php
function jsonInput() {
    $body = file_get_contents('php://input');
    return $body ? json_decode($body, true) : [];
}

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function authUserID() {
    return $_SESSION['user_id'] ?? null;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

try {

       //POST ACTIONS

    if ($method === 'POST') {

        $data = jsonInput() ?? [];

        // REGISTER

        if ($action === 'register') {

            if (empty($data['email']) || empty($data['password'])) {
                respond(['error' => 'Email and password required'], 422);
            }

            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);

            if ($stmt->fetch()) {
                respond(['error' => 'Email already in use'], 409);
            }

            $hash = password_hash($data['password'], PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("
                INSERT INTO users
                (username, first_name, last_name, email, password_hash, phone, role)
                VALUES (:username, :first_name, :last_name, :email, :password_hash, :phone, :role)
            ");

            $stmt->execute([
                ':username' => $data['username'] ?? null,
                ':first_name' => $data['first_name'] ?? null,
                ':last_name' => $data['last_name'] ?? null,
                ':email' => $data['email'],
                ':password_hash' => $hash,
                ':phone' => $data['phone'] ?? null,
                ':role' => $data['role'] ?? 'customer'
            ]);

            respond([
                'success' => true,
                'id' => $pdo->lastInsertId()
            ], 201);
        }

        // LOGIN

        if ($action === 'login') {

            if (empty($data['email']) || empty($data['password'])) {
                respond(['error' => 'Email and password required'], 422);
            }

            $stmt = $pdo->prepare("
                SELECT id, password_hash, email, username, role
                FROM users
                WHERE email = ?
            ");

            $stmt->execute([$data['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($data['password'], $user['password_hash'])) {
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


    
      // GET USERS 

    if ($method === 'GET') {

        if ($id) {

            $stmt = $pdo->prepare("
                SELECT id, username, first_name, last_name, email, phone, role, created_at
                FROM users
                WHERE id = ?
            ");

            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                respond(['error' => 'User not found'], 404);
            }

            respond($user);
        }

        $stmt = $pdo->query("
            SELECT id, username, first_name, last_name, email, phone, role, created_at
            FROM users
            ORDER BY id DESC
            LIMIT 200
        ");

        respond($stmt->fetchAll(PDO::FETCH_ASSOC));
    }


      // UPDATE USER

    if ($method === 'PUT') {

        if (!$id) respond(['error' => 'Missing user id'], 422);

        $current = authUserID();
        $isAdmin = ($_SESSION['role'] ?? '') === 'admin';

        if (!$current || ($current !== $id && !$isAdmin)) {
            respond(['error' => 'Unauthorized'], 403);
        }

        $data = jsonInput();

        $fields = ['username','first_name','last_name','phone','role'];
        $sets = [];
        $params = [];

        foreach ($fields as $f) {

            if (array_key_exists($f, $data)) {

                if ($f === 'role' && !$isAdmin) continue;

                $sets[] = "$f = :$f";
                $params[":$f"] = $data[$f];
            }
        }

        if (!empty($data['password'])) {

            $sets[] = "password_hash = :password_hash";
            $params[':password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        if (empty($sets)) {
            respond(['error' => 'No fields to update'], 400);
        }

        $params[':id'] = $id;

        $sql = "UPDATE users SET " . implode(', ', $sets) . " WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        respond(['success' => true]);
    }


      // DELETE USER

    if ($method === 'DELETE') {

        if (!$id) respond(['error' => 'Missing user id'], 422);

        $current = authUserID();
        $isAdmin = ($_SESSION['role'] ?? '') === 'admin';

        if (!$current || ($current !== $id && !$isAdmin)) {
            respond(['error' => 'Unauthorized'], 403);
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        respond(['success' => true]);
    }

    respond(['error' => 'Unknown request'], 400);

} catch (PDOException $e) {

    respond([
        'error' => 'Database error',
        'details' => $e->getMessage()
    ], 500);
}
