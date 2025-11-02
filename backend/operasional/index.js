// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const operasionalRoutes = require('./routes/operasionalRoutes');

const app = express();
app.use(cors()); // allow all origins (dev)
app.use(express.json());
app.use('/operasional', operasionalRoutes);

// tambahkan route root sederhana (opsional, untuk cek cepat)
app.get('/', (req, res) => res.send('Operasional service is alive'));

// jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Operasional service running on port ${PORT}`);
});