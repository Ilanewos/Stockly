import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM menu";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Query error", error: err });
    }
    res.status(200).json(results);
  });
});

export default router;
