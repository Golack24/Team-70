<?php
function slugify($s) {
    $s = strtolower(trim($s));
    $s = preg_replace('/[^a-z0-9\-]+/','-', $s);
    $s = preg_replace('/-+/', '-', $s);
    return trim($s, '-');
}

// Create tag if not exists then return id
function getOrCreateTag(PDO $pdo, string $name) : int {
    $slug = slugify($name);
    // check if it's existing
    $stmt = $pdo->prepare("SELECT id FROM tags WHERE slug = ? LIMIT 1");
    $stmt->execute([$slug]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) return (int)$row['id'];

    // insert new tag
    $stmt = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (?, ?)");
    $stmt->execute([$name, $slug]);
    return (int)$pdo->lastInsertId();
}

// Associate a product and tag 
function addTagToProduct(PDO $pdo, int $productId, int $tagId) : bool {
    $stmt = $pdo->prepare("INSERT IGNORE INTO product_tags (product_id, tag_id) VALUES (?, ?)");
    return $stmt->execute([$productId, $tagId]);
}

// Remove tag association
function removeTagFromProduct(PDO $pdo, int $productId, int $tagId) : bool {
    $stmt = $pdo->prepare("DELETE FROM product_tags WHERE product_id = ? AND tag_id = ?");
    return $stmt->execute([$productId, $tagId]);
}

// Get tags for a product
function getTagsForProduct(PDO $pdo, int $productId) : array {
    $stmt = $pdo->prepare("SELECT t.id, t.name, t.slug FROM tags t JOIN product_tags pt ON pt.tag_id = t.id WHERE pt.product_id = ? ORDER BY t.name");
    $stmt->execute([$productId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get products for a tag id
function getProductsForTag(PDO $pdo, int $tagId, int $limit = 100) : array {
    $stmt = $pdo->prepare("SELECT p.* FROM products p JOIN product_tags pt ON pt.product_id = p.id WHERE pt.tag_id = ? ORDER BY p.id DESC LIMIT ?");
    $stmt->bindValue(1, $tagId, PDO::PARAM_INT);
    $stmt->bindValue(2, $limit, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get products that have all specified tag ids
function getProductsWithAllTags(PDO $pdo, array $tagIds, int $limit = 100) : array {
    if (empty($tagIds)) return [];
    $placeholders = implode(',', array_fill(0, count($tagIds), '?'));
    $sql = "
      SELECT p.*
      FROM products p
      JOIN product_tags pt ON pt.product_id = p.id
      WHERE pt.tag_id IN ({$placeholders})
      GROUP BY p.id
      HAVING COUNT(DISTINCT pt.tag_id) = ?
      ORDER BY p.id DESC
      LIMIT ?
    ";
    $stmt = $pdo->prepare($sql);
    $i = 1;
    foreach ($tagIds as $t) $stmt->bindValue($i++, (int)$t, PDO::PARAM_INT);
    $stmt->bindValue($i++, count($tagIds), PDO::PARAM_INT);
    $stmt->bindValue($i++, $limit, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
