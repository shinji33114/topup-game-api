const db = require('../config/db');

exports.getAllGames = (req, res) => {
  db.query('SELECT * FROM games WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getGameById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM games WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Game tidak ditemukan' });
    res.json(results[0]);
  });
};