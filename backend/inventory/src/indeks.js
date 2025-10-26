require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Default route
app.get('/', (req, res) => {
  res.send('✅ Backend Inventory berjalan!');
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
