<?php
function addAddress($db, $user_id, $line1, $line2, $city, $postcode, $country, $is_default) {
    // If this address will be default it will remove default from other addresses
    if ($is_default == 1) {
        $db->query("UPDATE addresses SET is_default = 0 WHERE user_id = $user_id");
    }

    $stmt = $db->prepare("
        INSERT INTO addresses (user_id, line1, line2, city, postcode, country, is_default) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$user_id, $line1, $line2, $city, $postcode, $country, $is_default]);
}
function getAddresses($db, $user_id) {
    $stmt = $db->prepare("SELECT id, line1, line2, city, postcode, country, is_default FROM addresses WHERE user_id = ?");
    $stmt->execute([$user_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function setDefaultAddress($db, $user_id, $address_id) {
    // Remove default from all addresses of the user
    $db->query("UPDATE addresses SET is_default = 0 WHERE user_id = $user_id");

    // Set the specified address as default
    $stmt = $db->prepare("UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?");
    $stmt->execute([$address_id, $user_id]);
}
function deleteAddress($db, $user_id, $address_id) {
    $stmt = $db->prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?");
    $stmt->execute([$address_id, $user_id]);
}
?>