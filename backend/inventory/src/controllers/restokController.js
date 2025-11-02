const db = require('../db');

// POST tambah restok (update stok bahan + catat di tabel restok)
exports.createRestok = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id_bahan, jumlah_tambah } = req.body;

    // Validasi input
    if (!id_bahan || !jumlah_tambah) {
      return res.status(400).json({ error: 'id_bahan dan jumlah_tambah wajib diisi' });
    }

    const jumlahTambah = Number(jumlah_tambah);
    if (isNaN(jumlahTambah) || jumlahTambah <= 0) {
      return res.status(400).json({ error: 'jumlah_tambah harus berupa angka positif' });
    }

    await connection.beginTransaction();

    // 1. Ambil stok bahan saat ini
    const [bahanRows] = await connection.query('SELECT stok FROM bahan WHERE id_bahan = ?', [id_bahan]);
    if (bahanRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Bahan tidak ditemukan' });
    }

    const stokBaru = bahanRows[0].stok + jumlahTambah;

    // 2. Update stok bahan
    await connection.query('UPDATE bahan SET stok = ? WHERE id_bahan = ?', [stokBaru, id_bahan]);

    // 3. Cek apakah id_bahan sudah ada di tabel restok
    const [restokRows] = await connection.query(
      'SELECT * FROM restok WHERE id_bahan = ?',
      [id_bahan]
    );

    if (restokRows.length > 0) {
      // Sudah ada → update jumlah_tambah dan tanggal
      await connection.query(
        'UPDATE restok SET jumlah_tambah = ?, tanggal_restok = NOW() WHERE id_bahan = ?',
        [jumlahTambah, id_bahan]
      );
    } else {
      // Belum ada → insert baru
      await connection.query(
        'INSERT INTO restok (jumlah_tambah, id_bahan, tanggal_restok) VALUES (?, ?, NOW())',
        [jumlahTambah, id_bahan]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Restok berhasil ditambahkan', stok_baru: stokBaru });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// GET semua data restok (join dengan bahan)
exports.getAllRestok = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.id_restok, r.jumlah_tambah, r.tanggal_restok, 
        b.nama_bahan, b.satuan
      FROM restok r
      LEFT JOIN bahan b ON r.id_bahan = b.id_bahan
      ORDER BY r.tanggal_restok DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
