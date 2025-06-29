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

  db.query(query, values, callback);
};

// Fungsi untuk menambahkan data flights ke tabel flights
const addFlights = (flights, callback) => {
  const query = `
    INSERT INTO flights (
      logbook_id, time, operator, aircraftType, flightNumber, depArrFrom, toPenerbangan, rwUse, remarks
    ) VALUES ?
  `;
  const values = flights.map((flight) => [
    flight.logbook_id,
    flight.time,
    flight.operator,
    flight.aircraftType,
    flight.flightNumber,
    flight.depArrFrom,
    flight.to,
    flight.rwUse,
    flight.remarks,
  ]);

  db.query(query, [values], callback);
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

// Fungsi untuk mengambil flights berdasarkan logbook_id
const getFlightsByLogbookId = (logbook_id, callback) => {
  const query = "SELECT * FROM flights WHERE logbook_id = ?";
  db.query(query, [logbook_id], callback);
};

// Fungsi untuk mengedit logbook
const editLogbook = (id, updatedData, callback) => {
  const query = `
    UPDATE logbooks
    SET hari = ?, tanggal = ?, jam = ?, petugas = ?, flights = ?, koja = ?, regu = ?,
        hariKejadian = ?, tanggalKejadian = ?, waktuKejadian = ?, cuaca = ?, kejadian = ?,
        noPnb = ?, tipePesawat = ?, fasePenerbangan = ?, kerusakanPesawat = ?, jenisFasilitas = ?,
        kerusakanFasilitas = ?, rincianKejadian = ?
    WHERE id = ?
  `;

  const values = [
    updatedData.hari,
    updatedData.tanggal,
    updatedData.jam,
    updatedData.petugas,
    updatedData.flights,
    updatedData.koja,
    updatedData.regu,
    updatedData.hariKejadian,
    updatedData.tanggalKejadian,
    updatedData.waktuKejadian,
    updatedData.cuaca,
    updatedData.kejadian,
    updatedData.noPnb,
    updatedData.tipePesawat,
    updatedData.fasePenerbangan,
    updatedData.kerusakanPesawat,
    updatedData.jenisFasilitas,
    updatedData.kerusakanFasilitas,
    updatedData.rincianKejadian,
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
  addFlights,
  getAllLogbooks,
  getLogbookById,
  getFlightsByLogbookId,
  editLogbook,
  deleteLogbook,
  getLogbooksByUserId,
};