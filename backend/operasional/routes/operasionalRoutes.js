// routes/operasionalRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/operasionalController');

// ambil semua pesanan pending / processing / done (opsional query status)
router.get('/orders', controller.getOrders);

// proses pesanan: ubah status ke 'processing'
router.post('/orders/:id/process', controller.processOrder);

// selesai pesanan: ubah status ke 'done', kurangi stok bahan berdasarkan resep
router.post('/orders/:id/done', controller.finishOrder);

// laporan penjualan (opsional filter tanggal: from,to -> YYYY-MM-DD)
router.get('/report', controller.getReport);

module.exports = router;
