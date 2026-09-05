const db = require('../config/db');

// Ambil semua produk berdasarkan game_id
exports.getProductsByGame = (req, res) => {
  const { gameId } = req.params;
  db.query(
    'SELECT * FROM products WHERE game_id = ? AND is_active = 1',
    [gameId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};