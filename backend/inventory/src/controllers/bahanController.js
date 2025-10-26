const db = require('../db');

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bahan');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    const { id_bahan } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM bahan WHERE id_bahan=?', [id_bahan]);
        if (rows.length === 0) return res.status(404).json({ error: 'Bahan tidak ditemukan' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
