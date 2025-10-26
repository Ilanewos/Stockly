const express = require('express');
require('dotenv').config();

const bahanRoutes = require('./routes/bahanRoutes');
const restockRoutes = require('./routes/restockRoutes');

const app = express();
app.use(express.json());

// index.js (backend)
const cors = require('cors');
app.use(cors());


app.use('/api/bahan', bahanRoutes);
app.use('/api/restock', restockRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
