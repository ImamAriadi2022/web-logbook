const mysql = require("mysql2");
require("dotenv").config(); // Tambahkan ini untuk membaca file .env

console.log("Konfigurasi Koneksi:");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Password:", process.env.DB_PASSWORD === "" ? "(kosong)" : "***");
console.log("Database:", process.env.DB_NAME);
console.log("Port:", process.env.DB_PORT || 3306);

// Gunakan createPool untuk koneksi yang lebih stabil
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
});

// Test koneksi database
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Gagal terhubung ke database:", err.message);
    console.error("Error code:", err.code);
    console.error("Error errno:", err.errno);
  } else {
    console.log("✅ Database terhubung dengan sukses!");
    connection.release(); // Release connection back to pool
  }
});

module.exports = db;