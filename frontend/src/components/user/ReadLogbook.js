import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Modal, Alert, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const currentUser = { username: "budi" };

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

const initialLogs = [
  {
    id: 1,
    tanggal: "2025-06-06",
    aktivitas: "Pengecekan alat pemadam",
    petugas: "budi",
    watchroom: { ...initialWatchroom },
    report: { ...initialReport },
  },
  {
    id: 2,
    tanggal: "2025-06-06",
    aktivitas: "Simulasi evakuasi",
    petugas: "budi",
    watchroom: { ...initialWatchroom },
    report: { ...initialReport },
  },
  {
    id: 3,
    tanggal: "2025-06-05",
    aktivitas: "Patroli area landasan",
    petugas: "budi",
    watchroom: { ...initialWatchroom },
    report: { ...initialReport },
  },
];

const ReadLogbook = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [filter, setFilter] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // State untuk form edit
  const [watchroom, setWatchroom] = useState(initialWatchroom);
  const [report, setReport] = useState(initialReport);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Prefill form saat edit
  useEffect(() => {
    if (editData) {
      setWatchroom(editData.watchroom || initialWatchroom);
      setReport(editData.report || initialReport);
      setError("");
      setSuccess("");
    }
  }, [editData]);

  const userLogs = logs.filter((log) => log.petugas === currentUser.username);

  const filteredLogs = userLogs.filter(
    (log) =>
      log.aktivitas.toLowerCase().includes(filter.toLowerCase()) ||
      log.petugas.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus log ini?")) {
      setLogs(logs.filter((log) => log.id !== id));
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
    setLogs((prev) =>
      prev.map((log) =>
        log.id === editData.id
          ? {
              ...log,
              watchroom: { ...watchroom },
              report: { ...report },
              tanggal: watchroom.tanggal,
              aktivitas: report.kejadian,
            }
          : log
      )
    );
    setSuccess("Logbook dan laporan berhasil disimpan!");
    setTimeout(() => {
      handleCloseEdit();
    }, 1000);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", color: "var(--color-accent)" }}>
        Daftar Logbook
      </h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
        <InputGroup style={{ maxWidth: 260 }}>
          <Form.Control
            placeholder="Cari aktivitas/petugas"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </InputGroup>
      </div>
      <Table bordered hover responsive>
        <thead style={{ background: "var(--color-accent)", color: "#fff" }}>
          <tr>
            <th>Tanggal</th>
            <th>Aktivitas</th>
            <th>Petugas</th>
            <th style={{ width: 110 }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                Tidak ada data logbook.
              </td>
            </tr>
          ) : (
            filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.tanggal}</td>
                <td>{log.aktivitas}</td>
                <td>{log.petugas}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleEdit(log)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(log.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

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

export default ReadLogbook;