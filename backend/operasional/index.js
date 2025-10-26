// index.js
const express = require('express');
const cors = require('cors'); // tambahkan ini
require('dotenv').config();

const app = express();
const orderRoutes = require('./routes/orderRoutes');

app.use(cors()); 
app.use(express.json());
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
