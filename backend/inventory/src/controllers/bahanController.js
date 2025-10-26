const db = require('../db');

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bahan');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
