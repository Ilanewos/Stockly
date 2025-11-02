const db = require('../db');

// GET semua bahan
exports.getAllBahan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bahan');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET bahan berdasarkan id
exports.getBahanById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bahan WHERE id_bahan = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Bahan tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST tambah bahan baru
exports.createBahan = async (req, res) => {
  try {
    const { nama_bahan, stok, satuan, harga, minim_stok } = req.body;
    const [result] = await db.query(
      'INSERT INTO bahan (nama_bahan, stok, satuan, harga, minim_stok) VALUES (?, ?, ?, ?, ?)',
      [nama_bahan, stok || 0, satuan, harga || 0, minim_stok || 0]
    );
    res.status(201).json({ message: 'Bahan berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update bahan
exports.updateBahan = async (req, res) => {
  try {
    const { nama_bahan, stok, satuan, harga, status, minim_stok } = req.body;
    const [result] = await db.query(
      `UPDATE bahan 
       SET nama_bahan = ?, stok = ?, satuan = ?, harga = ?, status = ?, minim_stok = ?
       WHERE id_bahan = ?`,
      [nama_bahan, stok, satuan, harga, status, minim_stok, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Bahan tidak ditemukan' });
    res.json({ message: 'Bahan berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE bahan
exports.deleteBahan = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM bahan WHERE id_bahan = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Bahan tidak ditemukan' });
    res.json({ message: 'Bahan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
