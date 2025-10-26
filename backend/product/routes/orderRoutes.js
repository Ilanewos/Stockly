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
  const { meja, items } = req.body;
  if (!meja || !items || items.length === 0) {
    return res.status(400).json({ message: "Data pesanan tidak lengkap" });
  }

  const total_bayar = items.reduce((sum, i) => sum + i.harga * i.quantity, 0);

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: "Transaction error" });

    db.query(
      "INSERT INTO pesanan (meja, total_bayar, status) VALUES (?, ?, 'pending')",
      [meja, total_bayar],
      (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ message: err }));

        const id_pesanan = result.insertId;
        let processed = 0;

        items.forEach(item => {
          const sqlBahan = `
            SELECT r.id_bahan, r.jumlah_bahan, b.stok, b.nama_bahan
            FROM resep r
            JOIN bahan b ON r.id_bahan = b.id_bahan
            WHERE r.id_menu = ?
          `;
          db.query(sqlBahan, [item.id_menu], (err, bahanList) => {
            if (err) return db.rollback(() => res.status(500).json({ message: err }));

            // cek stok bahan
            const kurang = bahanList.filter(b => b.stok < b.jumlah_bahan * item.quantity);
            if (kurang.length > 0) {
              const namaBahan = kurang.map(b => b.nama_bahan).join(", ");
              return db.rollback(() => res.status(400).json({ message: `Stok bahan habis: ${namaBahan}` }));
            }

            // insert item pesanan
            const subtotal = item.harga * item.quantity;
            db.query(
              "INSERT INTO item_pesanan (id_pesanan, id_menu, quantity, subtotal) VALUES (?, ?, ?, ?)",
              [id_pesanan, item.id_menu, item.quantity, subtotal],
              (err) => {
                if (err) return db.rollback(() => res.status(500).json({ message: err }));

                // update stok bahan
                let updated = 0;
                if (bahanList.length === 0) {
                  checkDone();
                  return;
                }

                bahanList.forEach(b => {
                  db.query(
                    "UPDATE bahan SET stok = stok - ? WHERE id_bahan = ?",
                    [b.jumlah_bahan * item.quantity, b.id_bahan],
                    (err) => {
                      if (err) return db.rollback(() => res.status(500).json({ message: err }));
                      updated++;
                      if (updated === bahanList.length) checkDone();
                    }
                  );
                });

                function checkDone() {
                  processed++;
                  if (processed === items.length) {
                    db.commit(err => {
                      if (err) return db.rollback(() => res.status(500).json({ message: err }));
                      res.json({ message: "Pesanan berhasil dibuat", id_pesanan });
                    });
                  }
                }
              }
            );
          });
        });
      }
    );
  });
});

export default router;
