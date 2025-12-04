<?php
header('Content-Type: application/json; charset=utf-8');


function inputJson() {
    $b = file_get_contents('php://input');
    return $b ? json_decode($b, true) : [];
}
function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}
function currentUserRole() {
    return $_SESSION['role'] ?? null;
}
function requireAdmin() {
    if (currentUserRole() !== 'admin') respond(['error' => 'Admin only'], 403);
}

//read method and params
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;
$page   = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit  = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 20;
$offset = ($page - 1) * $limit;
$q      = isset($_GET['q']) ? trim($_GET['q']) : null; //search term

try {
    //GET list or a single product
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare(
                "SELECT p.*, c.name AS category_name
                 FROM products p
                 LEFT JOIN categories c ON c.id = p.category_id
                 WHERE p.id = ?"
            );
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if (!$product) respond(['error' => 'Product not found'], 404);
            respond($product);
        }

        //build list query with optional search
        if ($q) {
            //search by name or description
            $sql = " SELECT p.id, p.name, p.price, p.stock, p.image, p.category_id, c.name AS category_name FROM products pLEFT JOIN categories c ON c.id = p.category_id
                WHERE p.name LIKE :q OR p.description LIKE :q
                ORDER BY p.id DESC
                LIMIT :limit OFFSET :offset
            ";
            $stmt = $pdo->prepare($sql);
            $like = '%' . $q . '%';
            $stmt->bindValue(':q', $like, PDO::PARAM_STR);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll();
        } else {
            $sql = " SELECT p.id, p.name, p.price, p.stock, p.image, p.category_id, c.name AS category_name FROM products p
                LEFT JOIN categories c ON c.id = p.category_id
                ORDER BY p.id DESC
                LIMIT :limit OFFSET :offset
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll();
        }

        $countSql = $q
            ? "SELECT COUNT(*) FROM products WHERE name LIKE :q OR description LIKE :q"
            : "SELECT COUNT(*) FROM products";
        $countStmt = $pdo->prepare($countSql);
        if ($q) $countStmt->execute([$like]);
        else $countStmt->execute();
        $total = (int)$countStmt->fetchColumn();

        respond([
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => (int)ceil($total / $limit)
            ],
            'data' => $rows
        ]);
    }
    //POST create 
    if ($method === 'POST') {
        requireAdmin();
        $data = inputJson();

        //validation
        if (empty($data['name']) || !isset($data['price'])) {
            respond(['error' => 'Name and price are required'], 422);
        }

        $name = trim($data['name']);
        $price = floatval($data['price']);
        $stock = isset($data['stock']) ? (int)$data['stock'] : 0;
        $description = isset($data['description']) ? $data['description'] : null;
        $image = isset($data['image']) ? $data['image'] : null; // filename or URL
        $category_id = isset($data['category_id']) ? (int)$data['category_id'] : null;

        //verifies if a category exists
        if ($category_id !== null) {
            $c = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
            $c->execute([$category_id]);
            if (!$c->fetch()) respond(['error' => 'Invalid category_id'], 422);
        }

        $stmt = $pdo->prepare("
            INSERT INTO products (name, price, stock, description, image, category_id)
            VALUES (:name, :price, :stock, :description, :image, :category_id)
        ");
        $stmt->execute([
            ':name' => $name,
            ':price' => $price,
            ':stock' => $stock,
            ':description' => $description,
            ':image' => $image,
            ':category_id' => $category_id
        ]);

        respond(['success' => true, 'id' => (int)$pdo->lastInsertId()], 201);
    }

    //PUT update
    if ($method === 'PUT') {
        requireAdmin();
        if (!$id) respond(['error' => 'Missing product id'], 422);

        $data = inputJson();
        $allowed = ['name','price','stock','description','image','category_id'];
        $sets = []; $params = [];

        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                //type casting
                if ($f === 'price') $params[":$f"] = floatval($data[$f]);
                elseif ($f === 'stock') $params[":$f"] = (int)$data[$f];
                elseif ($f === 'category_id') $params[":$f"] = $data[$f] === null ? null : (int)$data[$f];
                else $params[":$f"] = $data[$f];
                $sets[] = "$f = :$f";
            }
        }

        if (!$sets) respond(['error' => 'Nothing to update'], 400);

        //verifies if a category exists if included
        if (array_key_exists('category_id', $data) && $data['category_id'] !== null) {
            $c = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
            $c->execute([(int)$data['category_id']]);
            if (!$c->fetch()) respond(['error' => 'Invalid category_id'], 422);
        }

        $params[':id'] = $id;
        $sql = "UPDATE products SET " . implode(', ', $sets) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        respond(['success' => true]);
    }

    //DELETES a product

    if ($method === 'DELETE') {
        requireAdmin();
        if (!$id) respond(['error' => 'Missing product id'], 422);

        //checks if a product exists first
        $check = $pdo->prepare("SELECT id FROM products WHERE id = ?");
        $check->execute([$id]);
        if (!$check->fetch()) respond(['error' => 'Product not found'], 404);

        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);

        respond(['success' => true]);
    }

    respond(['error' => 'Method not allowed'], 405);

} catch (PDOException $e) {
    //logs an error in production and returns a generic message
    respond(['error' => 'Database error', 'details' => $e->getMessage()], 500);
}

