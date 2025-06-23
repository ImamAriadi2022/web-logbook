const express = require("express");
const path = require("path");
const { registerUser, loginUser, logoutUser, addAdmin, getAllUsers, editUser } = require("../controllers/userController");

const router = express.Router();

// Route untuk pendaftaran pengguna
router.post("/register", registerUser);

// Route untuk login pengguna
router.post("/login", loginUser);

// Route untuk logout pengguna
router.post("/logout", logoutUser);

// Route untuk menambahkan admin
router.post("/add-admin", addAdmin);

// Route untuk mengambil semua pengguna
router.get("/users", getAllUsers);

// Route untuk mengedit pengguna
router.put("/users/:id", editUser);

module.exports = router;