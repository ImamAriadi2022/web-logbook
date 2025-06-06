import React, { useState } from "react";
import { Form, Button, Alert, Row, Col, InputGroup } from "react-bootstrap";

// Helper untuk men-generate field dinamis
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

const AddLogbook = () => {
  // State untuk form 1 (Watch Room)
  const [watchroom, setWatchroom] = useState(initialWatchroom);
  // State untuk form 2 (Report)
  const [report, setReport] = useState(initialReport);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

  // Submit handler
  const handleSubmit = (e) => {
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
    setSuccess("Logbook dan laporan berhasil disimpan!");
    setWatchroom(initialWatchroom);
    setReport(initialReport);
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "2rem" }}>
      {/* Highlighted Section: Logbook Watch Room */}
      <div style={{ background: "var(--color-accent, #023E8A)", color: "#fff", borderRadius: 8, padding: "1.2rem 1rem", marginBottom: 28 }}>
        <h2 style={{ fontWeight: 700, margin: 0, fontSize: "1.35rem" }}>
          Logbook Watch Room ARFF Bandara Internasional Batam
        </h2>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
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
        {/* Highlighted Section: Laporan/Report */}
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
        <Button type="submit" style={{ width: "100%", background: "var(--color-cta)", border: "none", fontWeight: 700, marginTop: 20 }}>
          Simpan Logbook & Laporan
        </Button>
      </Form>
    </div>
  );
};

export default AddLogbook;