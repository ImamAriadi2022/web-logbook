const mysql = require("mysql2");
require("dotenv").config(); // Tambahkan ini untuk membaca file .env

console.log("Konfigurasi Koneksi:");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Password:", process.env.DB_PASSWORD === "" ? "(kosong)" : process.env.DB_PASSWORD);
console.log("Database:", process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;