import db from "../db.js";

export const getResep = (req, res) => {
  db.query(
    `SELECT r.id_resep, r.id_menu, m.nama_menu, r.id_bahan, b.nama_bahan, r.jumlah_bahan
     FROM resep r
     JOIN menu m ON r.id_menu = m.id_menu
     JOIN bahan b ON r.id_bahan = b.id_bahan
     WHERE r.deleted_at IS NULL`,
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB Error" });
      res.json(result);
    }
  );
};

export const createResep = (req, res) => {
  const { id_menu, id_bahan, jumlah_bahan } = req.body;
  db.query(
    "INSERT INTO resep (id_menu, id_bahan, jumlah_bahan) VALUES (?, ?, ?)",
    [id_menu, id_bahan, jumlah_bahan],
    (err) => {
      if (err) return res.status(500).json({ error: "Gagal tambah resep" });
      res.json({ message: "Resep berhasil ditambahkan" });
    }
  );
};

export const updateResep = (req, res) => {
  const { id } = req.params;
  const { id_menu, id_bahan, jumlah_bahan } = req.body;

  db.query(
    `UPDATE resep 
     SET id_menu=?, id_bahan=?, jumlah_bahan=? 
     WHERE id_resep=?`,
    [id_menu, id_bahan, jumlah_bahan, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Gagal update resep" });
      res.json({ message: "Update resep berhasil" });
    }
  );
};

export const softDeleteResep = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE resep SET deleted_at = NOW() WHERE id_resep=?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: "Gagal hapus resep" });
      res.json({ message: "Resep dihapus (soft delete)" });
    }
  );
};
