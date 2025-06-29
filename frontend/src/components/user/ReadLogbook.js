import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

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

const ReadLogbook = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Ambil user_id dari local storage
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/logbooks/user/${user_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Helper function to format date for input[type="date"]
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        // Helper function to format date for display (DD Bulan YYYY)
        const formatDateForDisplay = (dateString) => {
          console.log('formatDateForDisplay input:', dateString, typeof dateString);
          
          if (!dateString || dateString === "" || dateString === null || dateString === undefined) {
            console.log('formatDateForDisplay: empty input, returning empty string');
            return "";
          }
          
          // If already formatted, return as is
          if (typeof dateString === 'string' && dateString.includes(' ')) {
            console.log('formatDateForDisplay: already formatted, returning as is');
            return dateString;
          }
          
          try {
            let date;
            
            // Handle different date formats
            if (typeof dateString === 'string') {
              // Handle ISO string with timestamp (e.g., "2025-06-28T17:00:00.000Z")
              if (dateString.includes('T')) {
                date = new Date(dateString);
              }
              // Handle date string in YYYY-MM-DD format
              else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                date = new Date(dateString + 'T00:00:00');
              }
              // Handle other date string formats
              else {
                date = new Date(dateString);
              }
            } else {
              date = new Date(dateString);
            }
            
            if (isNaN(date.getTime())) {
              console.log('formatDateForDisplay: invalid date, returning empty string');
              return "";
            }
            
            const day = date.getDate();
            const year = date.getFullYear();
            
            const months = [
              'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
              'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            
            const month = months[date.getMonth()];
            
            // Validate all parts
            if (isNaN(day) || isNaN(year) || !month) {
              console.log('formatDateForDisplay: invalid date parts, returning empty string');
              return "";
            }
            
            const result = `${day.toString().padStart(2, '0')} ${month} ${year}`;
            console.log('formatDateForDisplay result:', result);
            return result;
          } catch (error) {
            console.log('formatDateForDisplay error:', error);
            return "";
          }
        };

        // Helper function to format time for display (HH:MM)
        const formatTimeForDisplay = (timeString) => {
          if (!timeString) return "";
          // Remove seconds if present (HH:MM:SS -> HH:MM)
          return timeString.split(':').slice(0, 2).join(':');
        };

        // Pastikan data `petugas` dan `flights` dikonversi dari JSON
        const formattedLogs = data.logbooks.map((log) => ({
          ...log,
          petugas: Array.isArray(log.petugas) ? log.petugas : JSON.parse(log.petugas || "[]"),
          flights: Array.isArray(log.flights) ? log.flights : JSON.parse(log.flights || "[]"),
          tanggal: formatDateForInput(log.tanggal),
          tanggalKejadian: formatDateForInput(log.tanggalKejadian),
          displayTanggal: formatDateForDisplay(log.tanggal), // For display in table
          displayJam: formatTimeForDisplay(log.jam), // For display in table
        }));

        setLogs(formattedLogs);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
        setError(error.message);
      }
    };

    fetchLogs();
  }, [user_id]);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus log ini?")) {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/logbooks/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat menghapus logbook");
        }

        setLogs((prev) => prev.filter((log) => log.id !== id));
        setSuccess("Logbook berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting logbook:", error.message);
        setError(error.message);
      }
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

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (!editData) {
      setError("Data untuk diedit tidak ditemukan.");
      return;
    }

    // Helper function to format date to YYYY-MM-DD
    const formatDate = (dateString) => {
      if (!dateString) return new Date().toISOString().split('T')[0];
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return new Date().toISOString().split('T')[0];
        }
        return date.toISOString().split('T')[0];
      } catch (error) {
        return new Date().toISOString().split('T')[0];
      }
    };
  
    try {
      const response = await fetch(`https://web-logbook-bvjl.vercel.app/logbooks/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          watchroom: {
            hari: editData.hari || "-",
            tanggal: formatDate(editData.tanggal) || formatDate(new Date()),
            jam: editData.jam || "00:00",
            petugas: editData.petugas || [],
            flights: editData.flights || [],
            koja: editData.koja || "-",
            regu: editData.regu || "-",
          },
          report: {
            hariKejadian: editData.hariKejadian || "-",
            tanggalKejadian: formatDate(editData.tanggalKejadian) || formatDate(new Date()),
            waktuKejadian: editData.waktuKejadian || "00:00",
            cuaca: editData.cuaca || "-",
            kejadian: editData.kejadian || "-",
            noPnb: editData.noPnb || "",
            tipePesawat: editData.tipePesawat || "",
            fasePenerbangan: editData.fasePenerbangan || "",
            kerusakanPesawat: editData.kerusakanPesawat || "",
            jenisFasilitas: editData.jenisFasilitas || "",
            kerusakanFasilitas: editData.kerusakanFasilitas || "",
            rincianKejadian: editData.rincianKejadian || "",
          },
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat menyimpan perubahan logbook");
      }
  
      setLogs((prev) =>
        prev.map((log) => (log.id === editData.id ? { ...log, ...editData } : log))
      );
      setSuccess("Logbook berhasil diperbarui!");
      setTimeout(() => {
        handleCloseEdit();
      }, 1500);
    } catch (error) {
      console.error("Error saving logbook:", error.message);
      setError(error.message);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      (typeof log.hari === "string" && log.hari.toLowerCase().includes(filter.toLowerCase())) ||
      (typeof log.displayTanggal === "string" && log.displayTanggal.includes(filter)) ||
      (typeof log.displayJam === "string" && log.displayJam.includes(filter)) ||
      (Array.isArray(log.petugas) && log.petugas.some((p) => 
        typeof p === "string" && p.toLowerCase().includes(filter.toLowerCase())
      ))
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", color: "var(--color-accent)" }}>
        Daftar Logbook
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
        <InputGroup style={{ maxWidth: 260 }}>
          <Form.Control
            placeholder="Cari hari/jam/petugas"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </InputGroup>
      </div>
      <Table bordered hover responsive>
        <thead style={{ background: "var(--color-accent)", color: "#fff" }}>
          <tr>
            <th>Hari</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Petugas</th>
            <th style={{ width: 110 }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
                Tidak ada data logbook.
              </td>
            </tr>
          ) : (
            filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.hari}</td>
                <td>{log.displayTanggal}</td>
                <td>{log.displayJam}</td>
                <td>{log.petugas.join(", ") || "Tidak ada petugas"}</td>
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
            {editData ? (
              <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "2rem" }}>
                {/* Highlighted Section: Logbook Watch Room */}
                <div style={{ background: "var(--color-accent, #023E8A)", color: "#fff", borderRadius: 8, padding: "1.2rem 1rem", marginBottom: 28 }}>
                  <h2 style={{ fontWeight: 700, margin: 0, fontSize: "1.35rem" }}>
                    Edit Logbook Watch Room ARFF Bandara Internasional Batam
                  </h2>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSaveEdit}>
                  {/* Watch Room Section */}
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hari</Form.Label>
                        <Form.Control
                          type="text"
                          name="hari"
                          value={editData.hari || ""}
                          onChange={(e) => setEditData({ ...editData, hari: e.target.value })}
                          placeholder="Kosongkan jika tidak ingin mengubah"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tanggal</Form.Label>
                        <Form.Control
                          type="date"
                          name="tanggal"
                          value={editData.tanggal || ""}
                          onChange={(e) => setEditData({ ...editData, tanggal: e.target.value })}
                          placeholder="Kosongkan jika tidak ingin mengubah"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Jam</Form.Label>
                        <Form.Control
                          type="time"
                          name="jam"
                          value={editData.jam || ""}
                          onChange={(e) => setEditData({ ...editData, jam: e.target.value })}
                          placeholder="Kosongkan jika tidak ingin mengubah"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Petugas Watch Room</Form.Label>
                    {editData.petugas.map((p, idx) => (
                      <InputGroup className="mb-2" key={idx}>
                        <Form.Control
                          type="text"
                          value={p}
                          onChange={(e) => {
                            const updatedPetugas = [...editData.petugas];
                            updatedPetugas[idx] = e.target.value;
                            setEditData({ ...editData, petugas: updatedPetugas });
                          }}
                          placeholder={`Petugas ke-${idx + 1}`}
                        />
                        {editData.petugas.length > 1 && (
                          <Button variant="danger" onClick={() => {
                            const updatedPetugas = editData.petugas.filter((_, i) => i !== idx);
                            setEditData({ ...editData, petugas: updatedPetugas });
                          }}>
                            Hapus
                          </Button>
                        )}
                      </InputGroup>
                    ))}
                    <Button variant="secondary" size="sm" onClick={() =>
                      setEditData({ ...editData, petugas: [...editData.petugas, ""] })
                    }>
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
                          value={editData.koja || ""}
                          onChange={(e) => setEditData({ ...editData, koja: e.target.value })}
                          placeholder="kosongkan jika tidak ingin mengubah"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Regu Jaga</Form.Label>
                        <Form.Control
                          type="text"
                          name="regu"
                          value={editData.regu || ""}
                          onChange={(e) => setEditData({ ...editData, regu: e.target.value })}
                          placeholder="kosongkan jika tidak ingin mengubah"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <hr style={{ margin: "2.5rem 0 1.5rem 0", borderTop: "2px dashed var(--color-accent, #023E8A)" }} />
                  <h5 style={{ marginTop: 20, marginBottom: 10 }}>Aircraft Movement</h5>
                  {editData.flights.map((flight, idx) => (
                    <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                      <Row>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                              type="datetime-local"
                              name="time"
                              value={flight.time || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].time = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                              placeholder="kosongkan jika tidak ingin mengubah"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Operator</Form.Label>
                            <Form.Control
                              type="text"
                              name="operator"
                              value={flight.operator || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].operator = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                              placeholder="kosongkan jika tidak ingin mengubah"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Type of Aircraft</Form.Label>
                            <Form.Control
                              type="text"
                              name="aircraftType"
                              value={flight.aircraftType || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].aircraftType = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                              placeholder="kosongkan jika tidak ingin mengubah"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Flight Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="flightNumber"
                              value={flight.flightNumber || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].flightNumber = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                              placeholder="kosongkan jika tidak ingin mengubah"
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
                              value={flight.depArrFrom || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].depArrFrom = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                              placeholder="kosongkan jika tidak ingin mengubah"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>To</Form.Label>
                            <Form.Control
                              type="text"
                              name="to"
                              value={flight.to || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].to = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                              placeholder="kosongkan jika tidak ingin mengubah"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>R/W Use</Form.Label>
                            <Form.Control
                              type="text"
                              name="rwUse"
                              value={flight.rwUse || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].rwUse = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                              placeholder="kosongkan jika tidak ingin mengubah"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                              type="text"
                              name="remarks"
                              value={flight.remarks || ""}
                              onChange={(e) => {
                                const updatedFlights = [...editData.flights];
                                updatedFlights[idx].remarks = e.target.value;
                                setEditData({ ...editData, flights: updatedFlights });
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      {editData.flights.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ marginTop: 10 }}
                          onClick={() => {
                            const updatedFlights = editData.flights.filter((_, i) => i !== idx);
                            setEditData({ ...editData, flights: updatedFlights });
                          }}
                        >
                          Hapus Aktivitas
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" onClick={() =>
                    setEditData({ ...editData, flights: [...editData.flights, Object.assign({}, emptyFlight)] })
                  } style={{ marginBottom: 20 }}>
                    + Tambah Aktivitas / Kejadian
                  </Button>
                  <hr style={{ margin: "2.5rem 0 1.5rem 0", borderTop: "2px dashed var(--color-accent, #023E8A)" }} />
                  <h5 style={{ marginTop: 20, marginBottom: 10 }}>Laporan / Report</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hari Kejadian</Form.Label>
                        <Form.Control
                          type="text"
                          name="hariKejadian"
                          value={editData.hariKejadian || ""}
                          onChange={(e) => setEditData({ ...editData, hariKejadian: e.target.value })}
                          placeholder="Senin, Selasa, ..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tanggal Kejadian</Form.Label>
                        <Form.Control
                          type="date"
                          name="tanggalKejadian"
                          value={editData.tanggalKejadian || ""}
                          onChange={(e) => setEditData({ ...editData, tanggalKejadian: e.target.value })}
                          placeholder="Kosongkan jika tidak ingin mengubah"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Waktu Kejadian</Form.Label>
                        <Form.Control
                          type="time"
                          name="waktuKejadian"
                          value={editData.waktuKejadian || ""}
                          onChange={(e) => setEditData({ ...editData, waktuKejadian: e.target.value })}
                          placeholder="Kosongkan jika tidak ingin mengubah"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Cuaca</Form.Label>
                    <Form.Control
                      type="text"
                      name="cuaca"
                      value={editData.cuaca || ""}
                      onChange={(e) => setEditData({ ...editData, cuaca: e.target.value })}
                      placeholder="Cerah, Hujan, dll"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Kejadian</Form.Label>
                    <Form.Control
                      type="text"
                      name="kejadian"
                      value={editData.kejadian || ""}
                      onChange={(e) => setEditData({ ...editData, kejadian: e.target.value })}
                      placeholder="Contoh: Wildlife hazard di runway 05"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>No. PNB</Form.Label>
                    <Form.Control
                      type="text"
                      name="noPnb"
                      value={editData.noPnb || ""}
                      onChange={(e) => setEditData({ ...editData, noPnb: e.target.value })}
                      placeholder="Nomor PNB (Pilot Notified Briefing)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipe Pesawat</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipePesawat"
                      value={editData.tipePesawat || ""}
                      onChange={(e) => setEditData({ ...editData, tipePesawat: e.target.value })}
                      placeholder="Contoh: B737, A320, dll"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Fase Penerbangan</Form.Label>
                    <Form.Control
                      type="text"
                      name="fasePenerbangan"
                      value={editData.fasePenerbangan || ""}
                      onChange={(e) => setEditData({ ...editData, fasePenerbangan: e.target.value })}
                      placeholder="Contoh: Takeoff, Landing, dll"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Kerusakan Pesawat Udara</Form.Label>
                    <Form.Control
                      type="text"
                      name="kerusakanPesawat"
                      value={editData.kerusakanPesawat || ""}
                      onChange={(e) => setEditData({ ...editData, kerusakanPesawat: e.target.value })}
                      placeholder="Contoh: Sayap patah, Mesin mati, dll"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Jenis Fasilitas</Form.Label>
                    <Form.Control
                      type="text"
                      name="jenisFasilitas"
                      value={editData.jenisFasilitas || ""}
                      onChange={(e) => setEditData({ ...editData, jenisFasilitas: e.target.value })}
                      placeholder="Contoh: Runway, Taxiway, Apron, dll"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Kerusakan Fasilitas</Form.Label>
                    <Form.Control
                      type="text"
                      name="kerusakanFasilitas"
                      value={editData.kerusakanFasilitas || ""}
                      onChange={(e) => setEditData({ ...editData, kerusakanFasilitas: e.target.value })}
                      placeholder="Contoh: Lubang, Retakan, dll"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Rincian Kejadian</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="rincianKejadian"
                      value={editData.rincianKejadian || ""}
                      onChange={(e) => setEditData({ ...editData, rincianKejadian: e.target.value })}
                      placeholder="Deskripsi kejadian secara detail"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    style={{
                      width: "100%",
                      background: "var(--color-cta, #007BFF)",
                      border: "none",
                      fontWeight: 700,
                      marginTop: 20,
                      display: "block",
                    }}
                  >
                    Simpan Perubahan
                  </Button>
                </Form>
              </div>
            ) : (
              <Alert variant="warning">Data tidak ditemukan untuk diedit.</Alert>
            )}
          </Modal.Body>
        </Modal>


      </div>
  );
};

export default ReadLogbook;