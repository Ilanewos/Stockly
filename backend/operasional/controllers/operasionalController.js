// controllers/operasionalController.js
const db = require('../db');

/**
 * GET /operasional/orders?status=pending
 * default: semua
 */
exports.getOrders = async (req, res) => {
  const { status } = req.query;
  try {
    const conn = await db.getConnection();
    let sql = `SELECT t.*, m.nama_menu, m.harga
               FROM transaksi t
               JOIN menu m ON t.id_menu = m.id_menu`;
    const params = [];
    if (status) {
      sql += ` WHERE t.status_pesanan = ?`;
      params.push(status);
    }
    sql += ` ORDER BY t.waktu DESC`;
    const [rows] = await conn.execute(sql, params);
    conn.release();
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * POST /operasional/orders/:id/process
 * set status_pesanan = 'processing'
 */
exports.processOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await db.getConnection();
    const [r] = await conn.execute(`UPDATE transaksi SET status_pesanan = 'processing' WHERE id_transaksi = ?`, [id]);
    conn.release();
    if (r.affectedRows === 0) return res.status(404).json({ success:false, message: 'Order not found' });
    return res.json({ success: true, message: 'Order set to processing' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message: 'Server error', error: err.message });
  }
};

/**
 * POST /operasional/orders/:id/done
 * - ubah status_pesanan = 'done'
 * - kurangi stok bahan sesuai resep * total_jumlah
 * - gunakan transaction DB untuk konsistensi
 */
exports.finishOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    // ambil transaksi
    const [txRows] = await conn.execute(`SELECT * FROM transaksi WHERE id_transaksi = ? FOR UPDATE`, [id]);
    if (txRows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ success:false, message: 'Order not found' });
    }
    const tx = txRows[0];
    if (tx.status_pesanan === 'done') {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ success:false, message: 'Order already done' });
    }

    // dapatkan resep untuk menu
    const [resepRows] = await conn.execute(
      `SELECT r.id_bahan, r.jumlah_bahan, b.stok
       FROM resep r
       JOIN bahan b ON r.id_bahan = b.id_bahan
       WHERE r.id_menu = ? AND (r.deleted_at IS NULL)`,
      [tx.id_menu]
    );

    // cek ketersediaan (optional)
    for (const r of resepRows) {
      const needed = (r.jumlah_bahan || 0) * tx.total_jumlah;
      if (r.stok < needed) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({
          success:false,
          message: `Stok bahan id=${r.id_bahan} tidak cukup. Dibutuhkan ${needed}, tersedia ${r.stok}`
        });
      }
    }

    // kurangi stok
    for (const r of resepRows) {
      const needed = (r.jumlah_bahan || 0) * tx.total_jumlah;
      await conn.execute(`UPDATE bahan SET stok = stok - ? WHERE id_bahan = ?`, [needed, r.id_bahan]);
    }

    // update transaksi jadi done
    await conn.execute(`UPDATE transaksi SET status_pesanan = 'done' WHERE id_transaksi = ?`, [id]);

    await conn.commit();
    conn.release();
    return res.json({ success: true, message: 'Order finished, bahan dikurangi, status set to done' });
  } catch (err) {
    console.error(err);
    try { if (conn) { await conn.rollback(); conn.release(); } } catch(e){}
    return res.status(500).json({ success:false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /operasional/report?from=2025-10-01&to=2025-10-31
 * default: semua
 * hasil: total transaksi done, total pendapatan, list ringkas
 */
exports.getReport = async (req, res) => {
  const { from, to } = req.query;
  try {
    const conn = await db.getConnection();
    let where = `WHERE t.status_pesanan = 'done'`;
    const params = [];
    if (from) {
      where += ` AND DATE(t.waktu) >= ?`;
      params.push(from);
    }
    if (to) {
      where += ` AND DATE(t.waktu) <= ?`;
      params.push(to);
    }

    const [summaryRows] = await conn.execute(
      `SELECT COUNT(*) as total_transaksi, COALESCE(SUM(total_harga),0) as total_pendapatan
       FROM transaksi t
       ${where}`,
      params
    );

    const [listRows] = await conn.execute(
      `SELECT t.id_transaksi, t.id_menu, m.nama_menu, t.total_jumlah, t.total_harga, t.waktu
       FROM transaksi t
       JOIN menu m ON t.id_menu = m.id_menu
       ${where}
       ORDER BY t.waktu DESC
       LIMIT 100`,
      params
    );

    conn.release();
    return res.json({ success:true, summary: summaryRows[0], list: listRows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /operasional/stok-bahan
 * tampilkan kondisi stok bahan (nama, stok, satuan, status)
 */
exports.getStokBahan = async (req, res) => {
  try {
    const conn = await db.getConnection();
    const [rows] = await conn.execute(`
      SELECT 
        nama_bahan AS namaBahan,
        stok,
        satuan,
        status
      FROM bahan
      ORDER BY status DESC, nama_bahan ASC
    `);
    conn.release();
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data stok bahan', error: err.message });
  }
};