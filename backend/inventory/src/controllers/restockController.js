const db = require('../db');

// GET semua restock
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.id_restock, r.id_bahan, b.nama_bahan, r.jumlah_tambah, r.tanggal
            FROM restock r
            JOIN bahan b ON r.id_bahan = b.id_bahan
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};