// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    listOrdersb
} = require('../controllers/orderControllers');

router.get('/orders', listOrders);            // ?status=proses

module.exports = router;