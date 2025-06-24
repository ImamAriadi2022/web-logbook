const express = require("express");
const {
  addLogbook,
  getAllLogbooks,
  getLogbookById,
  editLogbook,
  deleteLogbook,
  getLogbooksByUserId,
} = require("../models/loogBookModel");

// Controller untuk menambahkan logbook baru
const createLogbook = (req, res) => {
  const { user_id, watchroom, report } = req.body; // Gunakan user_id

  console.log("Data diterima:", { user_id, watchroom, report }); // Log data yang diterima

  if (!user_id || !watchroom || !report) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  addLogbook(user_id, watchroom, report, (err, results) => {
    if (err) {
      console.error("Error saat menambahkan logbook:", err); // Log error
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
    res.status(201).json({ message: "Logbook berhasil ditambahkan", logbookId: results.insertId });
  });
};

// Controller untuk mengambil semua logbook
const fetchAllLogbooks = (req, res) => {
  getAllLogbooks((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
    res.status(200).json({ logbooks: results });
  });
};

// Controller untuk mengambil logbook berdasarkan ID
const fetchLogbookById = (req, res) => {
  const { id } = req.params;

  getLogbookById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Logbook tidak ditemukan" });
    }

    res.status(200).json({ logbook: results[0] });
  });
};

// Controller untuk mengambil logbook berdasarkan user_id
const fetchLogbooksByUserId = (req, res) => {
  const { user_id } = req.params;

  getLogbooksByUserId(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Logbook tidak ditemukan untuk user ini" });
    }

    res.status(200).json({ logbooks: results });
  });
};

// Controller untuk mengedit logbook
const updateLogbook = (req, res) => {
  const { id } = req.params;
  const { watchroom, report } = req.body;

  if (!watchroom || !report) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  editLogbook(id, watchroom, report, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Logbook tidak ditemukan" });
    }

    res.status(200).json({ message: "Logbook berhasil diperbarui" });
  });
};

// Controller untuk menghapus logbook
const removeLogbook = (req, res) => {
  const { id } = req.params;

  deleteLogbook(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Logbook tidak ditemukan" });
    }

    res.status(200).json({ message: "Logbook berhasil dihapus" });
  });
};

module.exports = {
  createLogbook,
  fetchAllLogbooks,
  fetchLogbookById,
  fetchLogbooksByUserId,
  updateLogbook,
  removeLogbook,
};