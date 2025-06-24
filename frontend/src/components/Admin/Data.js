import React, { useState, useEffect } from "react";
import { Card, Table, Button, InputGroup, Form, Modal, Alert, Row, Col } from "react-bootstrap";
import { FaClipboardList, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";

const Data = () => {
  const [logbook, setLogbook] = useState([]);
  const [filter, setFilter] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // State untuk form edit
  const [watchroom, setWatchroom] = useState({});
  const [report, setReport] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch data logbook dari backend
  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const response = await fetch("https://web-logbook-bvjl.vercel.app/logbooks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil data logbook");
        }

        setLogbook(data.logbooks);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
      }
    };

    fetchLogbooks();
  }, []);

  // Prefill form saat edit
  useEffect(() => {
    if (editData) {
      setWatchroom(editData.watchroom || {});
      setReport(editData.report || {});
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

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus logbook ini?")) {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/logbooks/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Terjadi kesalahan saat menghapus logbook");
        }

        setLogbook(logbook.filter((l) => l.id !== id));
      } catch (error) {
        console.error("Error deleting logbook:", error.message);
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

    try {
      const response = await fetch(`https://web-logbook-bvjl.vercel.app/logbooks/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ watchroom, report }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat menyimpan perubahan logbook");
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
      setSuccess("Logbook berhasil diperbarui!");
      setTimeout(() => {
        handleCloseEdit();
      }, 1000);
    } catch (error) {
      console.error("Error saving logbook:", error.message);
      setError("Terjadi kesalahan saat menyimpan perubahan logbook");
    }
  };

    // Tambahkan fungsi handleExport di bawah fungsi lainnya
  const handleExport = (log) => {
    const logData = JSON.stringify(log, null, 2); // Format data logbook sebagai JSON
    const blob = new Blob([logData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = `logbook-${log.id}.json`; // Nama file yang akan diunduh
    a.click();
  
    URL.revokeObjectURL(url); // Bersihkan URL setelah digunakan
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
          {/* Form untuk edit logbook */}
          <Form onSubmit={handleSaveEdit}>
            {/* Form fields */}
            <Button type="submit">Simpan Perubahan</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Data;