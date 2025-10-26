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

// POST tambah atau update restock
exports.createOrUpdate = async (req, res) => {
    const { id_bahan, jumlah_tambah, tanggal } = req.body;

    if (!id_bahan || !jumlah_tambah || !tanggal) {
        return res.status(400).json({ error: 'id_bahan, jumlah_tambah, dan tanggal wajib diisi' });
    }

    try {
        // 1️⃣ Update stok bahan
        await db.query('UPDATE bahan SET stok = stok + ? WHERE id_bahan=?', [jumlah_tambah, id_bahan]);

        // 2️⃣ Cek apakah restock untuk bahan ini sudah ada
        const [rows] = await db.query('SELECT * FROM restock WHERE id_bahan=?', [id_bahan]);

        if (rows.length === 0) {
            // Belum ada, buat baris baru
            await db.query('INSERT INTO restock (id_bahan, jumlah_tambah, tanggal) VALUES (?, ?, ?)', [id_bahan, jumlah_tambah, tanggal]);
        } else {
            // Sudah ada, **update jumlah_tambah dengan nilai input terakhir**, tidak kumulatif
            await db.query('UPDATE restock SET jumlah_tambah=?, tanggal=? WHERE id_bahan=?', [jumlah_tambah, tanggal, id_bahan]);
        }

        res.json({
            message: 'Restock berhasil ditambahkan atau diupdate',
            id_bahan,
            jumlah_tambah,
            tanggal
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// PUT update restock manual (jumlah_tambah langsung diubah)
exports.update = async (req, res) => {
    const { id_restock } = req.params;
    const { jumlah_tambah, tanggal } = req.body;

    if (!jumlah_tambah || !tanggal) {
        return res.status(400).json({ error: 'jumlah_tambah dan tanggal wajib diisi' });
    }

    try {
        // Ambil data lama
        const [rows] = await db.query('SELECT id_bahan, jumlah_tambah FROM restock WHERE id_restock=?', [id_restock]);
        if (rows.length === 0) return res.status(404).json({ error: 'Restock tidak ditemukan' });

    //     const { id_bahan, jumlah_tambah: jumlah_lama } = rows[0];

    //     // Koreksi stok bahan sesuai selisih
    //     const selisih = jumlah_tambah - jumlah_lama;
    //     await db.query('UPDATE bahan SET stok = stok + ? WHERE id_bahan=?', [selisih, id_bahan]);

    //     // Update restock
    //     await db.query('UPDATE restock SET jumlah_tambah=?, tanggal=? WHERE id_restock=?', [jumlah_tambah, tanggal, id_restock]);

    //     res.json({ message: 'Restock berhasil diupdate' });

    } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ error: err.message });
    // }
};

// // DELETE restock
// exports.delete = async (req, res) => {
//     const { id_restock } = req.params;

//     try {
//         const [rows] = await db.query('SELECT id_bahan, jumlah_tambah FROM restock WHERE id_restock=?', [id_restock]);
//         if (rows.length === 0) return res.status(404).json({ error: 'Restock tidak ditemukan' });

//         const { id_bahan, jumlah_tambah } = rows[0];

//         // Kurangi stok di bahan
//         await db.query('UPDATE bahan SET stok = stok - ? WHERE id_bahan=?', [jumlah_tambah, id_bahan]);

//         // Hapus restock
//         await db.query('DELETE FROM restock WHERE id_restock=?', [id_restock]);

//         res.json({ message: 'Restock berhasil dihapus' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// };
