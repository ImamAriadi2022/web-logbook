const express = require("express");
const {
  addLogbook,
  getAllLogbooks,
  getLogbookById,
  editLogbook,
  deleteLogbook,
  getLogbooksByUserId,
  addFlights,
  getFlightsByLogbookId,
} = require("../models/loogBookModel");

// Controller untuk menambahkan logbook baru
const createLogbook = (req, res) => {
  const { user_id, watchroom, report } = req.body;

  console.log("Data diterima:", { user_id, watchroom, report }); // Log data yang diterima

  if (!user_id || !watchroom || !report) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Format data sebelum disimpan
  const formattedWatchroom = {
    ...watchroom,
    tanggal: new Date(watchroom.tanggal).toISOString().split("T")[0], // Format DATE
    jam: watchroom.jam || "00:00:00", // Default jika kosong
    petugas: JSON.stringify(watchroom.petugas), // Konversi ke JSON
  };

  const formattedReport = {
    ...report,
    tanggalKejadian: report.tanggalKejadian
      ? new Date(report.tanggalKejadian).toISOString().split("T")[0]
      : null, // Format DATE
    waktuKejadian: report.waktuKejadian || "00:00:00", // Default jika kosong
  };

  addLogbook(user_id, formattedWatchroom, formattedReport, (err, results) => {
    if (err) {
      console.error("Error saat menambahkan logbook:", err); // Log error
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    const logbookId = results.insertId;

    // Simpan data flights ke tabel flights jika ada
    if (watchroom.flights && watchroom.flights.length > 0) {
      const flightsData = watchroom.flights.map((flight) => ({
        logbook_id: logbookId,
        time: flight.time,
        operator: flight.operator,
        aircraftType: flight.aircraftType,
        flightNumber: flight.flightNumber,
        depArrFrom: flight.depArrFrom,
        to: flight.to,
        rwUse: flight.rwUse,
        remarks: flight.remarks,
      }));

      addFlights(flightsData, (err) => {
        if (err) {
          console.error("Error saat menambahkan flights:", err); // Log error
          return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
        }

        res.status(201).json({ message: "Logbook dan flights berhasil ditambahkan", logbookId });
      });
    } else {
      res.status(201).json({ message: "Logbook berhasil ditambahkan", logbookId });
    }
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

  getLogbookById(id, (err, logbook) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (!logbook) {
      return res.status(404).json({ message: "Logbook tidak ditemukan" });
    }

    getFlightsByLogbookId(id, (err, flights) => {
      if (err) {
        return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
      }

      res.status(200).json({ logbook, flights });
    });
  });
};

// Controller untuk mengedit logbook
const updateLogbook = (req, res) => {
  const { id } = req.params;
  const { watchroom, report } = req.body;

  console.log("Data yang diterima untuk update:", { id, watchroom, report });

  // Validasi minimal - hanya pastikan ada data yang akan diupdate
  if (!watchroom && !report) {
    return res.status(400).json({ message: "Setidaknya salah satu data watchroom atau report harus diisi." });
  }

  // Ambil data logbook yang sudah ada dari database
  getLogbookById(id, (err, originalLogbook) => {
    if (err) {
      console.error("Error saat mengambil logbook:", err.message);
      return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }

    if (!originalLogbook) {
      return res.status(404).json({ message: "Logbook tidak ditemukan" });
    }

    try {
      // Gunakan data yang sudah ada jika data baru kosong
      const updatedData = {
        hari: (watchroom && watchroom.hari) || originalLogbook.hari || "-",
        tanggal: (watchroom && watchroom.tanggal) || originalLogbook.tanggal || new Date().toISOString().split('T')[0],
        jam: (watchroom && watchroom.jam) || originalLogbook.jam || "00:00:00",
        petugas: (watchroom && Array.isArray(watchroom.petugas)) ? JSON.stringify(watchroom.petugas) : 
                 (watchroom && watchroom.petugas) || originalLogbook.petugas || "[]",
        flights: (watchroom && Array.isArray(watchroom.flights)) ? JSON.stringify(watchroom.flights) : 
                 (watchroom && watchroom.flights) || originalLogbook.flights || "[]",
        koja: (watchroom && watchroom.koja) || originalLogbook.koja || "-",
        regu: (watchroom && watchroom.regu) || originalLogbook.regu || "-",
        hariKejadian: (report && report.hariKejadian) || originalLogbook.hariKejadian || "-",
        tanggalKejadian: (report && report.tanggalKejadian) || originalLogbook.tanggalKejadian || new Date().toISOString().split('T')[0],
        waktuKejadian: (report && report.waktuKejadian) || originalLogbook.waktuKejadian || "00:00:00",
        cuaca: (report && report.cuaca) || originalLogbook.cuaca || "-",
        kejadian: (report && report.kejadian) || originalLogbook.kejadian || "-",
        noPnb: (report && report.noPnb) || originalLogbook.noPnb || null,
        tipePesawat: (report && report.tipePesawat) || originalLogbook.tipePesawat || null,
        fasePenerbangan: (report && report.fasePenerbangan) || originalLogbook.fasePenerbangan || null,
        kerusakanPesawat: (report && report.kerusakanPesawat) || originalLogbook.kerusakanPesawat || null,
        jenisFasilitas: (report && report.jenisFasilitas) || originalLogbook.jenisFasilitas || null,
        kerusakanFasilitas: (report && report.kerusakanFasilitas) || originalLogbook.kerusakanFasilitas || null,
        rincianKejadian: (report && report.rincianKejadian) || originalLogbook.rincianKejadian || null,
      };

      console.log("Data yang akan diupdate:", updatedData);

      // Update logbook dengan data yang sudah diperbarui
      editLogbook(id, updatedData, (err, results) => {
        if (err) {
          console.error("Error saat mengupdate logbook:", err.message);
          return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Logbook tidak ditemukan" });
        }

        res.status(200).json({ message: "Logbook berhasil diperbarui" });
      });
    } catch (error) {
      console.error("Error parsing data:", error.message);
      res.status(400).json({ message: "Data tidak valid", error: error.message });
    }
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

const fetchLogbooksByUserId = (req, res) => {
  const { user_id } = req.params;

  getLogbooksByUserId(user_id, (err, results) => {
    if (err) {
      console.error("Error fetching logbooks:", err.message);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil logbook" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Logbook tidak ditemukan untuk user ini" });
    }

    console.log("Raw logbook data from database:", JSON.stringify(results[0], null, 2));
    
    res.status(200).json({ logbooks: results });
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