// controllers/orderController.js
const pool = require('../db');

const VALID_INPUT_STATUSES = ['pending', 'proses', 'processing', 'done', 'cancel'];

/**
 * Helper: normalize status input from UI -> DB enum
 * accept 'proses' -> 'processing'
 */
function normalizeStatus(s) {
  if (!s) return null;
  s = s.toString().toLowerCase();
  if (s === 'proses') return 'processing';
  return s;
}

/**
 * GET /api/orders
 * ?status=pending|proses|processing|done
 * pagination ?limit & ?page
 * returns joined order info (pesanan + menu + optionally detail_pesanan)
 */
// debug: listOrders dengan logging SQL & params dan error stack full
async function listOrders(req, res) {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limitNum;

    let where = '';
    const params = [];

    if (status) {
      const norm = normalizeStatus(status);
      if (!VALID_INPUT_STATUSES.includes(status) && !['processing'].includes(norm)) {
        return res.status(400).json({ error: `Status tidak valid` });
      }
      where = 'WHERE p.status = ?';
      params.push(norm);
    }

    const sql = `
      SELECT p.id_pesanan, p.meja, p.total_bayar, p.status,
       i.id_menu, m.nama_menu, i.quantity, i.subtotal
FROM pesanan p
LEFT JOIN item_pesanan i ON i.id_pesanan = p.id_pesanan
LEFT JOIN menu m ON m.id_menu = i.id_menu
ORDER BY p.id_pesanan DESC
LIMIT ? OFFSET ?
    `;

    // tambahkan params limit & offset
    params.push(limitNum, offset);

    // LOGGING: tampilkan SQL dan params ke terminal sebelum eksekusi
    console.log('DEBUG listOrders -> SQL:', sql.replace(/\s+/g, ' ').trim());
    console.log('DEBUG listOrders -> params:', params);

    const [rows] = await pool.execute(sql, params);
    return res.json({ data: rows, meta: { page: Number(page), limit: limitNum } });
  } catch (err) {
    // LOGGING lebih lengkap
    console.error('listOrders error:', err);
    // kirimkan detail error untuk development (jangan di production)
    return res.status(500).json({ error: 'Gagal mengambil orders', details: err.message || err });
  }
}

/**
 * GET /api/orders/history
 * returns pesanan dengan status = 'done'
 */
async function historyOrders(req, res) {
  try {
    const { limit = 20, page = 1 } = req.query;
    const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limitNum;

    // Ambil semua order dengan status 'done'
   const [ordersRows] = await pool.execute(
  `SELECT p.id_pesanan, p.meja, p.total_bayar, p.status,
          sp.tanggal_riwayat
   FROM pesanan p
   LEFT JOIN status_pesanan sp 
     ON sp.id_pesanan = p.id_pesanan AND sp.status = 'done'
   WHERE p.status = 'done'
   ORDER BY sp.tanggal_riwayat DESC
   LIMIT ? OFFSET ?`,
  [limitNum, offset]
);

    const orderIds = ordersRows.map(o => o.id_pesanan);
    if (orderIds.length === 0) {
      return res.json({ data: [], meta: { page: Number(page), limit: limitNum } });
    }

    // Ambil semua item pesanan terkait
    const [itemsRows] = await pool.execute(
      `SELECT i.id_pesanan, i.id_menu, m.nama_menu, i.quantity, i.subtotal
       FROM item_pesanan i
       JOIN menu m ON m.id_menu = i.id_menu
       WHERE i.id_pesanan IN (${orderIds.map(() => '?').join(',')})
       ORDER BY i.id_pesanan ASC`,
      orderIds
    );

    // Gabungkan items ke masing-masing order
    const data = ordersRows.map(o => ({
      id_pesanan: o.id_pesanan,
      meja: o.meja,
      total_bayar: o.total_bayar,
      status: o.status,
      tanggal_riwayat: o.tanggal_riwayat,
      items: itemsRows.filter(i => i.id_pesanan === o.id_pesanan)
    }));

    return res.json({ data, meta: { page: Number(page), limit: limitNum } });
  } catch (err) {
    console.error('historyOrders error', err);
    return res.status(500).json({ error: 'Gagal mengambil riwayat pesanan', details: err.message });
  }
}

/**
 * GET /api/orders/:id
 * detail order + all detail_pesanan rows + menu + bahan via resep (optional)
 */
async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const [orders] = await pool.execute(
      `SELECT p.*, m.nama_menu FROM pesanan p LEFT JOIN menu m ON m.id_menu = p.id_menu WHERE p.id_pesanan = ? LIMIT 1`,
      [id]
    );
    if (orders.length === 0) return res.status(404).json({ error: 'Order tidak ditemukan' });
    const order = orders[0];

    const [details] = await pool.execute(
      `SELECT * FROM detail_pesanan WHERE id_pesanan = ?`,
      [id]
    );

    // Ambil resep untuk tiap menu di detail (gabungkan bahan)
    const bahanPerDetail = [];
    for (const d of details) {
      const [resepRows] = await pool.execute(
        `SELECT r.id_bahan, b.nama_bahan, r.jumlah_bahan
         FROM resep r JOIN bahan b ON b.id_bahan = r.id_bahan
         WHERE r.id_menu = ?`,
        [d.id_menu]
      );
      bahanPerDetail.push({ detail: d, resep: resepRows });
    }

    return res.json({ order, details, bahanPerDetail });
  } catch (err) {
    console.error('getOrder error', err);
    return res.status(500).json({ error: 'Gagal mengambil order' });
  }
}

