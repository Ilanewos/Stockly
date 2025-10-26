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


// POST tambah bahan baru
exports.create = async (req, res) => {
    const { nama_bahan, stok } = req.body;

   try {
        // 1️⃣ Tambah bahan baru
        const [result] = await db.query(
            'INSERT INTO bahan (nama_bahan, stok) VALUES (?, ?)',
            [nama_bahan, stok]
        );

         // 2️⃣ Tambah entry di restock
        await db.query(
            'INSERT INTO restock (id_bahan, jumlah_tambah, tanggal) VALUES (?, ?, ?)',
            [id_bahan, stok, new Date()] // jumlah_tambah = stok awal, tanggal = sekarang
        );
        
        res.json({
            id_bahan,
            nama_bahan,
            stok,
            message: 'Bahan berhasil ditambahkan dan otomatis masuk ke restock'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
