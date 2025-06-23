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