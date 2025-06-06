import React, { useState } from "react";
import { Card, Table, Button, InputGroup, Form, Modal, Alert, Row, Col } from "react-bootstrap";
import { FaClipboardList, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";

// Dummy data logbook, ganti dengan data asli dari backend jika ada
const emptyFlight = {
  time: "",
  operator: "",
  aircraftType: "",
  flightNumber: "",
  depArrFrom: "",
  to: "",
  rwUse: "",
  remarks: "",
};

const emptyPetugas = "";

const initialWatchroom = {
  hari: "",
  tanggal: "",
  jam: "",
  petugas: [emptyPetugas],
  koja: "",
  regu: "",
  flights: [Object.assign({}, emptyFlight)],
};

const initialReport = {
  tanggalKejadian: "",
  hariKejadian: "",
  waktuKejadian: "",
  cuaca: "",
  kejadian: "",
  noPnb: "",
  tipePesawat: "",
  fasePenerbangan: "",
  kerusakanPesawat: "",
  jenisFasilitas: "",
  kerusakanFasilitas: "",
  rincianKejadian: "",
};

const dummyLogbook = [
  {
    id: 1,
    tanggal: "2025-01-04",
    aktivitas: "Wildlife hazard di Runway 04",
    petugas: "Siti",
    watchroom: { ...initialWatchroom },
    report: { ...initialReport },
  },
  {
    id: 2,
    tanggal: "2025-01-05",
    aktivitas: "Pengecekan alat pemadam",
    petugas: "Andi",
    watchroom: { ...initialWatchroom },
    report: { ...initialReport },
  },
  {
    id: 3,
    tanggal: "2025-01-06",
    aktivitas: "Simulasi evakuasi",
    petugas: "Budi",
    watchroom: { ...initialWatchroom },
    report: { ...initialReport },
  },
];

const Data = () => {
  const [logbook, setLogbook] = useState(dummyLogbook);
  const [filter, setFilter] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // State untuk form edit
  const [watchroom, setWatchroom] = useState(initialWatchroom);
  const [report, setReport] = useState(initialReport);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Prefill form saat edit
  React.useEffect(() => {
    if (editData) {
      setWatchroom(editData.watchroom || initialWatchroom);
      setReport(editData.report || initialReport);
      setError("");
      setSuccess("");
    }
  }, [editData]);

  const filteredLogbook = logbook.filter(
    (log) =>
      (log.tanggal || "").toLowerCase().includes(filter.toLowerCase()) ||
      (log.petugas || "").toLowerCase().includes(filter.toLowerCase()) ||
      (log.aktivitas || "").toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus logbook ini?")) {
      setLogbook(logbook.filter((l) => l.id !== id));
    }
  };

  const handleEdit = (log) => {
    setEditData(log);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditData(null);
    setError("");
    setSuccess("");
  };

  // Handler untuk field Watch Room
  const handleWatchroomChange = (e) => {
    const { name, value } = e.target;
    setWatchroom((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk petugas (bisa lebih dari satu)
  const handlePetugasChange = (idx, value) => {
    const newPetugas = [...watchroom.petugas];
    newPetugas[idx] = value;
    setWatchroom((prev) => ({ ...prev, petugas: newPetugas }));
  };

  const addPetugas = () => {
    setWatchroom((prev) => ({ ...prev, petugas: [...prev.petugas, ""] }));
  };

  const removePetugas = (idx) => {
    const newPetugas = watchroom.petugas.filter((_, i) => i !== idx);
    setWatchroom((prev) => ({ ...prev, petugas: newPetugas }));
  };

  // Handler untuk flight/kejadian dinamis
  const handleFlightChange = (idx, e) => {
    const { name, value } = e.target;
    const newFlights = watchroom.flights.map((f, i) =>
      i === idx ? { ...f, [name]: value } : f
    );
    setWatchroom((prev) => ({ ...prev, flights: newFlights }));
  };

  const addFlight = () => {
    setWatchroom((prev) => ({
      ...prev,
      flights: [...prev.flights, Object.assign({}, emptyFlight)],
    }));
  };

  const removeFlight = (idx) => {
    const newFlights = watchroom.flights.filter((_, i) => i !== idx);
    setWatchroom((prev) => ({ ...prev, flights: newFlights }));
  };

  // Handler untuk report
  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  // Simulasi update logbook (harusnya update ke backend)
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validasi sederhana
    if (
      !watchroom.hari ||
      !watchroom.tanggal ||
      !watchroom.jam ||
      watchroom.petugas.some((p) => !p) ||
      !watchroom.koja ||
      !watchroom.regu ||
      watchroom.flights.some(
        (f) =>
          !f.time ||
          !f.operator ||
          !f.aircraftType ||
          !f.flightNumber ||
          !f.depArrFrom ||
          !f.to ||
          !f.rwUse
      ) ||
      !report.hariKejadian ||
      !report.tanggalKejadian ||
      !report.waktuKejadian ||
      !report.cuaca ||
      !report.kejadian ||
      !report.noPnb ||
      !report.tipePesawat ||
      !report.fasePenerbangan ||
      !report.kerusakanPesawat ||
      !report.jenisFasilitas ||
      !report.kerusakanFasilitas ||
      !report.rincianKejadian
    ) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLogbook((prev) =>
      prev.map((log) =>
        log.id === editData.id
          ? {
              ...log,
              watchroom: { ...watchroom },
              report: { ...report },
              tanggal: watchroom.tanggal,
              aktivitas: report.kejadian,
              petugas: watchroom.petugas.join(", "),
            }
          : log
      )
    );
    setSuccess("Logbook dan laporan berhasil disimpan!");
    setTimeout(() => {
      handleCloseEdit();
    }, 1000);
  };

  // Export logbook ke PDF (simulasi: print halaman)
  const handleExport = (log) => {
    // Buat window baru untuk print
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Export Logbook</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; color: #000; padding: 20px; }
            table { width: 100%; font-size: 12px; border-collapse: collapse; border: 1px solid black; margin-bottom: 16px; }
            td, th { border: 1px solid black; padding: 4px; }
            h3, h4, h5 { text-align: center; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h3 style="text-align:center; margin-bottom:10px;">Logbook Watch Room ARFF Bandara Internasional Batam</h3>
          <!-- TABEL ATAS -->
          <table>
            <tbody>
              <tr>
                <td>Hari</td>
                <td>${log.watchroom.hari || ""}</td>
                <td>Petugas Watch room</td>
                <td>
                  <ul style="list-style-type:none; padding:0; margin:0;">
                    ${(log.watchroom.petugas || []).map((p, i) => `<li style="margin-bottom:4px;">${i + 1}. ${p}</li>`).join("")}
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Tanggal</td>
                <td>${log.watchroom.tanggal || ""}</td>
                <td>Koja</td>
                <td>${log.watchroom.koja || ""}</td>
              </tr>
              <tr>
                <td>Jam</td>
                <td>${log.watchroom.jam || ""}</td>
                <td>Regu Jaga</td>
                <td>${log.watchroom.regu || ""}</td>
              </tr>
            </tbody>
          </table>
          <!-- TABEL PERGERAKAN PESAWAT -->
          <h5 style="text-align:center; margin:20px 0 5px;">Pergerakan Pesawat / Aircraft Movement</h5>
          <table style="text-align:center;">
            <thead>
              <tr style="font-weight:bold;">
                <td>No</td>
                <td>Time</td>
                <td>Operator</td>
                <td>Type</td>
                <td>Flight</td>
                <td>From</td>
                <td>To</td>
                <td>RW</td>
              </tr>
            </thead>
            <tbody>
              ${(log.watchroom.flights || [])
                .map(
                  (f, i) =>
                    `<tr>
                      <td>${i + 1}</td>
                      <td>${f.time || ""}</td>
                      <td>${f.operator || ""}</td>
                      <td>${f.aircraftType || ""}</td>
                      <td>${f.flightNumber || ""}</td>
                      <td>${f.depArrFrom || ""}</td>
                      <td>${f.to || ""}</td>
                      <td>${f.rwUse || ""}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <h4 style="text-align:center; margin:20px 0 5px;">LAPORAN/REPORT</h4>
          <!-- TABEL INFORMASI UMUM -->
          <h5 style="margin:20px 0 5px; font-size:13px; font-weight:bold;">Informasi Umum / General Information</h5>
          <table style="border:none;">
            <tbody>
              <tr>
                <td style="border:none;">Tanggal Kejadian</td>
                <td style="border:none;">${log.report.tanggalKejadian || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Waktu Kejadian</td>
                <td style="border:none;">${log.report.waktuKejadian || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Cuaca</td>
                <td style="border:none;">${log.report.cuaca || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Kejadian</td>
                <td style="border:none;">${log.report.kejadian || ""}</td>
              </tr>
            </tbody>
          </table>
          <h5 style="margin:20px 0 5px; font-size:13px; font-weight:bold;">Informasi Pesawat Udara</h5>
          <table style="border:none;">
            <tbody>
              <tr>
                <td style="border:none;">No.PNB</td>
                <td style="border:none;">${log.report.noPnb || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Tipe Pesawat</td>
                <td style="border:none;">${log.report.tipePesawat || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Fase Penerbangan</td>
                <td style="border:none;">${log.report.fasePenerbangan || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Kerusakan Pesawat Udara</td>
                <td style="border:none;">${log.report.kerusakanPesawat || ""}</td>
              </tr>
            </tbody>
          </table>
          <h5 style="margin:20px 0 5px; font-size:13px; font-weight:bold;">Informasi Fasilitas yang Terdampak</h5>
          <table style="border:none;">
            <tbody>
              <tr>
                <td style="border:none;">Jenis Fasilitas</td>
                <td style="border:none;">${log.report.jenisFasilitas || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Kerusakan Fasilitas</td>
                <td style="border:none;">${log.report.kerusakanFasilitas || ""}</td>
              </tr>
              <tr>
                <td style="border:none;">Rincian Kejadian</td>
                <td style="border:none;">${log.report.rincianKejadian || ""}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };


  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <FaClipboardList style={{ fontSize: 28 }} /> Data Logbook
      </h2>
      <Card>
        <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff" }}>
          Lihat semua logbook yang dicatat user
        </Card.Header>
        <Card.Body>
          <InputGroup className="mb-3" style={{ maxWidth: 350 }}>
            <Form.Control
              placeholder="Filter tanggal, user, kejadian"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </InputGroup>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Tanggal</th>
                <th>Petugas</th>
                <th>Kejadian</th>
                <th style={{ width: 180 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogbook.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
                    Tidak ada data logbook.
                  </td>
                </tr>
              ) : (
                filteredLogbook.map((log, i) => (
                  <tr key={log.id}>
                    <td>{i + 1}</td>
                    <td>{log.tanggal}</td>
                    <td>{log.petugas}</td>
                    <td>{log.aktivitas}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        style={{ marginRight: 8 }}
                        onClick={() => handleEdit(log)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        style={{ marginRight: 8 }}
                        onClick={() => handleDelete(log.id)}
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleExport(log)}
                      >
                        <FaFileExport />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal untuk Edit Logbook */}
      <Modal show={showEdit} onHide={handleCloseEdit} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Edit Logbook</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "2rem" }}>
            <div style={{ background: "var(--color-accent, #023E8A)", color: "#fff", borderRadius: 8, padding: "1.2rem 1rem", marginBottom: 28 }}>
              <h2 style={{ fontWeight: 700, margin: 0, fontSize: "1.35rem" }}>
                Logbook Watch Room ARFF Bandara Internasional Batam
              </h2>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSaveEdit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hari</Form.Label>
                    <Form.Control
                      type="text"
                      name="hari"
                      value={watchroom.hari}
                      onChange={handleWatchroomChange}
                      placeholder="Senin, Selasa, ..."
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tanggal</Form.Label>
                    <Form.Control
                      type="date"
                      name="tanggal"
                      value={watchroom.tanggal}
                      onChange={handleWatchroomChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Jam</Form.Label>
                    <Form.Control
                      type="time"
                      name="jam"
                      value={watchroom.jam}
                      onChange={handleWatchroomChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Petugas Watch Room</Form.Label>
                {watchroom.petugas.map((p, idx) => (
                  <InputGroup className="mb-2" key={idx}>
                    <Form.Control
                      type="text"
                      value={p}
                      onChange={(e) => handlePetugasChange(idx, e.target.value)}
                      placeholder={`Petugas ke-${idx + 1}`}
                      required
                    />
                    {watchroom.petugas.length > 1 && (
                      <Button variant="danger" onClick={() => removePetugas(idx)}>
                        Hapus
                      </Button>
                    )}
                  </InputGroup>
                ))}
                <Button variant="secondary" size="sm" onClick={addPetugas}>
                  + Tambah Petugas
                </Button>
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Koja</Form.Label>
                    <Form.Control
                      type="text"
                      name="koja"
                      value={watchroom.koja}
                      onChange={handleWatchroomChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Regu Jaga</Form.Label>
                    <Form.Control
                      type="text"
                      name="regu"
                      value={watchroom.regu}
                      onChange={handleWatchroomChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr style={{ margin: "2.5rem 0 1.5rem 0", borderTop: "2px dashed var(--color-accent, #023E8A)" }} />
              <h5 style={{ marginTop: 20, marginBottom: 10 }}>Aktivitas Penerbangan / Kejadian</h5>
              {watchroom.flights.map((flight, idx) => (
                <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="time"
                          value={flight.time}
                          onChange={(e) => handleFlightChange(idx, e)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Operator</Form.Label>
                        <Form.Control
                          type="text"
                          name="operator"
                          value={flight.operator}
                          onChange={(e) => handleFlightChange(idx, e)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Type of Aircraft</Form.Label>
                        <Form.Control
                          type="text"
                          name="aircraftType"
                          value={flight.aircraftType}
                          onChange={(e) => handleFlightChange(idx, e)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Flight Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="flightNumber"
                          value={flight.flightNumber}
                          onChange={(e) => handleFlightChange(idx, e)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Dep/Arr From</Form.Label>
                        <Form.Control
                          type="text"
                          name="depArrFrom"
                          value={flight.depArrFrom}
                          onChange={(e) => handleFlightChange(idx, e)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>To</Form.Label>
                        <Form.Control
                          type="text"
                          name="to"
                          value={flight.to}
                          onChange={(e) => handleFlightChange(idx, e)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>R/W Use</Form.Label>
                        <Form.Control
                          type="text"
                          name="rwUse"
                          value={flight.rwUse}
                          onChange={(e) => handleFlightChange(idx, e)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                          type="text"
                          name="remarks"
                          value={flight.remarks}
                          onChange={(e) => handleFlightChange(idx, e)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {watchroom.flights.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      style={{ marginTop: 10 }}
                      onClick={() => removeFlight(idx)}
                    >
                      Hapus Aktivitas
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={addFlight} style={{ marginBottom: 20 }}>
                + Tambah Aktivitas / Kejadian
              </Button>
              <hr style={{ margin: "2.5rem 0 1.5rem 0", borderTop: "2px dashed var(--color-accent, #023E8A)" }} />
              <div style={{ background: "var(--color-primary, #0096C7)", color: "#fff", borderRadius: 8, padding: "1rem 1rem", marginBottom: 20 }}>
                <h4 style={{ fontWeight: 700, margin: 0, fontSize: "1.13rem" }}>Laporan / Report</h4>
                <div style={{ fontWeight: 500, fontSize: "1rem", marginTop: 4 }}>Informasi Umum</div>
              </div>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hari Kejadian</Form.Label>
                    <Form.Control
                      type="text"
                      name="hariKejadian"
                      value={report.hariKejadian}
                      onChange={handleReportChange}
                      placeholder="Senin, Selasa, ..."
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tanggal Kejadian</Form.Label>
                    <Form.Control
                      type="date"
                      name="tanggalKejadian"
                      value={report.tanggalKejadian}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Waktu Kejadian</Form.Label>
                    <Form.Control
                      type="time"
                      name="waktuKejadian"
                      value={report.waktuKejadian}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cuaca</Form.Label>
                    <Form.Control
                      type="text"
                      name="cuaca"
                      value={report.cuaca}
                      onChange={handleReportChange}
                      placeholder="Cerah, Hujan, dll"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Kejadian</Form.Label>
                <Form.Control
                  type="text"
                  name="kejadian"
                  value={report.kejadian}
                  onChange={handleReportChange}
                  placeholder="Contoh: Wildlife hazard di runway 05"
                  required
                />
              </Form.Group>
              <div style={{ fontWeight: 600, margin: "18px 0 8px 0" }}>Informasi Pesawat Udara</div>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>No. PNB</Form.Label>
                    <Form.Control
                      type="text"
                      name="noPnb"
                      value={report.noPnb}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipe Pesawat</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipePesawat"
                      value={report.tipePesawat}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fase Penerbangan</Form.Label>
                    <Form.Control
                      type="text"
                      name="fasePenerbangan"
                      value={report.fasePenerbangan}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Kerusakan Pesawat Udara</Form.Label>
                    <Form.Control
                      type="text"
                      name="kerusakanPesawat"
                      value={report.kerusakanPesawat}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div style={{ fontWeight: 600, margin: "18px 0 8px 0" }}>Informasi Fasilitas yang Terdampak</div>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Jenis Fasilitas</Form.Label>
                    <Form.Control
                      type="text"
                      name="jenisFasilitas"
                      value={report.jenisFasilitas}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Kerusakan Fasilitas</Form.Label>
                    <Form.Control
                      type="text"
                      name="kerusakanFasilitas"
                      value={report.kerusakanFasilitas}
                      onChange={handleReportChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rincian Kejadian</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="rincianKejadian"
                      value={report.rincianKejadian}
                      onChange={handleReportChange}
                      required
                      placeholder="Deskripsi kejadian secara detail"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Batal
                </Button>
                <Button type="submit">
                  Simpan Perubahan
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Data;