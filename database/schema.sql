-- =========================================================
-- Schema Database: topup_game_db
-- Project: Top Up Game API
-- Cara pakai: Buat database baru bernama 'topup_game_db' di
-- phpMyAdmin, lalu import/jalankan seluruh file ini di tab SQL.
-- =========================================================

-- Tabel users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel games
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    thumbnail_url VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel products (paket top-up per game)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Tabel orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    target_account_id VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    total_price DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'processing', 'success', 'failed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabel order_logs (histori perubahan status)
CREATE TABLE order_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =========================================================
-- Data Dummy (opsional, untuk keperluan testing/demo)
-- =========================================================

-- Data dummy games
INSERT INTO games (name, thumbnail_url, description) VALUES
('Mobile Legends', 'https://via.placeholder.com/150', 'Top up diamond Mobile Legends'),
('Free Fire', 'https://via.placeholder.com/150', 'Top up diamond Free Fire'),
('PUBG Mobile', 'https://via.placeholder.com/150', 'Top up UC PUBG Mobile');

-- Data dummy products (paket top-up)
INSERT INTO products (game_id, name, price) VALUES
(1, '86 Diamonds', 20000),
(1, '172 Diamonds', 40000),
(1, '257 Diamonds', 60000),
(2, '70 Diamonds', 10000),
(2, '140 Diamonds', 20000),
(3, '60 UC', 15000),
(3, '325 UC', 75000);

-- Catatan: data dummy user TIDAK disertakan di sini karena password
-- perlu di-hash dengan bcrypt melalui endpoint POST /api/auth/register,
-- bukan diinsert manual sebagai plain text.
-- Setelah menjalankan server, gunakan endpoint register untuk membuat
-- akun user dan admin (role admin bisa diubah manual lewat phpMyAdmin
-- pada kolom 'role' di tabel users).
