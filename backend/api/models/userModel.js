const db = require("../config/dbConfig");

// Fungsi untuk membuat pengguna baru
const createUser = (name, email, password, callback) => {
  const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')"; // Tambahkan kolom role dengan default 'user'
  db.query(query, [name, email, password], callback);
};

// Fungsi untuk mencari pengguna berdasarkan email
const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

// Fungsi untuk mendapatkan pengguna berdasarkan email dan password
const findUserByEmailAndPassword = (email, password, callback) => {
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], callback);
};

module.exports = { createUser, findUserByEmail, findUserByEmailAndPassword };