const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Tambahkan ini
const userRoutes = require("./routes/userRoutes");
const db = require("./config/dbConfig");

// Konfigurasi dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Tambahkan middleware CORS
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

// Endpoint untuk mengecek status server dan database
app.get("/", (req, res) => {
  res.send(`
    <h1>Server Berjalan</h1>
    <p>Gunakan endpoint berikut untuk menguji:</p>
    <ul>
        <li><strong>GET</strong> <code>/</code>: Mengecek status server</li>
        <li><strong>POST</strong> <code>/api/users/register</code>: Mendaftarkan pengguna baru</li>
        <li><strong>GET</strong> <code>/api/users</code>: Mendapatkan daftar pengguna</li>
        <li><strong>POST</strong> <code>/api/users/login</code>: Login pengguna</li>
        <li><strong>POST</strong> <code>/api/users/logout</code>: Logout pengguna</li>
        <li><strong>POST</strong> <code>/api/users/add-admin</code>: Menambahkan admin (hanya untuk admin)</li>
        <li><strong>GET</strong> <code>/api/users/admin</code>: Menampilkan halaman tambah admin</li>
        <li><strong>GET</strong> <code>/api/users/users</code>: Mengambil semua pengguna</li>
        <li><strong>PUT</strong> <code>/api/users/users/:id</code>: Mengedit pengguna (hanya untuk admin)</li>
    </ul>
    <p>Status Database: <span style="color: green;">Terhubung</span></p>
  `);
});

// Endpoint untuk mendapatkan daftar pengguna
app.get("/api/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
    res.status(200).json({ users: results });
  });
});

// Endpoint untuk mendaftarkan pengguna baru
app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
    res.status(201).json({
      message: "Pendaftaran berhasil",
      user: { id: results.insertId, name, email },
    });
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});