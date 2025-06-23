import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Modal, Alert } from "react-bootstrap";
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
  console.log("User ID:", user_id);

   useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/logbooks/user/${user_id}`);
        const data = await response.json();
  
        console.log("Data logbooks:", data); // Tambahkan log ini
  
        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil logbook");
        }
  
        setLogs(data.logbooks);
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
        const response = await fetch(`http://localhost:5000/api/logbooks/${id}`, {
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
  
    if (!editData) return;
  
    try {
      // Filter data untuk menghindari atribut kosong
      const filteredData = Object.keys(editData).reduce((acc, key) => {
        if (editData[key] !== null && editData[key] !== "") {
          acc[key] = editData[key];
        }
        return acc;
      }, {});
  
      const response = await fetch(`http://localhost:5000/api/logbooks/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredData),
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
      }, 1000);
    } catch (error) {
      console.error("Error saving logbook:", error.message);
      setError(error.message);
    }
  };
  
  const filteredLogs = logs.filter(
    (log) =>
      (typeof log.hari === "string" && log.hari.toLowerCase().includes(filter.toLowerCase())) ||
      (typeof log.jam === "string" && log.jam.toLowerCase().includes(filter.toLowerCase()))
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
                <td>{new Date(log.tanggal).toLocaleDateString()}</td>
                <td>{log.jam}</td>
                <td>{log.petugas || "Tidak ada petugas"}</td>
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
            <Form onSubmit={handleSaveEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Hari</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.hari || ""}
                  onChange={(e) => setEditData({ ...editData, hari: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tanggal</Form.Label>
                <Form.Control
                  type="date"
                  value={editData.tanggal || ""}
                  onChange={(e) => setEditData({ ...editData, tanggal: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Jam</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.jam || ""}
                  onChange={(e) => setEditData({ ...editData, jam: e.target.value })}
                />
              </Form.Group>
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
                    />
                    {editData.petugas.length > 1 && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          const updatedPetugas = editData.petugas.filter((_, i) => i !== idx);
                          setEditData({ ...editData, petugas: updatedPetugas });
                        }}
                      >
                        Hapus
                      </Button>
                    )}
                  </InputGroup>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setEditData({ ...editData, petugas: [...editData.petugas, ""] })
                  }
                >
                  + Tambah Petugas
                </Button>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Koja</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.koja || ""}
                  onChange={(e) => setEditData({ ...editData, koja: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Regu Jaga</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.regu || ""}
                  onChange={(e) => setEditData({ ...editData, regu: e.target.value })}
                />
              </Form.Group>
              <hr />
              <h5>Aircraft Movement</h5>
              {editData.flights.map((flight, idx) => (
                <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={flight.time || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].time = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Operator</Form.Label>
                    <Form.Control
                      type="text"
                      value={flight.operator || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].operator = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Type of Aircraft</Form.Label>
                    <Form.Control
                      type="text"
                      value={flight.aircraftType || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].aircraftType = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Flight Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={flight.flightNumber || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].flightNumber = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Dep/Arr From</Form.Label>
                    <Form.Control
                      type="text"
                      value={flight.depArrFrom || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].depArrFrom = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="text"
                      value={flight.to || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].to = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>R/W Use</Form.Label>
                    <Form.Control
                      type="text"
                      value={flight.rwUse || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].rwUse = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      value={flight.remarks || ""}
                      onChange={(e) => {
                        const updatedFlights = [...editData.flights];
                        updatedFlights[idx].remarks = e.target.value;
                        setEditData({ ...editData, flights: updatedFlights });
                      }}
                    />
                  </Form.Group>
                  {editData.flights.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setEditData({ ...editData, flights: [...editData.flights, Object.assign({}, emptyFlight)] })
                }
              >
                + Tambah Aktivitas / Kejadian
              </Button>
              <Button type="submit" variant="primary" style={{ marginTop: 20 }}>
                Simpan Perubahan
              </Button>
            </Form>
          ) : (
            <Alert variant="warning">Data tidak ditemukan untuk diedit.</Alert>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReadLogbook;