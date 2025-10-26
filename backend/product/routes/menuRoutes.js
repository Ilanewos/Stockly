import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /menu -> menu + resep + bahan lengkap
router.get("/", (req, res) => {
  const sqlMenu = "SELECT * FROM menu";
  db.query(sqlMenu, (err, menuList) => {
    if (err) return res.status(500).json({ message: "Query error", error: err });

    if (menuList.length === 0) return res.json([]);

    const menuWithResep = [];
    let processed = 0;

    menuList.forEach((menuItem) => {
      const sqlResep = `
        SELECT r.id_resep, r.id_menu, r.id_bahan, r.jumlah_bahan, b.nama_bahan, b.stok
        FROM resep r
        JOIN bahan b ON r.id_bahan = b.id_bahan
        WHERE r.id_menu = ?
      `;
      db.query(sqlResep, [menuItem.id_menu], (err, resepList) => {
        if (err) return res.status(500).json({ message: "Query error", error: err });

        menuWithResep.push({
          ...menuItem,
          resep: resepList.map(r => ({
            id_resep: r.id_resep,
            id_bahan: r.id_bahan,
            jumlah_bahan: r.jumlah_bahan,
            nama_bahan: r.nama_bahan,
            stok: r.stok
          }))
        });

        processed++;
        if (processed === menuList.length) {
          res.json(menuWithResep);
        }
      });
    });
  });
});

export default router;
