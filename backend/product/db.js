import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restoran"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database error:", err);
  } else {
    console.log("✅ Database connected!");
  }
});

export default db;
