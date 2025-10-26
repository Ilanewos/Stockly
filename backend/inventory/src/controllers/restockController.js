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

// GET per ID restock
exports.getById = async (req, res) => {
    const { id_restock } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT r.id_restock, r.id_bahan, b.nama_bahan, r.jumlah_tambah, r.tanggal
            FROM restock r
            JOIN bahan b ON r.id_bahan = b.id_bahan
            WHERE r.id_restock=?
        `, [id_restock]);

        if (rows.length === 0) return res.status(404).json({ error: 'Restock tidak ditemukan' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};