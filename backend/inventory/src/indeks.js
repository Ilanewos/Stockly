const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bahanRoutes = require('./routes/bahanRoutes');
const restokRoutes = require('./routes/restokRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bahan', bahanRoutes);
app.use('/api/restok', restokRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
