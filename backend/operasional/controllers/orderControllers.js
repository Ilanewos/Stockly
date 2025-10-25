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
      SELECT p.id_pesanan, p.id_menu, m.nama_menu, p.total_bayar, p.status,
             dp.id_detail, dp.nomor_meja, dp.jumlah AS jumlah_detail, dp.subtotal,
             p.id_pesanan
      FROM pesanan p
      LEFT JOIN menu m ON m.id_menu = p.id_menu
      LEFT JOIN detail_pesanan dp ON dp.id_pesanan = p.id_pesanan
      ${where}
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


module.exports = { listOrders};
