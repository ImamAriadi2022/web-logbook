// filepath: c:\programming\web-logbook\backend\routes\logBookRoutes.js
const express = require("express");
const {
  createLogbook,
  fetchAllLogbooks,
  fetchLogbookById,
  fetchLogbooksByUserId,
  updateLogbook,
  removeLogbook,
} = require("../controllers/LogBookController"); // Pastikan nama file dan fungsi benar

const router = express.Router();

// Route untuk menambahkan logbook baru
router.post("/add", createLogbook);

// Route untuk mengambil semua logbook
router.get("/", fetchAllLogbooks);

// Route untuk mengambil logbook berdasarkan ID
router.get("/:id", fetchLogbookById);

// Route untuk mengambil logbook berdasarkan user_id
router.get("/user/:user_id", fetchLogbooksByUserId);

// Route untuk mengedit logbook
router.put("/:id", updateLogbook);

// Route untuk menghapus logbook
router.delete("/:id", removeLogbook);

module.exports = router;