/**
 * GET /api/orders-summary
 * counts per status
 */
async function summary(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) as count FROM pesanan GROUP BY status`
    );
    const out = { pending: 0, processing: 0, done: 0, cancel: 0 };
    rows.forEach(r => { out[r.status] = Number(r.count); });
    // juga beri alias 'proses' untuk UI yang butuh kata 'proses'
    out.proses = out.processing;
    return res.json(out);
  } catch (err) {
    console.error('summary error', err);
    return res.status(500).json({ error: 'Gagal mengambil ringkasan status' });
  }
}

/**
 * POST /api/orders/:id/status
 * body: { status: 'pending'|'proses'|'processing'|'done'|'cancel' }
 *
 * Transactional:
 * - ambil pesanan FOR UPDATE
 * - ambil semua detail_pesanan untuk pesanan
 * - hitung kebutuhan total untuk setiap bahan berdasarkan resep
 * - jika status baru === 'done' && old != 'done' => cek stok semua bahan cukup, kurangi
 * - jika old === 'done' && status baru != 'done' => kembalikan stok (revert)
 * - simpan record ke status_pesanan (riwayat)
 */
async function updateStatus(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status wajib' });
  const newStatus = normalizeStatus(status);
  if (!['pending', 'processing', 'done', 'cancel'].includes(newStatus)) {
    return res.status(400).json({ error: 'status tidak valid' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // ambil pesanan FOR UPDATE
    const [pesRows] = await conn.execute('SELECT * FROM pesanan WHERE id_pesanan = ? FOR UPDATE', [id]);
    if (pesRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }
    const pes = pesRows[0];
    const oldStatus = pes.status;

    if (oldStatus === newStatus) {
      await conn.rollback();
      return res.status(200).json({ message: 'Status tidak berubah', order: pes });
    }

    // ambil detail pesanan
    const [details] = await conn.execute('SELECT * FROM detail_pesanan WHERE id_pesanan = ?', [id]);

    // kumpulkan kebutuhan bahan: { id_bahan: totalNeeded }
    const needed = {}; // angka integer
    for (const d of details) {
      // ambil resep untuk menu d.id_menu
      const [resepRows] = await conn.execute('SELECT id_bahan, jumlah_bahan FROM resep WHERE id_menu = ?', [d.id_menu]);
      for (const r of resepRows) {
        const total = r.jumlah_bahan * d.jumlah; // resep per 1 menu × jumlah pesanan
        needed[r.id_bahan] = (needed[r.id_bahan] || 0) + total;
      }
    }

    // Jika newStatus === done dan oldStatus !== done -> cek stok & kurangi
    if (newStatus === 'done' && oldStatus !== 'done') {
      // cek ketersediaan stok semua bahan
      for (const bahanIdStr of Object.keys(needed)) {
        const idB = Number(bahanIdStr);
        const [brows] = await conn.execute('SELECT stok FROM bahan WHERE id_bahan = ? FOR UPDATE', [idB]);
        if (brows.length === 0) {
          await conn.rollback();
          return res.status(404).json({ error: `Bahan id ${idB} tidak ditemukan` });
        }
        const stok = Number(brows[0].stok);
        if (stok < needed[idB]) {
          await conn.rollback();
          return res.status(400).json({ error: `Stok bahan tidak cukup (id_bahan=${idB})`, detail: { need: needed[idB], stock: stok } });
        }
      }

      // kurangi stok semua bahan
      for (const bahanIdStr of Object.keys(needed)) {
        const idB = Number(bahanIdStr);
        const qty = needed[idB];
        await conn.execute('UPDATE bahan SET stok = stok - ? WHERE id_bahan = ?', [qty, idB]);
      }
    }

    // Jika oldStatus === done dan newStatus != done -> kembalikan stok (revert)
    if (oldStatus === 'done' && newStatus !== 'done') {
      for (const bahanIdStr of Object.keys(needed)) {
        const idB = Number(bahanIdStr);
        const qty = needed[idB];
        await conn.execute('UPDATE bahan SET stok = stok + ? WHERE id_bahan = ?', [qty, idB]);
      }
    }

    // update status di pesanan
    await conn.execute('UPDATE pesanan SET status = ? WHERE id_pesanan = ?', [newStatus, id]);

    // insert ke status_pesanan sebagai riwayat
    const totalBayar = pes.total_bayar || 0;
    await conn.execute(
      `INSERT INTO status_pesanan (id_pesanan, id_detail_pesanan, total_bayar, status) VALUES (?, NULL, ?, ?)`,
      [id, totalBayar, newStatus]
    );

    await conn.commit();

    // ambil order terbaru untuk response
    const [updated] = await pool.execute('SELECT * FROM pesanan WHERE id_pesanan = ?', [id]);
    return res.json({ message: `Status diubah dari ${oldStatus} menjadi ${newStatus}`, order: updated[0] });

  } catch (err) {
    await conn.rollback();
    console.error('updateStatus error', err);
    return res.status(500).json({ error: 'Gagal update status', details: err.message });
  } finally {
    conn.release();
  }
}

module.exports = { listOrders, historyOrders, getOrder, summary, updateStatus };