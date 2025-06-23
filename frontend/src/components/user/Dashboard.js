import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, ListGroup } from "react-bootstrap";
import { FaBook, FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ totalLog: 0, totalShift: 0, totalPetugas: 0 });
  const [aktivitasTerbaru, setAktivitasTerbaru] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/logbooks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil logbook");
        }

        setLogs(data.logbooks);

        // Hitung ringkasan data
        const totalLog = data.logbooks.length;
        const shiftSet = new Set(data.logbooks.map((log) => log.jam));
        const petugasSet = new Set(data.logbooks.flatMap((log) => log.petugas));
        setSummary({
          totalLog,
          totalShift: shiftSet.size,
          totalPetugas: petugasSet.size,
        });

        // Ambil aktivitas terbaru
        const aktivitas = data.logbooks
          .map((log) => ({
            id: log.id,
            waktu: `${log.tanggal} ${log.jam.split(" ")[0]}`,
            aktivitas: log.report?.kejadian || "Tidak ada kejadian",
            petugas: Array.isArray(log.petugas) ? log.petugas.join(", ") : log.petugas || "Tidak ada petugas",
          }))
          .sort((a, b) => (a.waktu < b.waktu ? 1 : -1))
          .slice(0, 5);

        setAktivitasTerbaru(aktivitas);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
        setError(error.message);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: "1.5rem" }}>
        Dashboard
      </h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <Row className="mb-4" xs={1} md={3} style={{ gap: "1rem 0" }}>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-accent)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.totalLog}</div>
              <div style={{ color: "#888" }}>Total Logbook</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-cta)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.totalShift}</div>
              <div style={{ color: "#888" }}>Total Shift</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-primary)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.totalPetugas}</div>
              <div style={{ color: "#888" }}>Total Petugas</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8} className="mb-4">
          <Card>
            <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff" }}>
              Aktivitas Terbaru
            </Card.Header>
            <ListGroup variant="flush">
              {aktivitasTerbaru.map((a) => (
                <ListGroup.Item key={a.id}>
                  <div style={{ fontWeight: 600 }}>{a.aktivitas}</div>
                  <div style={{ fontSize: "0.97rem", color: "#888" }}>
                    {a.waktu} &mdash; {a.petugas}
                  </div>
                </ListGroup.Item>
              ))}
              {aktivitasTerbaru.length === 0 && (
                <ListGroup.Item>Tidak ada aktivitas terbaru.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header style={{ fontWeight: 600 }}>Shortcut</Card.Header>
            <Card.Body style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Button as={Link} to="/logbook" variant="primary">
                <FaBook style={{ marginRight: 8 }} />
                Lihat Logbook
              </Button>
              <Button as={Link} to="/logbook/tambah" variant="success">
                <FaPlusCircle style={{ marginRight: 8 }} />
                Tambah Logbook
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;