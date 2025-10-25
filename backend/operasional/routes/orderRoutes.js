// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    listOrders,
    historyOrders,
    getOrder,
    summary,
    updateStatus
} = require('../controllers/orderControllers');

router.get('/orders', listOrders);            // ?status=proses
router.get('/orders/history', historyOrders);
router.get('/orders/:id', getOrder);
router.get('/orders-summary', summary);
router.post('/orders/:id/status', updateStatus);

module.exports = router;
