const db = require('../config/db');

// Bikin order baru (checkout)
exports.createOrder = (req, res) => {
  const user_id = req.user.id; // diambil dari token, bukan dari body lagi
  const { product_id, target_account_id, quantity } = req.body;

  if (!product_id || !target_account_id) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  // Ambil harga produk dulu dari database
  db.query('SELECT price FROM products WHERE id = ?', [product_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const price = results[0].price;
    const qty = quantity || 1;
    const totalPrice = price * qty;

    // Insert order baru
    const insertQuery = `
      INSERT INTO orders (user_id, product_id, target_account_id, quantity, total_price, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    db.query(insertQuery, [user_id, product_id, target_account_id, qty, totalPrice], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: 'Order berhasil dibuat',
        order_id: result.insertId,
        total_price: totalPrice,
        status: 'pending'
      });
    });
  });
};

// Ambil detail order berdasarkan ID
exports.getOrderById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT orders.*, products.name AS product_name, games.name AS game_name
    FROM orders
    JOIN products ON orders.product_id = products.id
    JOIN games ON products.game_id = games.id
    WHERE orders.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Order tidak ditemukan' });
    res.json(results[0]);
  });
};

// Ambil semua order milik user tertentu (riwayat transaksi)
exports.getOrdersByUser = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT orders.*, products.name AS product_name, games.name AS game_name
    FROM orders
    JOIN products ON orders.product_id = products.id
    JOIN games ON products.game_id = games.id
    WHERE orders.user_id = ?
    ORDER BY orders.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};