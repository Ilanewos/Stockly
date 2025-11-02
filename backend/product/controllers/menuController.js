import db from "../db.js";

export const getMenu = (req, res) => {
    db.query("SELECT * FROM menu WHERE deleted_at IS NULL", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

export const createMenu = (req, res) => {
  const { nama_menu, harga } = req.body;
  if (!nama_menu || !harga)
    return res.status(400).json({ error: "Nama menu dan harga wajib diisi" });

  db.query(
    "INSERT INTO menu (nama_menu, harga) VALUES (?, ?)",
    [nama_menu, harga],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Menu berhasil ditambahkan" });
    }
  );
};

export const updateMenu = (req, res) => {
  const { id } = req.params;
  const { nama_menu, harga } = req.body;

  db.query(
    "UPDATE menu SET nama_menu=?, harga=? WHERE id_menu=?",
    [nama_menu, harga, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Update berhasil" });
    }
  );
};

export const deleteMenu = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE menu SET deleted_at = NOW() WHERE id_menu = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Menu berhasil dihapus (soft delete)" });
    }
  );
};

