<?php
function jsonInput() { //reads json body
    $body = file_get_contents('php://input');
    return $body ? json_decode($body, true) : [];
}


function respond($data, $status = 200) { //sends json 
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function authUserID() {
    return $_SESSION['user_id'] ?? null;

}


$method = $_SERVER['REQUEST_METHOD'];  //routing based on the actions and methods 
$action = $_GET['action'] ?? null;
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

//POST Actions to register,login and logout
try {
    if($method == 'POST') {
        $data = inputJson();
    }

    if ($action == 'register') {
        if(empty($data['email']) || empty($data['password'])) {
            respond(['error' => 'Email and password required'],422);
        }
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email=?");
        $stmt ->execute([$data['email']]);
        if ($stmt->fetch()) respond(['error' => 'Email already in use'], 409);

        $stmt = $pdo->prepare("
                INSERT INTO users (username, first_name, last_name, email, password_hash, phone, role)
                VALUES (:username,:first_name,:last_name,:email,:password_hash,:phone,:role)
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
            respond(['success' => true, 'id' => $pdo->lastInsertId()], 201);
    }

    if($action == 'login') {
        if (empty($data['email']) || empty($data['password'])) {
            respond(['error' => 'Email and password required'], 422);
        }
        $stmt = $pdo->prepare("SELECT id, password_hash, email, username, role FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            $u = $stmt->fetch();
            if (!$u || !password_verify($data['password'], $u['password_hash'])) {
                respond(['error' => 'Invalid credentials'], 401);
            }
        $_SESSION['user_id'] = $u['id'];
            $_SESSION['role'] = $u['role'];
            respond(['success' => true, 'user' => [
                'id' => $u['id'],
                'email' => $u['email'],
                'username' => $u['username'],
                'role' => $u['role']
            ]]);
    }

    if($action == 'logout') {
        session_unset();
        session_destroy();
        respond(['success'=> true]);
    }
    respond(['error' => 'Unknown POST action'], 400);


if($method === 'GET') {
    if($id) {
        $stmt = $pdo->prepare("SELECT id, username, first_name, last_name, email, phone, role, created_at FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $u = $stmt->fetch();
            if (!$u) respond(['error' => 'User not found'], 404);
            respond($u);
        } else {
            // listing users
            $stmt = $pdo->query("SELECT id, username, first_name, last_name, email, phone, role, created_at FROM users ORDER BY id DESC LIMIT 200");
            respond($stmt->fetchAll());
    }

}

if ($method === 'PUT') {
        if (!$id) respond(['error' => 'Missing user id'], 422);
        $current = authUserId();
        $isAdmin = ($_SESSION['role'] ?? '') === 'admin';
        if (!$current || ($current !== $id && !$isAdmin)) respond(['error' => 'Unauthorized'], 403);

        $data = jsonInput();
        // allow change of specific fields only
        $fields = ['username','first_name','last_name','phone','role'];
        $sets = []; $params = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $data)) {
                // only admin can change role
                if ($f === 'role' && !$isAdmin) continue;
                $sets[] = "$f = :$f";
                $params[":$f"] = $data[$f];
            }
        }
        if (!empty($data['password'])) { //password change
            $sets[] = "password_hash = :password_hash";
            $params[':password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        if (empty($sets)) respond(['error' => 'No fields to update'], 400);
        $params[':id'] = $id;
        $sql = "UPDATE users SET " . implode(', ', $sets) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        respond(['success' => true]);
    }

    //delete user
if ($method === 'DELETE') {
    if(!$id) respond(['error' => 'Missing user id'],422);
    $current = authUserID();
    $isAdmin = ($_SESSION['role']?? '') === 'admin';
    if (!$current || ($current !== $id && !$isAdmin)) respond(['error' => 'Unauthorised'], 403);

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt ->execute(['id']);
    respond(['success' -> true]);
    }

} catch (PDOException $e) {
    respond(['error' => 'Database error', 'details' => $e->getMessage()], 500);
}
