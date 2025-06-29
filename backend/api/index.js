const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const logBookRoutes = require("./routes/logBookRoutes");
const db = require("./config/dbConfig");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Flag status koneksi database
let isDbConnected = false;

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error("❌ Gagal terhubung ke database:", err.message);
  } else {
    console.log("✅ Terhubung ke database");
    isDbConnected = true;
  }
});

// Endpoint root (cek koneksi dan dokumentasi)
app.get("/", (req, res) => {
  const dbStatus = isDbConnected ? "Terhubung" : "Tidak Terhubung";

  res.send(`
    <html>
      <head>
        <title>Status Server</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          code { background: #f4f4f4; padding: 2px 4px; }
          .status-green { color: green; }
          .status-red { color: red; }
        </style>
      </head>
      <body>
        <h1>Server Berjalan</h1>
        <p>Gunakan endpoint berikut untuk menguji:</p>
        <h2>🧑‍💻 Endpoint Pengguna</h2>
        <ul>
          <li><strong>POST</strong> <code>/api/users/register</code></li>
          <li><strong>POST</strong> <code>/api/users/login</code></li>
          <li><strong>POST</strong> <code>/api/users/logout</code></li>
          <li><strong>GET</strong> <code>/api/users/users</code></li>
          <li><strong>POST</strong> <code>/api/users/add-admin</code></li>
          <li><strong>GET</strong> <code>/api/users/admin</code></li>
          <li><strong>GET</strong> <code>/api/users/users/:id</code></li>
          <li><strong>PUT</strong> <code>/api/users/users/:id</code></li>
          <li><strong>DELETE</strong> <code>/api/users/users/:id</code></li>
        </ul>

        <h2>📓 Endpoint Logbook</h2>
        <ul>
          <li><strong>POST</strong> <code>/api/logbooks/add</code></li>
          <li><strong>GET</strong> <code>/api/logbooks</code></li>
          <li><strong>GET</strong> <code>/api/logbooks/:id</code></li>
          <li><strong>GET</strong> <code>/api/logbooks/user/:userId</code></li>
          <li><strong>PUT</strong> <code>/api/logbooks/:id</code></li>
          <li><strong>DELETE</strong> <code>/api/logbooks/:id</code></li>
        </ul>

        <h2>Status Server</h2>
        <p>Status Server: <span class="${dbStatus === 'Terhubung' ? 'status-green' : 'status-red'}">Berjalan</span></p>
        <p>Status Database: <span class="${dbStatus === 'Terhubung' ? 'status-green' : 'status-red'}">${dbStatus}</span></p>
      </body>
    </html>
  `);
});

// Routing
app.use("/api/users", userRoutes);
app.use("/api/logbooks", logBookRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
