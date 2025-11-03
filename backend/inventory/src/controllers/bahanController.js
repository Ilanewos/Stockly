const db = require('../db');

// ✅ GET semua bahan (hanya yang belum dihapus)
exports.getAllBahan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bahan WHERE deleted_at IS NULL');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET bahan berdasarkan id (hanya jika belum dihapus)
exports.getBahanById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bahan WHERE id_bahan = ? AND deleted_at IS NULL', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Bahan tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Fungsi bantu untuk menentukan status otomatis
function hitungStatus(stok, minim_stok) {
  if (stok <= 0) return "habis";
  if (stok <= minim_stok) return "menipis";
  return "normal";
}

// ✅ POST tambah bahan baru
exports.createBahan = async (req, res) => {
  try {
    const { nama_bahan, stok, satuan, harga, minim_stok } = req.body;
    const status = hitungStatus(stok || 0, minim_stok || 0);

    const [result] = await db.query(
      'INSERT INTO bahan (nama_bahan, stok, satuan, harga, status, minim_stok) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_bahan, stok || 0, satuan, harga || 0, status, minim_stok || 0]
    );
    res.status(201).json({ message: 'Bahan berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT update bahan (otomatis update status)
exports.updateBahan = async (req, res) => {
  try {
    const { nama_bahan, stok, satuan, harga, minim_stok } = req.body;
    const status = hitungStatus(stok, minim_stok);

    const [result] = await db.query(
      `UPDATE bahan 
       SET nama_bahan = ?, stok = ?, satuan = ?, harga = ?, status = ?, minim_stok = ?
       WHERE id_bahan = ? AND deleted_at IS NULL`,
      [nama_bahan, stok, satuan, harga, status, minim_stok, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Bahan tidak ditemukan atau sudah dihapus' });

    res.json({ message: 'Bahan berhasil diupdate', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE bahan (soft delete)
exports.deleteBahan = async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE bahan SET deleted_at = NOW() WHERE id_bahan = ? AND deleted_at IS NULL',
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Bahan tidak ditemukan atau sudah dihapus' });
    res.json({ message: 'Bahan berhasil dihapus (soft delete)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
