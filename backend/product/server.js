import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes.js";
import resepRoutes from "./routes/resepRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Cek API berjalan
app.get("/", (req, res) => {
  res.send("✅ Restoran backend berjalan!");
});

// Routing utama
app.use("/menu", menuRoutes);
app.use("/resep", resepRoutes);

const PORT = 4000;
app.listen(PORT, () =>
  console.log("🚀 Server berjalan di http://localhost:" + PORT)
);
