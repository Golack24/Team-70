CREATE DATABASE IF NOT EXISTS metricdb;
USE metricdb;

CREATE TABLE users (
    id int AUTO_INCREMENT PRIMARY key,
    username VARCHAR(100) DEFAULT NULL,
    first_name VARCHAR(100) DEFAULT NULL,
    last_name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    role ENUM('customer','admin','staff') NOT NULL DEFAULT 'customer'
);

CREATE TABLE categories (
    id int AUTO_INCREMENT PRIMARY key,
    name VARCHAR(255),
    slug VARCHAR(100) NOT NULL UNIQUE,
);

CREATE TABLE products (
    id int  AUTO_INCREMENT PRIMARY key,
    name VARCHAR(255) NOT NULL,
    price decimal(10,2) NOT NULL,
    stock INT default 0,
    description TEXT,
    image VARCHAR(255) DEFAULT NULL,
    category_id INT,    
    FOREIGN Key (category_id) REFERENCES categories(id) ON Delete SET NULL 

);

CREATE TABLE reviews (
    id int AUTO_INCREMENT PRIMARY key,
    users_id INT NOT NULL,
    product_id INT NOT NULL,
    rating TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    FOREIGN Key (user_id) REFERENCES users(id) ON Delete CASCADE,
    FOREIGN Key (product_id) REFERENCES products(id) ON Delete CASCADE
);



CREATE TABLE favourites (
    id int AUTO_INCREMENT PRIMARY Key,
    users_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN Key (user_id) REFERENCES users(id) ON Delete CASCADE,
    FOREIGN Key (product_id) REFERENCES products(id) ON Delete CASCADE,
    UNIQUE Key unique_favourite (user_id, product_id)

);

CREATE TABLE coupons (
    id int AUTO_INCREMENT PRIMARY Key,
    CODE VARCHAR(25) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2),
    min_order_value DECIMAL (10,2) DEFAULT 0.00,
    usage_limit INT DEFAULT NULL,
    times_used INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
);


CREATE TABLE orders (
    id AUTO_INCREMENT PRIMARY Key,
    users_id INT NOT NULL,
    total DECIMAL(0,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN Key (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE basket (
    id int AUTO_INCREMENT PRIMARY key,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN Key (user_id) REFERENCES users(id) ON Delete CASCADE,
    FOREIGN Key (product_id) REFERENCES products(id) ON Delete CASCADE,
    UNIQUE KEY unique_basket_item (user_id, product_id)
);

CREATE TABLE addresses (
    id int AUTO_INCREMENT PRIMARY key,
    user_id INT NOT NULL,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(VARCHAR(255) DEFAULT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default TINYINT(1) DEFAULT 0,
    FOREIGN Key (user_id) REFERENCES users(id) ON Delete CASCADE
);

CREATE TABLE shipping (
    id int AUTO_INCREMENT PRIMARY key,
    order_id INT NOT NULL,
    tracking_number VARCHAR(100),
    courier VARCHAR(100),
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    estimated_delivery DATE,
    FOREIGN Key (order_id) REFERENCES orders(id) ON Delete CASCADE
);


