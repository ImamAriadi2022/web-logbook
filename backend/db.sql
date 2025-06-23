CREATE DATABASE db_loogbook;

USE db_loogbook;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user', -- Tambahkan kolom role
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE logbooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, -- ID pengguna yang memiliki logbook
  hari VARCHAR(50) NOT NULL,
  tanggal DATE NOT NULL,
  jam TIME NOT NULL,
  petugas JSON NOT NULL,
  koja VARCHAR(50) NOT NULL,
  regu VARCHAR(50) NOT NULL,
  flights JSON NOT NULL,
  hariKejadian VARCHAR(50) NOT NULL,
  tanggalKejadian DATE NOT NULL,
  waktuKejadian TIME NOT NULL,
  cuaca VARCHAR(50) NOT NULL,
  kejadian TEXT NOT NULL,
  noPnb VARCHAR(50),
  tipePesawat VARCHAR(50),
  fasePenerbangan VARCHAR(50),
  kerusakanPesawat TEXT,
  jenisFasilitas VARCHAR(50),
  kerusakanFasilitas TEXT,
  rincianKejadian TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relasi dengan tabel users
);