import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Route untuk menambahkan pesanan baru
router.post("/", (req, res) => {
  console.log(req.body);
  const { id_menu, total_bayar, status, quantity } = req.body;

  if (!id_menu || !total_bayar || !status || !quantity) {
    return res.status(400).json({ message: "Missing data" });
  }

  // Ambil bahan dari resep dan cek stok
  const sqlResep = `
    SELECT r.id_bahan, r.jumlah_bahan, b.stok, b.nama_bahan
    FROM resep r
    JOIN bahan b ON r.id_bahan = b.id_bahan
    WHERE r.id_menu = ?
  `;
  db.query(sqlResep, [id_menu], (err, bahanList) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // Cek stok
    const stokKurang = bahanList.filter(b => b.stok < b.jumlah_bahan * quantity);
    if (stokKurang.length > 0) {
      const namaBahan = stokKurang.map(b => b.nama_bahan).join(", ");
      return res.status(400).json({ message: `Stok bahan untuk item ini habis: ${namaBahan}` });
    }

    // Kalau stok cukup, lanjut transaction
    db.beginTransaction(err => {
      if (err) return res.status(500).json({ message: "Transaction error", error: err });

      const sqlPesanan = "INSERT INTO pesanan (id_menu, total_bayar, status) VALUES (?, ?, ?)";
      db.query(sqlPesanan, [id_menu, total_bayar, status], (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ message: "Database error", error: err }));

        const id_pesanan = result.insertId;

        // Kurangi stok bahan
        let updateCount = 0;
        for (let bahan of bahanList) {
          const totalKurang = bahan.jumlah_bahan * quantity;
          db.query("UPDATE bahan SET stok = stok - ? WHERE id_bahan = ?", [totalKurang, bahan.id_bahan], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ message: "Update stok error", error: err }));

            updateCount++;
            if (updateCount === bahanList.length) {
              db.commit(err => {
                if (err) return db.rollback(() => res.status(500).json({ message: "Commit error", error: err }));
                res.json({ message: "Pesanan berhasil dibuat dan stok bahan terupdate", id_pesanan });
              });
            }
          });
        }

        if (bahanList.length === 0) {
          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json({ message: "Commit error", error: err }));
            res.json({ message: "Pesanan berhasil dibuat", id_pesanan });
          });
        }
      });
    });
  });
});

export default router;
