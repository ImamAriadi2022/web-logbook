const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const db = require("./config/dbConfig");

// Konfigurasi dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/api/users", userRoutes);

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error("Database gagal terhubung:", err.message);
    process.exit(1);
  }
  console.log("Database berhasil terhubung");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});