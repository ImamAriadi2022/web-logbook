-- Membuat database
CREATE DATABASE IF NOT EXISTS db_loogbook;

-- Menggunakan database
USE db_loogbook;

-- Tabel users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user', -- Kolom role untuk peran pengguna
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logbooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, -- ID pengguna yang memiliki logbook
  hari VARCHAR(50) NOT NULL,
  tanggal DATE NOT NULL,
  jam TIME NOT NULL,
  petugas JSON NOT NULL, -- Data petugas dalam format JSON
  koja VARCHAR(50) NOT NULL,
  regu VARCHAR(50) NOT NULL,
  flights JSON NOT NULL, -- Data pergerakan pesawat dalam format JSON
  hariKejadian VARCHAR(50) NOT NULL,
  tanggalKejadian DATE NOT NULL,
  waktuKejadian TIME NOT NULL,
  cuaca VARCHAR(50) NOT NULL,
  kejadian TEXT NOT NULL,
  noPnb VARCHAR(50), -- Nomor PNB
  tipePesawat VARCHAR(50), -- Tipe pesawat
  fasePenerbangan VARCHAR(50), -- Fase penerbangan
  kerusakanPesawat TEXT, -- Kerusakan pesawat
  jenisFasilitas VARCHAR(50), -- Jenis fasilitas yang terdampak
  kerusakanFasilitas TEXT, -- Kerusakan fasilitas
  rincianKejadian TEXT, -- Rincian kejadian
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relasi dengan tabel users
);

-- Tabel flights (opsional jika ingin menyimpan data pergerakan pesawat secara terpisah)
CREATE TABLE IF NOT EXISTS flights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  logbook_id INT NOT NULL, -- Relasi dengan tabel logbooks
  time DATETIME NOT NULL, -- Waktu pergerakan pesawat
  operator VARCHAR(50) NOT NULL, -- Operator pesawat
  aircraftType VARCHAR(50), -- Tipe pesawat
  flightNumber VARCHAR(50), -- Nomor penerbangan
  depArrFrom VARCHAR(50), -- Asal atau tujuan penerbangan
  toPenerbangan VARCHAR(50), -- Tujuan penerbangan
  rwUse VARCHAR(50), -- Runway yang digunakan
  remarks TEXT, -- Catatan tambahan
  FOREIGN KEY (logbook_id) REFERENCES logbooks(id) ON DELETE CASCADE
);