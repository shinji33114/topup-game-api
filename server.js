require('dotenv').config();
const express = require('express');
const cors = require('cors');

const gameRoutes = require('./src/routes/gameRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const authRoutes = require('./src/routes/authRoutes');

// app HARUS didefinisikan dulu sebelum dipakai
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Top Up Game berjalan dengan baik!');
});

// Baru setelah app didefinisikan, boleh pakai app.use()
app.use('/api/games', gameRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});