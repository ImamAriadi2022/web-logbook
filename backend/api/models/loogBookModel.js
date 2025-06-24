const db = require("../config/dbConfig");

// Fungsi untuk menambahkan logbook baru
const addLogbook = (user_id, watchroom, report, callback) => {
  const query = `
    INSERT INTO logbooks (
      user_id, hari, tanggal, jam, petugas, koja, regu, flights, hariKejadian, tanggalKejadian, waktuKejadian, cuaca, kejadian, noPnb, tipePesawat, fasePenerbangan, kerusakanPesawat, jenisFasilitas, kerusakanFasilitas, rincianKejadian
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    user_id,
    watchroom.hari,
    watchroom.tanggal,
    watchroom.jam,
    JSON.stringify(watchroom.petugas),
    watchroom.koja,
    watchroom.regu,
    JSON.stringify(watchroom.flights),
    report.hariKejadian,
    report.tanggalKejadian,
    report.waktuKejadian,
    report.cuaca,
    report.kejadian,
    report.noPnb,
    report.tipePesawat,
    report.fasePenerbangan,
    report.kerusakanPesawat,
    report.jenisFasilitas,
    report.kerusakanFasilitas,
    report.rincianKejadian,
  ];

  console.log("Query SQL:", query); // Log query
  console.log("Values:", values); // Log nilai yang dikirim

  db.query(query, values, callback);
};

// Fungsi untuk mengambil semua logbook
const getAllLogbooks = (callback) => {
  const query = "SELECT * FROM logbooks";
  db.query(query, callback);
};

// Fungsi untuk mengambil logbook berdasarkan ID
const getLogbookById = (id, callback) => {
  const query = "SELECT * FROM logbooks WHERE id = ?";
  db.query(query, [id], callback);
};

// Fungsi untuk mengedit logbook
const editLogbook = (id, watchroom, report, callback) => {
  const query = `
    UPDATE logbooks
    SET hari = ?, tanggal = ?, jam = ?, petugas = ?, koja = ?, regu = ?, flights = ?, hariKejadian = ?, tanggalKejadian = ?, waktuKejadian = ?, cuaca = ?, kejadian = ?, noPnb = ?, tipePesawat = ?, fasePenerbangan = ?, kerusakanPesawat = ?, jenisFasilitas = ?, kerusakanFasilitas = ?, rincianKejadian = ?
    WHERE id = ?
  `;
  const values = [
    watchroom.hari,
    watchroom.tanggal,
    watchroom.jam,
    JSON.stringify(watchroom.petugas),
    watchroom.koja,
    watchroom.regu,
    JSON.stringify(watchroom.flights),
    report.hariKejadian,
    report.tanggalKejadian,
    report.waktuKejadian,
    report.cuaca,
    report.kejadian,
    report.noPnb,
    report.tipePesawat,
    report.fasePenerbangan,
    report.kerusakanPesawat,
    report.jenisFasilitas,
    report.kerusakanFasilitas,
    report.rincianKejadian,
    id,
  ];
  db.query(query, values, callback);
};

// Fungsi untuk menghapus logbook
const deleteLogbook = (id, callback) => {
  const query = "DELETE FROM logbooks WHERE id = ?";
  db.query(query, [id], callback);
};

// Fungsi untuk mengambil logbook berdasarkan user_id
const getLogbooksByUserId = (user_id, callback) => {
  const query = "SELECT * FROM logbooks WHERE user_id = ?";
  db.query(query, [user_id], callback);
};

module.exports = {
  addLogbook,
  getAllLogbooks,
  getLogbookById,
  editLogbook,
  deleteLogbook,
  getLogbooksByUserId,
};