const bcrypt = require("bcryptjs");
const db = require("../config/dbConfig"); // Tambahkan ini untuk mengimpor konfigurasi database
const { createUser, findUserByEmail } = require("../models/userModel");

// Fungsi untuk registrasi pengguna
const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Cek apakah email sudah terdaftar
  findUserByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
      }

      // Simpan pengguna baru
      createUser(name, email, hashedPassword, (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
        }

        res.status(201).json({
          message: "Pendaftaran berhasil",
          user: { id: results.insertId, name, email },
        });
      });
    });
  });
};

// Fungsi untuk login pengguna
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  // Cari pengguna berdasarkan email
  findUserByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const user = results[0];
    const user_id = user.id; // Simpan user.id ke dalam variabel user_id

    // Verifikasi password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Password salah" });
      }

      res.status(200).json({
        message: "Login berhasil",
        user: { id: user_id, name: user.name, email: user.email, role: user.role },
      });
    });
  });
};

// Fungsi untuk logout pengguna
const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logout berhasil" });
};

// Fungsi untuk menambahkan admin
const addAdmin = (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    // Simpan admin baru
    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')";
    db.query(query, [name, email, hashedPassword], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
      }

      res.status(201).json({
        message: "Admin berhasil ditambahkan",
        user: { id: results.insertId, name, email, role: "admin" },
      });
    });
  });
};


const getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, role FROM users"; // Ambil hanya id, name, email, dan role
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
    res.status(200).json({ users: results });
  });
};

const editUser = (req, res) => {
  const { id } = req.params; // Ambil ID dari parameter URL
  const { name, email, role } = req.body; // Ambil data yang akan diubah

  // Validasi input
  if (!name || !email || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const query = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
  db.query(query, [name, email, role, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengguna berhasil diperbarui" });
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;

  db.query("SELECT id, name, email FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    res.json({ user: results[0] });
  });
};

const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, password } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama tidak boleh kosong." });
  }

  const updateQuery = password
    ? "UPDATE users SET name = ?, password = ? WHERE id = ?"
    : "UPDATE users SET name = ? WHERE id = ?";

  const params = password ? [name, password, userId] : [name, userId];

  db.query(updateQuery, params, (err) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
    res.json({ message: "Profil berhasil diperbarui." });
  });
};

module.exports = { getUserById, updateUser, registerUser, loginUser, logoutUser, addAdmin, getAllUsers, editUser };