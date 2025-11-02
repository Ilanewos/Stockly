// index.js
const express = require('express');
require('dotenv').config();
const operasionalRoutes = require('./routes/operasionalRoutes');

const app = express();
app.use(express.json());

app.use('/operasional', operasionalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Operasional service running on port ${PORT}`);
});